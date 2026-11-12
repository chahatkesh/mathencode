"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Inbox,
  MailOpen,
  Plus,
  RefreshCw,
  Users,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { AdminPageHeader } from "~/components/admin/admin-page";
import type { AdminDashboardStats } from "~/types/admin-dashboard";

type AttentionItem = {
  href: string;
  icon: typeof Inbox;
  title: string;
  detail: string;
  count: number;
};

const shortcuts = [
  { href: "/admin/courses/new", text: "Create a course", icon: Plus },
  {
    href: "/admin/tests",
    text: "Manage diagnostic tests",
    icon: ClipboardList,
  },
  {
    href: "/admin/tests/submissions",
    text: "Explore student results",
    icon: ClipboardCheck,
  },
] as const;

function attentionItems(stats: AdminDashboardStats): AttentionItem[] {
  const items: AttentionItem[] = [];
  if (stats.nonContactedRequests > 0) {
    const count = stats.nonContactedRequests;
    items.push({
      href: "/admin/submissions",
      icon: Inbox,
      title: "Reply to families who reached out",
      detail:
        count === 1
          ? "1 family has not been contacted"
          : `${count.toLocaleString()} families have not been contacted`,
      count,
    });
  }
  if (stats.unseenSubmissions > 0) {
    const count = stats.unseenSubmissions;
    items.push({
      href: "/admin/tests/submissions",
      icon: ClipboardCheck,
      title: "Review unseen test results",
      detail:
        count === 1
          ? "1 submission has not been seen"
          : `${count.toLocaleString()} submissions have not been seen`,
      count,
    });
  }
  if (stats.pendingApplications > 0) {
    const count = stats.pendingApplications;
    items.push({
      href: "/admin/applications",
      icon: Users,
      title: "Meet your next tutors",
      detail:
        count === 1
          ? "1 pending application to review"
          : `${count.toLocaleString()} pending applications to review`,
      count,
    });
  }
  return items;
}

