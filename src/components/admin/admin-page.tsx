"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, CircleAlert, Inbox, RefreshCw } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

export function AdminPageHeader({
  title,
  description,
  children,
  backHref,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
  backHref?: string;
}) {
  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0 space-y-2">
        {backHref && (
          <Button asChild variant="ghost" size="sm" className="-ml-3 mb-1">
            <Link href={backHref}>
              <ArrowLeft aria-hidden="true" />
              Back
            </Link>
          </Button>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-admin-foreground sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="max-w-2xl text-sm leading-6 text-admin-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="flex flex-wrap items-center gap-3">{children}</div>
      )}
    </header>
  );
}

export function AdminEmptyState({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-admin border border-dashed border-admin-border bg-admin-card px-6 py-14 text-center">
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-admin bg-admin-muted text-admin-muted-foreground">
        <Inbox className="h-6 w-6" aria-hidden="true" />
      </span>
      <h2 className="text-base font-semibold text-admin-foreground">{title}</h2>
      {description && (
        <p className="mt-2 max-w-md text-sm leading-6 text-admin-muted-foreground">
          {description}
        </p>
      )}
      {children && (
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          {children}
        </div>
      )}
    </div>
  );
}

export function AdminErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <Card className="border-admin-destructive/25">
      <CardContent className="flex flex-col items-start gap-4 pt-6 sm:flex-row sm:items-center">
        <CircleAlert
          className="h-5 w-5 shrink-0 text-admin-destructive"
          aria-hidden="true"
        />
        <div role="alert" className="flex-1">
          <h2 className="text-sm font-semibold text-admin-foreground">
            Something went wrong
          </h2>
          <p className="mt-1 text-sm leading-6 text-admin-muted-foreground">
            {message}
          </p>
        </div>
        {onRetry && (
          <Button variant="outline" onClick={onRetry}>
            <RefreshCw aria-hidden="true" /> Try again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

const HEAD_WIDTHS = ["w-16", "w-24", "w-14", "w-20", "w-16", "w-14"] as const;

function AdminHeaderSkeleton({
  back = false,
  actions = 0,
}: {
  back?: boolean;
  actions?: number;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0 space-y-2">
        {back ? <Skeleton className="mb-1 h-8 w-16" /> : null}
        <Skeleton className="h-8 w-56 max-w-full sm:h-9" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>
      {actions > 0 ? (
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: actions }, (_, index) => (
            <Skeleton key={index} className="h-11 w-28 rounded-admin" />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function AdminFieldSkeleton({ tall = false }: { tall?: boolean }) {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-28" />
      <Skeleton
        className={cn("w-full rounded-admin", tall ? "h-32" : "h-11")}
      />
    </div>
  );
}

export function AdminTableSkeleton({
  columns = 5,
  rows = 6,
}: {
  columns?: number;
  rows?: number;
}) {
  return (
    <Card className="overflow-hidden">
      <Table className="min-w-[48rem] table-fixed">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {Array.from({ length: columns }, (_, column) => (
              <TableHead
                key={column}
                className={cn(
                  column === 0 && "pl-4",
                  column === columns - 1 && "pr-4",
                )}
              >
                <Skeleton
                  className={cn(
                    "h-3",
                    HEAD_WIDTHS[column % HEAD_WIDTHS.length],
                  )}
                />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }, (_, row) => (
            <TableRow key={row} className="hover:bg-transparent">
              {Array.from({ length: columns }, (_, column) => (
                <TableCell
                  key={column}
                  className={cn(
                    "py-3.5",
                    column === 0 && "pl-4",
                    column === columns - 1 && "pr-4",
                  )}
                >
                  <Skeleton
                    className={cn(
                      "h-4",
                      ["w-3/5", "w-4/5", "w-2/3", "w-3/4"][(row + column) % 4],
                    )}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

function AdminFormSkeleton({ aside = false }: { aside?: boolean }) {
  const fields = (
    <div className="space-y-6">
      <Card>
        <CardHeader className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-64 max-w-full" />
        </CardHeader>
        <CardContent className="space-y-5">
          <AdminFieldSkeleton />
          <AdminFieldSkeleton tall />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-11 w-full rounded-admin" />
          <Skeleton className="h-11 w-full rounded-admin" />
          <Skeleton className="h-11 w-full rounded-admin" />
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div>
      <AdminHeaderSkeleton back actions={aside ? 1 : 0} />
      {aside ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(17.5rem,0.46fr)]">
          {fields}
          <Card className="h-fit">
            <CardHeader className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-48 max-w-full" />
            </CardHeader>
            <CardContent className="space-y-5">
              <AdminFieldSkeleton />
              <AdminFieldSkeleton />
            </CardContent>
          </Card>
        </div>
      ) : (
        fields
      )}
    </div>
  );
}

function AdminDetailSkeleton() {
  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-2">
          <Skeleton className="mb-1 h-8 w-16" />
          <Skeleton className="h-8 w-64 max-w-full sm:h-9" />
          <Skeleton className="h-4 w-full max-w-sm" />
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-36" />
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-28" />
              </div>
            ))}
          </CardContent>
        </Card>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-[4.75rem] rounded-admin" />
          ))}
        </div>
        <div className="space-y-2">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-full max-w-lg" />
        </div>
        <Card>
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/5" />
          </CardHeader>
          <CardContent className="space-y-2">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-12 w-full rounded-admin" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AdminDashboardSkeleton() {
  return (
    <div>
      <AdminHeaderSkeleton actions={2} />
      <div className="space-y-8">
        <Card>
          <CardHeader className="space-y-2">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-4 w-72 max-w-full" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-[4.5rem] w-full" />
            <Skeleton className="h-[4.5rem] w-full" />
            <Skeleton className="h-[4.5rem] w-full" />
          </CardContent>
        </Card>
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(220px,0.8fr)]">
          <div className="space-y-3">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-64 max-w-full" />
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }, (_, index) => (
                <Skeleton key={index} className="h-28 rounded-admin" />
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-12 w-full rounded-admin" />
            <Skeleton className="h-12 w-full rounded-admin" />
            <Skeleton className="h-12 w-full rounded-admin" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminLoading({
  label = "Loading…",
  variant = "page",
  columns = 5,
  rows = 6,
}: {
  label?: string;
  variant?: "page" | "table" | "form" | "editor" | "detail" | "dashboard";
  columns?: number;
  rows?: number;
}) {
  let body = <AdminTableSkeleton columns={columns} rows={rows} />;
  if (variant === "page") {
    body = (
      <div>
        <AdminHeaderSkeleton actions={1} />
        <AdminTableSkeleton columns={columns} rows={rows} />
      </div>
    );
  } else if (variant === "form") {
    body = <AdminFormSkeleton aside />;
  } else if (variant === "editor") {
    body = <AdminFormSkeleton />;
  } else if (variant === "detail") {
    body = <AdminDetailSkeleton />;
  } else if (variant === "dashboard") {
    body = <AdminDashboardSkeleton />;
  }

  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <p className="sr-only">{label}</p>
      <div aria-hidden="true">{body}</div>
    </div>
  );
}
