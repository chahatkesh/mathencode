"use client";

import { useState, type MouseEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { redirectIfExpired } from "~/components/admin/expired-session";
import {
  AdminPageHeader,
  AdminEmptyState,
} from "~/components/admin/admin-page";
import { ButtonLock } from "~/components/admin/button-lock";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "~/components/ui/table";
import { cn } from "~/lib/utils";
import { inboxDate } from "~/components/admin/inbox-controls";
import type { DiagnosticSubmissionSummary } from "~/types";

type PageInfo = {
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
};

export default function AdminTestSubmissions({
  initial,
}: {
  initial: PageInfo & { items: DiagnosticSubmissionSummary[] };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [items, setItems] = useState(initial.items);
  const [pageInfo, setPageInfo] = useState<PageInfo>(initial);
  const [loadedFrom, setLoadedFrom] = useState(initial);
  if (loadedFrom !== initial) {
    setLoadedFrom(initial);
    setItems(initial.items);
    setPageInfo(initial);
  }
  const [actionError, setActionError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  function openPage(next: number) {
    const params = new URLSearchParams();
    if (next > 1) params.set("page", String(next));
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  function openSubmission(id: string) {
    router.push(`/admin/tests/submissions/${id}`);
  }

  function openFromRow(event: MouseEvent<HTMLTableRowElement>, id: string) {
    const target = event.target;
    if (target instanceof Element && target.closest("button, [role='switch']"))
      return;
    openSubmission(id);
  }

  async function toggleSeen(item: DiagnosticSubmissionSummary) {
    if (busyId) return;
    setBusyId(item.id);
    setActionError("");
    try {
      const response = await fetch(
        `/api/admin/test-submissions/${item.id}/seen`,
        { method: "PATCH" },
      );
      if (redirectIfExpired(response, (href) => router.replace(href))) return;
      const body = (await response.json()) as {
        success?: boolean;
        message?: string;
        data?: { seen?: boolean };
      };
      if (
        !response.ok ||
        !body.success ||
        typeof body.data?.seen !== "boolean"
      ) {
        setActionError(body.message || "Could not update seen status.");
        return;
      }
      const seen = body.data.seen;
      setItems((current) =>
        current.map((row) => (row.id === item.id ? { ...row, seen } : row)),
      );
    } catch (toggleError) {
      console.error("Error updating seen status:", toggleError);
      setActionError("Could not update seen status.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Test results"
        description="Review diagnostic results. Mark a submission seen only after you have looked at it."
      />
      {actionError ? (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          {actionError}
        </div>
      ) : null}
      {items.length === 0 ? (
        <AdminEmptyState
          title="No submissions yet"
          description="Completed student diagnostic tests will appear here."
        />
      ) : (
        <Card className="overflow-hidden">
          <section aria-label="Test submissions">
            <Table className="min-w-[52rem] table-fixed">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[18%] pl-4" scope="col">
                    Student
                  </TableHead>
                  <TableHead className="w-[16%]" scope="col">
                    Number
                  </TableHead>
                  <TableHead className="w-[22%]" scope="col">
                    Course
                  </TableHead>
                  <TableHead className="w-[10%]" scope="col">
                    Score
                  </TableHead>
                  <TableHead className="w-[18%]" scope="col">
                    Seen
                  </TableHead>
                  <TableHead className="w-[16%] pr-4" scope="col">
                    Submitted
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow
                    key={item.id}
                    tabIndex={0}
                    className={cn(
                      "cursor-pointer focus-visible:bg-admin-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-admin-ring",
                      !item.seen && "bg-admin-primary/[0.04]",
                    )}
                    aria-label={`Open submission from ${item.studentName}`}
                    onClick={(event) => openFromRow(event, item.id)}
                    onKeyDown={(event) => {
                      if (event.target !== event.currentTarget) return;
                      if (event.key !== "Enter" && event.key !== " ") return;
                      event.preventDefault();
                      openSubmission(item.id);
                    }}
                  >
                    <TableCell className="py-3 pl-4">
                      <p
                        className={
                          item.seen
                            ? "truncate text-sm font-medium"
                            : "truncate text-sm font-semibold"
                        }
                        title={item.studentName}
                      >
                        {item.studentName}
                      </p>
                    </TableCell>
                    <TableCell className="py-3">
                      <p
                        className="truncate text-sm"
                        title={item.contactNumber}
                      >
                        {item.contactNumber}
                      </p>
                    </TableCell>
                    <TableCell className="py-3">
                      <p
                        className="truncate text-sm"
                        title={`${item.courseTitle} · ${item.testTitle}`}
                      >
                        {item.courseTitle}
                      </p>
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge variant="secondary" className="tabular-nums">
                        {item.percentage}%
                      </Badge>
                    </TableCell>
                    <TableCell
                      className="py-3"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={item.seen === true}
                          disabled={busyId !== null}
                          onCheckedChange={() => void toggleSeen(item)}
                          aria-label={`Mark ${item.studentName}'s submission as ${item.seen ? "unseen" : "seen"}`}
                        />
                        <span className="whitespace-nowrap text-xs text-admin-muted-foreground">
                          {item.seen ? "Seen" : "Unseen"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap py-3 pr-4 text-xs text-admin-muted-foreground">
                      <time dateTime={item.createdAt}>
                        {inboxDate(item.createdAt)}
                      </time>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {pageInfo.pageCount > 1 ? (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-admin-border px-4 py-3">
                <p className="text-sm text-admin-muted-foreground">
                  {pageInfo.total} submissions
                </p>
                <nav
                  aria-label="Submission pages"
                  className="flex items-center gap-2"
                >
                  <ButtonLock
                    locked={pageInfo.page <= 1}
                    reason="Already on the first page."
                  >
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => openPage(pageInfo.page - 1)}
                      disabled={pageInfo.page <= 1}
                    >
                      Previous
                    </Button>
                  </ButtonLock>
                  <span className="px-1 text-xs tabular-nums text-admin-muted-foreground">
                    {pageInfo.page} / {pageInfo.pageCount}
                  </span>
                  <ButtonLock
                    locked={pageInfo.page >= pageInfo.pageCount}
                    reason="Already on the last page."
                  >
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => openPage(pageInfo.page + 1)}
                      disabled={pageInfo.page >= pageInfo.pageCount}
                    >
                      Next
                    </Button>
                  </ButtonLock>
                </nav>
              </div>
            ) : null}
          </section>
        </Card>
      )}
    </div>
  );
}
