import FormSubmissions from "~/components/features/form-submissions";
import { requireAdminPage } from "~/lib/auth";
import { listFormSubmissions } from "~/lib/admin-inbox";
import { parseInboxPage } from "~/lib/inbox-page";

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  await requireAdminPage();
  const params = await searchParams;
  const page = parseInboxPage(params.page);
  const initial = await listFormSubmissions(page);
  return <FormSubmissions key={initial.page} initial={initial} />;
}
