"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AdminPageHeader,
  AdminEmptyState,
  AdminErrorState,
  AdminLoading,
} from "~/components/admin/admin-page";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
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
import type { AdminTestListItem } from "~/types";

function testStatus(item: AdminTestListItem) {
  if (!item.test) return "Not created";
  return item.test.published ? "Published" : "Draft";
}

export default function AdminTests() {
  const router = useRouter();
  const [items, setItems] = useState<AdminTestListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
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
  }, [reload]);

  function openTest(id: string) {
    router.push(`/admin/tests/${id}`);
  }

  function openFromRow(event: MouseEvent<HTMLTableRowElement>, id: string) {
    const target = event.target;
    if (target instanceof Element && target.closest("a, button")) return;
    openTest(id);
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Diagnostic tests"
        description="One test per course. Open a row to create or edit it."
      />
      {error ? (
        <AdminErrorState
          message={error}
          onRetry={() => setReload((value) => value + 1)}
        />
      ) : null}
      {loading ? (
        <AdminLoading label="Loading tests" variant="table" columns={5} />
      ) : error && items.length === 0 ? null : items.length === 0 ? (
        <AdminEmptyState
          title="No courses available"
          description="Create a course to start building its diagnostic test."
        >
          <Button asChild>
            <Link href="/admin/courses/new">Add course</Link>
          </Button>
        </AdminEmptyState>
      ) : (
        <Card className="overflow-hidden">
          <section aria-label="Diagnostic tests">
            <Table className="min-w-[48rem] table-fixed">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[28%] pl-4" scope="col">
                    Course
                  </TableHead>
                  <TableHead className="w-[28%]" scope="col">
                    Test
                  </TableHead>
                  <TableHead className="w-[14%]" scope="col">
                    Questions
                  </TableHead>
                  <TableHead className="w-[14%]" scope="col">
                    Time
                  </TableHead>
                  <TableHead className="w-[16%] pr-4" scope="col">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => {
                  const status = testStatus(item);
                  return (
                    <TableRow
                      key={item.course.id}
                      tabIndex={0}
                      className={cn(
                        "cursor-pointer focus-visible:bg-admin-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-admin-ring",
                      )}
                      aria-label={`${item.test ? "Edit" : "Create"} test for ${item.course.title}`}
                      onClick={(event) => openFromRow(event, item.course.id)}
                      onKeyDown={(event) => {
                        if (event.target !== event.currentTarget) return;
                        if (event.key !== "Enter" && event.key !== " ") return;
                        event.preventDefault();
                        openTest(item.course.id);
                      }}
                    >
                      <TableCell className="py-3 pl-4">
                        <p
                          className="truncate text-sm font-medium"
                          title={item.course.title}
                        >
                          {item.course.title}
                        </p>
                      </TableCell>
                      <TableCell className="py-3">
                        <p
                          className="truncate text-sm"
                          title={item.test?.title ?? "Not created"}
                        >
                          {item.test?.title ?? "Not created"}
                        </p>
                      </TableCell>
                      <TableCell className="py-3 text-sm tabular-nums">
                        {item.test ? item.test.questionCount : "—"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap py-3 text-sm">
                        {item.test?.timeLimitMinutes
                          ? `${item.test.timeLimitMinutes} min`
                          : "—"}
                      </TableCell>
                      <TableCell className="py-3 pr-4">
                        <Badge
                          variant={
                            status === "Published" ? "default" : "secondary"
                          }
                        >
                          {status}
                        </Badge>
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
