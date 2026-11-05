import type { Metadata } from "next";
import Link from "next/link";
import { CourseCard } from "~/components/features/courses";
import DottedGrid from "~/components/layout/dotted-grid";
import SectionHeading from "~/components/layout/section-heading";
import { readHomeCatalog } from "~/lib/public-reads";
import { whichCourseMetadata } from "~/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = whichCourseMetadata;

export default async function WhichCoursePage() {
  const catalog = await readHomeCatalog();

  return (
    <div className="min-h-screen bg-white pt-[var(--site-header)]">
      <div className="container-custom pb-16 pt-6 sm:pt-8">
        <div className="relative overflow-hidden rounded-3xl bg-primary text-white">
          <DottedGrid />
          <div className="relative px-5 py-8 sm:px-10 sm:py-14">
            <h1 className="max-w-3xl text-balance text-3xl font-semibold tracking-tight md:text-5xl">
              Not sure which course?
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
              If you are confused about which course to take, look through the
              courses below, or attempt the free test. The test shows which
              course you should start with.
            </p>
            {catalog.hasCommonTest ? (
              <Link
                href="/diagnostic/common"
                className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-primary"
              >
                Attempt Free Test
              </Link>
            ) : null}
          </div>
        </div>

        <div className="mt-12 sm:mt-16">
          <SectionHeading
            align="left"
            title="Available courses"
            subtitle="Each course shows when it starts and what it covers."
          />
          {catalog.coursesUnavailable ? (
            <p className="mt-8 text-dark/70">
              Courses are temporarily unavailable.
            </p>
          ) : catalog.courses.length === 0 ? (
            <p className="mt-8 text-dark/70">
              New courses will be listed here soon.
            </p>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {catalog.courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
