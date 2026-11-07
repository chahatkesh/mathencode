import AdminDashboard from "~/components/admin/admin-dashboard";
import AdminLogin from "~/components/admin/admin-login";
import { getSession } from "~/lib/auth";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{
    reason?: string | string[];
    from?: string | string[];
  }>;
}) {
  const session = await getSession();
  if (session) return <AdminDashboard />;
  const params = await searchParams;
  return (
    <AdminLogin
      returnPath={typeof params.from === "string" ? params.from : undefined}
      sessionExpired={params.reason === "expired"}
    />
  );
}
