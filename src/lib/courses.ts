import "server-only";
import mongoose from "mongoose";
import { isReadyTest } from "~/lib/diagnostic-eval";
import { ensureDb } from "~/lib/mongodb";
import { slugIssue, slugifyTitle } from "~/lib/slug";
import { toObjectId } from "~/lib/object-id";
import { RequestError } from "~/lib/request-error";
import type { CourseInput } from "~/lib/validations";
import Course from "~/models/course";
import DiagnosticAttempt from "~/models/diagnostic-attempt";
import DiagnosticSubmission from "~/models/diagnostic-submission";
import DiagnosticTest from "~/models/diagnostic-test";
import type {
  AdminCourse,
  CourseAccent,
  CourseColorScheme,
  MarketingCourse,
} from "~/types";

type CourseLike = {
  _id: { toString(): string };
  publicId: number;
  slug?: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  group: string;
  highlights: string[];
  colorScheme: {
    gradient: string;
    accent: string;
    bg: string;
    border: string;
  };
  objectives: string[];
  prerequisites: string;
  schedule: string;
  nextStart: string;
  visible?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

function asAccent(value: string): CourseAccent {
  if (
    value === "primary" ||
    value === "secondary" ||
    value === "purple" ||
    value === "accent" ||
    value === "orange"
  ) {
    return value;
  }
  return "primary";
}

function asColorScheme(value: CourseLike["colorScheme"]): CourseColorScheme {
  return {
    gradient: value.gradient,
    accent: asAccent(value.accent),
    bg: value.bg,
    border: value.border,
  };
}

function iso(value?: Date | string) {
  if (!value) return new Date(0).toISOString();
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime())
    ? new Date(0).toISOString()
    : date.toISOString();
}

function toMarketing(
  course: CourseLike,
  hasDiagnosticTest: boolean,
): MarketingCourse {
  return {
    id: course._id.toString(),
    publicId: course.publicId,
    slug: course.slug ?? "",
    title: course.title,
    description: course.description,
    level: course.level,
    duration: course.duration,
    group: course.group,
    highlights: course.highlights,
    colorScheme: asColorScheme(course.colorScheme),
    objectives: course.objectives,
    prerequisites: course.prerequisites,
    schedule: course.schedule,
    nextStart: course.nextStart,
    hasDiagnosticTest,
  };
}

function toAdmin(course: CourseLike, hasDiagnosticTest = false): AdminCourse {
  return {
    ...toMarketing(course, hasDiagnosticTest),
    visible: course.visible !== false,
    createdAt: iso(course.createdAt),
    updatedAt: iso(course.updatedAt),
  };
}

function courseFields(input: CourseInput) {
  return {
    title: input.title,
    description: input.description,
    level: input.level,
    duration: input.duration,
    group: input.group,
    highlights: input.highlights,
    objectives: input.objectives,
    prerequisites: input.prerequisites,
    schedule: input.schedule,
    nextStart: input.nextStart,
    visible: input.visible,
    colorScheme: {
      gradient: "from-secondary to-secondary",
      accent: "secondary" as const,
      bg: "bg-secondary/5",
      border: "border-secondary/20",
    },
  };
}

let slugPromise: Promise<void> | null = null;

async function allocateSlug(title: string, exceptId?: string) {
  const base = slugifyTitle(title).slice(0, 60).replace(/-+$/g, "");
  let suffix = 2;
  let candidate = slugIssue(base) === null ? base : "course";

  while (slugIssue(candidate)) {
    candidate = `course-${suffix}`;
    suffix += 1;
  }

  while (true) {
    const existing = await Course.findOne({ slug: candidate }).select("_id");
    if (!existing || (exceptId && String(existing._id) === exceptId)) {
      return candidate;
    }
    candidate = `${base || "course"}-${suffix}`;
    suffix += 1;
  }
}

async function backfillCourseSlugs() {
  const courses = await Course.find().sort({ publicId: 1 });
  for (const course of courses) {
    if (course.slug && slugIssue(course.slug) === null) continue;
    course.slug = await allocateSlug(course.title, String(course._id));
    await course.save();
  }
}

function ensureCourseSlugs() {
  if (!slugPromise) {
    slugPromise = backfillCourseSlugs().catch((error) => {
      slugPromise = null;
      throw error;
    });
  }
  return slugPromise;
}

export async function findCourseBySlug(slug: string) {
  await ensureCourseSlugs();
  if (!slug || slugIssue(slug)) return null;
  return Course.findOne({ slug });
}

export async function findCourseByParam(param: string) {
  await ensureCourseSlugs();
  const bySlug = await Course.findOne({ slug: param });
  if (bySlug) return bySlug;
  const id = toObjectId(param);
  if (!id) return null;
  return Course.findById(id);
}

