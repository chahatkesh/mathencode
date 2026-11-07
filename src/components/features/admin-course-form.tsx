"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { ButtonLock } from "~/components/admin/button-lock";
import {
  UnsavedChangesDialog,
  useUnsavedChanges,
} from "~/components/admin/unsaved-changes";
import {
  MAX_COURSE_TOPICS,
  courseSaveBlocked,
  courseSnapshot,
  normalizeWholeNumber,
  type CourseDraft,
} from "~/lib/admin-form-state";
import { courseInputSchema } from "~/lib/validations";
import {
  AdminPageHeader,
  AdminErrorState,
  AdminLoading,
} from "~/components/admin/admin-page";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { ConfirmDialog } from "~/components/admin";
import type { AdminCourse } from "~/types";

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

function toCourseDraft(form: typeof EMPTY): CourseDraft {
  return {
    title: form.title,
    description: form.description,
    startDate: form.startDate,
    batchSize: form.batchSize,
    topics: form.topics.map((topic) => topic.value),
  };
}

function courseDraftSnapshot(form: typeof EMPTY) {
  return courseSnapshot(toCourseDraft(form));
}

function commitTrimmed(
  event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  apply: (value: string) => void,
) {
  const next = event.target.value.trim();
  if (next !== event.target.value) apply(next);
}

