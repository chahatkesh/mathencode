"use client";

import { useState } from "react";
import { redirectIfExpired } from "~/components/admin/expired-session";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Loader2, Plus, Trash2 } from "lucide-react";
import { ConfirmDialog } from "~/components/admin";
import { ButtonLock } from "~/components/admin/button-lock";
import {
  UnsavedChangesDialog,
  useUnsavedChanges,
} from "~/components/admin/unsaved-changes";
import {
  AdminPageHeader,
  AdminEmptyState,
  AdminErrorState,
  AdminLoading,
} from "~/components/admin/admin-page";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  MAX_TEST_QUESTIONS,
  normalizeWholeNumber,
  testDraftSaveBlocked,
  testSnapshot,
} from "~/lib/admin-form-state";
import { publishBlockReason, testInputSchema } from "~/lib/validations";
import type {
  AdminTestCourseSummary,
  DiagnosticQuestionAdmin,
  DiagnosticTestAdmin,
} from "~/types";

type DraftQuestion = {
  key: string;
  id?: string;
  prompt: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
};

function blankQuestion(): DraftQuestion {
  return {
    key: crypto.randomUUID(),
    prompt: "",
    options: ["", "", "", ""],
    correctIndex: 0,
    explanation: "",
  };
}

function fromSaved(question: DiagnosticQuestionAdmin): DraftQuestion {
  const options = [...question.options, "", "", "", ""].slice(0, 4) as [
    string,
    string,
    string,
    string,
  ];
  return {
    key: question.id,
    id: question.id,
    prompt: question.prompt,
    options,
    correctIndex: question.correctIndex,
    explanation: question.explanation,
  };
}

function testDraftSnapshot(
  title: string,
  instructions: string,
  timeLimitMinutes: string,
  published: boolean,
  questions: DraftQuestion[],
) {
  return testSnapshot({
    title,
    instructions,
    timeLimitMinutes,
    published,
    questions,
  });
}

function commitTrimmed(
  event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  apply: (value: string) => void,
) {
  const next = event.target.value.trim();
  if (next !== event.target.value) apply(next);
}

function buildEditor(initial: {
  course: AdminTestCourseSummary;
  test: DiagnosticTestAdmin | null;
}) {
  if (initial.test) {
    const test = initial.test;
    const questions = test.questions.map(fromSaved);
    const time = test.timeLimitMinutes ? String(test.timeLimitMinutes) : "";
    return {
      course: initial.course,
      exists: true,
      title: test.title,
      instructions: test.instructions,
      timeLimitMinutes: time,
      published: test.published,
      questions,
      openKey: test.questions[0]?.id ?? null,
      savedSnapshot: testDraftSnapshot(
        test.title,
        test.instructions,
        time,
        test.published,
        questions,
      ),
    };
  }

  const nextTitle =
    initial.course.id === "common"
      ? "Common Diagnostic Test"
      : `${initial.course.title} Diagnostic Test`;
  const firstQuestion = blankQuestion();
  return {
    course: initial.course,
    exists: false,
    title: nextTitle,
    instructions: "",
    timeLimitMinutes: "",
    published: false,
    questions: [firstQuestion],
    openKey: firstQuestion.key,
    savedSnapshot: testDraftSnapshot(nextTitle, "", "", false, [firstQuestion]),
  };
}

