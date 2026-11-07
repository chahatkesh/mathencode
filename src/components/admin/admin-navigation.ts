import {
  BookOpen,
  ClipboardCheck,
  ClipboardList,
  Inbox,
  LayoutDashboard,
  Users,
} from "lucide-react";

export const ADMIN_LINKS = [
  {
    href: "/admin",
    label: "Overview",
    icon: LayoutDashboard,
    group: "Workspace",
  },
  {
    href: "/admin/submissions",
    label: "Demo requests",
    icon: Inbox,
    group: "Workspace",
  },
  {
    href: "/admin/applications",
    label: "Tutor applications",
    icon: Users,
    group: "Workspace",
  },
  {
    href: "/admin/courses",
    label: "Courses",
    icon: BookOpen,
    group: "Learning",
  },
  {
    href: "/admin/tests",
    label: "Diagnostic tests",
    icon: ClipboardList,
    group: "Learning",
  },
  {
    href: "/admin/tests/submissions",
    label: "Test results",
    icon: ClipboardCheck,
    group: "Learning",
  },
] as const;

export function activeAdminLink(pathname: string) {
  return [...ADMIN_LINKS]
    .sort((a, b) => b.href.length - a.href.length)
    .find((link) =>
      link.href === "/admin"
        ? pathname === link.href
        : pathname === link.href || pathname.startsWith(`${link.href}/`),
    );
}
