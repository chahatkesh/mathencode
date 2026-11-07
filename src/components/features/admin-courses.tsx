"use client";

import { useEffect, useState, type MouseEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import {
  AdminPageHeader,
  AdminEmptyState,
  AdminErrorState,
  AdminLoading,
} from "~/components/admin/admin-page";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "~/components/ui/table";
import { cn } from "~/lib/utils";
import { formatCourseDate } from "~/lib/course-format";
import type { AdminCourse } from "~/types";

const STATUS_MESSAGES: Record<string, string> = {
  created: "Course added.",
  deleted: "Course deleted.",
};

export default function AdminCourses() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const notice = STATUS_MESSAGES[searchParams.get("status") ?? ""] ?? "";
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
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
  }, [reload]);

  function openCourse(id: string) {
    router.push(`/admin/courses/${id}`);
  }

  function openFromRow(event: MouseEvent<HTMLTableRowElement>, id: string) {
    const target = event.target;
    if (target instanceof Element && target.closest("a, button")) return;
    openCourse(id);
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Courses"
        description="Open a course to edit its details, schedule, and batch size."
      >
        <Button asChild>
          <Link href="/admin/courses/new">
            <Plus className="size-4" />
            Add course
          </Link>
        </Button>
      </AdminPageHeader>
      {notice ? (
        <p
          role="status"
          className="rounded-lg border border-admin-primary/20 bg-admin-primary/5 px-4 py-3 text-sm text-admin-foreground"
        >
          {notice}
        </p>
      ) : null}
      {error ? (
        <AdminErrorState
          message={error}
          onRetry={() => setReload((value) => value + 1)}
        />
      ) : null}
      {loading ? (
        <AdminLoading label="Loading courses" variant="table" columns={4} />
      ) : error && courses.length === 0 ? null : courses.length === 0 ? (
        <AdminEmptyState
          title="Build your first course"
          description="Add the details students need to find their next small-group class."
        >
          <Button asChild>
            <Link href="/admin/courses/new">
              <Plus className="size-4" />
              Add course
            </Link>
          </Button>
        </AdminEmptyState>
      ) : (
        <Card className="overflow-hidden">
          <section aria-label="Courses">
            <Table className="min-w-[48rem] table-fixed">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[32%] pl-4" scope="col">
                    Course
                  </TableHead>
                  <TableHead className="w-[24%]" scope="col">
                    Start date
                  </TableHead>
                  <TableHead className="w-[28%]" scope="col">
                    Topics
                  </TableHead>
                  <TableHead className="w-[16%] pr-4" scope="col">
                    Batch
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => {
                  const topics =
                    course.topics.length === 0
                      ? "None yet"
                      : course.topics.join(", ");
                  const start = formatCourseDate(course.startDate);
                  return (
                    <TableRow
                      key={course.id}
                      tabIndex={0}
                      className={cn(
                        "cursor-pointer focus-visible:bg-admin-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-admin-ring",
                      )}
                      aria-label={`Edit ${course.title}`}
                      onClick={(event) => openFromRow(event, course.id)}
                      onKeyDown={(event) => {
                        if (event.target !== event.currentTarget) return;
                        if (event.key !== "Enter" && event.key !== " ") return;
                        event.preventDefault();
                        openCourse(course.id);
                      }}
                    >
                      <TableCell className="py-3 pl-4">
                        <p
                          className="truncate text-sm font-medium"
                          title={course.title}
                        >
                          {course.title}
                        </p>
                      </TableCell>
                      <TableCell className="py-3">
                        <p className="truncate text-sm">
                          {start ?? "To be decided"}
                        </p>
                      </TableCell>
                      <TableCell className="py-3">
                        <p className="truncate text-sm" title={topics}>
                          {topics}
                        </p>
                      </TableCell>
                      <TableCell className="whitespace-nowrap py-3 pr-4 text-sm">
                        {course.batchSize}{" "}
                        {course.batchSize === 1 ? "student" : "students"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </section>
        </Card>
      )}
    </div>
  );
}
