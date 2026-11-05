"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, Loader2, Plus } from "lucide-react";
import { ConfirmDialog } from "~/components/admin";
import { formatCourseDate } from "~/lib/course-format";
import type { AdminCourse } from "~/types";

const STATUS_MESSAGES: Record<string, string> = {
  created: "Course added.",
  deleted: "Course deleted.",
};

function topicPreview(topics: string[]) {
  if (topics.length === 0) return "None yet";
  const shown = topics.slice(0, 3).join(", ");
  const extra = topics.length - 3;
  return extra > 0 ? `${shown} +${extra}` : shown;
}

export default function AdminCourses() {
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(
    STATUS_MESSAGES[searchParams.get("status") ?? ""] ?? "",
  );
  const [pendingDelete, setPendingDelete] = useState<AdminCourse | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch("/api/admin/courses");
        const body = (await response.json()) as {
          success?: boolean;
          message?: string;
          data?: AdminCourse[];
        };
        if (cancelled) return;
        if (!response.ok || !body.success || !body.data) {
          setError(body.message || "Could not load courses.");
          return;
        }
        setCourses(body.data);
      } catch (loadError) {
        console.error("Error loading courses:", loadError);
        if (!cancelled) setError("Could not load courses.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/courses/${pendingDelete.id}`, {
        method: "DELETE",
      });
      const body = (await response.json()) as {
        success?: boolean;
        message?: string;
      };
      if (!response.ok || !body.success) {
        setError(body.message || "Could not delete this course.");
        setPendingDelete(null);
        return;
      }
      setCourses((current) =>
        current.filter((course) => course.id !== pendingDelete.id),
      );
      setNotice("Course deleted.");
      setPendingDelete(null);
    } catch (deleteError) {
      console.error("Error deleting course:", deleteError);
      setError("Could not delete this course.");
      setPendingDelete(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="container-custom py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dark">Courses</h1>
          <p className="mt-2 text-dark/70">
            Manage course names, start dates, topics, and batch sizes.
          </p>
        </div>
        <Link
          href="/admin/courses/new"
          className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
        >
          <Plus className="mr-2 size-4" />
          Add course
        </Link>
      </div>

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
          Loading courses
        </div>
      ) : courses.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
          <h2 className="text-xl font-bold text-dark">No courses yet</h2>
          <p className="mt-2 text-dark/70">
            Add a course to show it on the site.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="bg-neutral text-left text-xs font-semibold uppercase tracking-wider text-dark/60">
                  <th className="px-4 py-3">Course</th>
                  <th className="px-4 py-3">Start date</th>
                  <th className="px-4 py-3">Topics</th>
                  <th className="px-4 py-3">Batch size</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-dark">
                        {course.title}
                      </div>
                      <p className="mt-1 text-sm text-dark/50">
                        /course/{course.slug}
                      </p>
                      {course.description ? (
                        <p className="mt-1 line-clamp-2 max-w-md text-sm text-dark/60">
                          {course.description}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-4 text-sm text-dark">
                      {formatCourseDate(course.startDate) ?? "Not set"}
                    </td>
                    <td className="px-4 py-4 text-sm text-dark">
                      <p className="max-w-xs">{topicPreview(course.topics)}</p>
                      {course.topics.length > 0 ? (
                        <p className="mt-1 text-dark/50">
                          {course.topics.length}{" "}
                          {course.topics.length === 1 ? "topic" : "topics"}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-4 text-sm text-dark">
                      {course.batchSize}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-3 text-sm font-semibold">
                        <Link
                          href={`/admin/courses/${course.id}`}
                          className="text-primary hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setError("");
                            setPendingDelete(course);
                          }}
                          className="text-secondary hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete course"
        message={
          pendingDelete
            ? `Delete “${pendingDelete.title}”? This cannot be undone.`
            : ""
        }
        busy={deleting}
        onClose={() => {
          if (!deleting) setPendingDelete(null);
        }}
        onConfirm={() => {
          void confirmDelete();
        }}
      />
    </div>
  );
}
