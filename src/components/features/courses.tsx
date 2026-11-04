import Link from "next/link";
import DottedGrid from "~/components/layout/dotted-grid";
import SectionHeading from "~/components/layout/section-heading";
import type { MarketingCourse } from "~/types";

function gradeMark(level: string) {
  const match = level.match(/(\d+\s*[–-]\s*\d+|k\s*[–-]\s*\d+)/i);
  if (!match?.[1]) return level.trim();
  return match[1].replace(/\s+/g, "").replace("-", "–");
}

function summary(text: string) {
  const trimmed = text.trim();
  if (trimmed.length <= 120) return trimmed;
  return `${trimmed.slice(0, 117).trimEnd()}...`;
}

const Courses = ({
  courses,
  unavailable = false,
  hasCommonTest = false,
}: {
  courses: MarketingCourse[];
  unavailable?: boolean;
  hasCommonTest?: boolean;
}) => {
  return (
    <section
      id="courses"
      className="scroll-mt-[var(--site-header)] bg-white py-16 md:py-24"
    >
      <div className="container-custom">
        <SectionHeading
          title="Programs that get results"
          subtitle="Live, one-to-one coaching for each grade."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {hasCommonTest ? (
            <article className="flex flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white">
              <Link href="/diagnostic/common" className="flex h-full flex-col">
                <div className="relative h-44 overflow-hidden bg-primary sm:h-48">
                  <DottedGrid />
                  <div className="relative flex h-full flex-col justify-end p-5 text-white">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/75">
                      Start here
                    </p>
                    <p className="mt-2 text-4xl font-semibold leading-none tracking-tight">
                      K–12
                    </p>
                    <h3 className="mt-2 line-clamp-2 text-lg font-semibold leading-snug">
                      Not sure which program?
                    </h3>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-sm leading-relaxed text-dark/70">
                    One free diagnostic across every grade. It shows where you
                    are, so you can choose the right program.
                  </p>
                  <p className="mt-4 text-xs font-medium text-dark/50">
                    Free · Every grade
                  </p>
                  <ul className="mt-4 space-y-1.5">
                    {[
                      "No program to pick first",
                      "See your level before you start",
                      "A clear next step after the test",
                    ].map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2 text-sm text-dark/80"
                      >
                        <span
                          aria-hidden
                          className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-primary"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-6">
                    <span className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white">
                      Attempt Free Test
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ) : null}
          {unavailable ? (
            <p className="col-span-full text-center text-dark/70">
              Programs are temporarily unavailable.
            </p>
          ) : courses.length === 0 ? (
            <p className="col-span-full text-center text-dark/70">
              New programs will be listed here soon.
            </p>
          ) : null}
          {courses.map((course) => {
            const highlights = course.highlights
              .map((item) => item.trim())
              .filter(Boolean);
            const topics = highlights.slice(0, 3);
            const extraTopics = highlights.length - topics.length;
            const href = `/course/${course.slug || course.publicId}`;

            return (
              <article
                key={course.id}
                className="relative flex flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white"
              >
                <Link
                  href={href}
                  aria-label={course.title}
                  className="absolute inset-0 z-0 rounded-2xl"
                />
                <div className="pointer-events-none relative flex flex-1 flex-col">
                  <div className="relative h-44 overflow-hidden bg-secondary sm:h-48">
                    <DottedGrid />
                    <div className="relative flex h-full flex-col justify-end p-5 text-white">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/75">
                        Grade
                      </p>
                      <p className="mt-2 text-4xl font-semibold leading-none tracking-tight">
                        {gradeMark(course.level)}
                      </p>
                      <h3 className="mt-2 line-clamp-2 text-lg font-semibold leading-snug">
                        {course.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-sm leading-relaxed text-dark/70">
                      {summary(course.description)}
                    </p>
                    <p className="mt-4 text-xs font-medium text-dark/50">
                      {[course.duration, course.group]
                        .map((item) => item.trim())
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    {topics.length > 0 ? (
                      <ul className="mt-4 space-y-1.5">
                        {topics.map((topic) => (
                          <li
                            key={topic}
                            className="flex items-start gap-2 text-sm text-dark/80"
                          >
                            <span
                              aria-hidden
                              className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-secondary"
                            />
                            <span className="min-w-0">{topic}</span>
                          </li>
                        ))}
                        {extraTopics > 0 ? (
                          <li className="pl-3 text-sm font-medium text-secondary">
                            +{extraTopics} topics
                          </li>
                        ) : null}
                      </ul>
                    ) : null}
                    {course.hasDiagnosticTest ? <div className="pt-6" /> : null}
                  </div>
                </div>
                {course.hasDiagnosticTest ? (
                  <div className="relative z-10 px-5 pb-5">
                    <Link
                      href={`/diagnostic/${course.slug || course.publicId}`}
                      className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-secondary px-4 py-3 text-sm font-semibold text-white hover:bg-secondary/90"
                    >
                      Attempt Free Test
                    </Link>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Courses;
