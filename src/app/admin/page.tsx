"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BookOpen,
  ClipboardList,
  FileText,
  Loader2,
  LogOut,
  Users,
} from "lucide-react";
import { isSafeAdminReturnPath } from "~/lib/admin-path";

const DASHBOARD_LINKS = [
  {
    href: "/admin/courses",
    title: "Courses",
    description: "Add, edit, and manage courses",
    icon: BookOpen,
  },
  {
    href: "/admin/tests",
    title: "Tests",
    description: "Manage diagnostic tests and results",
    icon: ClipboardList,
  },
  {
    href: "/admin/submissions",
    title: "Form submissions",
    description: "Review demo class requests",
    icon: FileText,
  },
  {
    href: "/admin/applications",
    title: "Tutor applications",
    description: "Review and update teaching applications",
    icon: Users,
  },
];

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center text-sm text-dark/70">
          Checking session
        </div>
      }
    >
      <AdminPageInner />
    </Suspense>
  );
}

function AdminPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sessionExpired = searchParams.get("reason") === "expired";
  const returnPath = searchParams.get("from");
  const pendingReturnPath = useRef<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        const data = (await response.json()) as { authenticated?: boolean };
        if (data.authenticated) setIsAuthenticated(true);
      } catch (sessionError) {
        console.error("Session check failed:", sessionError);
      } finally {
        setIsLoading(false);
      }
    };

    void checkSession();
  }, []);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!username.trim() || !password || isSubmitting) return;

    setIsSubmitting(true);
    setError("");
    let succeeded = false;

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = (await response.json()) as {
        success?: boolean;
        error?: string;
      };

      if (data.success) {
        succeeded = true;
        pendingReturnPath.current =
          returnPath &&
          isSafeAdminReturnPath(returnPath) &&
          returnPath.startsWith("/admin/")
            ? returnPath
            : null;
        router.refresh();
        setIsAuthenticated(true);
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (loginError) {
      console.error("Login error:", loginError);
      setError("Something went wrong. Try again.");
    } finally {
      if (!succeeded) setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !isSubmitting) return;

    let cancelled = false;
    const hasNavbar = () =>
      Boolean(document.querySelector('[aria-label="Admin navigation"]'));

    const reveal = () => {
      if (cancelled) return;
      const destination = pendingReturnPath.current;
      if (destination) {
        pendingReturnPath.current = null;
        if (hasNavbar()) router.replace(destination);
        else window.location.assign(destination);
        return;
      }
      setIsSubmitting(false);
    };

    if (hasNavbar()) {
      reveal();
      return;
    }

    const observer = new MutationObserver(() => {
      if (hasNavbar()) {
        observer.disconnect();
        reveal();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    const fallback = window.setTimeout(reveal, 800);

    return () => {
      cancelled = true;
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [isAuthenticated, isSubmitting, router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsAuthenticated(false);
      setUsername("");
      setPassword("");
      router.refresh();
    } catch (logoutError) {
      console.error("Logout error:", logoutError);
    }
  };

  if (isLoading || (isAuthenticated && isSubmitting)) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-dark/70">
        {isAuthenticated ? "Loading dashboard" : "Checking session"}
      </div>
    );
  }

  if (!isAuthenticated) {
    const canSubmit = Boolean(username.trim() && password) && !isSubmitting;

    return (
      <div className="flex min-h-dvh items-center justify-center bg-neutral px-6">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-custom"
          noValidate
          aria-label="Admin sign in"
        >
          <h1 className="text-2xl font-bold text-primary">
            Math<span className="text-secondary">Encode</span>
          </h1>
          <p className="mt-1 text-sm text-dark/60">Admin sign in</p>
          {sessionExpired ? (
            <p role="status" className="mt-4 text-center text-xs text-dark/60">
              Session expired. Sign in to continue.
            </p>
          ) : null}
          <div className="mt-6 space-y-4">
            <label
              className="block text-sm font-medium text-dark"
              htmlFor="username"
            >
              Username
              <input
                id="username"
                type="text"
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);
                  if (error) setError("");
                }}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-primary"
                autoComplete="username"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                required
                disabled={isSubmitting}
                autoFocus
              />
            </label>
            <label
              className="block text-sm font-medium text-dark"
              htmlFor="password"
            >
              Password
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (error) setError("");
                }}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-primary"
                autoComplete="current-password"
                required
                disabled={isSubmitting}
              />
            </label>
          </div>
          <button
            type="submit"
            className="mt-6 flex h-11 w-full items-center justify-center rounded-lg bg-primary text-sm font-semibold text-white disabled:opacity-60"
            disabled={!canSubmit}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Signing in
              </>
            ) : (
              "Continue"
            )}
          </button>
          <p
            role="alert"
            className="mt-3 min-h-4 text-center text-xs text-red-600"
          >
            {error || "\u00A0"}
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="container-custom flex flex-1 flex-col justify-center py-10">
      <h1 className="text-3xl font-bold text-dark">Dashboard</h1>
      <p className="mt-2 text-dark/70">
        Courses, diagnostic tests, demo requests, and tutor applications.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {DASHBOARD_LINKS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <Icon className="size-5 text-primary" />
              <h2 className="mt-4 text-lg font-bold text-dark">{item.title}</h2>
              <p className="mt-1 text-sm text-dark/70">{item.description}</p>
            </Link>
          );
        })}
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <LogOut className="size-5 text-primary" />
          <h2 className="mt-4 text-lg font-bold text-dark">Log out</h2>
          <p className="mt-1 text-sm text-dark/70">End this admin session.</p>
        </button>
      </div>
    </div>
  );
}
