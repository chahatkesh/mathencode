"use client";

import { useRef, useState } from "react";
import { RefreshCw } from "lucide-react";
import type { TutorApplicationRecord, TutorApplicationStatus } from "~/types";
import {
  AdminEmptyState,
  AdminErrorState,
  AdminLoading,
  AdminPageHeader,
} from "~/components/admin/admin-page";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import {
  ContactActions,
  InboxPagination,
  InboxSelect,
  PAGE_SIZE,
  inboxDate,
  sortInbox,
  useInbox,
} from "~/components/admin/inbox-controls";
import { Badge } from "~/components/ui/badge";
import { ButtonLock } from "~/components/admin/button-lock";
import { Button, buttonVariants } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

const STATUSES: { value: TutorApplicationStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "reviewing", label: "Reviewing" },
  { value: "interviewed", label: "Interviewed" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
];

function StatusBadge({ status }: { status: TutorApplicationStatus }) {
  const tones = {
    pending: "border-orange-200 bg-orange-50 text-orange-800",
    reviewing: "border-blue-200 bg-blue-50 text-blue-800",
    interviewed: "border-violet-200 bg-violet-50 text-violet-800",
    accepted: "border-green-200 bg-green-50 text-green-800",
    rejected: "border-admin-border bg-admin-muted text-admin-muted-foreground",
  };
  return (
    <Badge variant="outline" className={tones[status]}>
      {STATUSES.find((item) => item.value === status)?.label || status}
    </Badge>
  );
}

