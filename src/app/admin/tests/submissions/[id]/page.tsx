import { ProtectedRoute } from "~/components/admin";
import { AdminLoading } from "~/components/admin/admin-page";
import AdminSubmissionDetail from "~/components/features/admin-submission-detail";

export default async function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <ProtectedRoute
      pending={<AdminLoading label="Loading submission" variant="detail" />}
    >
      <AdminSubmissionDetail submissionId={id} />
    </ProtectedRoute>
  );
}
