"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Maximize } from "lucide-react";
import DottedGrid from "~/components/layout/dotted-grid";
import { COUNTRY_CODES, findCountryByName } from "~/data/countries";
import { formatClock, formatDuration } from "~/lib/duration";
import { studentContactError } from "~/lib/validations";
import type { DiagnosticResult, DiagnosticTestPublic } from "~/types";

export type DiagnosticContext = {
  storageKey: string;
  title: string;
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

function prefersImmersiveShell() {
  return window.matchMedia("(max-width: 767px)").matches;
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
        !prefersImmersiveShell() &&
        document.fullscreenEnabled &&
        document.fullscreenElement !== shell;
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
    if (!prefersImmersiveShell()) {
      const entered = await requestShellFullscreen();
      if (!entered) {
        setError(
          "Full screen is required. Allow full screen in your browser, then try again.",
        );
        return;
      }
    }
    enteredAt.current = Date.now();
    setPaused(false);
    setPhase("details");
  }

  async function resumeFullscreen() {
    if (document.hidden) return;
    if (!prefersImmersiveShell()) {
      const entered = await requestShellFullscreen();
      if (!entered) return;
    }
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
    ? "fixed inset-0 z-[80] flex flex-col overflow-auto bg-white"
    : "min-h-screen bg-white pt-[var(--site-header)]";

  return (
    <div ref={shellRef} className={shellClass}>
      {inSession ? (
        <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-black/[0.06] bg-white/95 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur">
          <div className="flex min-w-0 items-center gap-2">
            <Image
              src="/logo_color.svg"
              alt=""
              width={28}
              height={28}
              unoptimized
              className="h-7 w-auto shrink-0"
            />
            <span className="truncate text-lg font-bold text-primary">
              Math<span className="text-secondary">Encode</span>
            </span>
          </div>
          {(phase === "question" || phase === "review") &&
          remainingSeconds !== null ? (
            <div
              className={`shrink-0 rounded-full bg-neutral px-3 py-1.5 text-sm font-bold tabular-nums ${
                remainingSeconds <= 60 ? "text-secondary" : "text-dark"
              }`}
              role="timer"
              aria-live="polite"
            >
              {formatClock(remainingSeconds)}
            </div>
          ) : null}
        </header>
      ) : null}
      <div
        className={
          inSession
            ? "mx-auto w-full max-w-2xl flex-1 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 sm:px-6 sm:pb-10 sm:pt-10"
            : "container-custom py-8 md:py-16"
        }
      >
        {paused && inSession ? (
          <div className="mx-auto w-full max-w-lg rounded-2xl border border-black/[0.06] bg-white p-6 text-center sm:p-8">
            <Maximize className="mx-auto size-8 text-secondary" />
            <h1 className="mt-4 text-2xl font-bold text-dark">
              Stay on this test
            </h1>
            <p className="mt-3 text-dark/70">
              <span className="md:hidden">
                The test is paused because you left this tab. Come back to
                continue.
              </span>
              <span className="hidden md:inline">
                The test is paused because you left full screen or switched
                tabs. Come back to this screen to continue.
              </span>
            </p>
            <button
              type="button"
              onClick={() => void resumeFullscreen()}
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-secondary px-5 py-2.5 text-sm font-semibold text-white hover:bg-secondary/90 sm:w-auto"
            >
              <span className="md:hidden">Continue test</span>
              <span className="hidden md:inline">Return to full screen</span>
            </button>
          </div>
        ) : null}

        {!paused && phase === "intro" ? (
          <div className="mx-auto mt-2 max-w-3xl overflow-hidden rounded-3xl bg-secondary text-white sm:mt-6">
            <div className="relative">
              <DottedGrid />
              <div className="relative px-5 py-8 sm:px-10 sm:py-12">
                <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
                  {test.title}
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/85">
                  {test.instructions.trim() ||
                    "A short check before the course begins."}
                </p>
              </div>
            </div>
            <div className="bg-white px-5 py-6 text-dark sm:px-10">
              <p className="text-sm text-dark/65">
                <span className="md:hidden">
                  Stay on this tab until you submit.
                </span>
                <span className="hidden md:inline">
                  Opens in full screen. Stay on this tab until you submit.
                </span>
              </p>
              <p className="mt-2 text-sm font-medium text-dark/80">
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
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-secondary px-5 py-2.5 text-sm font-semibold text-white hover:bg-secondary/90 disabled:opacity-60 sm:w-auto"
              >
                <Maximize className="mr-2 hidden size-4 md:inline" />
                <span className="md:hidden">Start test</span>
                <span className="hidden md:inline">Open in full screen</span>
              </button>
            </div>
          </div>
        ) : null}

        {!paused && phase === "details" ? (
          <form
            onSubmit={startTest}
            className="mx-auto w-full max-w-lg rounded-2xl border border-black/[0.06] bg-white p-5 sm:p-8"
            noValidate
          >
            <p className="text-sm font-semibold text-secondary">
              {context.title}
            </p>
            <h1 className="mt-2 text-3xl font-bold text-dark">
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
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-3 text-base outline-none focus:border-secondary"
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
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-3 text-base outline-none focus:border-secondary"
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
                    className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-3 text-base outline-none focus:border-secondary"
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
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-secondary px-5 py-2.5 text-sm font-semibold text-white hover:bg-secondary/90 disabled:opacity-60 sm:w-auto"
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
            <div className="mb-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm text-dark/60">
              <span>
                Question {index + 1} of {test.questions.length}
              </span>
              <span>
                {answeredCount} of {test.questions.length} answered
              </span>
            </div>
            <div className="mb-6 h-2 overflow-hidden rounded-full bg-white">
              <div
                className="h-full bg-secondary"
                style={{
                  width: `${((index + 1) / test.questions.length) * 100}%`,
                }}
              />
            </div>
            <div className="rounded-2xl border border-black/[0.06] bg-white p-4 sm:p-6 md:p-8">
              <h1 className="text-balance text-xl font-bold text-dark sm:text-2xl">
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
                      className={`flex min-h-12 w-full items-start rounded-xl border px-4 py-3 text-left text-base transition ${
                        selected
                          ? "border-secondary bg-secondary/10"
                          : "border-gray-200 hover:border-secondary/40"
                      }`}
                    >
                      <span className="mr-3 mt-0.5 font-semibold text-secondary">
                        {String.fromCharCode(65 + optionIndex)}
                      </span>
                      <span className="text-dark">{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIndex((current) => Math.max(0, current - 1))}
                disabled={index === 0}
                className="min-h-12 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-dark disabled:opacity-40"
              >
                Previous
              </button>
              {index === test.questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setPhase("review")}
                  className="min-h-12 rounded-xl bg-secondary px-5 py-2.5 text-sm font-semibold text-white hover:bg-secondary/90"
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
                  className="min-h-12 rounded-xl bg-secondary px-5 py-2.5 text-sm font-semibold text-white hover:bg-secondary/90"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        ) : null}

        {!paused && phase === "review" ? (
          <div className="mx-auto w-full max-w-2xl">
            <h1 className="text-balance text-3xl font-bold text-dark">
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
                    <span className="mt-1 block break-words font-medium text-dark">
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
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={() => setPhase("question")}
                className="min-h-12 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-dark"
              >
                Back to questions
              </button>
              <button
                type="button"
                onClick={() => void submitTest()}
                disabled={submitting}
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-secondary px-5 py-2.5 text-sm font-semibold text-white hover:bg-secondary/90 disabled:opacity-60"
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
            <div className="rounded-2xl border border-black/[0.06] bg-white p-5 sm:p-8">
              <p className="text-sm font-semibold text-secondary">
                {result.courseTitle}
              </p>
              <h1 className="mt-2 text-3xl font-bold text-dark">
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
              <p className="mt-8 text-4xl font-semibold text-secondary sm:text-5xl">
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
                    <dd className="mt-1 text-2xl font-bold text-dark">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8">
                <Link
                  href="/#courses"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-secondary px-5 py-2.5 text-sm font-semibold text-white hover:bg-secondary/90"
                >
                  All programs
                </Link>
              </div>
            </div>

            <form
              onSubmit={sendQuery}
              className="rounded-2xl border border-black/[0.06] bg-white p-5 sm:p-8"
              noValidate
            >
              <h2 className="text-2xl font-bold text-dark">Have a question?</h2>
              <p className="mt-2 text-dark/70">
                Send it here and we will reply using the details from your test.
              </p>
              {querySent ? (
                <p
                  role="status"
                  className="mt-4 text-sm font-medium text-secondary"
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
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-3 text-base outline-none focus:border-secondary"
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
                      className="mt-1 min-h-28 w-full rounded-lg border border-gray-200 px-3 py-3 text-base outline-none focus:border-secondary"
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
                    className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-secondary px-5 py-2.5 text-sm font-semibold text-white hover:bg-secondary/90 disabled:opacity-60 sm:w-auto"
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
