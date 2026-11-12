"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock3,
  Flag,
  ListChecks,
  Loader2,
  Maximize,
} from "lucide-react";
import "~/styles/public-learning.css";
import { COUNTRY_CODES, findCountryByName } from "~/data/countries";
import { formatClock, formatDuration } from "~/lib/duration";
import { studentContactError } from "~/lib/validations";
import { normalizePhoneInput } from "~/lib/phone-input";
import type {
  DiagnosticQuestionPublic,
  DiagnosticResult,
  DiagnosticTestPublic,
} from "~/types";

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

function readFlags(key: string) {
  try {
    const raw = sessionStorage.getItem(`${storageKey(key)}-flags`);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed || typeof parsed !== "object") return {};
    const flags: Record<string, boolean> = {};
    for (const [id, value] of Object.entries(parsed)) {
      if (value === true) flags[id] = true;
    }
    return flags;
  } catch {
    return {};
  }
}

function questionTileLabel(
  number: number,
  status: { answered: boolean; flagged: boolean },
) {
  return [
    `Question ${number}`,
    status.flagged ? "flagged" : "",
    status.answered ? "answered" : "not answered",
  ]
    .filter(Boolean)
    .join(", ");
}

function QuestionMap({
  questions,
  answers,
  flagged,
  currentIndex,
  onJump,
}: {
  questions: DiagnosticQuestionPublic[];
  answers: Record<string, number | null>;
  flagged: Record<string, boolean>;
  currentIndex: number | null;
  onJump: (index: number) => void;
}) {
  return (
    <nav
      id="diagnostic-questions"
      className="diagnostic-qnav"
      aria-label="Questions"
    >
      <div>
        <h2 className="diagnostic-qnav-title">Questions</h2>
        <p className="diagnostic-qnav-note">
          Tap a number to open that question.
        </p>
      </div>
      <div className="diagnostic-qnav-grid">
        {questions.map((item, itemIndex) => {
          const answered = typeof answers[item.id] === "number";
          const isFlagged = Boolean(flagged[item.id]);
          const current = currentIndex === itemIndex;
          return (
            <button
              key={item.id}
              type="button"
              className={[
                "diagnostic-qnav-item",
                answered ? "diagnostic-qnav-item--answered" : "",
                isFlagged ? "diagnostic-qnav-item--flagged" : "",
                current ? "diagnostic-qnav-item--current" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-current={current ? "true" : undefined}
              aria-label={questionTileLabel(itemIndex + 1, {
                answered,
                flagged: isFlagged,
              })}
              onClick={() => onJump(itemIndex)}
            >
              {itemIndex + 1}
            </button>
          );
        })}
      </div>
      <ul className="diagnostic-qnav-legend" aria-label="Question status">
        {currentIndex !== null ? (
          <li>
            <span
              className="diagnostic-qnav-swatch diagnostic-qnav-swatch--current"
              aria-hidden="true"
            />
            Current
          </li>
        ) : null}
        <li>
          <span
            className="diagnostic-qnav-swatch diagnostic-qnav-swatch--answered"
            aria-hidden="true"
          />
          Answered
        </li>
        <li>
          <span
            className="diagnostic-qnav-swatch diagnostic-qnav-swatch--flagged"
            aria-hidden="true"
          />
          Flagged
        </li>
        <li>
          <span className="diagnostic-qnav-swatch" aria-hidden="true" />
          Not yet
        </li>
      </ul>
    </nav>
  );
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
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
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
    if (phase !== "question" && phase !== "review") return;
    sessionStorage.setItem(
      storageKey(context.storageKey),
      JSON.stringify(answers),
    );
    sessionStorage.setItem(
      `${storageKey(context.storageKey)}-flags`,
      JSON.stringify(flagged),
    );
  }, [answers, flagged, context.storageKey, phase]);

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
      const savedFlags = readFlags(context.storageKey);
      const nextAnswers: Record<string, number | null> = {};
      const nextFlags: Record<string, boolean> = {};
      for (const item of nextTest.questions) {
        const previous = saved[item.id];
        nextAnswers[item.id] =
          typeof previous === "number" && previous >= 0 && previous <= 3
            ? previous
            : null;
        if (savedFlags[item.id]) nextFlags[item.id] = true;
      }
      setTest(nextTest);
      setAnswers(nextAnswers);
      setFlagged(nextFlags);
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

  function toggleFlag() {
    if (!question || paused) return;
    const id = question.id;
    setFlagged((current) => {
      const next = { ...current };
      if (next[id]) delete next[id];
      else next[id] = true;
      return next;
    });
  }

  function openQuestion(nextIndex: number) {
    setIndex(nextIndex);
    setPhase("question");
    shellRef.current?.scrollTo({ top: 0 });
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
      sessionStorage.removeItem(`${storageKey(context.storageKey)}-flags`);
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
    ? "diagnostic-shell diagnostic-shell--active"
    : "diagnostic-shell";
  const wideSession = phase === "question" || phase === "review";
  const questionFlagged = Boolean(question && flagged[question.id]);

  return (
    <div ref={shellRef} className={shellClass}>
      {inSession ? (
        <header className="diagnostic-session-header">
          <div className="diagnostic-brand">
            <Image
              src="/logo_color.svg"
              alt=""
              width={28}
              height={28}
              unoptimized
              className="h-7 w-auto shrink-0"
            />
            <span>
              Math<span className="diagnostic-brand-accent">Encode</span>
            </span>
          </div>
          {(phase === "question" || phase === "review") &&
          remainingSeconds !== null ? (
            <div
              className={`diagnostic-timer ${remainingSeconds <= 60 ? "diagnostic-timer--urgent" : ""}`}
              role="timer"
              aria-label="Time remaining"
              aria-live="polite"
            >
              <Clock3 size={17} aria-hidden="true" />
              {formatClock(remainingSeconds)}
            </div>
          ) : null}
        </header>
      ) : null}
      <div
        className={
          inSession
            ? wideSession
              ? "diagnostic-session-content diagnostic-session-content--wide"
              : "diagnostic-session-content"
            : "site-container public-section"
        }
      >
        {paused && inSession ? (
          <section
            aria-labelledby="diagnostic-paused-title"
            className="diagnostic-card diagnostic-pause"
          >
            <span className="diagnostic-icon-tile">
              <Maximize size={28} aria-hidden="true" />
            </span>
            <h1
              id="diagnostic-paused-title"
              className="diagnostic-heading mt-5"
            >
              Stay on this test
            </h1>
            <p className="public-lead mt-4">
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
              className="public-button public-button--orange mt-7"
            >
              <span className="md:hidden">Continue test</span>
              <span className="hidden md:inline">Return to full screen</span>
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </section>
        ) : null}

        {!paused && phase === "intro" ? (
          <section
            aria-labelledby="diagnostic-intro-title"
            className="diagnostic-intro"
          >
            <div className="diagnostic-intro-copy">
              <p className="public-eyebrow">Free diagnostic</p>
              <h1 id="diagnostic-intro-title" className="public-display mt-5">
                {test.title}
              </h1>
              <p className="public-lead diagnostic-instructions mt-6">
                {test.instructions.trim() ||
                  "A free check of what you already know, before a course is chosen."}
              </p>
              <div className="diagnostic-facts">
                <span className="public-pill">
                  <ListChecks size={18} aria-hidden="true" />
                  {test.questions.length}{" "}
                  {test.questions.length === 1 ? "question" : "questions"}
                </span>
                {test.timeLimitMinutes ? (
                  <span className="public-pill">
                    <Clock3 size={18} aria-hidden="true" />
                    {test.timeLimitMinutes} minute
                    {test.timeLimitMinutes === 1 ? "" : "s"}
                  </span>
                ) : null}
              </div>
              <div className="diagnostic-start-card">
                <h2 className="text-2xl font-semibold">Before you begin</h2>
                <p className="diagnostic-muted mt-3">
                  <span className="md:hidden">
                    Stay on this tab until you submit.
                  </span>
                  <span className="hidden md:inline">
                    The test opens in full screen. Stay on this tab until you
                    submit.
                  </span>
                </p>
                {test.questions.length === 0 ? (
                  <p className="diagnostic-muted mt-3">
                    This test has no questions available yet.
                  </p>
                ) : null}
                {error ? (
                  <p role="alert" className="diagnostic-error mt-4">
                    {error}
                  </p>
                ) : null}
                <button
                  type="button"
                  onClick={() => void openFullscreen()}
                  disabled={test.questions.length === 0}
                  className="public-button public-button--orange mt-6"
                >
                  <Maximize
                    className="hidden size-4 md:inline"
                    aria-hidden="true"
                  />
                  <span className="md:hidden">Start test</span>
                  <span className="hidden md:inline">Open in full screen</span>
                  <ArrowUpRight size={18} aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="diagnostic-intro-art">
              <span className="diagnostic-math-note" aria-hidden="true">
                a² + b²
              </span>
              <svg
                className="diagnostic-doodle"
                aria-hidden="true"
                viewBox="0 0 100 100"
                fill="none"
              >
                <path
                  d="M50 9v20m0 42v20M9 50h20m42 0h20M21 21l15 15m28 28 15 15M21 79l15-15m28-28 15-15"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="12"
                  stroke="currentColor"
                  strokeWidth="3"
                />
              </svg>
              <div className="diagnostic-intro-image">
                <Image
                  src="/assets/learning/exams.svg"
                  alt=""
                  fill
                  sizes="(max-width: 1023px) 90vw, 42vw"
                  className="bg-[#fffdf8] object-contain p-3"
                  priority
                />
              </div>
              <div className="diagnostic-art-caption">
                <span className="diagnostic-icon-tile">
                  <ListChecks size={26} aria-hidden="true" />
                </span>
                <p>
                  A little clarity.
                  <br />A world of possibility.
                </p>
              </div>
              <ol className="diagnostic-steps" aria-label="Test steps">
                <li>
                  <span>01</span>Your details
                </li>
                <li>
                  <span>02</span>The questions
                </li>
                <li>
                  <span>03</span>Your results
                </li>
              </ol>
            </div>
          </section>
        ) : null}

        {!paused && phase === "details" ? (
          <form
            onSubmit={startTest}
            className="diagnostic-card diagnostic-details"
            aria-labelledby="diagnostic-details-title"
            noValidate
          >
            <p className="public-eyebrow">{context.title}</p>
            <h1
              id="diagnostic-details-title"
              className="diagnostic-heading mt-3"
            >
              Before you start
            </h1>
            <p className="public-lead mt-4">
              Add your name and phone number. We use them to follow up after the
              test.
            </p>
            <div className="mt-7 space-y-5">
              <label className="diagnostic-label" htmlFor="student-name">
                Full name
                <input
                  id="student-name"
                  value={studentName}
                  onChange={(event) => setStudentName(event.target.value)}
                  className="diagnostic-input"
                  autoComplete="name"
                  required
                />
              </label>
              <div className="relative">
                <label className="diagnostic-label" htmlFor="student-country">
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
                    className="diagnostic-input"
                    autoComplete="country-name"
                    placeholder="Start typing a country"
                    required
                  />
                </label>
                {countryOpen ? (
                  <ul className="diagnostic-country-menu">
                    {countryMatches.length === 0 ? (
                      <li className="diagnostic-muted px-4 py-3">
                        No matching country
                      </li>
                    ) : (
                      countryMatches.map((country) => (
                        <li key={`${country.country}-${country.name}`}>
                          <button
                            type="button"
                            className="diagnostic-country-option"
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
                            <span className="diagnostic-muted shrink-0">
                              {country.code}
                            </span>
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                ) : null}
              </div>
              <label className="diagnostic-label" htmlFor="student-phone">
                Mobile number
                <div className="diagnostic-phone">
                  <span className="diagnostic-country-code">
                    {countryCode || "+"}
                  </span>
                  <input
                    id="student-phone"
                    type="tel"
                    value={contactNumber}
                    onChange={(event) =>
                      setContactNumber(normalizePhoneInput(event.target.value))
                    }
                    className="diagnostic-input"
                    inputMode="tel"
                    autoComplete="tel-national"
                    placeholder="Phone number"
                    required
                  />
                </div>
              </label>
            </div>
            {formError ? (
              <p role="alert" className="diagnostic-error mt-4">
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
              className="public-button public-button--orange mt-7"
            >
              {starting ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : null}
              {starting ? "Starting" : "Start test"}
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </form>
        ) : null}

        {!paused && phase === "question" && question ? (
          <div className="diagnostic-workbench">
            <section aria-labelledby="diagnostic-question-title">
              <div className="diagnostic-question-status">
                <span>
                  Question {index + 1} of {test.questions.length}
                </span>
                <span>
                  {answeredCount} of {test.questions.length} answered
                </span>
              </div>
              <div className="diagnostic-card diagnostic-question-card">
                <div className="diagnostic-question-tools">
                  <p className="public-eyebrow">Choose one answer</p>
                  <button
                    type="button"
                    className={
                      questionFlagged
                        ? "diagnostic-flag diagnostic-flag--on"
                        : "diagnostic-flag"
                    }
                    aria-pressed={questionFlagged}
                    onClick={toggleFlag}
                  >
                    <Flag size={15} aria-hidden="true" />
                    {questionFlagged ? "Flagged" : "Flag"}
                  </button>
                </div>
                <h1
                  id="diagnostic-question-title"
                  className="diagnostic-question-heading mt-4"
                >
                  {question.prompt}
                </h1>
                <div
                  className="mt-7 space-y-3"
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
                        className={`diagnostic-option ${selected ? "diagnostic-option--selected" : ""}`}
                      >
                        <span className="diagnostic-option-letter">
                          {String.fromCharCode(65 + optionIndex)}
                        </span>
                        <span className="diagnostic-option-text">{option}</span>
                        {selected ? (
                          <Check
                            size={19}
                            aria-hidden="true"
                            className="mt-1 shrink-0"
                          />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
              <nav
                aria-label="Question navigation"
                className="diagnostic-navigation"
              >
                <button
                  type="button"
                  onClick={() => openQuestion(Math.max(0, index - 1))}
                  disabled={index === 0}
                  className="public-button public-button--outline"
                >
                  <ArrowLeft size={17} aria-hidden="true" />
                  Previous
                </button>
                {index === test.questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setPhase("review");
                      shellRef.current?.scrollTo({ top: 0 });
                    }}
                    className="public-button public-button--orange"
                  >
                    Review answers
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      openQuestion(
                        Math.min(test.questions.length - 1, index + 1),
                      )
                    }
                    className="public-button public-button--orange"
                  >
                    Next
                    <ArrowRight size={17} aria-hidden="true" />
                  </button>
                )}
              </nav>
            </section>
            <QuestionMap
              questions={test.questions}
              answers={answers}
              flagged={flagged}
              currentIndex={index}
              onJump={openQuestion}
            />
          </div>
        ) : null}

        {!paused && phase === "review" ? (
          <div className="diagnostic-workbench diagnostic-workbench--review">
            <section aria-labelledby="diagnostic-review-title">
              <p className="public-eyebrow">Review</p>
              <h1
                id="diagnostic-review-title"
                className="diagnostic-heading mt-3"
              >
                Submit your test
              </h1>
              <p className="public-lead mt-4">
                {answeredCount} of {test.questions.length} answered. You can
                open a question to change the answer, then submit.
              </p>
              <div className="mt-8 space-y-3">
                {test.questions.map((item, itemIndex) => {
                  const selected = answers[item.id];
                  const isFlagged = Boolean(flagged[item.id]);
                  const answered = typeof selected === "number";
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => openQuestion(itemIndex)}
                      className="diagnostic-review-item"
                    >
                      <span
                        className={[
                          "diagnostic-review-number",
                          answered ? "diagnostic-review-number--answered" : "",
                          isFlagged ? "diagnostic-review-number--flagged" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        aria-hidden="true"
                      >
                        {String(itemIndex + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="public-eyebrow">
                          Question {itemIndex + 1}
                        </span>
                        <span className="mt-2 block break-words font-semibold">
                          {item.prompt}
                        </span>
                        <span
                          className={`mt-2 block break-words text-sm ${answered ? "diagnostic-muted" : "diagnostic-unanswered"}`}
                        >
                          {typeof selected === "number"
                            ? `${String.fromCharCode(65 + selected)}. ${item.options[selected]}`
                            : "Not answered"}
                          {isFlagged ? " · Flagged" : ""}
                        </span>
                      </span>
                      <ArrowUpRight
                        size={18}
                        aria-hidden="true"
                        className="mt-1 shrink-0"
                      />
                    </button>
                  );
                })}
              </div>
              {formError ? (
                <p role="alert" className="diagnostic-error mt-5">
                  {formError}
                </p>
              ) : null}
              <div className="mt-8 flex flex-col-reverse gap-4 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={() => openQuestion(index)}
                  className="public-button public-button--outline"
                >
                  <ArrowLeft size={17} aria-hidden="true" />
                  Back to questions
                </button>
                <button
                  type="button"
                  onClick={() => void submitTest()}
                  disabled={submitting}
                  className="public-button public-button--orange"
                >
                  {submitting ? (
                    <Loader2
                      className="size-4 animate-spin"
                      aria-hidden="true"
                    />
                  ) : null}
                  {submitting ? "Submitting" : "Submit test"}
                  <ArrowRight size={17} aria-hidden="true" />
                </button>
              </div>
            </section>
            <QuestionMap
              questions={test.questions}
              answers={answers}
              flagged={flagged}
              currentIndex={null}
              onJump={openQuestion}
            />
          </div>
        ) : null}

        {phase === "result" && result ? (
          <div className="diagnostic-results">
            <section
              aria-labelledby="diagnostic-result-title"
              className="diagnostic-card"
            >
              <p className="public-eyebrow">{result.courseTitle}</p>
              <h1
                id="diagnostic-result-title"
                className="diagnostic-heading mt-3"
              >
                {result.testTitle}
              </h1>
              <p className="public-lead mt-4">
                We will follow up about this result.
                {result.durationSeconds > 0
                  ? ` You finished in ${formatDuration(result.durationSeconds)}${
                      result.timeLimitMinutes
                        ? ` of ${result.timeLimitMinutes} minutes`
                        : ""
                    }.`
                  : ""}
              </p>
              <div className="diagnostic-score">
                <p className="diagnostic-score-value">{result.percentage}%</p>
                <p className="public-eyebrow">Score</p>
                <svg aria-hidden="true" viewBox="0 0 100 100" fill="none">
                  <path
                    d="m50 7 7 27 24-14-15 23 27 7-27 7 15 24-24-15-7 27-7-27-23 15 14-24-27-7 27-7-14-23 23 14 7-27Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <dl className="diagnostic-result-facts">
                {[
                  ["Total questions", result.totalQuestions],
                  ["Correct answers", result.correct],
                  ["Incorrect answers", result.incorrect],
                  ["Unanswered", result.unanswered],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              <Link
                href="/courses"
                className="public-button public-button--dark mt-8"
              >
                Explore courses
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </section>

            <form
              onSubmit={sendQuery}
              className="diagnostic-card diagnostic-query"
              aria-labelledby="diagnostic-query-title"
              noValidate
            >
              <span className="diagnostic-icon-tile" aria-hidden="true">
                ?
              </span>
              <h2
                id="diagnostic-query-title"
                className="diagnostic-heading mt-5"
              >
                Have a question?
              </h2>
              <p className="public-lead mt-4">
                Send it here. We will reply by email.
              </p>
              {querySent ? (
                <p role="status" className="diagnostic-query-success mt-6">
                  <Check size={20} aria-hidden="true" className="shrink-0" />
                  Your question was sent. We will reply by email.
                </p>
              ) : (
                <div className="mt-7 space-y-5">
                  <label className="diagnostic-label" htmlFor="query-email">
                    Email
                    <input
                      id="query-email"
                      type="email"
                      value={queryEmail}
                      onChange={(event) => setQueryEmail(event.target.value)}
                      className="diagnostic-input"
                      autoComplete="email"
                      required
                    />
                  </label>
                  <label className="diagnostic-label" htmlFor="query-message">
                    Your question
                    <textarea
                      id="query-message"
                      value={queryMessage}
                      onChange={(event) => setQueryMessage(event.target.value)}
                      className="diagnostic-input min-h-32"
                      required
                    />
                  </label>
                  {queryError ? (
                    <p role="alert" className="diagnostic-error">
                      {queryError}
                    </p>
                  ) : null}
                  <button
                    type="submit"
                    disabled={querySending}
                    className="public-button public-button--orange"
                  >
                    {querySending ? (
                      <Loader2
                        className="size-4 animate-spin"
                        aria-hidden="true"
                      />
                    ) : null}
                    {querySending ? "Sending" : "Send question"}
                    <ArrowUpRight size={18} aria-hidden="true" />
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
