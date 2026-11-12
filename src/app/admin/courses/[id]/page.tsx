import { notFound } from "next/navigation";
import AdminCourseForm from "~/components/features/admin-course-form";
import { requireAdminPage } from "~/lib/auth";
import { getAdminCourse } from "~/lib/courses";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminPage();
  const { id } = await params;
  const course = await getAdminCourse(id);
  if (!course) notFound();
  return <AdminCourseForm courseId={id} initial={course} />;
}
