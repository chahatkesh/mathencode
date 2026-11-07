import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminNavbar } from "~/components/admin";
import { getSession } from "~/lib/auth";
import { adminRobots } from "~/lib/seo";
import "~/styles/admin.css";
import "~/styles/admin-shell.css";

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
    return <div className="admin-site admin-root">{children}</div>;
  }

  return (
    <div className="admin-site admin-root">
      <a href="#admin-content" className="admin-skip">
        Skip to content
      </a>
      <AdminNavbar />
      <main id="admin-content" tabIndex={-1} className="admin-workspace">
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}
