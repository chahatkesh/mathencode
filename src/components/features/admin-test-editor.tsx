"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Loader2, Plus, Trash2 } from "lucide-react";
import { ConfirmDialog } from "~/components/admin";
import { publishBlockReason, testInputSchema } from "~/lib/validations";
import type {
  AdminTestCourseSummary,
  DiagnosticQuestionAdmin,
  DiagnosticTestAdmin,
} from "~/types";

const fieldClass =
  "mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-primary";

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

export default function AdminTestEditor({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [course, setCourse] = useState<AdminTestCourseSummary | null>(null);
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [timeLimitMinutes, setTimeLimitMinutes] = useState("");
  const [published, setPublished] = useState(false);
  const [questions, setQuestions] = useState<DraftQuestion[]>([]);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [exists, setExists] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState<DraftQuestion | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch(`/api/admin/tests/${courseId}`);
        const body = (await response.json()) as {
          success?: boolean;
          message?: string;
          data?: {
            course: AdminTestCourseSummary;
            test: DiagnosticTestAdmin | null;
          };
        };
        if (cancelled) return;
        if (!response.ok || !body.success || !body.data) {
          setError(body.message || "Course not found.");
          return;
        }
        setCourse(body.data.course);
        if (body.data.test) {
          const test = body.data.test;
          setExists(true);
          setTitle(test.title);
          setInstructions(test.instructions);
          setTimeLimitMinutes(
            test.timeLimitMinutes ? String(test.timeLimitMinutes) : "",
          );
          setPublished(test.published);
          setQuestions(test.questions.map(fromSaved));
          setOpenKey(test.questions[0]?.id ?? null);
        } else {
          setTitle(
            body.data.course.id === "common"
              ? "Common Diagnostic Test"
              : `${body.data.course.title} Diagnostic Test`,
          );
          setQuestions([blankQuestion()]);
        }
      } catch (loadError) {
        console.error("Error loading test:", loadError);
        if (!cancelled) setError("Could not load this test.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [courseId]);

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
    setError("");
    setNotice("");
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
        return;
      }
    }

    const parsed = testInputSchema.safeParse(payload);
    if (!parsed.success) {
      setError(
        parsed.error.issues[0]?.message ?? "Check the test and try again.",
      );
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/tests/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
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
      setQuestions(body.data.questions.map(fromSaved));
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
    }
  }

  async function confirmDelete() {
    setDeleting(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/tests/${courseId}`, {
        method: "DELETE",
      });
      const body = (await response.json()) as {
        success?: boolean;
        message?: string;
      };
      if (!response.ok || !body.success) {
        setError(body.message || "Could not delete this test.");
        setPendingDelete(false);
        return;
      }
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

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-dark/70">
        <Loader2 className="mr-2 size-4 animate-spin" />
        Loading test
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container-custom py-16 text-center">
        <h1 className="text-2xl font-bold text-dark">Course not found</h1>
        <Link href="/admin/tests" className="btn-primary mt-6 inline-flex">
          Back to tests
        </Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-8 pb-28">
      <Link
        href="/admin/tests"
        className="text-sm font-semibold text-primary hover:underline"
      >
        Back to tests
      </Link>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-primary">{course.title}</p>
          <h1 className="text-3xl font-bold text-dark">
            {exists ? "Edit diagnostic test" : "Create diagnostic test"}
          </h1>
        </div>
        {exists ? (
          <Link
            href={`/admin/tests/submissions?course=${course.id}`}
            className="text-sm font-semibold text-primary hover:underline"
          >
            View submissions
          </Link>
        ) : null}
      </div>
      {!course.visible ? (
        <p className="mt-4 rounded-lg bg-neutral px-4 py-3 text-sm text-dark/70">
          This course is hidden, so students cannot open its test until you show
          the course again.
        </p>
      ) : null}

      {error ? (
        <p
          role="alert"
          className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      ) : null}
      {notice ? (
        <p
          role="status"
          className="mt-4 rounded-lg bg-primary/10 px-4 py-3 text-sm text-dark"
        >
          {notice}
        </p>
      ) : null}

      <div className="mt-6 grid gap-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <label className="block text-sm font-medium text-dark">
          Test title
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className={fieldClass}
            maxLength={200}
          />
        </label>
        <label className="block text-sm font-medium text-dark">
          Instructions
          <textarea
            value={instructions}
            onChange={(event) => setInstructions(event.target.value)}
            className={`${fieldClass} min-h-24`}
            maxLength={4000}
            placeholder="Optional. Shown to the student before the first question."
          />
        </label>
        <label className="block text-sm font-medium text-dark">
          Time limit (minutes)
          <input
            type="number"
            min={1}
            max={180}
            step={1}
            value={timeLimitMinutes}
            onChange={(event) => setTimeLimitMinutes(event.target.value)}
            className={fieldClass}
            placeholder="20"
            required
          />
          <span className="mt-1 block text-xs font-normal text-dark/50">
            Students see a countdown and the test submits when time runs out.
          </span>
        </label>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-dark">Questions</h2>
        <button
          type="button"
          onClick={addQuestion}
          className="inline-flex items-center rounded-lg border border-primary px-3 py-2 text-sm font-semibold text-primary"
        >
          <Plus className="mr-1 size-4" />
          Add question
        </button>
      </div>

      {questions.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center text-dark/70">
          No questions yet. Add the first one to build this test.
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {questions.map((question, index) => {
            const open = openKey === question.key;
            return (
              <section
                key={question.key}
                className="rounded-2xl border border-gray-100 bg-white shadow-sm"
              >
                <div className="flex items-center gap-2 px-4 py-3">
                  <button
                    type="button"
                    onClick={() => setOpenKey(open ? null : question.key)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide text-dark/50">
                      Question {index + 1}
                    </span>
                    <span className="mt-1 block truncate text-sm font-medium text-dark">
                      {question.prompt.trim() || "Untitled question"}
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label="Move question up"
                    onClick={() => moveQuestion(index, -1)}
                    disabled={index === 0}
                    className="rounded-lg p-2 text-dark/60 disabled:opacity-30"
                  >
                    <ChevronUp className="size-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Move question down"
                    onClick={() => moveQuestion(index, 1)}
                    disabled={index === questions.length - 1}
                    className="rounded-lg p-2 text-dark/60 disabled:opacity-30"
                  >
                    <ChevronDown className="size-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Delete question"
                    onClick={() => {
                      const filled =
                        question.prompt.trim() ||
                        question.explanation.trim() ||
                        question.options.some((option) => option.trim());
                      if (!filled) {
                        setQuestions((current) =>
                          current.filter((item) => item.key !== question.key),
                        );
                        return;
                      }
                      setPendingQuestion(question);
                    }}
                    className="rounded-lg p-2 text-secondary"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                {open ? (
                  <div className="space-y-4 border-t border-gray-100 px-4 py-4">
                    <label className="block text-sm font-medium text-dark">
                      Question
                      <textarea
                        value={question.prompt}
                        onChange={(event) =>
                          updateQuestion(question.key, {
                            prompt: event.target.value,
                          })
                        }
                        className={`${fieldClass} min-h-20`}
                        maxLength={2000}
                      />
                    </label>
                    <fieldset>
                      <legend className="text-sm font-medium text-dark">
                        Answer options
                      </legend>
                      <div className="mt-2 space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <label
                            key={optionIndex}
                            className="flex items-center gap-3 text-sm text-dark"
                          >
                            <input
                              type="radio"
                              name={`correct-${question.key}`}
                              checked={question.correctIndex === optionIndex}
                              onChange={() =>
                                updateQuestion(question.key, {
                                  correctIndex: optionIndex,
                                })
                              }
                              aria-label={`Mark option ${optionIndex + 1} as correct`}
                              className="accent-primary"
                            />
                            <span className="w-5 font-semibold">
                              {String.fromCharCode(65 + optionIndex)}
                            </span>
                            <input
                              value={option}
                              onChange={(event) =>
                                updateOption(
                                  question.key,
                                  optionIndex,
                                  event.target.value,
                                )
                              }
                              className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-primary"
                              maxLength={500}
                              placeholder={`Option ${optionIndex + 1}`}
                            />
                          </label>
                        ))}
                      </div>
                      <p className="mt-2 text-xs text-dark/50">
                        Select the radio button next to the correct answer.
                      </p>
                    </fieldset>
                    <label className="block text-sm font-medium text-dark">
                      Explanation
                      <textarea
                        value={question.explanation}
                        onChange={(event) =>
                          updateQuestion(question.key, {
                            explanation: event.target.value,
                          })
                        }
                        className={`${fieldClass} min-h-16`}
                        maxLength={2000}
                        placeholder="Optional. Visible to admins when reviewing a submission."
                      />
                    </label>
                  </div>
                ) : null}
              </section>
            );
          })}
        </div>
      )}

      <div className="sticky bottom-4 mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-gray-100 bg-white/95 p-4 shadow-custom backdrop-blur">
        <button
          type="button"
          onClick={() => void save(published)}
          disabled={saving}
          className="inline-flex items-center rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary disabled:opacity-60"
        >
          {saving ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
          Save
        </button>
        {published ? (
          <button
            type="button"
            onClick={() => void save(false)}
            disabled={saving}
            className="rounded-lg bg-neutral px-4 py-2 text-sm font-semibold text-dark disabled:opacity-60"
          >
            Unpublish
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void save(true)}
            disabled={saving}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            Publish
          </button>
        )}
        {exists ? (
          <button
            type="button"
            onClick={() => setPendingDelete(true)}
            disabled={saving}
            className="ml-auto text-sm font-semibold text-secondary disabled:opacity-60"
          >
            Delete test
          </button>
        ) : null}
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
        message="Delete this test? Student submissions that were already received will stay available."
        busy={deleting}
        onClose={() => {
          if (!deleting) setPendingDelete(false);
        }}
        onConfirm={() => {
          void confirmDelete();
        }}
      />
    </div>
  );
}
