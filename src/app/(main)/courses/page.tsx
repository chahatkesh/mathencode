import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CourseCard, PrivatePlanCard } from "~/components/features/courses";
import { BookDemoButton } from "~/components/layout/book-demo-button";
import JsonLd from "~/components/seo/json-ld";
import { unavailableCatalog } from "~/lib/catalog-cache";
import { readHomeCatalog } from "~/lib/public-reads";
import { coursesMetadata, coursesPageGraph } from "~/lib/seo";

export const revalidate = 120;

export const metadata: Metadata = coursesMetadata;

export default async function CoursesPage() {
  const catalog = await readHomeCatalog();
  if (catalog.coursesUnavailable) return unavailableCatalog();

  return (
    <div className="min-h-screen bg-[#f4f0e5] pt-[var(--site-header)] text-[#263238]">
      <JsonLd
        data={coursesPageGraph({
          courses: catalog.courses,
          hasCommonTest: catalog.hasCommonTest,
        })}
      />
      <div className="site-container">
        <section
          aria-labelledby="courses-title"
          className="pb-14 pt-10 sm:pb-16 sm:pt-12 lg:pb-20 lg:pt-14"
        >
          <p className="public-eyebrow">Course list</p>
          <h1 id="courses-title" className="public-title mt-4 max-w-3xl">
            Explore <span className="scribble">AP Math courses.</span>
          </h1>
          <p className="public-lead mt-5 max-w-2xl">
            See what each course covers and when it starts. AP courses are
            marked on the card. Other courses are foundations for later study.
          </p>
          {catalog.courses.length === 0 ? (
            <div className="public-empty-state mt-10">
              New courses will be listed here soon.
            </div>
          ) : null}
          <div className="course-grid course-grid--catalog">
            {catalog.courses.map((course, index) => (
              <CourseCard
                key={course.id}
                course={course}
                index={index}
                priority={index < 3}
              />
            ))}
            <PrivatePlanCard />
          </div>
        </section>

        <section
          id="diagnostic"
          aria-labelledby="diagnostic-title"
          className="scroll-mt-[calc(var(--site-header)+1.5rem)] border-t border-[#263238]/15 py-14 sm:py-20"
        >
          <div className="rounded-[2rem] bg-[#f9d8c0] px-6 py-10 sm:rounded-[2.5rem] sm:px-12 sm:py-14">
            <p className="public-eyebrow">Free diagnostic</p>
            <h2 id="diagnostic-title" className="public-title mt-3 max-w-3xl">
              Not sure which course is right for you?
            </h2>
            <p className="public-lead mt-5 max-w-2xl text-[#3e4c52]">
              The free diagnostic shows your current level and a sensible place
              to start.
            </p>
            {catalog.hasCommonTest ? (
              <Link
                href="/diagnostic/common"
                className="public-button public-button--dark mt-8"
              >
                Take the free diagnostic
                <ArrowUpRight size={19} aria-hidden="true" />
              </Link>
            ) : (
              <div className="mt-8">
                <p className="max-w-2xl text-base leading-relaxed">
                  The free diagnostic is not open right now. Book a demo and we
                  will help you choose a course.
                </p>
                <BookDemoButton className="public-button public-button--dark mt-6">
                  Book a free demo
                  <ArrowUpRight size={19} aria-hidden="true" />
                </BookDemoButton>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