export default function AdminCourseForm({ courseId }: { courseId?: string }) {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(Boolean(courseId));
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loaded, setLoaded] = useState(!courseId);
  const [reload, setReload] = useState(0);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [savedSnapshot, setSavedSnapshot] = useState(() =>
    courseDraftSnapshot(EMPTY),
  );
  const isDirty = loaded && courseDraftSnapshot(form) !== savedSnapshot;
  const saveBlocked = courseSaveBlocked(toCourseDraft(form));
  const saveLocked = !isDirty || Boolean(saveBlocked);
  const saveReason = !isDirty
    ? courseId
      ? "No changes to update"
      : "No changes to save"
    : saveBlocked;
  const blankTopic = form.topics.some((topic) => !topic.value.trim());
  const saveStatus = error
    ? error
    : !isDirty
      ? courseId
        ? blankTopic
          ? "No unsaved changes. Name a topic to include it."
          : "No unsaved changes."
        : "Add the course details to save."
      : saveBlocked
        ? saveBlocked
        : courseId
          ? "Unsaved changes. Update the course to show them on the site."
          : "Unsaved changes. Save the course to show it on the site.";
  const saveLabel = saving
    ? courseId
      ? "Updating…"
      : "Saving…"
    : courseId
      ? "Update course"
      : "Save course";
  const unsaved = useUnsavedChanges(isDirty);

  useEffect(() => {
    if (!courseId) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
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
        setLoaded(true);
        const course = body.data;
        const nextForm = {
          title: course.title,
          description: course.description,
          startDate: course.startDate ?? "",
          batchSize: String(course.batchSize),
          topics: course.topics.map((topic) => topicDraft(topic)),
        };
        setForm(nextForm);
        setSavedSnapshot(courseDraftSnapshot(nextForm));
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
  }, [courseId, reload]);

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
    if (saving || deleting || !isDirty) return;
    const blocked = courseSaveBlocked(toCourseDraft(form));
    if (blocked) {
      setError(blocked);
      return;
    }
    setError("");
    setNotice("");
    setFieldErrors({});

    if (!form.batchSize.trim()) {
      setFieldErrors({ batchSize: "Cohort size is required" });
      setError("Cohort size is required");
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
      setFieldErrors(
        Object.fromEntries(
          parsed.error.issues.map((issue) => [
            String(issue.path[0]),
            issue.message,
          ]),
        ),
      );
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
      const nextForm = {
        title: parsed.data.title,
        description: parsed.data.description,
        startDate: parsed.data.startDate ?? "",
        batchSize: String(parsed.data.batchSize),
        topics: parsed.data.topics.map((value) => topicDraft(value)),
      };
      setForm(nextForm);
      setSavedSnapshot(courseDraftSnapshot(nextForm));
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

  async function confirmDelete() {
    if (!courseId) return;
    setDeleting(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: "DELETE",
      });
      const body = (await response.json()) as {
        success?: boolean;
        message?: string;
      };
      if (!response.ok || !body.success) {
        setError(body.message || "Could not delete this course.");
        setPendingDelete(false);
        return;
      }
      setSavedSnapshot(courseDraftSnapshot(form));
      router.push("/admin/courses?status=deleted");
      router.refresh();
    } catch (deleteError) {
      console.error("Error deleting course:", deleteError);
      setError("Could not delete this course.");
      setPendingDelete(false);
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <AdminLoading label="Loading course" variant="form" />;

  if (!loaded)
    return (
      <div className="space-y-6">
        <AdminPageHeader title="Edit course" backHref="/admin/courses" />
        <AdminErrorState
          message={error || "Course not found."}
          onRetry={() => setReload((value) => value + 1)}
        />
      </div>
    );

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={courseId ? "Edit course" : "Add course"}
        description="A clear course overview helps students find the right place to start."
        backHref="/admin/courses"
      >
        {courseId ? (
          <Button asChild variant="outline">
            <Link href={`/admin/tests/${courseId}`}>
              Manage diagnostic test
            </Link>
          </Button>
        ) : (
          <Badge variant="secondary">New course</Badge>
        )}
      </AdminPageHeader>
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {error ? <AdminErrorState message={error} /> : null}
        {notice && !isDirty ? (
          <p
            role="status"
            className="rounded-lg border border-admin-primary/20 bg-admin-primary/5 px-4 py-3 text-sm"
          >
            {notice}
          </p>
        ) : null}
        <fieldset
          disabled={saving}
          className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.5fr)]"
        >
          <div className="min-w-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course overview</CardTitle>
                <CardDescription>
                  The essentials students see in the course catalog.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="course-title">
                    Course name <span className="text-admin-primary">*</span>
                  </Label>
                  <Input
                    id="course-title"
                    placeholder="e.g. Algebra foundations"
                    value={form.title}
                    onChange={(event) => update("title", event.target.value)}
                    onBlur={(event) =>
                      commitTrimmed(event, (value) => update("title", value))
                    }
                    maxLength={200}
                    required
                    aria-invalid={Boolean(fieldErrors.title)}
                    aria-describedby={
                      fieldErrors.title ? "title-error" : undefined
                    }
                  />
                  {fieldErrors.title ? (
                    <p id="title-error" className="text-sm text-red-600">
                      {fieldErrors.title}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="course-description">
                    Description <span className="text-admin-primary">*</span>
                  </Label>
                  <Textarea
                    id="course-description"
                    value={form.description}
                    onChange={(event) =>
                      update("description", event.target.value)
                    }
                    onBlur={(event) =>
                      commitTrimmed(event, (value) =>
                        update("description", value),
                      )
                    }
                    className="min-h-32"
                    maxLength={300}
                    placeholder="What will students learn, and who is this course for?"
                    required
                    aria-invalid={Boolean(fieldErrors.description)}
                    aria-describedby="description-help description-error"
                  />
                  <div className="flex justify-between gap-4 text-xs text-admin-muted-foreground">
                    <p id="description-help">
                      Shown on the course card and course page.
                    </p>
                    <span>{form.description.length}/300</span>
                  </div>
                  <p id="description-error" className="text-sm text-red-600">
                    {fieldErrors.description}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <CardTitle>Curriculum</CardTitle>
                  <ButtonLock
                    locked={form.topics.length >= MAX_COURSE_TOPICS}
                    reason="A course can have at most 40 topics."
                  >
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={form.topics.length >= MAX_COURSE_TOPICS}
                      onClick={() =>
                        update("topics", [...form.topics, topicDraft()])
                      }
                    >
                      <Plus className="size-4" />
                      Add topic
                    </Button>
                  </ButtonLock>
                </div>
                <CardDescription>
                  List the subjects covered. Blank topics are not saved.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {form.topics.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-admin-border px-4 py-8 text-center">
                    <p className="text-sm font-medium">
                      What will students learn?
                    </p>
                    <p className="mt-1 text-sm text-admin-muted-foreground">
                      Add topics now, or come back when the curriculum is ready.
                    </p>
                  </div>
                ) : (
                  <ol className="space-y-3">
                    {form.topics.map((topic, index) => (
                      <li key={topic.key} className="flex items-center gap-3">
                        <span className="w-5 shrink-0 text-xs tabular-nums text-admin-muted-foreground">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <Label
                          className="sr-only"
                          htmlFor={`topic-${topic.key}`}
                        >
                          Topic {index + 1}
                        </Label>
                        <Input
                          id={`topic-${topic.key}`}
                          value={topic.value}
                          onChange={(event) =>
                            updateTopic(topic.key, event.target.value)
                          }
                          onBlur={(event) =>
                            commitTrimmed(event, (value) =>
                              updateTopic(topic.key, value),
                            )
                          }
                          maxLength={200}
                          placeholder="Topic name"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          aria-label={`Remove topic ${index + 1}`}
                          onClick={() => removeTopic(topic.key)}
                          className="shrink-0 text-admin-muted-foreground hover:text-red-600"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </li>
                    ))}
                  </ol>
                )}
                {fieldErrors.topics ? (
                  <p className="mt-2 text-sm text-red-600">
                    {fieldErrors.topics}
                  </p>
                ) : null}
              </CardContent>
            </Card>
          </div>
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Schedule & capacity</CardTitle>
              <CardDescription>
                Keep each cohort personal and focused.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="course-start">
                  Start date{" "}
                  <span className="font-normal text-admin-muted-foreground">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="course-start"
                  type="date"
                  value={form.startDate}
                  onChange={(event) => update("startDate", event.target.value)}
                  aria-invalid={Boolean(fieldErrors.startDate)}
                  aria-describedby="start-help start-error"
                />
                <p
                  id="start-help"
                  className="text-xs text-admin-muted-foreground"
                >
                  Leave blank until the next cohort is scheduled.
                </p>
                <p id="start-error" className="text-sm text-red-600">
                  {fieldErrors.startDate}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="course-batch">
                  Students per cohort{" "}
                  <span className="text-admin-primary">*</span>
                </Label>
                <Input
                  id="course-batch"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={30}
                  step={1}
                  value={form.batchSize}
                  onChange={(event) => update("batchSize", event.target.value)}
                  onBlur={(event) => {
                    const next = normalizeWholeNumber(event.target.value);
                    if (next !== event.target.value) update("batchSize", next);
                  }}
                  required
                  aria-invalid={Boolean(fieldErrors.batchSize)}
                  aria-describedby="batch-help batch-error"
                />
                <p
                  id="batch-help"
                  className="text-xs text-admin-muted-foreground"
                >
                  1–30 students. Small groups are usually 4–5.
                </p>
                <p id="batch-error" className="text-sm text-red-600">
                  {fieldErrors.batchSize}
                </p>
              </div>
            </CardContent>
          </Card>
        </fieldset>
        <div className="sticky bottom-3 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-admin-border bg-admin-card/95 p-4 shadow-sm backdrop-blur">
          <p
            id="course-save-status"
            aria-live={error ? "off" : "polite"}
            className={`max-w-lg text-xs ${error ? "text-red-600" : "text-admin-muted-foreground"}`}
          >
            {saveStatus}
          </p>
          <div className="flex gap-2">
            {courseId ? (
              <Button
                type="button"
                variant="ghost"
                className="text-red-600 hover:text-red-700"
                disabled={saving || deleting}
                onClick={() => setPendingDelete(true)}
              >
                <Trash2 className="size-4" />
                Delete
              </Button>
            ) : null}
            <Button asChild variant="outline">
              <Link href="/admin/courses">Cancel</Link>
            </Button>
            <ButtonLock locked={saveLocked && !saving} reason={saveReason}>
              <Button
                type="submit"
                disabled={saving || deleting}
                aria-describedby="course-save-status"
              >
                {saving ? <Loader2 className="size-4 animate-spin" /> : null}
                {saveLabel}
              </Button>
            </ButtonLock>
          </div>
        </div>
      </form>
      <ConfirmDialog
        open={pendingDelete}
        title="Delete course"
        confirmLabel="Delete course"
        message="Delete this course? This cannot be undone."
        busy={deleting}
        onClose={() => {
          if (!deleting) setPendingDelete(false);
        }}
        onConfirm={() => {
          void confirmDelete();
        }}
      />
      <UnsavedChangesDialog
        open={unsaved.leaveOpen}
        onStay={unsaved.stay}
        onLeave={unsaved.leave}
      />
    </div>
  );
}
