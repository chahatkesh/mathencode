import { ProtectedRoute } from "~/components/admin";
import AdminCourseForm from "~/components/features/admin-course-form";

export default function NewCoursePage() {
  return (
    <ProtectedRoute>
      <AdminCourseForm />
    </ProtectedRoute>
  );
}
