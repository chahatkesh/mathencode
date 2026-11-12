import AdminTestSubmissions from "~/components/features/admin-test-submissions";
import { requireAdminPage } from "~/lib/auth";
import { listSubmissions } from "~/lib/diagnostics";

export default async function TestSubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  await requireAdminPage();
  const params = await searchParams;
  const query = new URLSearchParams();
  const page = Array.isArray(params.page) ? params.page[0] : params.page;
  if (page) query.set("page", page);
  const result = await listSubmissions(query);
  return (
    <AdminTestSubmissions
      key={result.page}
      initial={{
        items: result.items,
        page: result.page,
        pageSize: result.pageSize,
        total: result.total,
        pageCount: result.pageCount,
      }}
    />
  );
}
