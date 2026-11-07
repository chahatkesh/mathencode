import { ProtectedRoute } from "~/components/admin";
import { AdminLoading } from "~/components/admin/admin-page";
import AdminCourseForm from "~/components/features/admin-course-form";

export default function NewCoursePage() {
  return (
    <ProtectedRoute
      pending={<AdminLoading label="Loading course" variant="form" />}
    >
      <AdminCourseForm />
    </ProtectedRoute>
  );
}
