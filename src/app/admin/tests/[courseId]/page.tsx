import { ProtectedRoute } from "~/components/admin";
import AdminTestEditor from "~/components/features/admin-test-editor";

export default async function TestEditorPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  return (
    <ProtectedRoute>
      <AdminTestEditor courseId={courseId} />
    </ProtectedRoute>
  );
}
