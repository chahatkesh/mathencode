"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, Loader2 } from "lucide-react";
import type { AdminTestListItem } from "~/types";

export default function AdminTests() {
  const [items, setItems] = useState<AdminTestListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch("/api/admin/tests");
        const body = (await response.json()) as {
          success?: boolean;
          message?: string;
          data?: AdminTestListItem[];
        };
        if (cancelled) return;
        if (!response.ok || !body.success || !body.data) {
          setError(body.message || "Could not load tests.");
          return;
        }
        setItems(body.data);
      } catch (loadError) {
        console.error("Error loading tests:", loadError);
        if (!cancelled) setError("Could not load tests.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function togglePublished(item: AdminTestListItem) {
    if (!item.test) return;
    setUpdatingId(item.course.id);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/admin/tests/${item.course.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !item.test.published }),
      });
      const body = (await response.json()) as {
        success?: boolean;
        message?: string;
        data?: { published: boolean };
      };
      if (!response.ok || !body.success || !body.data) {
        setError(body.message || "Could not update this test.");
        return;
      }
      setItems((current) =>
        current.map((entry) =>
          entry.course.id === item.course.id && entry.test
            ? {
                ...entry,
                test: { ...entry.test, published: body.data!.published },
              }
            : entry,
        ),
      );
      setNotice(body.data.published ? "Test published." : "Test unpublished.");
    } catch (toggleError) {
      console.error("Error updating test:", toggleError);
      setError("Could not update this test.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-dark">Tests</h1>
      <p className="mt-2 max-w-2xl text-dark/70">
        Each course has one diagnostic test. The common test is for students who
        are not sure which course to take. Students can open a test only after
        it is published.
      </p>

      {notice ? (
        <p
          role="status"
          className="mt-6 rounded-lg bg-primary/10 px-4 py-3 text-sm text-dark"
        >
          {notice}
        </p>
      ) : null}
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
          Loading tests
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="bg-neutral text-left text-xs font-semibold uppercase tracking-wider text-dark/60">
                  <th className="px-4 py-3">Course</th>
                  <th className="px-4 py-3">Test</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item) => (
                  <tr key={item.course.id}>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-dark">
                        {item.course.title}
                      </div>
                      <p className="mt-1 text-sm text-dark/60">
                        {item.course.batchSize
                          ? `${item.course.batchSize} ${
                              item.course.batchSize === 1
                                ? "student per batch"
                                : "students per batch"
                            }`
                          : "For students who are not sure which course to take"}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-sm text-dark">
                      {item.test ? (
                        <>
                          <div>{item.test.title}</div>
                          <p className="mt-1 text-dark/60">
                            {item.test.questionCount}{" "}
                            {item.test.questionCount === 1
                              ? "question"
                              : "questions"}
                            {item.test.timeLimitMinutes
                              ? ` · ${item.test.timeLimitMinutes} min`
                              : ""}
                          </p>
                        </>
                      ) : (
                        <span className="text-dark/50">No test yet</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {item.test ? (
                        <button
                          type="button"
                          onClick={() => togglePublished(item)}
                          disabled={updatingId === item.course.id}
                          className={`rounded-full px-3 py-1 text-xs font-semibold disabled:opacity-60 ${
                            item.test.published
                              ? "bg-primary/10 text-primary"
                              : "bg-neutral text-dark/60"
                          }`}
                        >
                          {updatingId === item.course.id
                            ? "Saving"
                            : item.test.published
                              ? "Published"
                              : "Unpublished"}
                        </button>
                      ) : (
                        <span className="text-sm text-dark/40">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-3 text-sm font-semibold">
                        <Link
                          href={`/admin/tests/${item.course.id}`}
                          className="text-primary hover:underline"
                        >
                          {item.test ? "Edit test" : "Create test"}
                        </Link>
                        {item.test ? (
                          <Link
                            href={`/admin/tests/submissions?course=${item.course.id}`}
                            className="text-primary hover:underline"
                          >
                            Submissions
                          </Link>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
