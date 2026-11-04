import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminNavbar } from "~/components/admin";
import { getSession } from "~/lib/auth";
import { adminRobots } from "~/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  description: "MathEncode admin",
  robots: adminRobots,
  openGraph: {
    title: "Admin",
    description: "MathEncode admin",
  },
  twitter: {
    card: "summary",
    title: "Admin",
    description: "MathEncode admin",
  },
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