async function readyCourseIds(courseIds: mongoose.Types.ObjectId[]) {
  if (courseIds.length === 0) return new Set<string>();

  const tests = await DiagnosticTest.find({
    published: true,
    course: { $in: courseIds },
  })
    .select(
      "course published timeLimitMinutes questions.prompt questions.options questions.correctIndex",
    )
    .lean();

  return new Set(
    tests
      .filter((test) => isReadyTest(test))
      .map((test) => String(test.course)),
  );
}

export async function getMarketingCourses(): Promise<{
  ok: boolean;
  courses: MarketingCourse[];
}> {
  try {
    await ensureDb("marketing-courses");
    await ensureCourseSlugs();
    const courses = await Course.find({ visible: true })
      .sort({ publicId: 1 })
      .lean<CourseLike[]>();
    const ready = await readyCourseIds(
      courses.map(
        (course) => new mongoose.Types.ObjectId(course._id.toString()),
      ),
    );
    return {
      ok: true,
      courses: courses.map((course) =>
        toMarketing(course, ready.has(course._id.toString())),
      ),
    };
  } catch (error) {
    console.error("Failed to load marketing courses", error);
    return { ok: false, courses: [] };
  }
}

export async function getPublicCourse(
  param: string,
): Promise<
  | { status: "ok"; course: MarketingCourse }
  | { status: "missing" }
  | { status: "error" }
> {
  try {
    await ensureDb("public-course");
    await ensureCourseSlugs();
    const course = await findCourseBySlug(param);
    if (!course || !course.visible) return { status: "missing" };
    const ready = await readyCourseIds([course._id]);
    return {
      status: "ok",
      course: toMarketing(
        course.toObject() as CourseLike,
        ready.has(String(course._id)),
      ),
    };
  } catch (error) {
    console.error("Failed to load course", error);
    return { status: "error" };
  }
}

export async function listAdminCourses() {
  await ensureDb("admin-courses");
  await ensureCourseSlugs();
  const courses = await Course.find()
    .sort({ publicId: 1 })
    .lean<CourseLike[]>();
  const ready = await readyCourseIds(
    courses.map((course) => new mongoose.Types.ObjectId(course._id.toString())),
  );
  return courses.map((course) =>
    toAdmin(course, ready.has(course._id.toString())),
  );
}

export async function getAdminCourse(param: string) {
  await ensureDb("admin-course");
  await ensureCourseSlugs();
  const course = await findCourseByParam(param);
  if (!course) return null;
  const ready = await readyCourseIds([course._id]);
  return toAdmin(
    course.toObject() as CourseLike,
    ready.has(String(course._id)),
  );
}

async function allocatePublicId() {
  const latest = await Course.findOne()
    .sort({ publicId: -1 })
    .select("publicId")
    .lean<{ publicId: number }>();
  return (latest?.publicId ?? 0) + 1;
}

export async function createCourse(input: CourseInput) {
  await ensureDb("create-course");
  await ensureCourseSlugs();
  const slug = await allocateSlug(input.title);

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const course = await Course.create({
        publicId: await allocatePublicId(),
        slug,
        ...courseFields(input),
      });
      return toAdmin(course.toObject() as CourseLike);
    } catch (error) {
      const duplicate =
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: unknown }).code === 11000;
      if (duplicate && attempt < 2) continue;
      throw error;
    }
  }

  throw new RequestError("Could not save the course. Try again.", 500);
}

export async function updateCourse(param: string, input: CourseInput) {
  await ensureDb("update-course");
  await ensureCourseSlugs();
  const course = await findCourseByParam(param);
  if (!course) return null;
  course.set({
    ...courseFields(input),
    slug: await allocateSlug(input.title, String(course._id)),
  });
  await course.save();
  return toAdmin(course.toObject() as CourseLike);
}

export async function setCourseVisibility(param: string, visible: boolean) {
  await ensureDb("course-visibility");
  const course = await findCourseByParam(param);
  if (!course) return null;
  course.visible = visible;
  await course.save();
  return toAdmin(course.toObject() as CourseLike);
}

export async function deleteCourse(param: string) {
  await ensureDb("delete-course");
  const course = await findCourseByParam(param);
  if (!course) return false;

  const submissions = await DiagnosticSubmission.countDocuments({
    course: course._id,
  });
  if (submissions > 0) {
    throw new RequestError(
      "This course has student submissions and cannot be deleted.",
      409,
    );
  }

  await DiagnosticTest.deleteOne({ course: course._id });
  await DiagnosticAttempt.deleteMany({ course: course._id });
  await course.deleteOne();
  return true;
}
