import { ProtectedRoute } from "~/components/admin";
import { AdminLoading } from "~/components/admin/admin-page";
import AdminTestEditor from "~/components/features/admin-test-editor";

export default async function TestEditorPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  return (
    <ProtectedRoute
      pending={<AdminLoading label="Loading test" variant="editor" />}
    >
      <AdminTestEditor courseId={courseId} />
    </ProtectedRoute>
  );
}
