"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Mail,
  MessageCircle,
  Phone,
  Search,
} from "lucide-react";
import { ButtonLock } from "~/components/admin/button-lock";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export const READ_FILTERS = [
  { value: "all", label: "All messages" },
  { value: "unread", label: "Unread" },
  { value: "read", label: "Read" },
];
export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "name", label: "Name A–Z" },
];
export const PAGE_SIZE = 12;

type InboxRecord = {
  _id: string;
  name: string;
  createdAt: string;
  isRead?: boolean;
  contacted?: boolean;
};

export function useInbox<T extends InboxRecord>(endpoint: string) {
  const router = useRouter();
  const [records, setRecords] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const operation = useRef<AbortController | null>(null);

  const checkAuth = useCallback(
    (response: Response) => {
      if (response.status !== 401 && response.status !== 403) return;
      setRecords([]);
      const params = new URLSearchParams({
        reason: "expired",
        from: `${window.location.pathname}${window.location.search}`,
      });
      router.replace(`/admin?${params.toString()}`);
      throw new Error("Your session has expired. Please sign in again.");
    },
    [router],
  );

  const load = useCallback(() => {
    if (operation.current) return;
    const controller = new AbortController();
    operation.current = controller;
    return fetch(endpoint, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (response) => {
        if (controller.signal.aborted) return;
        checkAuth(response);
        if (!response.ok)
          throw new Error("Unable to load the inbox. Please try again.");
        const result = (await response.json()) as {
          success?: boolean;
          data?: T[];
        };
        if (!result.success || !Array.isArray(result.data))
          throw new Error("Unable to load the inbox. Please try again.");
        if (!controller.signal.aborted) setRecords(result.data);
      })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted)
          setError(
            cause instanceof Error
              ? cause.message
              : "Unable to load the inbox.",
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
        if (operation.current === controller) operation.current = null;
      });
  }, [checkAuth, endpoint]);

  useEffect(() => {
    void load();
    return () => {
      operation.current?.abort();
      operation.current = null;
    };
  }, [load]);

  async function refresh() {
    if (operation.current) return;
    setLoading(true);
    setError(null);
    setActionError(null);
    setNotice("");
    await load();
  }

  async function update(
    id: string,
    action: "read" | "status" | "contacted",
    body?: { status: string },
  ) {
    if (operation.current) return false;
    const controller = new AbortController();
    operation.current = controller;
    setBusyId(id);
    setActionError(null);
    setNotice("");
    try {
      const response = await fetch(
        `${endpoint}/${encodeURIComponent(id)}/${action}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          ...(body ? { body: JSON.stringify(body) } : {}),
          signal: controller.signal,
        },
      );
      checkAuth(response);
      if (!response.ok)
        throw new Error(
          "The change could not be saved. Refresh the inbox before trying again.",
        );
      const result = (await response.json()) as { success?: boolean; data?: T };
      const verified =
        action === "contacted"
          ? typeof result.data?.contacted === "boolean"
          : typeof result.data?.isRead === "boolean";
      if (
        !result.success ||
        !result.data ||
        result.data._id !== id ||
        !verified
      ) {
        throw new Error(
          "The change could not be verified. Refresh the inbox before trying again.",
        );
      }
      const updated = result.data;
      if (controller.signal.aborted) return false;
      setRecords((current) =>
        current.map((record) =>
          record._id === id ? { ...record, ...updated } : record,
        ),
      );
      setNotice(
        action === "contacted"
          ? `Marked as ${updated.contacted ? "contacted" : "non contacted"}.`
          : action === "read"
            ? `Marked as ${updated.isRead ? "read" : "unread"}.`
            : "Application status updated.",
      );
      return true;
    } catch (cause) {
      if (!controller.signal.aborted)
        setActionError(
          cause instanceof Error
            ? cause.message
            : "The change could not be saved.",
        );
      return false;
    } finally {
      if (!controller.signal.aborted) setBusyId(null);
      if (operation.current === controller) operation.current = null;
    }
  }

  return {
    records,
    loading,
    error,
    actionError,
    notice,
    busyId,
    refresh,
    update,
  };
}

export function matchesInboxSearch(
  values: readonly (string | undefined)[],
  search: string,
) {
  const query = search.trim().toLocaleLowerCase();
  return (
    !query || values.some((value) => value?.toLocaleLowerCase().includes(query))
  );
}

export function matchesInboxReadStatus(isRead: boolean, filter: string) {
  return filter === "read" ? isRead : filter === "unread" ? !isRead : true;
}

export function sortInbox<T extends InboxRecord>(records: T[], sort: string) {
  return [...records].sort((a, b) =>
    sort === "name"
      ? a.name.localeCompare(b.name)
      : (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) *
        (sort === "oldest" ? 1 : -1),
  );
}

export function inboxDate(value: string, withTime = false) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    ...(withTime ? { timeStyle: "short" as const } : {}),
  }).format(date);
}

export function InboxMetric({
  label,
  value,
  onClick,
  active = false,
}: {
  label: string;
  value: number | string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <Card className={active ? "border-admin-primary bg-admin-primary/5" : ""}>
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className="flex w-full flex-col gap-1 rounded-xl p-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-admin-ring sm:flex-row sm:items-center sm:justify-between"
      >
        <span className="text-sm text-admin-muted-foreground">{label}</span>
        <span className="text-2xl font-semibold tabular-nums text-admin-foreground">
          {value}
        </span>
      </button>
    </Card>
  );
}

export function InboxSearch({
  value,
  onChange,
  placeholder,
  inputRef,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  inputRef: React.Ref<HTMLInputElement>;
}) {
  const id = useId();
  return (
    <div className="min-w-0 flex-1 space-y-2">
      <Label htmlFor={id}>Search</Label>
      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-admin-muted-foreground"
        />
        <Input
          ref={inputRef}
          id={id}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="pl-9"
        />
      </div>
    </div>
  );
}

export function InboxSelect({
  label,
  value,
  onChange,
  options,
  disabled,
  triggerRef,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly { value: string; label: string }[];
  disabled?: boolean;
  triggerRef?: React.Ref<HTMLButtonElement>;
}) {
  const id = useId();
  return (
    <div className="min-w-0 space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger id={id} ref={triggerRef}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-w-[calc(100vw-2rem)]">
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="whitespace-normal [overflow-wrap:anywhere]"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function InboxPagination({
  page,
  total,
  onChange,
}: {
  page: number;
  total: number;
  onChange: (page: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  return (
    <nav
      aria-label="Inbox pages"
      className="flex flex-wrap items-center justify-between gap-3 border-t border-admin-border pt-4 text-sm"
    >
      <p className="text-admin-muted-foreground" aria-live="polite">
        {total ? (page - 1) * PAGE_SIZE + 1 : 0}–
        {Math.min(page * PAGE_SIZE, total)} of {total} results
      </p>
      <div className="flex items-center gap-2">
        <ButtonLock locked={page <= 1} reason="Already on the first page.">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={
              page <= 1 ? "Already on the first page" : "Previous page"
            }
            disabled={page <= 1}
            onClick={() => onChange(page - 1)}
          >
            <ChevronLeft />
          </Button>
        </ButtonLock>
        <span className="px-1 tabular-nums">
          {page} / {pages}
        </span>
        <ButtonLock locked={page >= pages} reason="Already on the last page.">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={
              page >= pages ? "Already on the last page" : "Next page"
            }
            disabled={page >= pages}
            onClick={() => onChange(page + 1)}
          >
            <ChevronRight />
          </Button>
        </ButtonLock>
      </div>
    </nav>
  );
}

export function ContactActions({
  email,
  phone,
  countryCode,
}: {
  email: string;
  phone: string;
  countryCode?: string;
}) {
  const [feedback, setFeedback] = useState("");
  const compact = phone.replace(/[\s().-]/g, "");
  const international = compact.startsWith("+")
    ? compact
    : compact.startsWith("00")
      ? `+${compact.slice(2)}`
      : countryCode && /^\d+$/.test(compact)
        ? `${countryCode}${compact.replace(/^0/, "")}`
        : "";
  const whatsapp = /^\+[1-9]\d{6,14}$/.test(international)
    ? international.slice(1)
    : null;
  const callable = /^\+?[\d]{6,15}$/.test(compact);
  async function copy(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setFeedback(`${label} copied.`);
    } catch {
      setFeedback(
        "Copy unavailable. Select the contact text and copy it manually.",
      );
    }
  }
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="min-w-0 rounded-lg border border-admin-border p-3">
          <p className="mb-1 text-xs font-medium text-admin-muted-foreground">
            Email
          </p>
          <a
            className="break-all text-sm underline underline-offset-4"
            href={`mailto:${email}`}
          >
            {email}
          </a>
          <div className="mt-2 flex flex-wrap gap-1">
            <Button asChild variant="outline" size="sm">
              <a href={`mailto:${email}`}>
                <Mail aria-hidden="true" />
                Email
              </a>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => void copy(email, "Email")}
              aria-label="Copy email"
            >
              <Copy aria-hidden="true" />
              Copy
            </Button>
          </div>
        </div>
        <div className="min-w-0 rounded-lg border border-admin-border p-3">
          <p className="mb-1 text-xs font-medium text-admin-muted-foreground">
            Phone
          </p>
          <p className="break-all text-sm">{phone}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {callable && (
              <Button asChild variant="outline" size="sm">
                <a href={`tel:${international || compact}`}>
                  <Phone aria-hidden="true" />
                  Call
                </a>
              </Button>
            )}
            {whatsapp && (
              <Button asChild variant="outline" size="sm">
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle aria-hidden="true" />
                  WhatsApp<span className="sr-only"> (opens in new tab)</span>
                </a>
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => void copy(phone, "Phone number")}
              aria-label="Copy phone number"
            >
              <Copy aria-hidden="true" />
              Copy
            </Button>
          </div>
          {!whatsapp && (
            <p className="mt-2 text-xs text-admin-muted-foreground">
              WhatsApp needs a number with a country code.
            </p>
          )}
        </div>
      </div>
      <p role="status" className="text-xs text-admin-muted-foreground">
        {feedback}
      </p>
    </div>
  );
}

export function exportInbox(
  filename: string,
  headings: string[],
  rows: string[][],
) {
  const escape = (value: string) => {
    const safe = /^[\s]*[=+\-@\t\r]/.test(value) ? `'${value}` : value;
    return `"${safe.replace(/"/g, '""')}"`;
  };
  const csv = [headings, ...rows]
    .map((row) => row.map(escape).join(","))
    .join("\r\n");
  const url = URL.createObjectURL(
    new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
