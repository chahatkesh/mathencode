import { Suspense } from "react";
import { ProtectedRoute } from "~/components/admin";
import AdminCourses from "~/components/features/admin-courses";

export default function CoursesPage() {
  return (
    <ProtectedRoute>
      <Suspense
        fallback={
          <div className="flex flex-1 items-center justify-center text-sm text-dark/70">
            Loading courses
          </div>
        }
      >
        <AdminCourses />
      </Suspense>
    </ProtectedRoute>
  );
}
