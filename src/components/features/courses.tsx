import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Sigma } from "lucide-react";
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
    <section id="courses" className="public-section courses-section">
      <div className="site-container">
        <div className="section-topline">
          <SectionHeading
            align="left"
            eyebrow="Find your next step"
            title={
              <>
                Courses that get <span className="scribble">results.</span>
              </>
            }
            subtitle="Live classes that stay with an idea until you can use it."
          />
          <Link href="/which-course" className="text-link">
            Find the right course <ArrowUpRight aria-hidden />
          </Link>
        </div>
        <div className="course-grid">
          {unavailable ? (
            <p className="public-empty-state col-span-full">
              Courses are temporarily unavailable. Please try again shortly.
            </p>
          ) : courses.length === 0 ? (
            <p className="public-empty-state col-span-full">
              New courses will be listed here soon.
            </p>
          ) : null}
          {courses.map((course, index) => (
            <CourseCard key={course.id} course={course} index={index} />
          ))}
        </div>
        <p className="course-guidance">
          Not sure where to begin?{" "}
          <Link href="/which-course">Let’s find your starting point.</Link>
          <br />
          Need something that is not listed?{" "}
          <Link href="/premium">Request a custom course.</Link>
        </p>
      </div>
    </section>
  );
};

const coursePhotos = [
  "math-program.jpg",
  "online-learning.jpg",
  "learning-moment.jpg",
  "learning-together.jpg",
];

export function CourseCard({
  course,
  index = 0,
}: {
  course: MarketingCourse;
  index?: number;
}) {
  const href = `/course/${course.slug || course.publicId}`;
  const start = formatCourseDate(course.startDate);

  return (
    <article className="course-card">
      <Link href={href}>
        <span className="course-icon" aria-hidden="true">
          <Sigma size={25} />
        </span>
        <h3>{course.title}</h3>
        <p className="course-description">{course.description}</p>
        <p className="course-date">
          <CalendarDays aria-hidden />
          {start ? `Starts ${start}` : "Start date to be announced"}
        </p>
        <div className="course-image">
          <Image
            src={`/assets/learning/${coursePhotos[index % coursePhotos.length]}`}
            alt=""
            fill
            sizes="(max-width: 479px) 85vw, (max-width: 1100px) 40vw, 280px"
          />
        </div>
        <span className="course-link">
          Explore course <ArrowUpRight aria-hidden />
        </span>
      </Link>
    </article>
  );
}

export default Courses;
