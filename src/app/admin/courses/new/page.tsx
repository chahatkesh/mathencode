import AdminCourseForm from "~/components/features/admin-course-form";
import { requireAdminPage } from "~/lib/auth";

export default async function NewCoursePage() {
  await requireAdminPage();
  return <AdminCourseForm />;
}
