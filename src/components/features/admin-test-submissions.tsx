"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import { formatDuration } from "~/lib/duration";
import type { AdminCourse, DiagnosticSubmissionSummary } from "~/types";

type PageInfo = {
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
};

const EMPTY_PAGE: PageInfo = {
  page: 1,
  pageSize: 20,
  total: 0,
  pageCount: 1,
};

function formatWhen(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminTestSubmissions() {
  const searchParams = useSearchParams();
  const initialCourse = searchParams.get("course") ?? "";
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [items, setItems] = useState<DiagnosticSubmissionSummary[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>(EMPTY_PAGE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [courseId, setCourseId] = useState(initialCourse);
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [minScore, setMinScore] = useState("");
  const [maxScore, setMaxScore] = useState("");
  const [page, setPage] = useState(1);
  const [applied, setApplied] = useState({
    courseId: initialCourse,
    name: "",
    from: "",
    to: "",
    minScore: "",
    maxScore: "",
  });

  useEffect(() => {
    let cancelled = false;
    async function loadCourses() {
      try {
        const response = await fetch("/api/admin/courses");
        const body = (await response.json()) as {
          success?: boolean;
          data?: AdminCourse[];
        };
        if (!cancelled && body.success && body.data) setCourses(body.data);
      } catch (loadError) {
        console.error("Error loading courses for filters:", loadError);
      }
    }
    void loadCourses();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      const params = new URLSearchParams();
      params.set("page", String(page));
      if (applied.courseId) params.set("course", applied.courseId);
      if (applied.name) params.set("name", applied.name);
      if (applied.from) params.set("from", applied.from);
      if (applied.to) params.set("to", applied.to);
      if (applied.minScore) params.set("minScore", applied.minScore);
      if (applied.maxScore) params.set("maxScore", applied.maxScore);

      try {
        const response = await fetch(
          `/api/admin/test-submissions?${params.toString()}`,
        );
        const body = (await response.json()) as {
          success?: boolean;
          message?: string;
          data?: DiagnosticSubmissionSummary[];
          page?: number;
          pageSize?: number;
          total?: number;
          pageCount?: number;
        };
        if (cancelled) return;
        if (!response.ok || !body.success || !body.data) {
          setError(body.message || "Could not load submissions.");
          setItems([]);
          return;
        }
        setItems(body.data);
        setPageInfo({
          page: body.page ?? 1,
          pageSize: body.pageSize ?? 20,
          total: body.total ?? body.data.length,
          pageCount: body.pageCount ?? 1,
        });
      } catch (loadError) {
        console.error("Error loading submissions:", loadError);
        if (!cancelled) setError("Could not load submissions.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [applied, page]);

  function applyFilters(event: React.FormEvent) {
    event.preventDefault();
    setPage(1);
    setApplied({ courseId, name, from, to, minScore, maxScore });
  }

  function clearFilters() {
    setCourseId("");
    setName("");
    setFrom("");
    setTo("");
    setMinScore("");
    setMaxScore("");
    setPage(1);
    setApplied({
      courseId: "",
      name: "",
      from: "",
      to: "",
      minScore: "",
      maxScore: "",
    });
  }

  const start =
    pageInfo.total === 0 ? 0 : (pageInfo.page - 1) * pageInfo.pageSize + 1;
  const end = Math.min(pageInfo.page * pageInfo.pageSize, pageInfo.total);
  const filtersActive = Object.values(applied).some(Boolean);

  return (
    <div className="container-custom py-8">
      <Link
        href="/admin/tests"
        className="text-sm font-semibold text-primary hover:underline"
      >
        Back to tests
      </Link>
      <h1 className="mt-3 font-montserrat text-3xl font-bold text-dark">
        Test submissions
      </h1>
      <p className="mt-2 text-dark/70">
        Student diagnostic results are visible only in the admin portal.
      </p>

      <form
        onSubmit={applyFilters}
        className="mt-6 grid gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:grid-cols-3"
      >
        <label className="text-sm font-medium text-dark">
          Course
          <select
            value={courseId}
            onChange={(event) => setCourseId(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
          >
            <option value="">All tests</option>
            <option value="common">Common test</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium text-dark">
          Student name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
            maxLength={80}
          />
        </label>
        <label className="text-sm font-medium text-dark">
          From
          <input
            type="date"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
          />
        </label>
        <label className="text-sm font-medium text-dark">
          To
          <input
            type="date"
            value={to}
            onChange={(event) => setTo(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
          />
        </label>
        <label className="text-sm font-medium text-dark">
          Minimum score
          <input
            inputMode="numeric"
            value={minScore}
            onChange={(event) => setMinScore(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
            placeholder="0"
          />
        </label>
        <label className="text-sm font-medium text-dark">
          Maximum score
          <input
            inputMode="numeric"
            value={maxScore}
            onChange={(event) => setMaxScore(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
            placeholder="100"
          />
        </label>
        <div className="flex items-end gap-3 md:col-span-3">
          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
          >
            Apply filters
          </button>
          {filtersActive ? (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-semibold text-primary"
            >
              Clear
            </button>
          ) : null}
        </div>
      </form>

      {error ? (
        <p
          role="alert"
          className="mt-6 flex items-start gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      ) : null}

      {loading ? (
        <div className="flex h-64 items-center justify-center text-sm text-dark/70">
          <Loader2 className="mr-2 size-4 animate-spin" />
          Loading submissions
        </div>
      ) : items.length === 0 ? (
        <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
          <Inbox className="size-10 text-dark/20" />
          <h2 className="mt-4 font-montserrat text-xl font-bold text-dark">
            {filtersActive ? "No matching submissions" : "No submissions yet"}
          </h2>
          <p className="mt-2 max-w-md text-dark/70">
            {filtersActive
              ? "Try a different course, name, date, or score range."
              : "When a student submits a diagnostic test, the result will appear here."}
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[960px]">
                <thead>
                  <tr className="bg-neutral text-left text-xs font-semibold uppercase tracking-wider text-dark/60">
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Course</th>
                    <th className="px-4 py-3">Submitted</th>
                    <th className="px-4 py-3">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-neutral/70">
                      <td className="px-4 py-4">
                        <Link
                          href={`/admin/tests/submissions/${item.id}`}
                          className="font-semibold text-dark hover:text-primary"
                        >
                          {item.studentName}
                        </Link>
                        <p className="mt-1 text-sm text-dark/60">
                          {item.contactNumber} · {item.country}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-sm text-dark">
                        <div>{item.courseTitle}</div>
                        <p className="mt-1 text-dark/60">{item.testTitle}</p>
                      </td>
                      <td className="px-4 py-4 text-sm text-dark">
                        {formatWhen(item.createdAt)}
                      </td>
                      <td className="px-4 py-4 text-sm text-dark">
                        <div className="font-semibold">{item.percentage}%</div>
                        <p className="mt-1 text-dark/60">
                          {item.correct} correct · {item.incorrect} incorrect ·{" "}
                          {item.unanswered} unanswered · {item.totalQuestions}{" "}
                          total
                        </p>
                        {item.durationSeconds > 0 ? (
                          <p className="mt-1 text-dark/60">
                            {formatDuration(item.durationSeconds)}
                            {item.timeLimitMinutes
                              ? ` of ${item.timeLimitMinutes} min`
                              : ""}
                          </p>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-dark/70">
            <p>
              Showing {start}–{end} of {pageInfo.total}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={pageInfo.page <= 1}
                className="rounded-lg border border-gray-200 px-3 py-1.5 font-semibold text-dark disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() =>
                  setPage((current) =>
                    Math.min(pageInfo.pageCount, current + 1),
                  )
                }
                disabled={pageInfo.page >= pageInfo.pageCount}
                className="rounded-lg border border-gray-200 px-3 py-1.5 font-semibold text-dark disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
