import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CourseDetail from "~/components/features/course-detail";
import { getPublicCourse } from "~/lib/courses";

export const dynamic = "force-dynamic";

type CoursePageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await getPublicCourse(id);
  if (result.status !== "ok") {
    return { title: "Course" };
  }
  return {
    title: result.course.title,
    description: result.course.description,
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { id } = await params;
  const result = await getPublicCourse(id);

  if (result.status === "missing") notFound();

  if (result.status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 text-center">
        <div>
          <h1 className="font-montserrat text-2xl font-bold text-dark">
            Course unavailable
          </h1>
          <p className="mt-2 text-dark/70">
            This course could not be loaded. Try again shortly.
          </p>
          <Link href="/" className="btn-primary mt-6 inline-flex">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return <CourseDetail course={result.course} />;
}