export default function TutorApplications() {
  const {
    records: applications,
    loading,
    error,
    actionError,
    notice,
    busyId,
    refresh,
    update,
  } = useInbox<TutorApplicationRecord>("/api/tutor-applications");
  const [page, setPage] = useState(1);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const openerRef = useRef<HTMLTableRowElement | null>(null);
  const statusTriggerRef = useRef<HTMLButtonElement>(null);
  const active = applications.find((item) => item._id === activeId);
  const rejecting = applications.find((item) => item._id === rejectId);
  const ordered = sortInbox(applications, "newest");
  const currentPage = Math.min(
    page,
    Math.max(1, Math.ceil(ordered.length / PAGE_SIZE)),
  );
  const visible = ordered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const disabled = loading || busyId !== null;
  function openDetails(item: TutorApplicationRecord, row: HTMLTableRowElement) {
    openerRef.current = row;
    setActiveId(item._id);
  }
  function changeStatus(id: string, nextStatus: string) {
    if (!STATUSES.some((item) => item.value === nextStatus)) return;
    if (applications.find((item) => item._id === id)?.status === nextStatus)
      return;
    if (nextStatus === "rejected") setRejectId(id);
    else void update(id, "status", { status: nextStatus });
  }
  async function confirmRejection() {
    if (!rejecting) return;
    if (await update(rejecting._id, "status", { status: "rejected" }))
      setRejectId(null);
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Tutor applications"
        description="Review candidates and keep the next step clear."
      >
        <ButtonLock
          locked={!loading && busyId !== null}
          reason="Wait until the current change finishes saving."
        >
          <Button
            type="button"
            variant="outline"
            onClick={() => void refresh()}
            disabled={disabled}
          >
            <RefreshCw
              aria-hidden="true"
              className={loading ? "animate-spin" : ""}
            />
            {loading ? "Refreshing" : "Refresh"}
          </Button>
        </ButtonLock>
      </AdminPageHeader>

      {error && (
        <AdminErrorState message={error} onRetry={() => void refresh()} />
      )}
      {actionError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          {actionError}
        </div>
      )}
      <p role="status" className="sr-only">
        {notice}
      </p>

      {loading && !applications.length ? (
        <AdminLoading
          label="Loading tutor applications…"
          variant="table"
          columns={6}
        />
      ) : !error && !ordered.length ? (
        <AdminEmptyState
          title="No tutor applications yet"
          description="New tutor applications will appear here, ready for review."
        />
      ) : ordered.length > 0 ? (
        <Card className="overflow-hidden">
          <section aria-label="Tutor applications" aria-busy={loading}>
            <Table className="min-w-[52rem] table-fixed">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[18%] pl-4" scope="col">
                    Candidate
                  </TableHead>
                  <TableHead className="w-[24%]" scope="col">
                    Email
                  </TableHead>
                  <TableHead className="w-[16%]" scope="col">
                    Number
                  </TableHead>
                  <TableHead className="w-[16%]" scope="col">
                    Subjects
                  </TableHead>
                  <TableHead className="w-[14%]" scope="col">
                    Status
                  </TableHead>
                  <TableHead className="w-[12%] pr-4" scope="col">
                    Applied
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((item) => (
                  <TableRow
                    key={item._id}
                    tabIndex={0}
                    className="cursor-pointer focus-visible:bg-admin-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-admin-ring"
                    aria-label={`Open application from ${item.name}`}
                    onClick={(event) => openDetails(item, event.currentTarget)}
                    onKeyDown={(event) => {
                      if (event.key !== "Enter" && event.key !== " ") return;
                      event.preventDefault();
                      openDetails(item, event.currentTarget);
                    }}
                  >
                    <TableCell className="py-3 pl-4">
                      <p
                        className="truncate text-sm font-medium"
                        title={item.name}
                      >
                        {item.name}
                      </p>
                    </TableCell>
                    <TableCell className="py-3">
                      <p className="truncate text-sm" title={item.email}>
                        {item.email}
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
                      <p className="truncate text-sm" title={item.subject}>
                        {item.subject}
                      </p>
                    </TableCell>
                    <TableCell className="whitespace-nowrap py-3">
                      <StatusBadge status={item.status} />
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
            {ordered.length > PAGE_SIZE && (
              <div className="px-4 pb-3">
                <InboxPagination
                  page={currentPage}
                  total={ordered.length}
                  onChange={setPage}
                />
              </div>
            )}
          </section>
        </Card>
      ) : null}

      <Dialog
        open={Boolean(active)}
        onOpenChange={(open) => {
          if (!open) setActiveId(null);
        }}
      >
        <DialogContent
          className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl grid-cols-[minmax(0,1fr)] overflow-y-auto [&>*]:min-w-0"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            openerRef.current?.focus();
          }}
        >
          {active && (
            <>
              <DialogHeader className="pr-6">
                <DialogTitle className="break-words">{active.name}</DialogTitle>
                <DialogDescription>
                  Tutor application · {inboxDate(active.createdAt, true)}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={active.status} />
                <span className="min-w-0 max-w-full break-words text-sm text-admin-muted-foreground">
                  {active.subject}
                </span>
              </div>
              <ContactActions
                key={active._id}
                email={active.email}
                phone={active.contactNumber}
              />
              <section aria-label="Application message" className="space-y-2">
                <h3 className="text-sm font-semibold">Message</h3>
                <p className="whitespace-pre-wrap break-words rounded-lg bg-admin-muted p-4 text-sm leading-7">
                  {active.message || "No message provided."}
                </p>
              </section>
              <div className="space-y-2 rounded-lg border border-admin-border p-4">
                <InboxSelect
                  label="Application status"
                  triggerRef={statusTriggerRef}
                  value={active.status}
                  onChange={(value) => changeStatus(active._id, value)}
                  options={STATUSES}
                  disabled={disabled}
                />
                <p className="text-xs text-admin-muted-foreground">
                  Status changes save immediately. No email is sent to the
                  candidate.
                </p>
              </div>
              {actionError && (
                <p role="alert" className="text-sm text-red-700">
                  {actionError}
                </p>
              )}
              <p role="status" className="text-xs text-admin-muted-foreground">
                {busyId === active._id ? "Saving changes…" : notice}
              </p>
              <DialogFooter>
                <DialogClose asChild>
                  <Button>Done</Button>
                </DialogClose>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={Boolean(rejecting)}
        onOpenChange={(open) => {
          if (!open && !busyId) setRejectId(null);
        }}
      >
        <AlertDialogContent
          className="w-[calc(100%-2rem)] max-w-md grid-cols-[minmax(0,1fr)] [&>*]:min-w-0"
          aria-busy={busyId !== null}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            statusTriggerRef.current?.focus();
          }}
          onEscapeKeyDown={(event) => {
            if (busyId) event.preventDefault();
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Reject this application?</AlertDialogTitle>
            <AlertDialogDescription className="break-words">
              Change {rejecting?.name || "this candidate"}'s status to rejected?
              This does not delete the application or send an email. You can
              change the status again later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {actionError && (
            <p role="alert" className="text-sm text-red-700">
              {actionError}
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busyId !== null}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={busyId !== null}
              className={buttonVariants({ variant: "destructive" })}
              onClick={(event) => {
                event.preventDefault();
                void confirmRejection();
              }}
            >
              {busyId ? "Saving…" : "Reject application"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
