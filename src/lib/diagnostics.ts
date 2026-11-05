import "server-only";
import { randomBytes } from "node:crypto";
import mongoose from "mongoose";
import { cache } from "react";
import { evaluateDiagnostic, isReadyTest } from "~/lib/diagnostic-eval";
import { ensureDb } from "~/lib/mongodb";
import { toObjectId } from "~/lib/object-id";
import { RequestError } from "~/lib/request-error";
import {
  diagnosticSubmitSchema,
  formatContactNumber,
  normalizeStudentName,
  publishBlockReason,
  studentContactError,
  type DiagnosticSubmitInput,
  type TestInput,
} from "~/lib/validations";
import { findCountryByName } from "~/data/countries";
import Course from "~/models/course";
import DiagnosticAttempt from "~/models/diagnostic-attempt";
import DiagnosticSubmission from "~/models/diagnostic-submission";
import DiagnosticTest from "~/models/diagnostic-test";
import type {
  AdminTestCourseSummary,
  AdminTestListItem,
  DiagnosticResult,
  DiagnosticSubmissionDetail,
  DiagnosticSubmissionSummary,
  DiagnosticTestAdmin,
  DiagnosticTestPublic,
  MarketingCourse,
} from "~/types";
import { revalidatePublicCatalog } from "~/lib/catalog-cache";
import {
  ensureCourseSlugs,
  findCourseByParam,
  findCourseBySlug,
  getPublicCourse,
} from "~/lib/courses";

const ATTEMPT_TTL_MS = 24 * 60 * 60 * 1000;
export const COMMON_TEST_KEY = "common";
const COMMON_COURSE_TITLE = "Common test";

const COMMON_ADMIN_COURSE: AdminTestCourseSummary = {
  id: COMMON_TEST_KEY,
  publicId: 0,
  title: COMMON_COURSE_TITLE,
  batchSize: null,
};

function isCommonTestParam(param: string) {
  return param === COMMON_TEST_KEY;
}

type TestLike = {
  _id: { toString(): string };
  course?: { toString(): string } | null;
  scope?: string;
  title: string;
  instructions?: string;
  timeLimitMinutes?: number;
  published?: boolean;
  questions: Array<{
    _id: { toString(): string };
    prompt?: string;
    options: string[];
    correctIndex: number;
    explanation?: string;
  }>;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

type SubmissionLike = {
  _id: { toString(): string };
  course?: { toString(): string } | null;
  scope?: string;
  studentName: string;
  contactNumber: string;
  country: string;
  countryCode: string;
  courseTitle: string;
  testTitle: string;
  durationSeconds?: number | null;
  timeLimitMinutes?: number | null;
  results: DiagnosticResult;
  questions?: DiagnosticSubmissionDetail["questions"];
  createdAt?: Date | string;
};

function iso(value?: Date | string) {
  if (!value) return new Date(0).toISOString();
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime())
    ? new Date(0).toISOString()
    : date.toISOString();
}

function readIndex(value: unknown) {
  return typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 0 &&
    value <= 3
    ? value
    : null;
}

function toPublicTest(test: TestLike): DiagnosticTestPublic {
  return {
    id: test._id.toString(),
    title: test.title,
    instructions: test.instructions ?? "",
    timeLimitMinutes: test.timeLimitMinutes ?? 0,
    questions: test.questions.map((question) => ({
      id: question._id.toString(),
      prompt: question.prompt ?? "",
      options: [...question.options],
    })),
  };
}

function toAdminTest(test: TestLike): DiagnosticTestAdmin {
  return {
    id: test._id.toString(),
    courseId:
      test.scope === "common" || !test.course
        ? COMMON_TEST_KEY
        : test.course.toString(),
    title: test.title,
    instructions: test.instructions ?? "",
    timeLimitMinutes: test.timeLimitMinutes ?? 0,
    published: Boolean(test.published),
    questions: test.questions.map((question) => ({
      id: question._id.toString(),
      prompt: question.prompt ?? "",
      options: [...question.options],
      correctIndex: question.correctIndex,
      explanation: question.explanation ?? "",
    })),
    createdAt: iso(test.createdAt),
    updatedAt: iso(test.updatedAt),
  };
}

