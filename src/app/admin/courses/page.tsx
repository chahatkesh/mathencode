import { Suspense } from "react";
import { ProtectedRoute } from "~/components/admin";
import { AdminLoading } from "~/components/admin/admin-page";
import AdminCourses from "~/components/features/admin-courses";

function CoursesPending() {
  return <AdminLoading label="Loading courses" variant="page" columns={4} />;
}

export default function CoursesPage() {
  return (
    <ProtectedRoute pending={<CoursesPending />}>
      <Suspense fallback={<CoursesPending />}>
        <AdminCourses />
      </Suspense>
    </ProtectedRoute>
  );
}
