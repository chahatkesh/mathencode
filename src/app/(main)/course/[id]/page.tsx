import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CourseDetail from "~/components/features/course-detail";
import JsonLd from "~/components/seo/json-ld";
import { readPublicCourse } from "~/lib/public-reads";
import { courseGraph, courseMetadata, missingMetadata } from "~/lib/seo";

export const dynamic = "force-dynamic";

type CoursePageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await readPublicCourse(id);
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

  if (result.status === "error") {
    return (
      <section
        aria-labelledby="course-unavailable-title"
        className="flex min-h-[75vh] items-center bg-[#f4f0e5] pb-16 pt-[calc(var(--site-header)+4rem)] text-[#263238]"
      >
        <div className="site-container">
          <div className="public-empty-state mx-auto max-w-3xl">
            <p className="public-eyebrow">A little pause in the learning</p>
            <h1 id="course-unavailable-title" className="public-title mt-4">
              Course unavailable
            </h1>
            <p className="public-lead mt-4">
              This course could not be loaded. Try again shortly.
            </p>
            <Link href="/" className="public-button public-button--orange mt-8">
              Back to home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <JsonLd data={courseGraph(result.course)} />
      <CourseDetail course={result.course} />
    </>
  );
}