function toResult(submission: {
  courseTitle: string;
  testTitle: string;
  durationSeconds?: number | null;
  timeLimitMinutes?: number | null;
  results: {
    totalQuestions: number;
    correct: number;
    incorrect: number;
    unanswered: number;
    percentage: number;
  };
}): DiagnosticResult {
  return {
    courseTitle: submission.courseTitle,
    testTitle: submission.testTitle,
    totalQuestions: submission.results.totalQuestions,
    correct: submission.results.correct,
    incorrect: submission.results.incorrect,
    unanswered: submission.results.unanswered,
    percentage: submission.results.percentage,
    durationSeconds: submission.durationSeconds ?? 0,
    timeLimitMinutes: submission.timeLimitMinutes ?? 0,
  };
}

function completionDuration(startedAt: Date | undefined, limitMinutes: number) {
  const started = startedAt ? new Date(startedAt).getTime() : Date.now();
  const elapsed = Math.max(0, Math.round((Date.now() - started) / 1000));
  return Math.min(elapsed, Math.max(1, limitMinutes) * 60);
}

function toSummary(submission: SubmissionLike): DiagnosticSubmissionSummary {
  return {
    id: submission._id.toString(),
    courseId: submission.course
      ? submission.course.toString()
      : COMMON_TEST_KEY,
    studentName: submission.studentName,
    contactNumber: submission.contactNumber,
    country: submission.country,
    countryCode: submission.countryCode,
    createdAt: iso(submission.createdAt),
    ...toResult(submission),
  };
}

function courseSummary(course: {
  _id: { toString(): string };
  publicId: number;
  title: string;
  batchSize: number;
}): AdminTestCourseSummary {
  return {
    id: course._id.toString(),
    publicId: course.publicId,
    title: course.title,
    batchSize: course.batchSize,
  };
}

function questionObjectId(id?: string) {
  if (id) {
    const existing = toObjectId(id);
    if (existing) return existing;
  }
  return new mongoose.Types.ObjectId();
}

function toListTest(test: {
  _id: mongoose.Types.ObjectId;
  title: string;
  published: boolean;
  timeLimitMinutes?: number;
  updatedAt?: Date;
  questionCount: number;
}) {
  return {
    id: String(test._id),
    title: test.title,
    published: Boolean(test.published),
    questionCount: test.questionCount,
    timeLimitMinutes: test.timeLimitMinutes ?? 0,
    updatedAt: iso(test.updatedAt),
  };
}

export async function listAdminTests(): Promise<AdminTestListItem[]> {
  await ensureDb("admin-tests");
  const courses = await Course.find()
    .sort({ publicId: 1 })
    .select("publicId title batchSize")
    .lean();
  const tests = await DiagnosticTest.aggregate<{
    _id: mongoose.Types.ObjectId;
    course?: mongoose.Types.ObjectId | null;
    scope?: string;
    title: string;
    published: boolean;
    timeLimitMinutes?: number;
    updatedAt?: Date;
    questionCount: number;
  }>([
    {
      $project: {
        course: 1,
        scope: 1,
        title: 1,
        published: 1,
        timeLimitMinutes: 1,
        updatedAt: 1,
        questionCount: { $size: { $ifNull: ["$questions", []] } },
      },
    },
  ]);
  const common = tests.find((test) => test.scope === "common");
  const byCourse = new Map(
    tests
      .filter((test) => test.course)
      .map((test) => [String(test.course), test]),
  );

  return [
    {
      course: COMMON_ADMIN_COURSE,
      test: common ? toListTest(common) : null,
    },
    ...courses.map((course) => {
      const test = byCourse.get(String(course._id));
      return {
        course: courseSummary(course),
        test: test ? toListTest(test) : null,
      };
    }),
  ];
}

