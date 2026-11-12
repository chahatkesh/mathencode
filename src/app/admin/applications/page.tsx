import TutorApplications from "~/components/features/tutor-applications";
import { requireAdminPage } from "~/lib/auth";
import { listTutorApplications } from "~/lib/admin-inbox";
import { parseInboxPage } from "~/lib/inbox-page";

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  await requireAdminPage();
  const params = await searchParams;
  const page = parseInboxPage(params.page);
  const initial = await listTutorApplications(page);
  return <TutorApplications key={initial.page} initial={initial} />;
}
