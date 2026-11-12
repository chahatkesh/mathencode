import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Sigma, UserRound } from "lucide-react";
import SectionHeading from "~/components/layout/section-heading";
import { courseBlurb, courseKindLabel } from "~/lib/course-copy";
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
  const diagnosticHref = hasCommonTest
    ? "/diagnostic/common"
    : "/courses#diagnostic";

  return (
    <section id="courses" className="public-section courses-section">
      <div className="site-container">
        <div className="section-topline">
          <SectionHeading
            align="left"
            eyebrow="Course list"
            title={
              <>
                Explore <span className="scribble">AP Math courses.</span>
              </>
            }
            subtitle="See what each course covers and when it starts."
          />
          <Link href="/courses" className="text-link">
            Explore courses <ArrowUpRight aria-hidden />
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
            <CourseCard
              key={course.id}
              course={course}
              index={index}
              showKind={false}
            />
          ))}
        </div>
        <aside
          className="course-guidance"
          aria-labelledby="course-guidance-title"
        >
          <h3 id="course-guidance-title">
            Not sure which course is right for you?
          </h3>
          <p>
            The free diagnostic shows your current level and a sensible place to
            start.
          </p>
          <Link href={diagnosticHref} className="text-link">
            Take the free diagnostic <ArrowUpRight aria-hidden />
          </Link>
        </aside>
      </div>
    </section>
  );
};

const coursePhotos = [
  "mathematics.svg",
  "online-learning.svg",
  "studying.svg",
  "teaching.svg",
];

export function PrivatePlanCard() {
  return (
    <article className="course-card course-card--private">
      <Link href="/premium">
        <span className="course-icon" aria-hidden="true">
          <UserRound size={25} />
        </span>
        <p className="course-kind">Private</p>
        <h3>One student</h3>
        <p className="course-description">
          A teacher and a plan, for a topic the course list does not cover.
        </p>
        <p className="course-date">One teacher. Your topic.</p>
        <div className="course-image course-private-mark" aria-hidden="true">
          1 : 1
        </div>
        <span className="course-link">
          Request a private plan <ArrowUpRight aria-hidden />
        </span>
      </Link>
    </article>
  );
}

export function CourseCard({
  course,
  index = 0,
  priority = false,
  showKind = true,
}: {
  course: MarketingCourse;
  index?: number;
  priority?: boolean;
  showKind?: boolean;
}) {
  const href = `/course/${course.slug || course.publicId}`;
  const start = formatCourseDate(course.startDate);

  return (
    <article className="course-card">
      <Link href={href}>
        {showKind ? (
          <>
            <span className="course-icon" aria-hidden="true">
              <Sigma size={25} />
            </span>
            <p className="course-kind">{courseKindLabel(course)}</p>
          </>
        ) : null}
        <h3>{course.title}</h3>
        <p className="course-description">{courseBlurb(course)}</p>
        <p className="course-date">
          <CalendarDays aria-hidden />
          {start ? `Starts ${start}` : "Start date to be announced"}
        </p>
        <div className="course-image">
          <Image
            src={`/assets/learning/${coursePhotos[index % coursePhotos.length]}`}
            alt=""
            fill
            priority={priority}
            sizes="(max-width: 479px) 85vw, (max-width: 1100px) 45vw, 420px"
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