export async function getAdminTest(courseParam: string) {
  await ensureDb("admin-test");
  if (isCommonTestParam(courseParam)) {
    const test = await DiagnosticTest.findOne({
      scope: "common",
    }).lean<TestLike>();
    return {
      course: COMMON_ADMIN_COURSE,
      test: test ? toAdminTest(test) : null,
    };
  }
  const course = await findCourseByParam(courseParam);
  if (!course) return null;
  const test = await DiagnosticTest.findOne({
    course: course._id,
  }).lean<TestLike>();
  return {
    course: courseSummary(course),
    test: test ? toAdminTest(test) : null,
  };
}

export async function saveAdminTest(courseParam: string, input: TestInput) {
  await ensureDb("save-test");
  const common = isCommonTestParam(courseParam);
  const course = common ? null : await findCourseByParam(courseParam);
  if (!common && !course) return null;

  if (input.published) {
    const reason = publishBlockReason(input);
    if (reason) throw new RequestError(reason, 400);
  }

  const questions = input.questions.map((question) => ({
    _id: questionObjectId(question.id),
    prompt: question.prompt,
    options: question.options,
    correctIndex: question.correctIndex,
    explanation: question.explanation,
  }));
  const ids = questions.map((question) => String(question._id));
  if (new Set(ids).size !== ids.length) {
    throw new RequestError("Each question needs its own id.", 400);
  }

  const test = await DiagnosticTest.findOneAndUpdate(
    common ? { scope: "common" } : { course: course?._id },
    common
      ? {
          $set: {
            scope: "common",
            title: input.title,
            instructions: input.instructions,
            timeLimitMinutes: input.timeLimitMinutes,
            published: input.published,
            questions,
          },
          $unset: { course: 1 },
        }
      : {
          $set: {
            scope: "course",
            title: input.title,
            instructions: input.instructions,
            timeLimitMinutes: input.timeLimitMinutes,
            published: input.published,
            questions,
          },
        },
    {
      upsert: true,
      returnDocument: "after",
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  );

  if (!test) {
    throw new RequestError("Could not save the test. Try again.", 500);
  }

  revalidatePublicCatalog();
  return toAdminTest(test.toObject() as TestLike);
}

export async function setTestPublished(
  courseParam: string,
  published: boolean,
) {
  await ensureDb("publish-test");
  const common = isCommonTestParam(courseParam);
  const course = common ? null : await findCourseByParam(courseParam);
  if (!common && !course) return null;

  const test = await DiagnosticTest.findOne(
    common ? { scope: "common" } : { course: course?._id },
  );
  if (!test) {
    throw new RequestError(
      "Create a diagnostic test before changing its status.",
      404,
    );
  }

  if (published) {
    const reason = publishBlockReason({
      title: test.title,
      timeLimitMinutes: test.timeLimitMinutes,
      questions: test.questions.map((question) => ({
        prompt: question.prompt ?? "",
        options: question.options,
        correctIndex: question.correctIndex,
      })),
    });
    if (reason) throw new RequestError(reason, 400);
  }

  test.published = published;
  await test.save();
  revalidatePublicCatalog();
  return toAdminTest(test.toObject() as TestLike);
}

export async function deleteAdminTest(courseParam: string) {
  await ensureDb("delete-test");
  if (isCommonTestParam(courseParam)) {
    const deleted = await DiagnosticTest.deleteOne({ scope: "common" });
    await DiagnosticAttempt.deleteMany({ scope: "common", consumed: false });
    if (deleted.deletedCount > 0) revalidatePublicCatalog();
    return deleted.deletedCount > 0;
  }
  const course = await findCourseByParam(courseParam);
  if (!course) return false;
  const deleted = await DiagnosticTest.deleteOne({ course: course._id });
  await DiagnosticAttempt.deleteMany({ course: course._id, consumed: false });
  if (deleted.deletedCount > 0) revalidatePublicCatalog();
  return deleted.deletedCount > 0;
}

async function loadPublishedTest(courseId: mongoose.Types.ObjectId) {
  const test = await DiagnosticTest.findOne({
    course: courseId,
    published: true,
  }).lean<TestLike>();
  if (!test || !isReadyTest(test)) return null;
  return test;
}

export const getDiagnosticPage = cache(async function getDiagnosticPage(
  param: string,
): Promise<
  | { status: "ok"; course: MarketingCourse; test: DiagnosticTestPublic }
  | { status: "missing" }
  | { status: "error" }
> {
  try {
    await ensureDb("diagnostic-page");
    const loaded = await getPublicCourse(param);
    if (loaded.status !== "ok") return loaded;
    if (!loaded.course.hasDiagnosticTest) return { status: "missing" };
    const course = await findCourseBySlug(param);
    if (!course) return { status: "missing" };
    const test = await loadPublishedTest(course._id);
    if (!test) return { status: "missing" };
    return { status: "ok", course: loaded.course, test: toPublicTest(test) };
  } catch (error) {
    console.error("Failed to load diagnostic test", error);
    return { status: "error" };
  }
});

export const getCommonDiagnosticPage = cache(
  async function getCommonDiagnosticPage(): Promise<
    | { status: "ok"; test: DiagnosticTestPublic }
    | { status: "missing" }
    | { status: "error" }
  > {
    try {
      await ensureDb("common-diagnostic-page");
      const test = await DiagnosticTest.findOne({
        scope: "common",
        published: true,
      }).lean<TestLike>();
      if (!test || !isReadyTest(test)) return { status: "missing" };
      return { status: "ok", test: toPublicTest(test) };
    } catch (error) {
      console.error("Failed to load common diagnostic test", error);
      return { status: "error" };
    }
  },
);

export async function listIndexableDiagnostics(): Promise<
  { path: string; updatedAt: Date }[]
> {
  try {
    await ensureDb("seo-diagnostics");
    await ensureCourseSlugs();
    const tests = await DiagnosticTest.find({ published: true })
      .select(
        "scope course published timeLimitMinutes questions.prompt questions.options questions.correctIndex updatedAt",
      )
      .lean<TestLike[]>();
    const ready = tests.filter((test) => isReadyTest(test));
    const entries: { path: string; updatedAt: Date }[] = [];
    const common = ready.find((test) => test.scope === "common");

    if (common) {
      entries.push({
        path: `/diagnostic/${COMMON_TEST_KEY}`,
        updatedAt: new Date(iso(common.updatedAt)),
      });
    }

    const courseIds = ready
      .filter((test) => test.scope !== "common" && test.course)
      .map((test) => new mongoose.Types.ObjectId(String(test.course)));
    if (courseIds.length === 0) return entries;

    const courses = await Course.find({
      _id: { $in: courseIds },
    })
      .select("slug updatedAt")
      .lean<Array<{ slug?: string; updatedAt?: Date }>>();

    for (const course of courses) {
      if (!course.slug) continue;
      entries.push({
        path: `/diagnostic/${course.slug}`,
        updatedAt: new Date(iso(course.updatedAt)),
      });
    }

    return entries;
  } catch (error) {
    console.error("Failed to list diagnostics for sitemap", error);
    return [];
  }
}

export async function hasPublishedCommonTest() {
  try {
    await ensureDb("common-diagnostic-flag");
    const test = await DiagnosticTest.findOne({
      scope: "common",
      published: true,
    })
      .select(
        "published timeLimitMinutes questions.prompt questions.options questions.correctIndex",
      )
      .lean<TestLike | null>();
    return Boolean(test && isReadyTest(test));
  } catch (error) {
    console.error("Failed to check common diagnostic test", error);
    return false;
  }
}

export async function startDiagnosticAttempt(param: string) {
  await ensureDb("diagnostic-attempt");
  if (isCommonTestParam(param)) {
    const test = await DiagnosticTest.findOne({
      scope: "common",
      published: true,
    }).lean<TestLike>();
    if (!test || !isReadyTest(test)) return null;
    return createAttempt(test, "common");
  }
  const course = await findCourseBySlug(param);
  if (!course) return null;
  const test = await loadPublishedTest(course._id);
  if (!test) return null;

  return createAttempt(test, "course", course._id);
}

async function createAttempt(
  test: TestLike,
  scope: "course" | "common",
  courseId?: mongoose.Types.ObjectId,
) {
  const startedAt = new Date();
  const expiresAt = new Date(Date.now() + ATTEMPT_TTL_MS);
  const attempt = await DiagnosticAttempt.create({
    token: randomBytes(32).toString("hex"),
    scope,
    ...(courseId ? { course: courseId } : {}),
    test: new mongoose.Types.ObjectId(String(test._id)),
    questionIds: test.questions.map((question) => question._id.toString()),
    startedAt,
    consumed: false,
    expiresAt,
  });

  return {
    attemptToken: attempt.token,
    startedAt: startedAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
    test: toPublicTest(test),
  };
}

async function submitCommonDiagnostic(input: DiagnosticSubmitInput) {
  const attempt = await DiagnosticAttempt.findOne({
    token: input.attemptToken,
    scope: "common",
  });
  if (!attempt || attempt.course) {
    throw new RequestError(
      "This attempt is no longer valid. Start the test again.",
      409,
    );
  }

  const existing = await DiagnosticSubmission.findOne({
    attempt: attempt._id,
  }).lean<SubmissionLike>();
  if (existing) {
    if (!attempt.consumed) {
      await DiagnosticAttempt.updateOne(
        { _id: attempt._id },
        { $set: { consumed: true } },
      );
    }
    return toResult(existing);
  }

  const test = await DiagnosticTest.findOne({
    _id: attempt.test,
    scope: "common",
    published: true,
  });
  if (!test || !isReadyTest(test)) {
    throw new RequestError("This diagnostic test is not available.", 404);
  }

  const currentIds = test.questions.map((question) => String(question._id));
  if (currentIds.join("|") !== attempt.questionIds.join("|")) {
    throw new RequestError(
      "This test was updated. Refresh the page and start again.",
      409,
    );
  }

  if (attempt.expiresAt.getTime() <= Date.now()) {
    throw new RequestError(
      "This attempt has expired. Refresh the page and start again.",
      409,
    );
  }

  const evaluation = evaluateDiagnostic(
    test.questions.map((question) => ({
      id: String(question._id),
      prompt: question.prompt ?? "",
      options: question.options,
      correctIndex: question.correctIndex,
      explanation: question.explanation ?? "",
    })),
    input.answers,
  );
  if (!evaluation.ok) throw new RequestError(evaluation.message, 409);

  const country = findCountryByName(input.country.trim());
  if (!country) throw new RequestError("Select your country", 400);

  try {
    const submission = await DiagnosticSubmission.create({
      scope: "common",
      test: test._id,
      attempt: attempt._id,
      studentName: normalizeStudentName(input.studentName),
      contactNumber: formatContactNumber(country.code, input.contactNumber),
      countryCode: country.code,
      country: country.name,
      courseTitle: COMMON_COURSE_TITLE,
      testTitle: test.title,
      durationSeconds: completionDuration(
        attempt.startedAt,
        test.timeLimitMinutes ?? 1,
      ),
      timeLimitMinutes: test.timeLimitMinutes,
      answers: input.answers.map((answer) => ({
        questionId: answer.questionId,
        selectedIndex: answer.selectedIndex,
      })),
      results: evaluation.results,
      questions: evaluation.questions,
    });
    await DiagnosticAttempt.updateOne(
      { _id: attempt._id },
      { $set: { consumed: true } },
    );
    return toResult(submission);
  } catch (error) {
    const duplicate =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: unknown }).code === 11000;
    if (!duplicate) throw error;

    const saved = await DiagnosticSubmission.findOne({
      attempt: attempt._id,
    }).lean<SubmissionLike>();
    if (!saved) throw error;
    await DiagnosticAttempt.updateOne(
      { _id: attempt._id },
      { $set: { consumed: true } },
    );
    return toResult(saved);
  }
}

