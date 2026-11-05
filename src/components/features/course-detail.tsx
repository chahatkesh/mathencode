import Link from "next/link";
import { BookDemoButton } from "~/components/layout/book-demo-button";
import DottedGrid from "~/components/layout/dotted-grid";
import SectionHeading from "~/components/layout/section-heading";
import { batchSizeLabel, formatCourseDate } from "~/lib/course-format";
import type { MarketingCourse } from "~/types";

const CourseDetail = ({ course }: { course: MarketingCourse }) => {
  const testHref = `/diagnostic/${course.slug || course.publicId}`;
  const start = formatCourseDate(course.startDate);

  const facts = [
    ["Batch size", batchSizeLabel(course.batchSize)],
    ["Start date", start ?? "To be announced"],
  ];

  return (
    <div className="min-h-screen bg-white pt-[var(--site-header)]">
      <div className="container-custom pb-16 pt-6 sm:pt-8">
        <div className="relative overflow-hidden rounded-3xl bg-secondary">
          <DottedGrid />
          <div className="relative px-5 py-8 text-white sm:px-10 sm:py-14">
            <h1 className="max-w-3xl text-balance text-3xl font-semibold tracking-tight md:text-5xl">
              {course.title}
            </h1>
            {course.description ? (
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
                {course.description}
              </p>
            ) : null}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <BookDemoButton className="min-h-12 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-secondary sm:w-auto">
                Book a free demo
              </BookDemoButton>
              {course.hasDiagnosticTest ? (
                <Link
                  href={testHref}
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/40 px-5 py-3 text-center text-sm font-semibold text-white"
                >
                  Attempt Free Test
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-12 sm:mt-14 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.6fr)]">
          <div className="order-2 lg:order-1">
            <section>
              <SectionHeading
                align="left"
                title="Topics"
                subtitle="Subjects covered in this course."
              />
              {course.topics.length > 0 ? (
                <ol className="mt-8 space-y-3">
                  {course.topics.map((topic, index) => (
                    <li
                      key={`${topic}-${index}`}
                      className="flex items-baseline gap-4"
                    >
                      <span className="w-6 shrink-0 text-sm font-semibold text-secondary">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-dark">{topic}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-8 text-dark/70">
                  Topics for this course have not been added yet.
                </p>
              )}
            </section>
          </div>

          <aside className="order-1 h-fit rounded-2xl border border-black/[0.06] p-5 sm:p-6 lg:sticky lg:top-[calc(var(--site-header)+1rem)] lg:order-2">
            <h2 className="text-lg font-semibold text-dark">At a glance</h2>
            <dl className="mt-5 space-y-4">
              {facts.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs text-dark/45">{label}</dt>
                  <dd className="mt-1 text-sm font-medium text-dark">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
            {course.hasDiagnosticTest ? (
              <Link
                href={testHref}
                className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-secondary px-4 py-3 text-sm font-semibold text-white hover:bg-secondary/90"
              >
                Attempt Free Test
              </Link>
            ) : null}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
