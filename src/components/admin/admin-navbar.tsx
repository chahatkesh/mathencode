"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ChevronRight,
  LogOut,
  Menu,
  PanelLeft,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  ADMIN_LINKS,
  activeAdminLink,
} from "~/components/admin/admin-navigation";

function Brand() {
  return (
    <Link
      href="/admin"
      className="admin-brand"
      aria-label="MathEncode admin overview"
    >
      <Image
        src="/logo_color.svg"
        alt=""
        width={34}
        height={34}
        style={{ width: "auto", height: 34 }}
        unoptimized
      />
      <span>
        Math<span className="text-orange-600">Encode</span>
        <small>ADMIN WORKSPACE</small>
      </span>
    </Link>
  );
}

function Navigation({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  const active = activeAdminLink(pathname);
  return (
    <nav aria-label="Admin navigation" className="admin-navigation">
      {["Workspace", "Learning"].map((group) => (
        <div key={group} className="admin-nav-group">
          <p>{group}</p>
          {ADMIN_LINKS.filter((link) => link.group === group).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              aria-current={active?.href === link.href ? "page" : undefined}
            >
              <link.icon aria-hidden className="size-[18px]" />
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
}

export function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");
  const current = activeAdminLink(pathname);
  const detail = current && pathname !== current.href;

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpenPath(null);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  async function logout() {
    if (loggingOut) return;
    setLoggingOut(true);
    setError("");
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("Sign out failed. Please try again.");
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Couldn’t sign out. Please try again.");
      setLoggingOut(false);
    }
  }

  const footer = (
    <div className="admin-sidebar-footer">
      <Button
        asChild
        variant="ghost"
        className="w-full justify-start text-admin-muted-foreground"
      >
        <Link href="/" target="_blank" rel="noopener noreferrer">
          <ArrowUpRight className="size-4" />
          View public website
        </Link>
      </Button>
      <Button
        variant="ghost"
        onClick={() => void logout()}
        disabled={loggingOut}
        className="w-full justify-start text-admin-muted-foreground"
      >
        <LogOut className="size-4" />
        {loggingOut ? "Signing out…" : "Sign out"}
      </Button>
      {error ? (
        <p role="alert" className="mt-2 px-3 text-xs text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );

  return (
    <>
      <aside className="admin-sidebar">
        <Brand />
        <Navigation pathname={pathname} />
        {footer}
      </aside>
      <header className="admin-topbar">
        <div className="flex min-w-0 items-center gap-3">
          <Dialog
            open={openPath === pathname}
            onOpenChange={(open) => setOpenPath(open ? pathname : null)}
          >
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="admin-mobile-toggle"
                aria-label="Open navigation"
              >
                <Menu className="size-5" />
              </Button>
            </DialogTrigger>
            <DialogContent
              className="admin-mobile-dialog"
              onOpenAutoFocus={(event) => {
                event.preventDefault();
                document
                  .querySelector<HTMLElement>(
                    ".admin-mobile-dialog nav a[aria-current]",
                  )
                  ?.focus();
              }}
            >
              <DialogHeader className="sr-only">
                <DialogTitle>Admin navigation</DialogTitle>
                <DialogDescription>
                  Choose a workspace or learning section.
                </DialogDescription>
              </DialogHeader>
              <Brand />
              <Navigation
                pathname={pathname}
                onNavigate={() => setOpenPath(null)}
              />
              {footer}
            </DialogContent>
          </Dialog>
          <PanelLeft
            className="hidden size-4 shrink-0 text-admin-muted-foreground lg:block"
            aria-hidden
          />
          <nav
            aria-label="Breadcrumb"
            className="flex min-w-0 items-center gap-2 text-sm"
          >
            <Link
              href="/admin"
              className="hidden text-admin-muted-foreground hover:text-admin-foreground sm:block"
            >
              Workspace
            </Link>
            <ChevronRight
              className="hidden size-3.5 text-admin-muted-foreground sm:block"
              aria-hidden
            />
            {detail && current ? (
              <>
                <Link
                  href={current.href}
                  className="truncate text-admin-muted-foreground"
                >
                  {current.label}
                </Link>
                <ChevronRight
                  className="size-3.5 shrink-0 text-admin-muted-foreground"
                  aria-hidden
                />
                <span className="truncate font-medium">
                  {pathname.endsWith("/new")
                    ? "New course"
                    : pathname.includes("/submissions/")
                      ? "Submission"
                      : "Edit"}
                </span>
              </>
            ) : (
              <span className="truncate font-medium">
                {current?.label ?? "Admin"}
              </span>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}