export async function submitDiagnostic(courseParam: string, body: unknown) {
  const parsed = diagnosticSubmitSchema.safeParse(body);
  if (!parsed.success) {
    throw new RequestError(
      parsed.error.issues[0]?.message ?? "Check the form and try again.",
      400,
    );
  }

  const contactError = studentContactError(parsed.data);
  if (contactError) throw new RequestError(contactError, 400);

  await ensureDb("submit-diagnostic");
  if (isCommonTestParam(courseParam)) {
    return submitCommonDiagnostic(parsed.data);
  }
  const course = await findCourseBySlug(courseParam);
  if (!course) {
    throw new RequestError("This diagnostic test is not available.", 404);
  }

  const attempt = await DiagnosticAttempt.findOne({
    token: parsed.data.attemptToken,
  });
  if (!attempt || String(attempt.course) !== String(course._id)) {
    throw new RequestError(
      "This attempt is no longer valid. Start the test again.",
      409,
    );
  }

  const existing = await DiagnosticSubmission.findOne({
    attempt: attempt._id,
  }).lean<SubmissionLike>();
  if (existing) {
    if (!attempt.consumed) {
      await DiagnosticAttempt.updateOne(
        { _id: attempt._id },
        { $set: { consumed: true } },
      );
    }
    return toResult(existing);
  }

  const test = await DiagnosticTest.findOne({
    _id: attempt.test,
    course: course._id,
    published: true,
  });
  if (!test || !isReadyTest(test)) {
    throw new RequestError("This diagnostic test is not available.", 404);
  }

  const currentIds = test.questions.map((question) => String(question._id));
  if (currentIds.join("|") !== attempt.questionIds.join("|")) {
    throw new RequestError(
      "This test was updated. Refresh the page and start again.",
      409,
    );
  }

  if (attempt.expiresAt.getTime() <= Date.now()) {
    throw new RequestError(
      "This attempt has expired. Refresh the page and start again.",
      409,
    );
  }

  const evaluation = evaluateDiagnostic(
    test.questions.map((question) => ({
      id: String(question._id),
      prompt: question.prompt ?? "",
      options: question.options,
      correctIndex: question.correctIndex,
      explanation: question.explanation ?? "",
    })),
    parsed.data.answers,
  );
  if (!evaluation.ok) throw new RequestError(evaluation.message, 409);

  const country = findCountryByName(parsed.data.country.trim());
  if (!country) throw new RequestError("Select your country", 400);

  try {
    const submission = await DiagnosticSubmission.create({
      scope: "course",
      course: course._id,
      test: test._id,
      attempt: attempt._id,
      studentName: normalizeStudentName(parsed.data.studentName),
      contactNumber: formatContactNumber(
        country.code,
        parsed.data.contactNumber,
      ),
      countryCode: country.code,
      country: country.name,
      courseTitle: course.title,
      testTitle: test.title,
      durationSeconds: completionDuration(
        attempt.startedAt,
        test.timeLimitMinutes ?? 1,
      ),
      timeLimitMinutes: test.timeLimitMinutes,
      answers: parsed.data.answers.map((answer) => ({
        questionId: answer.questionId,
        selectedIndex: answer.selectedIndex,
      })),
      results: evaluation.results,
      questions: evaluation.questions,
    });
    await DiagnosticAttempt.updateOne(
      { _id: attempt._id },
      { $set: { consumed: true } },
    );
    return toResult(submission);
  } catch (error) {
    const duplicate =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: unknown }).code === 11000;
    if (!duplicate) throw error;

    const saved = await DiagnosticSubmission.findOne({
      attempt: attempt._id,
    }).lean<SubmissionLike>();
    if (!saved) throw error;
    await DiagnosticAttempt.updateOne(
      { _id: attempt._id },
      { $set: { consumed: true } },
    );
    return toResult(saved);
  }
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parsePage(value: string | null) {
  if (!value || !/^\d+$/.test(value)) return 1;
  const page = Number(value);
  if (!Number.isSafeInteger(page) || page < 1) return 1;
  return Math.min(page, 10000);
}

