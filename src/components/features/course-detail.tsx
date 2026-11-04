"use client";

import Link from "next/link";
import DottedGrid from "~/components/layout/dotted-grid";
import { openDemoPopup } from "~/components/layout/demo-help-button";
import SectionHeading from "~/components/layout/section-heading";
import type { MarketingCourse } from "~/types";

function gradeMark(level: string) {
  const match = level.match(/(\d+\s*[–-]\s*\d+|k\s*[–-]\s*\d+)/i);
  if (!match?.[1]) return level.trim();
  return match[1].replace(/\s+/g, "").replace("-", "–");
}

const CourseDetail = ({ course }: { course: MarketingCourse }) => {
  const href = `/diagnostic/${course.slug || course.publicId}`;

  const facts = [
    ["Duration", course.duration],
    ["Level", course.level],
    ["Class size", course.group],
    ["Schedule", course.schedule],
    ["Next start", course.nextStart],
    ["Prerequisites", course.prerequisites],
  ].filter(([, value]) => value.trim());

  return (
    <div className="mt-16 min-h-screen bg-white">
      <div className="container-custom pb-16 pt-6">
        <div className="relative overflow-hidden rounded-3xl bg-secondary">
          <DottedGrid />
          <div className="relative px-6 py-10 text-white sm:px-10 sm:py-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80">
              Grade
            </p>
            <p className="mt-3 text-5xl font-semibold leading-none tracking-tight md:text-6xl">
              {gradeMark(course.level)}
            </p>
            <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">
              {course.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
              {course.description}
            </p>
            <p className="mt-6 text-sm font-medium text-white/80">
              {[course.duration, course.group]
                .map((item) => item.trim())
                .filter(Boolean)
                .join(" · ")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={openDemoPopup}
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-secondary"
              >
                Book a free demo
              </button>
              {course.hasDiagnosticTest ? (
                <Link
                  href={href}
                  className="rounded-xl border border-white/40 px-5 py-3 text-sm font-semibold text-white"
                >
                  Attempt Free Test
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.6fr)]">
          <div className="space-y-14">
            {course.objectives.length > 0 ? (
              <section>
                <SectionHeading
                  align="left"
                  title="What you will learn"
                  subtitle="The ideas this program is built to make clear."
                />
                <ul className="mt-8 space-y-3">
                  {course.objectives.map((objective) => (
                    <li
                      key={objective}
                      className="border-l-2 border-secondary pl-4 text-dark/80"
                    >
                      {objective}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {course.highlights.length > 0 ? (
              <section>
                <SectionHeading
                  align="left"
                  title="Curriculum"
                  subtitle="The topics covered in this program."
                />
                <ol className="mt-8 space-y-3">
                  {course.highlights.map((topic, index) => (
                    <li key={topic} className="flex items-baseline gap-4">
                      <span className="w-6 shrink-0 text-sm font-semibold text-secondary">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-dark">{topic}</span>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}
          </div>

          <aside className="h-fit rounded-2xl border border-black/[0.06] p-6 lg:sticky lg:top-24">
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
                href={href}
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-secondary px-4 py-3 text-sm font-semibold text-white hover:bg-secondary/90"
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
