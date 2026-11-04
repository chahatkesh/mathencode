"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { courseInputSchema } from "~/lib/validations";
import type { AdminCourse, CourseAccent } from "~/types";

const fieldClass =
  "mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-primary";

const EMPTY = {
  title: "",
  description: "",
  level: "",
  duration: "",
  group: "Small group (4-5)",
  highlights: "",
  objectives: "",
  prerequisites: "",
  schedule: "",
  nextStart: "",
  accent: "primary" as CourseAccent,
  visible: true,
};

function lines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function AdminCourseForm({ courseId }: { courseId?: string }) {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(Boolean(courseId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!courseId) return;
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch(`/api/admin/courses/${courseId}`);
        const body = (await response.json()) as {
          success?: boolean;
          message?: string;
          data?: AdminCourse;
        };
        if (cancelled) return;
        if (!response.ok || !body.success || !body.data) {
          setError(body.message || "Course not found.");
          return;
        }
        const course = body.data;
        setForm({
          title: course.title,
          description: course.description,
          level: course.level,
          duration: course.duration,
          group: course.group,
          highlights: course.highlights.join("\n"),
          objectives: course.objectives.join("\n"),
          prerequisites: course.prerequisites,
          schedule: course.schedule,
          nextStart: course.nextStart,
          accent: course.colorScheme.accent,
          visible: course.visible,
        });
      } catch (loadError) {
        console.error("Error loading course:", loadError);
        if (!cancelled) setError("Could not load this course.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  function update<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setNotice("");

    const payload = {
      title: form.title,
      description: form.description,
      level: form.level,
      duration: form.duration,
      group: form.group,
      highlights: lines(form.highlights),
      objectives: lines(form.objectives),
      prerequisites: form.prerequisites,
      schedule: form.schedule,
      nextStart: form.nextStart,
      accent: form.accent,
      visible: form.visible,
    };
    const parsed = courseInputSchema.safeParse(payload);
    if (!parsed.success) {
      setError(
        parsed.error.issues[0]?.message ?? "Check the form and try again.",
      );
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(
        courseId ? `/api/admin/courses/${courseId}` : "/api/admin/courses",
        {
          method: courseId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        },
      );
      const body = (await response.json()) as {
        success?: boolean;
        message?: string;
      };
      if (!response.ok || !body.success) {
        setError(body.message || "Could not save this course.");
        return;
      }
      if (!courseId) {
        router.push("/admin/courses?status=created");
        router.refresh();
        return;
      }
      setNotice("Course updated.");
      router.refresh();
    } catch (saveError) {
      console.error("Error saving course:", saveError);
      setError("Could not save this course.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-dark/70">
        <Loader2 className="mr-2 size-4 animate-spin" />
        Loading course
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <Link
        href="/admin/courses"
        className="text-sm font-semibold text-primary hover:underline"
      >
        Back to courses
      </Link>
      <h1 className="mt-3 text-3xl font-bold text-dark">
        {courseId ? "Edit course" : "Add course"}
      </h1>
      <p className="mt-2 max-w-2xl text-dark/70">
        These details appear on the program card and the course page.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 max-w-3xl space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
        noValidate
      >
        {error ? (
          <p
            role="alert"
            className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </p>
        ) : null}
        {notice ? (
          <p
            role="status"
            className="rounded-lg bg-primary/10 px-4 py-3 text-sm text-dark"
          >
            {notice}
          </p>
        ) : null}

        <label className="block text-sm font-medium text-dark">
          Title
          <input
            value={form.title}
            onChange={(event) => update("title", event.target.value)}
            className={fieldClass}
            maxLength={200}
            required
          />
        </label>
        <label className="block text-sm font-medium text-dark">
          Description
          <textarea
            value={form.description}
            onChange={(event) => update("description", event.target.value)}
            className={`${fieldClass} min-h-28`}
            maxLength={5000}
            required
          />
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-medium text-dark">
            Grade level
            <input
              value={form.level}
              onChange={(event) => update("level", event.target.value)}
              className={fieldClass}
              maxLength={120}
              required
            />
          </label>
          <label className="block text-sm font-medium text-dark">
            Duration
            <input
              value={form.duration}
              onChange={(event) => update("duration", event.target.value)}
              className={fieldClass}
              maxLength={120}
              required
            />
          </label>
          <label className="block text-sm font-medium text-dark">
            Class size
            <input
              value={form.group}
              onChange={(event) => update("group", event.target.value)}
              className={fieldClass}
              maxLength={120}
              required
            />
          </label>
          <label className="block text-sm font-medium text-dark">
            Next start
            <input
              value={form.nextStart}
              onChange={(event) => update("nextStart", event.target.value)}
              className={fieldClass}
              maxLength={120}
              required
            />
          </label>
        </div>
        <label className="block text-sm font-medium text-dark">
          Schedule
          <input
            value={form.schedule}
            onChange={(event) => update("schedule", event.target.value)}
            className={fieldClass}
            maxLength={300}
            required
          />
        </label>
        <label className="block text-sm font-medium text-dark">
          Prerequisites
          <input
            value={form.prerequisites}
            onChange={(event) => update("prerequisites", event.target.value)}
            className={fieldClass}
            maxLength={1000}
            required
          />
        </label>
        <label className="block text-sm font-medium text-dark">
          Key topics
          <textarea
            value={form.highlights}
            onChange={(event) => update("highlights", event.target.value)}
            className={`${fieldClass} min-h-32`}
            placeholder="One topic per line"
            required
          />
        </label>
        <label className="block text-sm font-medium text-dark">
          Learning objectives
          <textarea
            value={form.objectives}
            onChange={(event) => update("objectives", event.target.value)}
            className={`${fieldClass} min-h-28`}
            placeholder="One objective per line"
            required
          />
        </label>

        <label className="flex items-center gap-3 text-sm font-medium text-dark">
          <input
            type="checkbox"
            checked={form.visible}
            onChange={(event) => update("visible", event.target.checked)}
            className="size-4 accent-primary"
          />
          Show this course on the marketing page
        </label>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
            {saving ? "Saving" : "Save course"}
          </button>
          <Link
            href="/admin/courses"
            className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold text-dark"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