function parseScore(value: string, label: string) {
  if (!/^\d{1,3}$/.test(value)) {
    throw new RequestError(`${label} must be a number from 0 to 100`, 400);
  }
  const score = Number(value);
  if (score > 100) {
    throw new RequestError(`${label} must be a number from 0 to 100`, 400);
  }
  return score;
}

function parseDay(value: string, end: boolean) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new RequestError("Enter a valid date", 400);
  }
  const date = new Date(`${value}T${end ? "23:59:59.999" : "00:00:00.000"}Z`);
  if (Number.isNaN(date.getTime())) {
    throw new RequestError("Enter a valid date", 400);
  }
  return date;
}

export async function listSubmissions(params: URLSearchParams) {
  await ensureDb("test-submissions");
  const pageSize = 20;
  const requestedPage = parsePage(params.get("page"));
  const filter: Record<string, unknown> = {};

  const courseParam = params.get("course")?.trim();
  if (courseParam === COMMON_TEST_KEY) {
    filter.scope = "common";
  } else if (courseParam) {
    const course = await findCourseByParam(courseParam);
    if (!course) {
      return {
        items: [] as DiagnosticSubmissionSummary[],
        page: 1,
        pageSize,
        total: 0,
        pageCount: 1,
      };
    }
    filter.course = course._id;
  }

  const name = params.get("name")?.trim() ?? "";
  if (name) {
    if (name.length > 80) {
      throw new RequestError("Name search is too long", 400);
    }
    filter.studentName = { $regex: escapeRegex(name), $options: "i" };
  }

  const minScore = params.get("minScore")?.trim() ?? "";
  const maxScore = params.get("maxScore")?.trim() ?? "";
  if (minScore || maxScore) {
    const range: { $gte?: number; $lte?: number } = {};
    if (minScore) range.$gte = parseScore(minScore, "Minimum score");
    if (maxScore) range.$lte = parseScore(maxScore, "Maximum score");
    if (
      range.$gte !== undefined &&
      range.$lte !== undefined &&
      range.$gte > range.$lte
    ) {
      throw new RequestError(
        "Minimum score cannot be higher than maximum score",
        400,
      );
    }
    filter["results.percentage"] = range;
  }

  const from = params.get("from")?.trim() ?? "";
  const to = params.get("to")?.trim() ?? "";
  if (from || to) {
    const createdAt: { $gte?: Date; $lte?: Date } = {};
    if (from) createdAt.$gte = parseDay(from, false);
    if (to) createdAt.$lte = parseDay(to, true);
    if (
      createdAt.$gte &&
      createdAt.$lte &&
      createdAt.$gte.getTime() > createdAt.$lte.getTime()
    ) {
      throw new RequestError("Start date cannot be after the end date", 400);
    }
    filter.createdAt = createdAt;
  }

  const total = await DiagnosticSubmission.countDocuments(filter);
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(requestedPage, pageCount);
  const items = await DiagnosticSubmission.find(filter)
    .select(
      "studentName contactNumber country countryCode course courseTitle testTitle durationSeconds timeLimitMinutes results createdAt",
    )
    .sort({ createdAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .lean<SubmissionLike[]>();

  return {
    items: items.map((item) => toSummary(item)),
    page,
    pageSize,
    total,
    pageCount,
  };
}

export async function getSubmission(id: string) {
  await ensureDb("test-submission");
  const objectId = toObjectId(id);
  if (!objectId) return null;
  const submission =
    await DiagnosticSubmission.findById(objectId).lean<SubmissionLike>();
  if (!submission) return null;

  return {
    ...toSummary(submission),
    questions: (submission.questions ?? []).map((question) => ({
      questionId: question.questionId,
      prompt: question.prompt,
      options: [...question.options],
      correctIndex: question.correctIndex,
      selectedIndex: readIndex(question.selectedIndex),
      explanation: question.explanation ?? "",
      isCorrect: Boolean(question.isCorrect),
    })),
  } satisfies DiagnosticSubmissionDetail;
}
