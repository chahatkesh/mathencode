import { notFound } from "next/navigation";
import AdminSubmissionDetail from "~/components/features/admin-submission-detail";
import { requireAdminPage } from "~/lib/auth";
import { getSubmission } from "~/lib/diagnostics";

export default async function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminPage();
  const { id } = await params;
  const submission = await getSubmission(id);
  if (!submission) notFound();
  return <AdminSubmissionDetail initial={submission} />;
}
