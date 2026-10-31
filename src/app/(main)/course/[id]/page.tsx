import type { Metadata } from "next";
import CourseDetail from "~/components/features/course-detail";
import { coursesData } from "~/data/courses";

type CoursePageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return coursesData.map((course) => ({ id: String(course.id) }));
}

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const { id } = await params;
  const course = coursesData.find((item) => item.id === Number(id));
  return {
    title: course?.title ?? "Course",
    description: course?.description,
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { id } = await params;
  return <CourseDetail courseId={id} />;
}
