import Link from "next/link";
import DottedGrid from "~/components/layout/dotted-grid";
import SectionHeading from "~/components/layout/section-heading";
import { formatCourseDate } from "~/lib/course-format";
import type { MarketingCourse } from "~/types";

const Courses = ({
  courses,
  unavailable = false,
}: {
  courses: MarketingCourse[];
  unavailable?: boolean;
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

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
