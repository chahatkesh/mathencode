import Link from "next/link";
import DottedGrid from "~/components/layout/dotted-grid";
import SectionHeading from "~/components/layout/section-heading";
import { formatCourseDate } from "~/lib/course-format";
import type { MarketingCourse } from "~/types";

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
          title="Courses that get results"
          subtitle="Live classes in small batches of about 4–5 students."
        />

        {hasCommonTest ? (
          <Link
            href="/which-course"
            className="mt-12 flex flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white md:flex-row"
          >
            <div className="relative flex min-h-40 flex-col justify-end overflow-hidden bg-primary p-5 text-white sm:min-h-44 md:w-[22rem] md:shrink-0 md:p-8">
              <DottedGrid />
              <div className="relative">
                <h3 className="text-2xl font-semibold leading-snug tracking-tight">
                  Not sure which course?
                </h3>
                <p className="mt-2 text-sm font-medium text-white/85">
                  Take a free test
                </p>
              </div>
            </div>
            <div className="flex flex-1 items-center p-5 md:p-8">
              <p className="max-w-xl text-sm leading-relaxed text-dark/70 md:text-base">
                If you are confused about which course to take, see the courses
                and attempt the free test. It shows where you should start.
              </p>
            </div>
          </Link>
        ) : null}
        <div
          className={`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 ${
            hasCommonTest ? "mt-6" : "mt-12"
          }`}
        >
          {unavailable ? (
            <p className="col-span-full text-center text-dark/70">
              Courses are temporarily unavailable.
            </p>
          ) : courses.length === 0 ? (
            <p className="col-span-full text-center text-dark/70">
              New courses will be listed here soon.
            </p>
          ) : null}
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
};

export function CourseCard({ course }: { course: MarketingCourse }) {
  const href = `/course/${course.slug || course.publicId}`;
  const start = formatCourseDate(course.startDate);

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white">
      <Link href={href} className="flex h-full flex-col">
        <div className="relative h-44 overflow-hidden bg-secondary sm:h-48">
          <DottedGrid />
          <div className="relative flex h-full flex-col justify-end p-5 text-white">
            <h3 className="line-clamp-2 text-2xl font-semibold leading-snug tracking-tight">
              {course.title}
            </h3>
            <p className="mt-2 text-sm font-medium text-white/85">
              {start ? `Starts ${start}` : "Start date to be announced"}
            </p>
          </div>
        </div>
        {course.description ? (
          <div className="flex flex-1 flex-col p-5">
            <p className="text-sm leading-relaxed text-dark/70">
              {course.description}
            </p>
          </div>
        ) : null}
      </Link>
    </article>
  );
}

export default Courses;
