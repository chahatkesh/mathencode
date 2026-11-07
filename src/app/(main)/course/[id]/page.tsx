import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CourseDetail from "~/components/features/course-detail";
import JsonLd from "~/components/seo/json-ld";
import { unavailableCatalog } from "~/lib/catalog-cache";
import { listIndexableCourses } from "~/lib/courses";
import { readPublicCourse } from "~/lib/public-reads";
import { courseGraph, courseMetadata, missingMetadata } from "~/lib/seo";

export const revalidate = 120;

type CoursePageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const courses = await listIndexableCourses();
  return courses.map((course) => ({ id: course.slug }));
}

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await readPublicCourse(id);
  if (result.status === "error") return unavailableCatalog();
  if (result.status !== "ok") {
    return missingMetadata(
      "Course",
      "This MathEncode course is unavailable.",
      `/course/${id}`,
    );
  }
  return courseMetadata(result.course);
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { id } = await params;
  const result = await readPublicCourse(id);

  if (result.status === "missing") notFound();
  if (result.status === "error") return unavailableCatalog();

  return (
    <>
      <JsonLd data={courseGraph(result.course)} />
      <CourseDetail course={result.course} />
    </>
  );
}
