"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { courseInputSchema } from "~/lib/validations";
import type { AdminCourse } from "~/types";

const fieldClass =
  "mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-primary";

type TopicDraft = { key: string; value: string };

const EMPTY = {
  title: "",
  description: "",
  startDate: "",
  batchSize: "5",
  topics: [] as TopicDraft[],
};

function topicDraft(value = ""): TopicDraft {
  return { key: crypto.randomUUID(), value };
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
          startDate: course.startDate ?? "",
          batchSize: String(course.batchSize),
          topics: course.topics.map((topic) => topicDraft(topic)),
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

  function updateTopic(key: string, value: string) {
    setForm((current) => ({
      ...current,
      topics: current.topics.map((topic) =>
        topic.key === key ? { ...topic, value } : topic,
      ),
    }));
  }

  function removeTopic(key: string) {
    setForm((current) => ({
      ...current,
      topics: current.topics.filter((topic) => topic.key !== key),
    }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!form.batchSize.trim()) {
      setError("Batch size is required");
      return;
    }

    const payload = {
      title: form.title,
      description: form.description,
      startDate: form.startDate.trim() ? form.startDate.trim() : null,
      topics: form.topics.map((topic) => topic.value.trim()).filter(Boolean),
      batchSize: Number(form.batchSize),
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
        A course needs a name, a short description, a start date, the topics it
        covers, and a batch size.
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
          Course name
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
            className={`${fieldClass} min-h-24`}
            maxLength={300}
            required
          />
          <span className="mt-1 block text-xs font-normal text-dark/50">
            A short line for the homepage banner. It shows on desktop only.
          </span>
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-medium text-dark">
            Start date
            <input
              type="date"
              value={form.startDate}
              onChange={(event) => update("startDate", event.target.value)}
              className={fieldClass}
            />
            <span className="mt-1 block text-xs font-normal text-dark/50">
              Leave this blank until a start date is set.
            </span>
          </label>
          <label className="block text-sm font-medium text-dark">
            Batch size
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={30}
              step={1}
              value={form.batchSize}
              onChange={(event) => update("batchSize", event.target.value)}
              className={fieldClass}
              required
            />
            <span className="mt-1 block text-xs font-normal text-dark/50">
              Students in one batch. Classes are small groups, usually 4–5.
            </span>
          </label>
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-dark">Topics</p>
            <button
              type="button"
              onClick={() => update("topics", [...form.topics, topicDraft()])}
              className="inline-flex items-center text-sm font-semibold text-primary hover:underline"
            >
              <Plus className="mr-1 size-4" />
              Add topic
            </button>
          </div>
          <p className="mt-1 text-xs text-dark/50">
            Subjects covered in this course. Add them when the list is ready.
          </p>
          {form.topics.length === 0 ? (
            <p className="mt-3 rounded-lg border border-dashed border-gray-200 px-4 py-6 text-center text-sm text-dark/50">
              No topics yet.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {form.topics.map((topic, index) => (
                <li key={topic.key} className="flex items-center gap-2">
                  <label className="sr-only" htmlFor={`topic-${topic.key}`}>
                    Topic {index + 1}
                  </label>
                  <input
                    id={`topic-${topic.key}`}
                    value={topic.value}
                    onChange={(event) =>
                      updateTopic(topic.key, event.target.value)
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-primary"
                    maxLength={200}
                    placeholder="Topic"
                  />
                  <button
                    type="button"
                    onClick={() => removeTopic(topic.key)}
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-dark/50 hover:text-secondary"
                    aria-label={`Remove topic ${index + 1}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

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
