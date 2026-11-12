import { Suspense } from "react";
import { AdminLoading } from "~/components/admin/admin-page";
import AdminCourses from "~/components/features/admin-courses";
import { requireAdminPage } from "~/lib/auth";
import { listAdminCourses } from "~/lib/courses";

export default async function CoursesPage() {
  await requireAdminPage();
  const courses = await listAdminCourses();
  return (
    <Suspense
      fallback={
        <AdminLoading label="Loading courses" variant="page" columns={4} />
      }
    >
      <AdminCourses initial={courses} />
    </Suspense>
  );
}
