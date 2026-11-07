import { ProtectedRoute } from "~/components/admin";
import { AdminLoading } from "~/components/admin/admin-page";
import AdminCourseForm from "~/components/features/admin-course-form";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <ProtectedRoute
      pending={<AdminLoading label="Loading course" variant="form" />}
    >
      <AdminCourseForm courseId={id} />
    </ProtectedRoute>
  );
}