export default function AdminDashboard({
  initial,
}: {
  initial: AdminDashboardStats;
}) {
  const router = useRouter();
  const [stats, setStats] = useState(initial);
  const [loadedFrom, setLoadedFrom] = useState(initial);
  const [loading, setLoading] = useState(false);
  if (loadedFrom !== initial) {
    setLoadedFrom(initial);
    setStats(initial);
    setLoading(false);
  }

  const refresh = () => {
    setLoading(true);
    router.refresh();
  };

  const attention = stats
    ? stats.nonContactedRequests +
      stats.pendingApplications +
      stats.unseenSubmissions
    : 0;
  const waiting = loading && !stats;
  const tasks = stats ? attentionItems(stats) : [];
  const glance = [
    {
      key: "demoRequests" as const,
      title: "Demo requests",
      href: "/admin/submissions",
      icon: Inbox,
      caption: "All requests from families",
    },
    {
      key: "nonContactedRequests" as const,
      title: "Not contacted",
      href: "/admin/submissions",
      icon: MailOpen,
      caption: stats
        ? `Out of ${stats.demoRequests.toLocaleString()} requests`
        : "Still waiting for a first reply",
    },
    {
      key: "courses" as const,
      title: "Courses",
      href: "/admin/courses",
      icon: BookOpen,
      caption: "Your current course catalog",
    },
    {
      key: "tests" as const,
      title: "Diagnostic tests",
      href: "/admin/tests",
      icon: ClipboardList,
      caption: stats
        ? `${stats.publishedTests.toLocaleString()} published · ${Math.max(stats.tests - stats.publishedTests, 0).toLocaleString()} drafts`
        : "Course and placement tests",
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Overview"
        description="Who needs a reply, and how your classes and tests are doing."
      >
        <Button
          variant="outline"
          onClick={refresh}
          disabled={loading}
          aria-label="Refresh dashboard"
        >
          <RefreshCw className={loading ? "size-4 animate-spin" : "size-4"} />{" "}
          Refresh
        </Button>
        <Button asChild>
          <Link href="/admin/courses/new">
            <Plus className="size-4" /> Add course
          </Link>
        </Button>
      </AdminPageHeader>
      <section aria-labelledby="attention-heading" aria-busy={waiting}>
        <Card className={attention > 0 ? "border-admin-primary/40" : undefined}>
          <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
            <div>
              <h2
                id="attention-heading"
                className="text-base font-semibold leading-none tracking-tight"
              >
                Needs your attention
              </h2>
              <CardDescription className="mt-1.5">
                Start with the people waiting to hear from you.
              </CardDescription>
            </div>
            {waiting ? (
              <Skeleton className="h-6 w-20 rounded-full" />
            ) : stats ? (
              <Badge variant={attention ? "default" : "secondary"}>
                {attention ? `${attention.toLocaleString()} waiting` : "Clear"}
              </Badge>
            ) : null}
          </CardHeader>
          <CardContent>
            {waiting ? (
              <div className="space-y-3">
                <Skeleton className="h-[4.5rem] w-full" />
                <Skeleton className="h-[4.5rem] w-full" />
                <Skeleton className="h-[4.5rem] w-full" />
              </div>
            ) : !stats ? (
              <p className="text-sm text-admin-muted-foreground">
                Refresh the dashboard to see your next actions.
              </p>
            ) : tasks.length === 0 ? (
              <div className="flex items-start gap-3 rounded-lg border border-dashed border-admin-border p-5">
                <CheckCircle2 className="mt-0.5 size-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium">You’re all caught up</p>
                  <p className="mt-1 text-sm text-admin-muted-foreground">
                    No demo requests left to contact, no unseen test results,
                    and no pending tutor applications.
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-admin-border">
                {tasks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group flex items-center gap-3 rounded-lg px-2 py-4 outline-none hover:bg-admin-muted focus-visible:ring-2 focus-visible:ring-admin-ring"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-admin-accent text-admin-foreground">
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-admin-foreground">
                          {item.title}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-admin-muted-foreground">
                          {item.detail}
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className="min-w-8 text-right text-2xl font-semibold tabular-nums tracking-tight text-admin-foreground"
                      >
                        {item.count.toLocaleString()}
                      </span>
                      <ArrowRight
                        className="size-4 shrink-0 text-admin-muted-foreground transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(220px,0.8fr)]">
        <section aria-labelledby="glance-heading" aria-busy={waiting}>
          <div className="mb-3">
            <h2
              id="glance-heading"
              className="text-base font-semibold tracking-tight"
            >
              At a glance
            </h2>
            <p className="mt-1 text-sm text-admin-muted-foreground">
              Requests, classes, and tests across the workspace.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {glance.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-busy={waiting}
                  className="group rounded-admin outline-none focus-visible:ring-2 focus-visible:ring-admin-ring focus-visible:ring-offset-2"
                >
                  <Card className="h-full transition-colors group-hover:border-admin-primary/40 group-hover:bg-admin-muted/40">
                    <CardContent className="flex items-start gap-4 p-4 sm:p-5">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-admin-muted text-admin-foreground">
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-start justify-between gap-2">
                          <span className="text-sm font-medium text-admin-muted-foreground">
                            {item.title}
                          </span>
                          <ArrowUpRight
                            className="size-4 shrink-0 text-admin-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            aria-hidden="true"
                          />
                        </span>
                        {waiting ? (
                          <Skeleton className="mt-1 h-9 w-16" />
                        ) : (
                          <span className="mt-1 block text-3xl font-semibold tabular-nums tracking-tight text-admin-foreground">
                            {stats ? stats[item.key].toLocaleString() : "–"}
                          </span>
                        )}
                        <span className="mt-1 block min-h-10 text-xs leading-5 text-admin-muted-foreground">
                          {item.caption}
                        </span>
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
        <section aria-labelledby="shortcuts-heading">
          <div className="mb-3">
            <h2
              id="shortcuts-heading"
              className="text-base font-semibold tracking-tight"
            >
              Shortcuts
            </h2>
            <p className="mt-1 text-sm text-admin-muted-foreground">
              Less searching. More teaching.
            </p>
          </div>
          <div className="grid gap-2">
            {shortcuts.map(({ href, text, icon: Icon }) => (
              <Button
                key={href}
                asChild
                variant="outline"
                className="h-auto min-h-12 justify-start whitespace-normal px-4 py-3 text-left"
              >
                <Link href={href}>
                  <Icon className="size-4" />
                  {text}
                  <ArrowRight className="ml-auto size-4" />
                </Link>
              </Button>
            ))}
          </div>
        </section>
      </div>
      <p className="text-xs text-admin-muted-foreground" role="status">
        {loading
          ? "Updating your overview…"
          : stats
            ? `Last updated ${new Date(stats.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.`
            : "Numbers will appear when the dashboard is available."}
      </p>
    </div>
  );
}
