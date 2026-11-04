import { ProtectedRoute } from "~/components/admin";
import AdminCourseForm from "~/components/features/admin-course-form";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <ProtectedRoute>
      <AdminCourseForm courseId={id} />
    </ProtectedRoute>
  );
}
