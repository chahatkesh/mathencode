import AdminTests from "~/components/features/admin-tests";
import { requireAdminPage } from "~/lib/auth";
import { listAdminTests } from "~/lib/diagnostics";

export default async function TestsPage() {
  await requireAdminPage();
  return <AdminTests initial={await listAdminTests()} />;
}
