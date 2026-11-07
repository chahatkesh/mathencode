"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { isSafeAdminReturnPath } from "~/lib/admin-path";
import { AdminErrorState, AdminLoading } from "~/components/admin/admin-page";

function expiredLoginHref() {
  const from = `${window.location.pathname}${window.location.search}`;
  const params = new URLSearchParams({ reason: "expired" });
  if (isSafeAdminReturnPath(from) && window.location.pathname !== "/admin") {
    params.set("from", from);
  }
  return `/admin?${params.toString()}`;
}

export function ProtectedRoute({
  children,
  pending,
}: {
  children: ReactNode;
  pending?: ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [checkFailed, setCheckFailed] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      try {
        const response = await fetch("/api/auth/session");
        if (cancelled) return;

        if (response.status >= 500) {
          setCheckFailed(true);
          setIsLoading(false);
          return;
        }

        const data = (await response.json()) as { authenticated?: boolean };
        if (cancelled) return;

        if (!data.authenticated) {
          router.replace(expiredLoginHref());
          return;
        }

        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Session check failed:", error);
        if (cancelled) return;
        setCheckFailed(true);
        setIsLoading(false);
      }
    }

    void checkSession();

    return () => {
      cancelled = true;
    };
  }, [router, retryCount]);

  const waiting = pending ?? <AdminLoading label="Checking your session…" />;

  if (isLoading && !checkFailed) return waiting;

  if (checkFailed) {
    return (
      <AdminErrorState
        message="Couldn’t verify your session. Check your connection and try again."
        onRetry={() => {
          setIsLoading(true);
          setCheckFailed(false);
          setRetryCount((count) => count + 1);
        }}
      />
    );
  }

  if (!isAuthenticated) return waiting;

  return <>{children}</>;
}
