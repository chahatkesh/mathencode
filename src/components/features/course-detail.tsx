import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Users,
} from "lucide-react";
import { BookDemoButton } from "~/components/layout/book-demo-button";
import { batchSizeLabel, formatCourseDate } from "~/lib/course-format";
import type { MarketingCourse } from "~/types";

const CourseDetail = ({ course }: { course: MarketingCourse }) => {
  const testHref = `/diagnostic/${course.slug || course.publicId}`;
  const customizeHref = `/premium?from=${encodeURIComponent(course.slug || String(course.publicId))}`;
  const start = formatCourseDate(course.startDate);

  const facts = [
    {
      label: "Cohort size",
      value: batchSizeLabel(course.batchSize),
      icon: Users,
    },
    {
      label: "Start date",
      value: start ?? "To be announced",
      icon: CalendarDays,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f4f0e5] pt-[var(--site-header)] text-[#263238]">
      <div className="site-container">
        <nav aria-label="Course navigation" className="pb-2 pt-8 sm:pt-10">
          <Link
            href="/#courses"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline"
          >
            <ArrowLeft size={17} aria-hidden="true" />
            All courses
          </Link>
        </nav>

        <section
          aria-labelledby="course-title"
          className="grid items-center gap-10 pb-16 pt-6 sm:gap-14 sm:pb-24 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:pt-10"
        >
          <div className="min-w-0">
            <p className="public-eyebrow">Small groups. Big ideas.</p>
            <h1 id="course-title" className="public-display mt-5 break-words">
              {course.title}
            </h1>
            {course.description ? (
              <p className="public-lead mt-6 max-w-2xl break-words">
                {course.description}
              </p>
            ) : null}
            <div className="mt-9 flex flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              <BookDemoButton className="public-button public-button--orange">
                Book a free demo
                <ArrowUpRight size={19} aria-hidden="true" />
              </BookDemoButton>
              {course.hasDiagnosticTest ? (
                <Link
                  href={testHref}
                  className="public-button public-button--outline"
                >
                  Attempt Free Test
                  <ArrowUpRight size={19} aria-hidden="true" />
                </Link>
              ) : null}
              <Link
                href={customizeHref}
                className="public-button public-button--outline public-button--compact"
              >
                Not sure? Request or customize
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl rounded-[2rem] bg-[#c9e0f2] p-5 pt-14 sm:rounded-[3rem] sm:p-7 sm:pt-16">
            <span
              aria-hidden="true"
              className="absolute left-7 top-3 -rotate-12 text-3xl font-semibold sm:left-10 sm:top-4 sm:text-4xl"
            >
              x² + y²
            </span>
            <svg
              aria-hidden="true"
              viewBox="0 0 90 90"
              fill="none"
              className="absolute right-6 top-3 size-16 rotate-12 text-[#263238] sm:size-20"
            >
              <path
                d="m45 7 5 24 23-12-14 21 24 5-24 6 14 22-23-13-5 24-6-24-22 13 13-22-24-6 24-5-13-21 22 12 6-24Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
            <div className="relative aspect-[5/4] overflow-hidden rounded-[1.5rem] sm:rounded-[2rem]">
              <Image
                src="/assets/learning/math-program.jpg"
                alt=""
                fill
                sizes="(max-width: 1023px) 90vw, 42vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="relative mx-auto -mt-7 flex w-fit max-w-full -rotate-3 items-center gap-3 rounded-2xl border border-[#263238]/10 bg-[#d6e59a] px-5 py-4 shadow-[0_4px_0_#263238] sm:px-6">
              <BookOpen size={23} aria-hidden="true" className="shrink-0" />
              <p className="text-sm font-semibold sm:text-base">
                Make room for your next big idea.
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-10 border-t border-[#263238]/15 py-14 sm:py-20 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)] lg:gap-20">
          <section aria-labelledby="course-topics" className="min-w-0">
            <p className="public-eyebrow">The learning journey</p>
            <h2 id="course-topics" className="public-title mt-3">
              Topics
            </h2>
            <p className="public-lead mt-4">Subjects covered in this course.</p>
            {course.topics.length > 0 ? (
              <ol className="mt-8 space-y-3 sm:mt-10">
                {course.topics.map((topic, index) => (
                  <li
                    key={`${topic}-${index}`}
                    className="flex items-start gap-4 rounded-2xl bg-[#fffdf7] p-5 sm:gap-5 sm:p-6"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f9d8c0] text-sm font-bold">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 break-words pt-1.5 text-base font-medium leading-relaxed sm:text-lg">
                      {topic}
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="public-empty-state mt-8">
                Topics for this course have not been added yet.
              </div>
            )}
          </section>

          <aside
            aria-labelledby="course-facts"
            className="h-fit rounded-[2rem] bg-[#d6e59a] p-7 sm:p-9 lg:sticky lg:top-[calc(var(--site-header)+1.5rem)]"
          >
            <p className="public-eyebrow">The essentials</p>
            <h2
              id="course-facts"
              className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              At a glance
            </h2>
            <dl className="mt-8 divide-y divide-[#263238]/15">
              {facts.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-start gap-4 py-5 first:pt-0"
                >
                  <Icon
                    size={22}
                    aria-hidden="true"
                    className="mt-1 shrink-0"
                  />
                  <div className="min-w-0">
                    <dt className="text-sm text-[#263238]/75">{label}</dt>
                    <dd className="mt-1 break-words text-lg font-semibold">
                      {value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
            {course.hasDiagnosticTest ? (
              <Link
                href={testHref}
                className="public-button public-button--dark mt-5 w-full"
              >
                Attempt Free Test
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            ) : null}
            <Link
              href={customizeHref}
              className="public-button public-button--outline public-button--compact public-button--paper mt-4 w-full"
            >
              Not sure? Request or customize
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
