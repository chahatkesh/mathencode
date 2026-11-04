import { ProtectedRoute } from "~/components/admin";
import AdminSubmissionDetail from "~/components/features/admin-submission-detail";

export default async function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <ProtectedRoute>
      <AdminSubmissionDetail submissionId={id} />
    </ProtectedRoute>
  );
}
