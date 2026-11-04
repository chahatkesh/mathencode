"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, Loader2 } from "lucide-react";
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

  useEffect(() => {
    let cancelled = false;

    async function load() {
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
  }, [submissionId]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-dark/70">
        <Loader2 className="mr-2 size-4 animate-spin" />
        Loading submission
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="container-custom py-16 text-center">
        <AlertCircle className="mx-auto size-8 text-red-500" />
        <h1 className="mt-3 font-montserrat text-2xl font-bold text-dark">
          {error || "Submission not found"}
        </h1>
        <Link
          href="/admin/tests/submissions"
          className="btn-primary mt-6 inline-flex"
        >
          Back to submissions
        </Link>
      </div>
    );
  }

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
    <div className="container-custom py-8">
      <Link
        href={`/admin/tests/submissions?course=${submission.courseId}`}
        className="text-sm font-semibold text-primary hover:underline"
      >
        Back to submissions
      </Link>
      <p className="mt-4 text-sm font-semibold text-primary">
        {submission.courseTitle}
      </p>
      <h1 className="font-montserrat text-3xl font-bold text-dark">
        {submission.studentName}
      </h1>
      <p className="mt-2 text-dark/70">{submission.testTitle}</p>

      <dl className="mt-6 grid gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-wide text-dark/50">
            Contact
          </dt>
          <dd className="mt-1 font-medium text-dark">
            {submission.contactNumber}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-dark/50">
            Country
          </dt>
          <dd className="mt-1 font-medium text-dark">{submission.country}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-dark/50">
            Submitted
          </dt>
          <dd className="mt-1 font-medium text-dark">
            {formatWhen(submission.createdAt)}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-dark/50">
            Score
          </dt>
          <dd className="mt-1 font-medium text-dark">
            {submission.percentage}%
          </dd>
        </div>
      </dl>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stats.map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl border border-gray-100 bg-white px-4 py-3"
          >
            <p className="text-xs uppercase tracking-wide text-dark/50">
              {label}
            </p>
            <p className="mt-1 font-montserrat text-xl font-bold text-dark">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        {submission.questions.map((question, index) => {
          const status = question.isCorrect
            ? "Correct"
            : question.selectedIndex === null
              ? "Unanswered"
              : "Incorrect";
          return (
            <article
              key={question.questionId}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h2 className="font-semibold text-dark">
                  {index + 1}. {question.prompt}
                </h2>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    question.isCorrect
                      ? "bg-primary/10 text-primary"
                      : question.selectedIndex === null
                        ? "bg-neutral text-dark/60"
                        : "bg-secondary/10 text-secondary"
                  }`}
                >
                  {status}
                </span>
              </div>
              <ul className="mt-4 space-y-2">
                {question.options.map((option, optionIndex) => {
                  const selected = question.selectedIndex === optionIndex;
                  const correct = question.correctIndex === optionIndex;
                  return (
                    <li
                      key={optionIndex}
                      className={`rounded-lg border px-3 py-2 text-sm ${
                        correct
                          ? "border-primary bg-primary/5"
                          : selected
                            ? "border-secondary bg-secondary/5"
                            : "border-gray-100"
                      }`}
                    >
                      <span className="mr-2 font-semibold">
                        {String.fromCharCode(65 + optionIndex)}.
                      </span>
                      {option}
                      {correct ? (
                        <span className="ml-2 text-xs font-semibold text-primary">
                          Correct answer
                        </span>
                      ) : null}
                      {selected ? (
                        <span className="ml-2 text-xs font-semibold text-secondary">
                          Student answer
                        </span>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
              {question.explanation ? (
                <p className="mt-3 text-sm text-dark/70">
                  {question.explanation}
                </p>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
