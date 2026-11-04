"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Maximize } from "lucide-react";
import { COUNTRY_CODES, findCountryByName } from "~/data/countries";
import { formatClock, formatDuration } from "~/lib/duration";
import { studentContactError } from "~/lib/validations";
import type { DiagnosticResult, DiagnosticTestPublic } from "~/types";

export type DiagnosticContext = {
  storageKey: string;
  title: string;
  backHref: string;
  backLabel: string;
  gradient: string;
  attemptPath: string;
  submitPath: string;
};

type Phase = "intro" | "details" | "question" | "review" | "result";

function storageKey(key: string) {
  return `mathencode-diagnostic-${key}`;
}

function readSaved(key: string) {
  try {
    const raw = sessionStorage.getItem(storageKey(key));
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed;
  } catch {
    return {};
  }
}

function isSessionPhase(phase: Phase) {
  return phase === "details" || phase === "question" || phase === "review";
}

export default function DiagnosticTest({
  context,
  test: initialTest,
}: {
  context: DiagnosticContext;
  test: DiagnosticTestPublic;
}) {
  const shellRef = useRef<HTMLDivElement>(null);
  const enteredAt = useRef(0);
  const [phase, setPhase] = useState<Phase>("intro");
  const [paused, setPaused] = useState(false);
  const [test, setTest] = useState(initialTest);
  const [attemptToken, setAttemptToken] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const autoSubmitted = useRef(false);
  const submitRef = useRef<() => Promise<void>>(async () => undefined);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [studentName, setStudentName] = useState("");
  const [countryName, setCountryName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [countryQuery, setCountryQuery] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);
  const [queryEmail, setQueryEmail] = useState("");
  const [queryMessage, setQueryMessage] = useState("");
  const [queryError, setQueryError] = useState("");
  const [querySending, setQuerySending] = useState(false);
  const [querySent, setQuerySent] = useState(false);

  const question = test.questions[index];
  const answeredCount = test.questions.filter(
    (item) => typeof answers[item.id] === "number",
  ).length;
  const inSession = isSessionPhase(phase);

  const countryMatches = useMemo(() => {
    const needle = countryQuery.trim().toLowerCase();
    const pool = needle
      ? COUNTRY_CODES.filter(
          (country) =>
            country.name.toLowerCase().includes(needle) ||
            country.code.includes(needle),
        )
      : COUNTRY_CODES;
    return pool.slice(0, 8);
  }, [countryQuery]);

  useEffect(() => {
    if (!inSession) return;

    function pauseIfLeft() {
      if (Date.now() - enteredAt.current < 800) return;
      const shell = shellRef.current;
      const leftFullscreen =
        document.fullscreenEnabled && document.fullscreenElement !== shell;
      if (document.hidden || leftFullscreen) setPaused(true);
    }

    document.addEventListener("visibilitychange", pauseIfLeft);
    document.addEventListener("fullscreenchange", pauseIfLeft);
    return () => {
      document.removeEventListener("visibilitychange", pauseIfLeft);
      document.removeEventListener("fullscreenchange", pauseIfLeft);
    };
  }, [inSession]);

  useEffect(() => {
    if (!startedAt || !test.timeLimitMinutes) return;
    if (phase !== "question" && phase !== "review") return;
    const end =
      new Date(startedAt).getTime() + test.timeLimitMinutes * 60 * 1000;
    function tick(fromInterval: boolean) {
      const seconds = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      setRemainingSeconds(seconds);
      if (fromInterval && seconds === 0 && !autoSubmitted.current) {
        autoSubmitted.current = true;
        void submitRef.current();
      }
    }
    tick(false);
    const timer = window.setInterval(() => tick(true), 250);
    return () => window.clearInterval(timer);
  }, [phase, startedAt, test.timeLimitMinutes]);

  useEffect(() => {
    if (phase === "intro" || phase === "result") return;
    sessionStorage.setItem(
      storageKey(context.storageKey),
      JSON.stringify(answers),
    );
  }, [answers, context.storageKey, phase]);

  async function requestShellFullscreen() {
    const shell = shellRef.current;
    if (!shell || !document.fullscreenEnabled || !shell.requestFullscreen) {
      return true;
    }
    if (document.fullscreenElement === shell) return true;
    try {
      await shell.requestFullscreen();
      return true;
    } catch (fullscreenError) {
      console.error("Full screen request failed:", fullscreenError);
      return false;
    }
  }

  async function openFullscreen() {
    setError("");
    const entered = await requestShellFullscreen();
    if (!entered) {
      setError(
        "Full screen is required. Allow full screen in your browser, then try again.",
      );
      return;
    }
    enteredAt.current = Date.now();
    setPaused(false);
    setPhase("details");
  }

  async function resumeFullscreen() {
    if (document.hidden) return;
    const entered = await requestShellFullscreen();
    if (!entered) return;
    enteredAt.current = Date.now();
    setPaused(false);
  }

  async function begin() {
    setStarting(true);
    setError("");
    try {
      const response = await fetch(context.attemptPath, { method: "POST" });
      const body = (await response.json()) as {
        success?: boolean;
        message?: string;
        data?: {
          attemptToken: string;
          startedAt: string;
          test: DiagnosticTestPublic;
        };
      };
      if (!response.ok || !body.success || !body.data) {
        setFormError(body.message || "This diagnostic test is not available.");
        return;
      }
      const nextTest = body.data.test;
      const saved = readSaved(context.storageKey);
      const nextAnswers: Record<string, number | null> = {};
      for (const item of nextTest.questions) {
        const previous = saved[item.id];
        nextAnswers[item.id] =
          typeof previous === "number" && previous >= 0 && previous <= 3
            ? previous
            : null;
      }
      setTest(nextTest);
      setAnswers(nextAnswers);
      setAttemptToken(body.data.attemptToken);
      setStartedAt(body.data.startedAt);
      autoSubmitted.current = false;
      setIndex(0);
      if (nextTest.questions.length === 0) {
        setFormError("This diagnostic test is not available.");
        return;
      }
      setPhase("question");
    } catch (beginError) {
      console.error("Error starting diagnostic test:", beginError);
      setFormError("Something went wrong. Try again.");
    } finally {
      setStarting(false);
    }
  }

  function startTest(event: React.FormEvent) {
    event.preventDefault();
    const contactError = studentContactError({
      studentName,
      country: countryName,
      countryCode,
      contactNumber,
    });
    if (contactError) {
      setFormError(contactError);
      return;
    }
    setFormError("");
    void begin();
  }

  function selectAnswer(optionIndex: number) {
    if (!question || paused) return;
    setAnswers((current) => ({ ...current, [question.id]: optionIndex }));
  }

  async function leaveFullscreen() {
    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => undefined);
    }
  }

  async function submitTest() {
    if (!attemptToken || submitting || paused) return;
    setSubmitting(true);
    setFormError("");
    try {
      const response = await fetch(context.submitPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attemptToken,
          studentName,
          country: countryName,
          countryCode,
          contactNumber,
          answers: test.questions.map((item) => ({
            questionId: item.id,
            selectedIndex: answers[item.id] ?? null,
          })),
        }),
      });
      const body = (await response.json()) as {
        success?: boolean;
        message?: string;
        data?: DiagnosticResult;
      };
      if (!response.ok || !body.success || !body.data) {
        setFormError(body.message || "Could not submit the test.");
        return;
      }
      sessionStorage.removeItem(storageKey(context.storageKey));
      setResult(body.data);
      setPaused(false);
      setPhase("result");
      await leaveFullscreen();
    } catch (submitError) {
      console.error("Error submitting diagnostic test:", submitError);
      setFormError("Could not submit the test. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    submitRef.current = submitTest;
  });

  async function sendQuery(event: React.FormEvent) {
    event.preventDefault();
    if (querySending || !result) return;
    if (!queryEmail.trim() || !queryMessage.trim()) {
      setQueryError("Add your email and your question.");
      return;
    }
    setQuerySending(true);
    setQueryError("");
    try {
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: studentName,
          email: queryEmail.trim(),
          contactNumber: `${countryCode} ${contactNumber.replace(/\D/g, "")}`,
          countryCode,
          message: `Diagnostic query for ${result.courseTitle} (${result.testTitle}). Score: ${result.percentage}%.\n\n${queryMessage.trim()}`,
        }),
      });
      const body = (await response.json()) as {
        success?: boolean;
        message?: string;
      };
      if (!response.ok || !body.success) {
        setQueryError(body.message || "Could not send your question.");
        return;
      }
      setQuerySent(true);
      setQueryMessage("");
    } catch (queryFailure) {
      console.error("Error sending diagnostic query:", queryFailure);
      setQueryError("Could not send your question. Try again.");
    } finally {
      setQuerySending(false);
    }
  }

  const shellClass = inSession
    ? "fixed inset-0 z-[80] overflow-auto bg-gradient-to-br from-neutral to-white"
    : "mt-16 min-h-screen bg-gradient-to-br from-neutral to-white";

  return (
    <div ref={shellRef} className={shellClass}>
      {inSession ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-center gap-2 pt-5">
          <img src="/logo_color.svg" alt="" className="h-8 w-auto" />
          <span className="font-montserrat text-2xl font-bold text-primary">
            Math<span className="text-secondary">Encode</span>
          </span>
        </div>
      ) : null}
      {inSession &&
      (phase === "question" || phase === "review") &&
      remainingSeconds !== null ? (
        <div
          className={`absolute right-4 top-5 z-10 rounded-full bg-white px-4 py-2 font-montserrat text-sm font-bold shadow-sm ${
            remainingSeconds <= 60 ? "text-secondary" : "text-dark"
          }`}
          role="timer"
          aria-live="polite"
        >
          {formatClock(remainingSeconds)}
        </div>
      ) : null}
      <div
        className={
          inSession && phase !== "review"
            ? "flex min-h-dvh items-center justify-center px-4 py-24"
            : inSession
              ? "container-custom px-4 pb-16 pt-24"
              : "container-custom py-10 md:py-16"
        }
      >
        {phase === "intro" || phase === "result" ? (
          <a
            href={context.backHref}
            className="inline-flex items-center text-sm font-semibold text-primary"
          >
            <ArrowLeft className="mr-2 size-4" />
            {context.backLabel}
          </a>
        ) : null}

        {paused && inSession ? (
          <div className="mx-auto w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-lg">
            <Maximize className="mx-auto size-8 text-primary" />
            <h1 className="mt-4 font-montserrat text-2xl font-bold text-dark">
              Stay on this test
            </h1>
            <p className="mt-3 text-dark/70">
              The test is paused because you left full screen or switched tabs.
              Come back to this screen to continue.
            </p>
            <button
              type="button"
              onClick={() => void resumeFullscreen()}
              className="btn-primary mt-6"
            >
              Return to full screen
            </button>
          </div>
        ) : null}

        {!paused && phase === "intro" ? (
          <div className="mx-auto mt-8 max-w-2xl rounded-2xl bg-white p-8 shadow-lg">
            <p className="text-sm font-semibold text-primary">
              {context.title}
            </p>
            <h1 className="mt-2 font-montserrat text-3xl font-bold text-dark">
              {test.title}
            </h1>
            <p className="mt-4 leading-relaxed text-dark/80">
              {test.instructions.trim() ||
                "This short diagnostic shows where you are before the course begins."}
            </p>
            <p className="mt-4 text-sm text-dark/70">
              The test opens in full screen. Stay on this tab until you submit.
              You will add your name and phone number before the first question.
            </p>
            <p className="mt-4 text-sm text-dark/60">
              {test.questions.length}{" "}
              {test.questions.length === 1 ? "question" : "questions"}
              {test.timeLimitMinutes
                ? ` · ${test.timeLimitMinutes} minute${test.timeLimitMinutes === 1 ? "" : "s"}`
                : ""}
            </p>
            {error ? (
              <p role="alert" className="mt-4 text-sm text-red-700">
                {error}
              </p>
            ) : null}
            <button
              type="button"
              onClick={() => void openFullscreen()}
              disabled={test.questions.length === 0}
              className="btn-primary mt-6 inline-flex items-center disabled:opacity-60"
            >
              <Maximize className="mr-2 size-4" />
              Open in full screen
            </button>
          </div>
        ) : null}

        {!paused && phase === "details" ? (
          <form
            onSubmit={startTest}
            className="mx-auto w-full max-w-lg rounded-2xl bg-white p-8 shadow-lg"
            noValidate
          >
            <p className="text-sm font-semibold text-primary">
              {context.title}
            </p>
            <h1 className="mt-2 font-montserrat text-3xl font-bold text-dark">
              Before you start
            </h1>
            <p className="mt-3 text-dark/70">
              Add your name and phone number. Our team uses these to reach you
              after the test.
            </p>
            <div className="mt-6 space-y-4">
              <label
                className="block text-sm font-medium text-dark"
                htmlFor="student-name"
              >
                Full name
                <input
                  id="student-name"
                  value={studentName}
                  onChange={(event) => setStudentName(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-primary"
                  autoComplete="name"
                  required
                />
              </label>
              <div className="relative">
                <label
                  className="block text-sm font-medium text-dark"
                  htmlFor="student-country"
                >
                  Country
                  <input
                    id="student-country"
                    value={countryOpen ? countryQuery : countryName}
                    onChange={(event) => {
                      setCountryQuery(event.target.value);
                      setCountryName("");
                      setCountryCode("");
                      setCountryOpen(true);
                    }}
                    onFocus={() => {
                      setCountryQuery(countryName);
                      setCountryOpen(true);
                    }}
                    onBlur={() => {
                      window.setTimeout(() => setCountryOpen(false), 150);
                    }}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-primary"
                    autoComplete="country-name"
                    placeholder="Start typing a country"
                    required
                  />
                </label>
                {countryOpen ? (
                  <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                    {countryMatches.length === 0 ? (
                      <li className="px-3 py-2 text-sm text-dark/50">
                        No matching country
                      </li>
                    ) : (
                      countryMatches.map((country) => (
                        <li key={`${country.country}-${country.name}`}>
                          <button
                            type="button"
                            className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-neutral"
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => {
                              setCountryName(country.name);
                              setCountryCode(country.code);
                              setCountryQuery(country.name);
                              setCountryOpen(false);
                            }}
                          >
                            <span>
                              {country.flag} {country.name}
                            </span>
                            <span className="text-dark/50">{country.code}</span>
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                ) : null}
              </div>
              <label
                className="block text-sm font-medium text-dark"
                htmlFor="student-phone"
              >
                Mobile number
                <div className="mt-1 flex gap-2">
                  <span className="flex items-center rounded-lg border border-gray-200 bg-neutral px-3 text-sm text-dark">
                    {countryCode || "+"}
                  </span>
                  <input
                    id="student-phone"
                    value={contactNumber}
                    onChange={(event) => setContactNumber(event.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-primary"
                    inputMode="tel"
                    autoComplete="tel-national"
                    placeholder="Phone number"
                    required
                  />
                </div>
              </label>
            </div>
            {formError ? (
              <p role="alert" className="mt-4 text-sm text-red-700">
                {formError}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={
                starting ||
                !studentName.trim() ||
                !findCountryByName(countryName) ||
                !contactNumber.trim()
              }
              className="btn-primary mt-6 inline-flex items-center disabled:opacity-60"
            >
              {starting ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : null}
              {starting ? "Starting" : "Start test"}
            </button>
          </form>
        ) : null}

        {!paused && phase === "question" && question ? (
          <div className="mx-auto w-full max-w-2xl">
            <div className="mb-4 flex items-center justify-between text-sm text-dark/60">
              <span>
                Question {index + 1} of {test.questions.length}
              </span>
              <span>
                {answeredCount} of {test.questions.length} answered
              </span>
            </div>
            <div className="mb-6 h-2 overflow-hidden rounded-full bg-white">
              <div
                className={`h-full bg-gradient-to-r ${context.gradient}`}
                style={{
                  width: `${((index + 1) / test.questions.length) * 100}%`,
                }}
              />
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-lg md:p-8">
              <h1 className="font-montserrat text-2xl font-bold text-dark">
                {question.prompt}
              </h1>
              <div
                className="mt-6 space-y-3"
                role="radiogroup"
                aria-label="Answer options"
              >
                {question.options.map((option, optionIndex) => {
                  const selected = answers[question.id] === optionIndex;
                  return (
                    <button
                      key={optionIndex}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => selectAnswer(optionIndex)}
                      className={`flex w-full items-start rounded-xl border px-4 py-3 text-left transition ${
                        selected
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-primary/40"
                      }`}
                    >
                      <span className="mr-3 mt-0.5 font-semibold text-primary">
                        {String.fromCharCode(65 + optionIndex)}
                      </span>
                      <span className="text-dark">{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIndex((current) => Math.max(0, current - 1))}
                disabled={index === 0}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-dark disabled:opacity-40"
              >
                Previous
              </button>
              {index === test.questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setPhase("review")}
                  className="btn-primary"
                >
                  Review answers
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    setIndex((current) =>
                      Math.min(test.questions.length - 1, current + 1),
                    )
                  }
                  className="btn-primary"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        ) : null}

        {!paused && phase === "review" ? (
          <div className="mx-auto w-full max-w-2xl">
            <h1 className="font-montserrat text-3xl font-bold text-dark">
              Submit your test
            </h1>
            <p className="mt-2 text-dark/70">
              {answeredCount} of {test.questions.length} answered. You can open
              a question to change the answer, then submit.
            </p>
            <div className="mt-6 space-y-3">
              {test.questions.map((item, itemIndex) => {
                const selected = answers[item.id];
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setIndex(itemIndex);
                      setPhase("question");
                    }}
                    className="block w-full rounded-xl border border-gray-100 bg-white p-4 text-left shadow-sm"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide text-dark/50">
                      Question {itemIndex + 1}
                    </span>
                    <span className="mt-1 block font-medium text-dark">
                      {item.prompt}
                    </span>
                    <span
                      className={`mt-2 block text-sm ${
                        typeof selected === "number"
                          ? "text-dark/70"
                          : "font-semibold text-secondary"
                      }`}
                    >
                      {typeof selected === "number"
                        ? `${String.fromCharCode(65 + selected)}. ${item.options[selected]}`
                        : "Not answered"}
                    </span>
                  </button>
                );
              })}
            </div>
            {formError ? (
              <p role="alert" className="mt-4 text-sm text-red-700">
                {formError}
              </p>
            ) : null}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setPhase("question")}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-dark"
              >
                Back to questions
              </button>
              <button
                type="button"
                onClick={() => void submitTest()}
                disabled={submitting}
                className="btn-primary inline-flex items-center disabled:opacity-60"
              >
                {submitting ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : null}
                {submitting ? "Submitting" : "Submit test"}
              </button>
            </div>
          </div>
        ) : null}

        {phase === "result" && result ? (
          <div className="mx-auto w-full max-w-2xl space-y-6">
            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <p className="text-sm font-semibold text-primary">
                {result.courseTitle}
              </p>
              <h1 className="mt-2 font-montserrat text-3xl font-bold text-dark">
                {result.testTitle}
              </h1>
              <p className="mt-3 text-dark/70">
                Our team will contact you immediately about this result.
                {result.durationSeconds > 0
                  ? ` You finished in ${formatDuration(result.durationSeconds)}${
                      result.timeLimitMinutes
                        ? ` of ${result.timeLimitMinutes} minutes`
                        : ""
                    }.`
                  : ""}
              </p>
              <p className="mt-8 font-montserrat text-5xl font-bold text-primary">
                {result.percentage}%
              </p>
              <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-dark/50">
                Score
              </p>
              <dl className="mt-8 grid grid-cols-2 gap-4">
                {[
                  ["Total questions", result.totalQuestions],
                  ["Correct answers", result.correct],
                  ["Incorrect answers", result.incorrect],
                  ["Unanswered", result.unanswered],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-neutral px-4 py-3">
                    <dt className="text-xs uppercase tracking-wide text-dark/50">
                      {label}
                    </dt>
                    <dd className="mt-1 font-montserrat text-2xl font-bold text-dark">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={context.backHref} className="btn-primary">
                  {context.backLabel}
                </a>
                <Link
                  href="/#courses"
                  className="rounded-lg border border-gray-200 px-6 py-2 font-semibold text-dark"
                >
                  All programs
                </Link>
              </div>
            </div>

            <form
              onSubmit={sendQuery}
              className="rounded-2xl bg-white p-8 shadow-lg"
              noValidate
            >
              <h2 className="font-montserrat text-2xl font-bold text-dark">
                Have a question?
              </h2>
              <p className="mt-2 text-dark/70">
                Send it here and we will reply using the details from your test.
              </p>
              {querySent ? (
                <p
                  role="status"
                  className="mt-4 text-sm font-medium text-primary"
                >
                  Your question was sent. We will contact you shortly.
                </p>
              ) : (
                <div className="mt-5 space-y-4">
                  <label
                    className="block text-sm font-medium text-dark"
                    htmlFor="query-email"
                  >
                    Email
                    <input
                      id="query-email"
                      type="email"
                      value={queryEmail}
                      onChange={(event) => setQueryEmail(event.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-primary"
                      autoComplete="email"
                      required
                    />
                  </label>
                  <label
                    className="block text-sm font-medium text-dark"
                    htmlFor="query-message"
                  >
                    Your question
                    <textarea
                      id="query-message"
                      value={queryMessage}
                      onChange={(event) => setQueryMessage(event.target.value)}
                      className="mt-1 min-h-28 w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-primary"
                      required
                    />
                  </label>
                  {queryError ? (
                    <p role="alert" className="text-sm text-red-700">
                      {queryError}
                    </p>
                  ) : null}
                  <button
                    type="submit"
                    disabled={querySending}
                    className="btn-primary inline-flex items-center disabled:opacity-60"
                  >
                    {querySending ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : null}
                    {querySending ? "Sending" : "Send question"}
                  </button>
                </div>
              )}
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
}
