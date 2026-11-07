import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Compass } from "lucide-react";
import { CourseCard } from "~/components/features/courses";
import { unavailableCatalog } from "~/lib/catalog-cache";
import { readHomeCatalog } from "~/lib/public-reads";
import { whichCourseMetadata } from "~/lib/seo";

export const revalidate = 120;

export const metadata: Metadata = whichCourseMetadata;

export default async function WhichCoursePage() {
  const catalog = await readHomeCatalog();
  if (catalog.coursesUnavailable) return unavailableCatalog();

  return (
    <div className="min-h-screen bg-[#f4f0e5] pt-[var(--site-header)] text-[#263238]">
      <div className="site-container">
        <section
          aria-labelledby="which-course-title"
          className="grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-24"
        >
          <div className="min-w-0">
            <p className="public-eyebrow">
              A starting point for every curious mind
            </p>
            <h1 id="which-course-title" className="public-display mt-5">
              Not sure <span className="text-[#bf4b00]">which course?</span>
            </h1>
            <p className="public-lead mt-6 max-w-2xl">
              If you are confused about which course to take, look through the
              courses below, or attempt the free test. The test shows which
              course you should start with.
            </p>
            <div className="mt-9 flex flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              {catalog.hasCommonTest ? (
                <Link
                  href="/diagnostic/common"
                  className="public-button public-button--orange"
                >
                  Attempt Free Test
                  <ArrowUpRight size={19} aria-hidden="true" />
                </Link>
              ) : null}
              <Link
                href="#available-courses"
                className="public-button public-button--outline"
              >
                Explore courses
                <ArrowDown size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl rounded-[2rem] bg-[#f6d7e8] p-5 pb-8 pt-12 sm:rounded-[3rem] sm:p-7 sm:pb-9 sm:pt-14">
            <svg
              aria-hidden="true"
              viewBox="0 0 150 75"
              fill="none"
              className="absolute left-6 top-2 h-14 w-28 -rotate-6 text-[#263238] sm:left-9 sm:w-32"
            >
              <path
                d="M8 52c17-44 35-46 43-20S33 73 27 55s36-37 73-21m-15-16 18 16-21 10M123 9v26m-13-13h26"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              aria-hidden="true"
              className="absolute right-8 top-3 rotate-12 text-4xl font-semibold"
            >
              ÷
            </span>
            <div className="relative aspect-[5/4] overflow-hidden rounded-[1.5rem] sm:rounded-[2rem]">
              <Image
                src="/assets/learning/online-learning.jpg"
                alt=""
                fill
                sizes="(max-width: 1023px) 90vw, 43vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="relative mx-auto -mt-7 flex w-fit max-w-full rotate-2 items-center gap-3 rounded-2xl border border-[#263238]/10 bg-[#d6e59a] px-5 py-4 shadow-[0_4px_0_#263238]">
              <Compass size={25} aria-hidden="true" className="shrink-0" />
              <span className="text-sm font-semibold sm:text-base">
                Find a course. Follow your curiosity.
              </span>
            </div>
          </div>
        </section>

        <section
          id="available-courses"
          aria-labelledby="available-courses-title"
          className="scroll-mt-[calc(var(--site-header)+2rem)] border-t border-[#263238]/15 py-14 sm:py-20"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            <div>
              <p className="public-eyebrow">Your next chapter</p>
              <h2 id="available-courses-title" className="public-title mt-3">
                Available courses
              </h2>
            </div>
            <p className="public-lead max-w-md">
              Each course shows when it starts and what it covers.
            </p>
          </div>
          {catalog.courses.length === 0 ? (
            <div className="public-empty-state mt-10">
              New courses will be listed here soon.
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {catalog.courses.map((course, index) => (
                <CourseCard key={course.id} course={course} index={index} />
              ))}
            </div>
          )}
          <p className="mt-10 text-center text-sm leading-relaxed text-[#586164]">
            If none of these fit,{" "}
            <Link
              href="/premium"
              className="font-semibold text-[#263238] underline underline-offset-4"
            >
              request a custom course
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
