"use client";

import { useEffect, useState } from "react";
import { Check, X, Minus } from "lucide-react";
import {
  AdminPageHeader,
  AdminEmptyState,
  AdminErrorState,
  AdminLoading,
} from "~/components/admin/admin-page";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Switch } from "~/components/ui/switch";
import { formatDuration } from "~/lib/duration";
import type { DiagnosticSubmissionDetail } from "~/types";

function formatWhen(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminSubmissionDetail({
  submissionId,
}: {
  submissionId: string;
}) {
  const [submission, setSubmission] =
    useState<DiagnosticSubmissionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [seenError, setSeenError] = useState("");
  const [savingSeen, setSavingSeen] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          `/api/admin/test-submissions/${submissionId}`,
        );
        const body = (await response.json()) as {
          success?: boolean;
          message?: string;
          data?: DiagnosticSubmissionDetail;
        };
        if (cancelled) return;
        if (!response.ok || !body.success || !body.data) {
          setError(body.message || "Submission not found.");
          return;
        }
        setSubmission(body.data);
      } catch (loadError) {
        console.error("Error loading submission:", loadError);
        if (!cancelled) setError("Could not load this submission.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [submissionId, reload]);

  async function toggleSeen() {
    if (!submission || savingSeen) return;
    setSavingSeen(true);
    setSeenError("");
    try {
      const response = await fetch(
        `/api/admin/test-submissions/${submission.id}/seen`,
        { method: "PATCH" },
      );
      const body = (await response.json()) as {
        success?: boolean;
        message?: string;
        data?: { seen?: boolean };
      };
      if (
        !response.ok ||
        !body.success ||
        typeof body.data?.seen !== "boolean"
      ) {
        setSeenError(body.message || "Could not update seen status.");
        return;
      }
      setSubmission({ ...submission, seen: body.data.seen });
    } catch (toggleError) {
      console.error("Error updating seen status:", toggleError);
      setSeenError("Could not update seen status.");
    } finally {
      setSavingSeen(false);
    }
  }

  if (loading)
    return <AdminLoading label="Loading submission" variant="detail" />;

  if (!submission || error)
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Submission details"
          backHref="/admin/tests/submissions"
        />
        <AdminErrorState
          message={error || "Submission not found."}
          onRetry={() => setReload((value) => value + 1)}
        />
      </div>
    );

  const stats = [
    ["Total questions", submission.totalQuestions],
    ["Correct", submission.correct],
    ["Incorrect", submission.incorrect],
    ["Unanswered", submission.unanswered],
    ["Score", `${submission.percentage}%`],
    [
      "Time taken",
      submission.durationSeconds > 0
        ? formatDuration(submission.durationSeconds)
        : "—",
    ],
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={submission.studentName}
        description={`${submission.courseTitle} · ${submission.testTitle}`}
        backHref="/admin/tests/submissions"
      >
        <div className="flex items-center gap-2">
          <Switch
            checked={submission.seen === true}
            disabled={savingSeen}
            onCheckedChange={() => void toggleSeen()}
            aria-label={`Mark ${submission.studentName}'s submission as ${submission.seen ? "unseen" : "seen"}`}
          />
          <span className="text-sm text-admin-muted-foreground">
            {submission.seen ? "Seen" : "Unseen"}
          </span>
        </div>
      </AdminPageHeader>
      {seenError ? (
        <p role="alert" className="text-sm text-red-700">
          {seenError}
        </p>
      ) : null}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Student details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-5 sm:grid-cols-3">
            {[
              ["Contact", submission.contactNumber],
              ["Country", submission.country],
              ["Submitted", formatWhen(submission.createdAt)],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs text-admin-muted-foreground">{label}</dt>
                <dd className="mt-1 break-words text-sm font-medium">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {stats.map(([label, value]) => (
          <Card
            key={label}
            className={
              label === "Correct"
                ? "border-green-200 bg-green-50"
                : label === "Incorrect"
                  ? "border-red-200 bg-red-50"
                  : label === "Score"
                    ? "border-admin-primary/30 bg-admin-primary/5"
                    : ""
            }
          >
            <CardContent className="p-4">
              <p className="text-xs text-admin-muted-foreground">{label}</p>
              <p
                className={`mt-2 text-2xl font-semibold tabular-nums ${label === "Correct" ? "text-green-700" : label === "Incorrect" ? "text-red-700" : label === "Score" ? "text-admin-primary" : "text-admin-foreground"}`}
              >
                {value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Answer review</h2>
          <p className="mt-1 text-sm text-admin-muted-foreground">
            Compare the student’s answers with the answer key saved for this
            submission.
          </p>
        </div>
        {submission.questions.length === 0 ? (
          <AdminEmptyState
            title="No question details available"
            description="This submission has no saved answers to display."
          />
        ) : (
          submission.questions.map((question, index) => {
            const status = question.isCorrect
              ? "Correct"
              : question.selectedIndex === null
                ? "Unanswered"
                : "Incorrect";
            const StatusIcon = question.isCorrect
              ? Check
              : question.selectedIndex === null
                ? Minus
                : X;
            return (
              <Card key={question.questionId}>
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-medium uppercase tracking-wider text-admin-muted-foreground">
                      Question {String(index + 1).padStart(2, "0")}
                    </span>
                    <Badge
                      variant={
                        question.isCorrect
                          ? "outline"
                          : question.selectedIndex === null
                            ? "secondary"
                            : "destructive"
                      }
                      className={
                        question.isCorrect
                          ? "gap-1 border-green-200 bg-green-50 text-green-800"
                          : "gap-1"
                      }
                    >
                      <StatusIcon className="size-3" />
                      {status}
                    </Badge>
                  </div>
                  <CardTitle className="whitespace-pre-wrap break-words text-base leading-relaxed">
                    {question.prompt}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {question.options.map((option, optionIndex) => {
                      const selected = question.selectedIndex === optionIndex;
                      const correct = question.correctIndex === optionIndex;
                      return (
                        <li
                          key={optionIndex}
                          className={`flex flex-wrap items-start gap-3 rounded-lg border p-3 text-sm ${correct ? "border-green-200 bg-green-50" : selected ? "border-red-200 bg-red-50" : "border-admin-border"}`}
                        >
                          <span
                            className={`flex size-6 shrink-0 items-center justify-center rounded-md text-xs font-semibold ${correct ? "bg-green-600 text-white" : "bg-admin-muted"}`}
                          >
                            {String.fromCharCode(65 + optionIndex)}
                          </span>
                          <span className="min-w-0 flex-1 whitespace-pre-wrap break-words leading-6">
                            {option}
                          </span>
                          <span className="flex flex-wrap gap-1">
                            {correct ? (
                              <Badge
                                variant="outline"
                                className="border-green-200 bg-green-50 text-green-800"
                              >
                                Correct answer
                              </Badge>
                            ) : null}
                            {selected ? (
                              <Badge variant="secondary">Student answer</Badge>
                            ) : null}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  {question.selectedIndex === null ? (
                    <p className="text-xs text-admin-muted-foreground">
                      The student did not select an answer.
                    </p>
                  ) : null}
                  {question.explanation ? (
                    <div className="rounded-lg bg-admin-muted p-4">
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-admin-muted-foreground">
                        Explanation
                      </h3>
                      <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed">
                        {question.explanation}
                      </p>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
