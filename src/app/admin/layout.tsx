import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminNavbar } from "~/components/admin";
import { getSession } from "~/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    return <div className="relative flex min-h-dvh flex-col">{children}</div>;
  }

  return (
    <div className="flex min-h-dvh flex-col bg-neutral">
      <AdminNavbar />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
