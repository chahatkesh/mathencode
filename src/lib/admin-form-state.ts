import { isCalendarDate } from "~/lib/course-format";

export const MAX_COURSE_TOPICS = 40;
export const MAX_TEST_QUESTIONS = 80;

export type CourseDraft = {
  title: string;
  description: string;
  startDate: string;
  batchSize: string;
  topics: string[];
};

export type TestQuestionDraft = {
  prompt: string;
  options: readonly string[];
  correctIndex: number;
  explanation: string;
};

export type TestDraft = {
  title: string;
  instructions: string;
  timeLimitMinutes: string;
  published: boolean;
  questions: readonly TestQuestionDraft[];
};

/** Whole numbers keep a stable form so "05" matches a saved value of "5". */
export function normalizeWholeNumber(value: string) {
  const trimmed = value.trim();
  if (!/^\d+$/.test(trimmed)) return trimmed;
  return String(Number(trimmed));
}

export function courseSnapshot(draft: CourseDraft) {
  return JSON.stringify({
    title: draft.title.trim(),
    description: draft.description.trim(),
    startDate: draft.startDate.trim(),
    batchSize: normalizeWholeNumber(draft.batchSize),
    topics: draft.topics.map((topic) => topic.trim()).filter(Boolean),
  });
}

export function courseSaveBlocked(draft: CourseDraft) {
  if (!draft.title.trim()) return "Course name is required.";
  if (!draft.description.trim()) return "Description is required.";
  const batch = normalizeWholeNumber(draft.batchSize);
  if (!batch) return "Cohort size is required.";
  if (!/^\d+$/.test(batch))
    return "Cohort size must be a whole number from 1 to 30.";
  const size = Number(batch);
  if (size < 1 || size > 30)
    return "Cohort size must be a whole number from 1 to 30.";
  if (draft.startDate.trim() && !isCalendarDate(draft.startDate.trim()))
    return "Enter a valid start date.";
  const topics = draft.topics.map((topic) => topic.trim()).filter(Boolean);
  if (topics.length > MAX_COURSE_TOPICS)
    return "A course can have at most 40 topics.";
  if (topics.some((topic) => topic.length > 200))
    return "A topic cannot be longer than 200 characters.";
  return "";
}

export function testSnapshot(draft: TestDraft) {
  return JSON.stringify({
    title: draft.title.trim(),
    instructions: draft.instructions.trim(),
    timeLimitMinutes: normalizeWholeNumber(draft.timeLimitMinutes),
    published: draft.published,
    questions: draft.questions.map((question) => ({
      prompt: question.prompt.trim(),
      options: question.options.map((option) => option.trim()),
      correctIndex: question.correctIndex,
      explanation: question.explanation.trim(),
    })),
  });
}

export function testDraftSaveBlocked(
  draft: Pick<TestDraft, "title" | "timeLimitMinutes">,
) {
  if (!draft.title.trim()) return "Enter a test title to save.";
  const minutes = normalizeWholeNumber(draft.timeLimitMinutes);
  if (!/^\d+$/.test(minutes))
    return "Set a time limit between 1 and 180 minutes to save.";
  const value = Number(minutes);
  if (value < 1 || value > 180)
    return "Set a time limit between 1 and 180 minutes to save.";
  return "";
}
