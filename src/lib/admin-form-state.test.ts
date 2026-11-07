import assert from "node:assert/strict";
import test from "node:test";
import {
  courseSaveBlocked,
  courseSnapshot,
  normalizeWholeNumber,
  testDraftSaveBlocked,
  testSnapshot,
} from "./admin-form-state";

const course = {
  title: "Algebra",
  description: "Foundations",
  startDate: "2026-09-01",
  batchSize: "5",
  topics: ["Equations"],
};

test("course edits that do not change the stored course stay clean", () => {
  assert.equal(normalizeWholeNumber("05"), "5");
  assert.equal(normalizeWholeNumber(""), "");
  assert.equal(
    courseSnapshot(course),
    courseSnapshot({
      ...course,
      title: "  Algebra  ",
      description: "Foundations ",
      batchSize: "05",
      topics: [" Equations ", "   "],
    }),
  );
  assert.notEqual(
    courseSnapshot(course),
    courseSnapshot({ ...course, title: "Geometry" }),
  );
  assert.notEqual(
    courseSnapshot(course),
    courseSnapshot({ ...course, topics: [] }),
  );
});

test("course save explains which required detail is missing", () => {
  assert.match(courseSaveBlocked({ ...course, title: "  " }), /Course name/);
  assert.match(
    courseSaveBlocked({ ...course, description: "" }),
    /Description/,
  );
  assert.match(courseSaveBlocked({ ...course, batchSize: "" }), /Cohort size/);
  assert.match(courseSaveBlocked({ ...course, batchSize: "0" }), /Cohort size/);
  assert.match(
    courseSaveBlocked({ ...course, batchSize: "31" }),
    /Cohort size/,
  );
  assert.match(
    courseSaveBlocked({ ...course, startDate: "2026-02-31" }),
    /start date/,
  );
  assert.equal(courseSaveBlocked(course), "");
  assert.equal(courseSaveBlocked({ ...course, startDate: "", topics: [] }), "");
});

const testDraft = {
  title: "Placement",
  instructions: "Read carefully",
  timeLimitMinutes: "20",
  published: false,
  questions: [
    {
      prompt: "2 + 2",
      options: ["1", "2", "3", "4"],
      correctIndex: 3,
      explanation: "",
    },
  ],
};

test("test drafts ignore surrounding spaces and leading zeroes", () => {
  assert.equal(
    testSnapshot(testDraft),
    testSnapshot({
      ...testDraft,
      title: " Placement ",
      instructions: "Read carefully  ",
      timeLimitMinutes: "020",
      questions: [
        {
          prompt: " 2 + 2 ",
          options: ["1", "2", "3", "4 "],
          correctIndex: 3,
          explanation: " ",
        },
      ],
    }),
  );
  assert.notEqual(
    testSnapshot(testDraft),
    testSnapshot({
      ...testDraft,
      questions: [
        ...testDraft.questions,
        {
          prompt: "",
          options: ["", "", "", ""],
          correctIndex: 0,
          explanation: "",
        },
      ],
    }),
  );
  assert.notEqual(
    testSnapshot(testDraft),
    testSnapshot({
      ...testDraft,
      questions: [{ ...testDraft.questions[0], correctIndex: 0 }],
    }),
  );
});

test("test save stays blocked until title and time can be stored", () => {
  assert.match(
    testDraftSaveBlocked({ title: "", timeLimitMinutes: "" }),
    /title/,
  );
  assert.match(
    testDraftSaveBlocked({ title: "Placement", timeLimitMinutes: "" }),
    /time limit/,
  );
  assert.match(
    testDraftSaveBlocked({ title: "Placement", timeLimitMinutes: "181" }),
    /time limit/,
  );
  assert.equal(
    testDraftSaveBlocked({ title: " Placement ", timeLimitMinutes: "020" }),
    "",
  );
});