export default function AdminTestEditor({
  courseId,
  initial,
}: {
  courseId: string;
  initial: {
    course: AdminTestCourseSummary;
    test: DiagnosticTestAdmin | null;
  };
}) {
  const router = useRouter();
  const [start] = useState(() => buildEditor(initial));
  const course = start.course;
  const [title, setTitle] = useState(start.title);
  const [instructions, setInstructions] = useState(start.instructions);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(
    start.timeLimitMinutes,
  );
  const [published, setPublished] = useState(start.published);
  const [questions, setQuestions] = useState(start.questions);
  const [openKey, setOpenKey] = useState<string | null>(start.openKey);
  const loading = false;
  const [saving, setSaving] = useState(false);
  const [pendingAction, setPendingAction] = useState<
    "draft" | "visibility" | null
  >(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [exists, setExists] = useState(start.exists);
  const [pendingDelete, setPendingDelete] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState<DraftQuestion | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [publishAttempted, setPublishAttempted] = useState(false);
  const [savedSnapshot, setSavedSnapshot] = useState<string | null>(
    start.savedSnapshot,
  );
  const draftSnapshot = testDraftSnapshot(
    title,
    instructions,
    timeLimitMinutes,
    published,
    questions,
  );
  const isDirty =
    !loading && savedSnapshot !== null && draftSnapshot !== savedSnapshot;
  const unsaved = useUnsavedChanges(isDirty);

  function updateQuestion(key: string, patch: Partial<DraftQuestion>) {
    setQuestions((current) =>
      current.map((question) =>
        question.key === key ? { ...question, ...patch } : question,
      ),
    );
  }

  function updateOption(key: string, optionIndex: number, value: string) {
    setQuestions((current) =>
      current.map((question) => {
        if (question.key !== key) return question;
        const options = [...question.options] as [
          string,
          string,
          string,
          string,
        ];
        options[optionIndex] = value;
        return { ...question, options };
      }),
    );
  }

  function moveQuestion(index: number, direction: -1 | 1) {
    setQuestions((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = current.slice();
      const [item] = next.splice(index, 1);
      if (!item) return current;
      next.splice(target, 0, item);
      return next;
    });
  }

  function addQuestion() {
    const question = blankQuestion();
    setQuestions((current) => [...current, question]);
    setOpenKey(question.key);
  }

  async function save(nextPublished: boolean) {
    if (saving || deleting) return;
    if (testDraftSaveBlocked({ title, timeLimitMinutes })) return;
    if (nextPublished === published && !isDirty) return;
    setError("");
    setNotice("");
    setFieldErrors({});
    setPublishAttempted(nextPublished);
    const payload = {
      title,
      instructions,
      timeLimitMinutes: Number(timeLimitMinutes),
      published: nextPublished,
      questions: questions.map((question) => ({
        id: question.id,
        prompt: question.prompt,
        options: question.options,
        correctIndex: question.correctIndex,
        explanation: question.explanation,
      })),
    };

    if (nextPublished) {
      const reason = publishBlockReason(payload);
      if (reason) {
        setError(reason);
        const incomplete = questions.find(
          (question) =>
            !question.prompt.trim() ||
            question.options.some((option) => !option.trim()),
        );
        if (incomplete) setOpenKey(incomplete.key);
        return;
      }
    }

    const parsed = testInputSchema.safeParse(payload);
    if (!parsed.success) {
      setFieldErrors(
        Object.fromEntries(
          parsed.error.issues.map((issue) => [
            issue.path.join("."),
            issue.message,
          ]),
        ),
      );
      const questionIssue = parsed.error.issues.find(
        (issue) =>
          issue.path[0] === "questions" && typeof issue.path[1] === "number",
      );
      if (questionIssue)
        setOpenKey(questions[Number(questionIssue.path[1])]?.key ?? null);
      setError(
        parsed.error.issues[0]?.message ?? "Check the test and try again.",
      );
      return;
    }

    setPendingAction(nextPublished === published ? "draft" : "visibility");
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/tests/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (redirectIfExpired(response, (href) => router.replace(href))) return;
      const body = (await response.json()) as {
        success?: boolean;
        message?: string;
        data?: DiagnosticTestAdmin;
      };
      if (!response.ok || !body.success || !body.data) {
        setError(body.message || "Could not save this test.");
        return;
      }
      setExists(true);
      setPublished(body.data.published);
      setTitle(body.data.title);
      setInstructions(body.data.instructions);
      setTimeLimitMinutes(String(body.data.timeLimitMinutes));
      const openIndex = questions.findIndex(
        (question) => question.key === openKey,
      );
      const nextQuestions = body.data.questions.map(fromSaved);
      setQuestions(nextQuestions);
      setSavedSnapshot(
        testDraftSnapshot(
          body.data.title,
          body.data.instructions,
          String(body.data.timeLimitMinutes),
          body.data.published,
          nextQuestions,
        ),
      );
      setOpenKey(body.data.questions[openIndex]?.id ?? null);
      setNotice(
        body.data.published
          ? "Test published. Students can take it from the course card."
          : "Test saved. It stays hidden until you publish it.",
      );
      router.refresh();
    } catch (saveError) {
      console.error("Error saving test:", saveError);
      setError("Could not save this test.");
    } finally {
      setSaving(false);
      setPendingAction(null);
    }
  }

  async function confirmDelete() {
    setDeleting(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/tests/${courseId}`, {
        method: "DELETE",
      });
      if (redirectIfExpired(response, (href) => router.replace(href))) return;
      const body = (await response.json()) as {
        success?: boolean;
        message?: string;
      };
      if (!response.ok || !body.success) {
        setError(body.message || "Could not delete this test.");
        setPendingDelete(false);
        return;
      }
      setSavedSnapshot(draftSnapshot);
      router.push("/admin/tests");
      router.refresh();
    } catch (deleteError) {
      console.error("Error deleting test:", deleteError);
      setError("Could not delete this test.");
      setPendingDelete(false);
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <AdminLoading label="Loading test" variant="editor" />;

  if (!course)
    return (
      <div className="space-y-6">
        <AdminPageHeader title="Diagnostic test" backHref="/admin/tests" />
        <AdminErrorState
          message={error || "Course not found."}
          onRetry={() => router.refresh()}
        />
      </div>
    );

  const titleError =
    fieldErrors.title ||
    (publishAttempted && !title.trim() ? "Enter a test title." : "");
  const timeError =
    fieldErrors.timeLimitMinutes ||
    (publishAttempted &&
    (!Number.isInteger(Number(timeLimitMinutes)) ||
      Number(timeLimitMinutes) < 1 ||
      Number(timeLimitMinutes) > 180)
      ? "Set a time limit between 1 and 180 minutes."
      : "");
  const draftBlock = testDraftSaveBlocked({ title, timeLimitMinutes });
  const publishReason = publishBlockReason({
    title,
    timeLimitMinutes: Number(timeLimitMinutes),
    questions,
  });
  const saveLocked = Boolean(draftBlock) || !isDirty;
  const publishLocked = published
    ? Boolean(draftBlock)
    : Boolean(publishReason);
  const saveReason = !isDirty
    ? published
      ? "No changes to update"
      : "No changes to save"
    : draftBlock;
  const visibilityReason = published
    ? draftBlock || "Fix the test before unpublishing."
    : publishReason || "Finish the test before publishing.";
  const saveStatus = error
    ? error
    : isDirty
      ? draftBlock ||
        (published
          ? "Unsaved changes. Update the test to keep them."
          : publishReason
            ? `Unsaved changes. Save a draft now. ${publishReason}.`
            : "Unsaved changes. Save a draft, or publish it for students.")
      : !published && publishReason
        ? exists
          ? `No unsaved changes. ${publishReason}.`
          : "Add the test details, then save a draft or publish."
        : !published
          ? "No unsaved changes. Publish when students should take this test."
          : "No unsaved changes.";
  const saveLabel =
    pendingAction === "draft"
      ? "Saving…"
      : published
        ? "Update test"
        : "Save draft";
  const visibilityLabel =
    pendingAction === "visibility"
      ? published
        ? "Unpublishing…"
        : "Publishing…"
      : published
        ? isDirty
          ? "Save & unpublish"
          : "Unpublish"
        : isDirty
          ? "Save & publish"
          : "Publish";

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={exists ? "Edit diagnostic test" : "Create diagnostic test"}
        description={course.title}
        backHref="/admin/tests"
      >
        <Badge variant={published ? "default" : "secondary"}>
          {published ? "Published" : "Draft"}
        </Badge>
        {exists ? (
          <Button asChild variant="outline">
            <Link href="/admin/tests/submissions">View submissions</Link>
          </Button>
        ) : null}
      </AdminPageHeader>
      {error ? <AdminErrorState message={error} /> : null}
      {notice && !isDirty ? (
        <p
          role="status"
          className="rounded-lg border border-admin-primary/20 bg-admin-primary/5 px-4 py-3 text-sm"
        >
          {notice}
        </p>
      ) : null}
      <fieldset disabled={saving || deleting} className="min-w-0 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Test settings</CardTitle>
            <CardDescription>
              Set the context and time students have to complete this
              diagnostic.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 md:grid-cols-[minmax(0,1fr)_220px]">
            <div className="space-y-2">
              <Label htmlFor="test-title">Test title</Label>
              <Input
                id="test-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                onBlur={(event) =>
                  commitTrimmed(event, (value) => setTitle(value))
                }
                maxLength={200}
                aria-invalid={Boolean(titleError)}
                aria-describedby="test-title-error"
              />
              <p id="test-title-error" className="text-sm text-red-600">
                {titleError}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="test-time">Time limit · minutes</Label>
              <Input
                id="test-time"
                type="number"
                min={1}
                max={180}
                step={1}
                value={timeLimitMinutes}
                onChange={(event) => setTimeLimitMinutes(event.target.value)}
                onBlur={(event) => {
                  const next = normalizeWholeNumber(event.target.value);
                  if (next !== event.target.value) setTimeLimitMinutes(next);
                }}
                placeholder="20"
                required
                aria-invalid={Boolean(timeError)}
                aria-describedby="test-time-error"
              />
              <p id="test-time-error" className="text-sm text-red-600">
                {timeError}
              </p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="test-instructions">
                Student instructions{" "}
                <span className="font-normal text-admin-muted-foreground">
                  (optional)
                </span>
              </Label>
              <Textarea
                id="test-instructions"
                value={instructions}
                onChange={(event) => setInstructions(event.target.value)}
                onBlur={(event) =>
                  commitTrimmed(event, (value) => setInstructions(value))
                }
                className="min-h-24"
                maxLength={4000}
                placeholder="What should students know before they begin?"
              />
              <p className="text-xs text-admin-muted-foreground">
                Shown before the first question. The test automatically submits
                when the countdown ends.
              </p>
              {fieldErrors.instructions ? (
                <p className="text-sm text-red-600">
                  {fieldErrors.instructions}
                </p>
              ) : null}
            </div>
          </CardContent>
        </Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Questions</h2>
              <Badge variant="secondary">{questions.length}</Badge>
            </div>
            <p className="mt-1 text-sm text-admin-muted-foreground">
              Four options per question. Choose one correct answer.
            </p>
          </div>
          <ButtonLock
            locked={questions.length >= MAX_TEST_QUESTIONS}
            reason="A test can have at most 80 questions."
          >
            <Button
              type="button"
              variant="outline"
              disabled={questions.length >= MAX_TEST_QUESTIONS}
              onClick={addQuestion}
            >
              <Plus className="size-4" />
              Add question
            </Button>
          </ButtonLock>
        </div>
        {fieldErrors.questions ? (
          <p className="text-sm text-red-600">{fieldErrors.questions}</p>
        ) : null}
        {questions.length === 0 ? (
          <AdminEmptyState
            title="Your first question starts here"
            description="Add a question and four answer options to begin building this test."
          >
            <ButtonLock
              locked={questions.length >= MAX_TEST_QUESTIONS}
              reason="A test can have at most 80 questions."
            >
              <Button
                type="button"
                variant="outline"
                disabled={questions.length >= MAX_TEST_QUESTIONS}
                onClick={addQuestion}
              >
                <Plus className="size-4" />
                Add question
              </Button>
            </ButtonLock>
          </AdminEmptyState>
        ) : (
          <div className="space-y-2">
            {questions.map((question, index) => {
              const open = openKey === question.key;
              const complete =
                question.prompt.trim() &&
                question.options.every((option) => option.trim());
              const promptError =
                fieldErrors[`questions.${index}.prompt`] ||
                (publishAttempted && !question.prompt.trim()
                  ? "Enter a question before publishing."
                  : "");
              return (
                <Card
                  key={question.key}
                  className={open ? "border-admin-primary/40" : ""}
                >
                  <div className="flex items-center gap-1 px-2 py-1.5">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setOpenKey(open ? null : question.key)}
                      aria-expanded={open}
                      aria-controls={`question-panel-${question.key}`}
                      className="h-8 min-w-0 flex-1 justify-start px-1.5 text-left"
                    >
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-admin-muted text-[11px] tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm font-medium">
                        {question.prompt.trim() || "Untitled question"}
                      </span>
                      <span
                        className={`shrink-0 text-[11px] ${complete ? "text-admin-muted-foreground" : "text-orange-700"}`}
                      >
                        {complete ? "Ready" : "Incomplete"}
                      </span>
                      <ChevronDown
                        className={`size-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                      />
                    </Button>
                    <div className="flex shrink-0">
                      <ButtonLock
                        locked={index === 0}
                        reason="This question is already first."
                      >
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={
                            index === 0
                              ? `Question ${index + 1} is already first`
                              : `Move question ${index + 1} up`
                          }
                          onClick={() => moveQuestion(index, -1)}
                          disabled={index === 0}
                          className="size-8"
                        >
                          <ChevronUp className="size-4" />
                        </Button>
                      </ButtonLock>
                      <ButtonLock
                        locked={index === questions.length - 1}
                        reason="This question is already last."
                      >
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={
                            index === questions.length - 1
                              ? `Question ${index + 1} is already last`
                              : `Move question ${index + 1} down`
                          }
                          onClick={() => moveQuestion(index, 1)}
                          disabled={index === questions.length - 1}
                          className="size-8"
                        >
                          <ChevronDown className="size-4" />
                        </Button>
                      </ButtonLock>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete question ${index + 1}`}
                        className="size-8 text-admin-muted-foreground hover:text-red-600"
                        onClick={() => {
                          const filled =
                            question.prompt.trim() ||
                            question.explanation.trim() ||
                            question.options.some((option) => option.trim());
                          if (!filled) {
                            setQuestions((current) =>
                              current.filter(
                                (item) => item.key !== question.key,
                              ),
                            );
                            return;
                          }
                          setPendingQuestion(question);
                        }}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                  {open ? (
                    <CardContent
                      id={`question-panel-${question.key}`}
                      className="space-y-3 border-t border-admin-border p-3 sm:p-4"
                    >
                      <div className="space-y-1.5">
                        <Label
                          htmlFor={`prompt-${question.key}`}
                          className="text-xs"
                        >
                          Question
                        </Label>
                        <Textarea
                          id={`prompt-${question.key}`}
                          value={question.prompt}
                          onChange={(event) =>
                            updateQuestion(question.key, {
                              prompt: event.target.value,
                            })
                          }
                          onBlur={(event) =>
                            commitTrimmed(event, (value) =>
                              updateQuestion(question.key, { prompt: value }),
                            )
                          }
                          rows={2}
                          className="min-h-14 py-2 text-sm"
                          maxLength={2000}
                          placeholder="Write the question…"
                          aria-invalid={Boolean(promptError)}
                          aria-describedby={
                            promptError
                              ? `prompt-error-${question.key}`
                              : undefined
                          }
                        />
                        {promptError ? (
                          <p
                            id={`prompt-error-${question.key}`}
                            className="text-xs text-red-600"
                          >
                            {promptError}
                          </p>
                        ) : null}
                      </div>
                      <fieldset className="space-y-1.5">
                        <legend className="text-xs font-medium text-admin-muted-foreground">
                          Answers · choose the correct one
                        </legend>
                        {question.options.map((option, optionIndex) => {
                          const letter = String.fromCharCode(65 + optionIndex);
                          const correct = question.correctIndex === optionIndex;
                          const optionError =
                            fieldErrors[
                              `questions.${index}.options.${optionIndex}`
                            ] ||
                            (publishAttempted && !option.trim()
                              ? "Enter this answer option before publishing."
                              : "");
                          return (
                            <div key={optionIndex} className="space-y-1">
                              <div
                                className={`flex items-center gap-2 rounded-md px-2 py-1 ${correct ? "bg-admin-primary/5 ring-1 ring-admin-primary/30" : ""}`}
                              >
                                <input
                                  type="radio"
                                  name={`correct-${question.key}`}
                                  checked={correct}
                                  onChange={() =>
                                    updateQuestion(question.key, {
                                      correctIndex: optionIndex,
                                    })
                                  }
                                  aria-label={`Mark option ${letter} as correct for question ${index + 1}`}
                                  className="accent-orange-600 size-4 shrink-0 focus-visible:outline-admin-ring"
                                />
                                <Label
                                  htmlFor={`option-${question.key}-${optionIndex}`}
                                  className="w-4 shrink-0 text-xs text-admin-muted-foreground"
                                >
                                  {letter}
                                </Label>
                                <Input
                                  id={`option-${question.key}-${optionIndex}`}
                                  value={option}
                                  onChange={(event) =>
                                    updateOption(
                                      question.key,
                                      optionIndex,
                                      event.target.value,
                                    )
                                  }
                                  onBlur={(event) =>
                                    commitTrimmed(event, (value) =>
                                      updateOption(
                                        question.key,
                                        optionIndex,
                                        value,
                                      ),
                                    )
                                  }
                                  maxLength={500}
                                  placeholder={`Answer ${letter}`}
                                  aria-invalid={Boolean(optionError)}
                                  aria-describedby={
                                    optionError
                                      ? `option-error-${question.key}-${optionIndex}`
                                      : undefined
                                  }
                                  className="h-9"
                                />
                                {correct ? (
                                  <span className="hidden shrink-0 text-[11px] text-admin-primary sm:inline">
                                    Correct
                                  </span>
                                ) : null}
                              </div>
                              {optionError ? (
                                <p
                                  id={`option-error-${question.key}-${optionIndex}`}
                                  className="pl-8 text-xs text-red-600"
                                >
                                  {optionError}
                                </p>
                              ) : null}
                            </div>
                          );
                        })}
                      </fieldset>
                      <div className="space-y-1.5">
                        <Label
                          htmlFor={`explanation-${question.key}`}
                          className="text-xs"
                        >
                          Explanation{" "}
                          <span className="font-normal text-admin-muted-foreground">
                            optional, visible only to admins
                          </span>
                        </Label>
                        <Textarea
                          id={`explanation-${question.key}`}
                          value={question.explanation}
                          onChange={(event) =>
                            updateQuestion(question.key, {
                              explanation: event.target.value,
                            })
                          }
                          onBlur={(event) =>
                            commitTrimmed(event, (value) =>
                              updateQuestion(question.key, {
                                explanation: value,
                              }),
                            )
                          }
                          rows={2}
                          className="min-h-14 py-2 text-sm"
                          maxLength={2000}
                          placeholder="Why this answer is correct…"
                        />
                        {fieldErrors[`questions.${index}.explanation`] ? (
                          <p className="text-xs text-red-600">
                            {fieldErrors[`questions.${index}.explanation`]}
                          </p>
                        ) : null}
                      </div>
                    </CardContent>
                  ) : null}
                </Card>
              );
            })}
          </div>
        )}
      </fieldset>
      <div className="sticky bottom-3 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-admin-border bg-admin-card/95 p-4 shadow-sm backdrop-blur">
        <div className="text-xs text-admin-muted-foreground">
          <p className="font-medium text-admin-foreground">
            {questions.length} questions ·{" "}
            {published ? "Visible to students" : "Hidden from students"}
          </p>
          <p
            id="test-save-status"
            aria-live={error ? "off" : "polite"}
            className={`mt-1 max-w-lg ${error ? "text-red-600" : ""}`}
          >
            {saveStatus}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {exists ? (
            <Button
              type="button"
              variant="ghost"
              disabled={saving || deleting}
              onClick={() => setPendingDelete(true)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="size-4" />
              Delete test
            </Button>
          ) : null}
          <ButtonLock locked={saveLocked && !saving} reason={saveReason}>
            <Button
              type="button"
              variant="outline"
              onClick={() => void save(published)}
              disabled={saving || deleting}
              aria-describedby="test-save-status"
            >
              {pendingAction === "draft" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : null}
              {saveLabel}
            </Button>
          </ButtonLock>
          <ButtonLock
            locked={publishLocked && !saving}
            reason={visibilityReason}
          >
            <Button
              type="button"
              variant={published ? "secondary" : "default"}
              onClick={() => void save(!published)}
              disabled={saving || deleting}
              aria-describedby="test-save-status"
            >
              {pendingAction === "visibility" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : null}
              {visibilityLabel}
            </Button>
          </ButtonLock>
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(pendingQuestion)}
        title="Delete question"
        message="Remove this question from the test? Save the test afterward to keep the change."
        confirmLabel="Delete question"
        onClose={() => setPendingQuestion(null)}
        onConfirm={() => {
          if (!pendingQuestion) return;
          setQuestions((current) =>
            current.filter((item) => item.key !== pendingQuestion.key),
          );
          setPendingQuestion(null);
        }}
      />
      <ConfirmDialog
        open={pendingDelete}
        title="Delete diagnostic test"
        confirmLabel="Delete test"
        message="Delete this test? Student submissions that were already received will stay available."
        busy={deleting}
        onClose={() => {
          if (!deleting) setPendingDelete(false);
        }}
        onConfirm={() => {
          void confirmDelete();
        }}
      />
      <UnsavedChangesDialog
        open={unsaved.leaveOpen}
        onStay={unsaved.stay}
        onLeave={unsaved.leave}
      />
    </div>
  );
}
