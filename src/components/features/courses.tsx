import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { BookDemoButton } from "~/components/layout/book-demo-button";
import SectionHeading from "~/components/layout/section-heading";
import { courseBlurb } from "~/lib/course-copy";
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
            title={
              <>
                Explore <span className="scribble">Courses</span>
              </>
            }
            subtitle="See what each course covers and when it starts."
          />
          <Link href="/courses" className="text-link">
            Explore All <ArrowUpRight aria-hidden />
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
        <CourseGuidance href={diagnosticHref} />
      </div>
    </section>
  );
};

function GuidanceArt() {
  return (
    <svg viewBox="0 0 340 250" fill="none" aria-hidden="true">
      <g transform="rotate(-8 78 140)">
        <rect
          x="22"
          y="58"
          width="118"
          height="148"
          rx="20"
          fill="#263238"
          fillOpacity="0.12"
        />
        <rect
          x="14"
          y="50"
          width="118"
          height="148"
          rx="20"
          fill="#c9e0f2"
          stroke="#263238"
          strokeWidth="3.5"
        />
        <path
          d="M36 96h62M36 118h44"
          stroke="#263238"
          strokeOpacity="0.22"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle
          cx="40"
          cy="154"
          r="8"
          stroke="#263238"
          strokeOpacity="0.35"
          strokeWidth="2.5"
        />
      </g>
      <g transform="rotate(8 262 136)">
        <rect
          x="214"
          y="54"
          width="118"
          height="148"
          rx="20"
          fill="#263238"
          fillOpacity="0.12"
        />
        <rect
          x="206"
          y="46"
          width="118"
          height="148"
          rx="20"
          fill="#f6d7e8"
          stroke="#263238"
          strokeWidth="3.5"
        />
        <path
          d="M230 92h62M230 114h40"
          stroke="#263238"
          strokeOpacity="0.22"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle
          cx="234"
          cy="150"
          r="8"
          stroke="#263238"
          strokeOpacity="0.35"
          strokeWidth="2.5"
        />
      </g>
      <rect
        x="118"
        y="28"
        width="132"
        height="186"
        rx="22"
        fill="#263238"
        fillOpacity="0.14"
      />
      <rect
        x="108"
        y="18"
        width="132"
        height="186"
        rx="22"
        fill="#fffdf8"
        stroke="#263238"
        strokeWidth="3.5"
      />
      <rect x="132" y="36" width="58" height="14" rx="7" fill="#ff6700" />
      <circle
        cx="136"
        cy="78"
        r="7"
        stroke="#263238"
        strokeOpacity="0.28"
        strokeWidth="2.4"
      />
      <path
        d="M152 78h62"
        stroke="#263238"
        strokeOpacity="0.16"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="136" cy="114" r="9" fill="#ff6700" />
      <path
        d="M131.6 114.2 135 117.6 141.4 110.4"
        stroke="#fffdf8"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M154 114h64"
        stroke="#ff6700"
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      <circle
        cx="136"
        cy="150"
        r="7"
        stroke="#263238"
        strokeOpacity="0.28"
        strokeWidth="2.4"
      />
      <path
        d="M152 150h42"
        stroke="#263238"
        strokeOpacity="0.16"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="216" cy="184" r="18" fill="#ff6700" />
      <path
        d="M208.4 184.4 213.6 189.8 224.4 178"
        stroke="#fffdf8"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CourseGuidance({
  href,
  titleId = "course-guidance-title",
  heading = "h3",
  id,
  demoFallback = false,
}: {
  href?: string;
  titleId?: string;
  heading?: "h2" | "h3";
  id?: string;
  demoFallback?: boolean;
}) {
  const Title = heading;

  return (
    <aside id={id} className="course-guidance" aria-labelledby={titleId}>
      <div className="course-guidance-copy">
        <p className="public-pill">Free diagnostic</p>
        <Title id={titleId} className="course-guidance-title">
          Not sure which course is right for you?
        </Title>
        <p>
          {demoFallback
            ? "The free diagnostic is not open right now. Book a demo and we will help you choose a course."
            : "The free diagnostic shows your current level and a sensible place to start."}
        </p>
        {demoFallback ? (
          <BookDemoButton className="public-button public-button--dark">
            Book a free demo
          </BookDemoButton>
        ) : (
          <Link
            href={href ?? "/courses#diagnostic"}
            className="public-button public-button--dark"
          >
            Take the free diagnostic <ArrowUpRight aria-hidden />
          </Link>
        )}
      </div>
      <div className="course-guidance-stage" aria-hidden="true">
        <GuidanceArt />
      </div>
    </aside>
  );
}

const coursePhotos = [
  "mathematics.svg",
  "online-learning.svg",
  "calculator.svg",
  "teaching.svg",
];

export function PrivatePlanCard() {
  return (
    <article className="course-card course-card--private">
      <Link href="/premium">
        <h3>One student</h3>
        <p className="course-description">
          One teacher and one student. A school topic, a test, or a pace that
          fits.
        </p>
        <p className="course-date">Live online. Your topic.</p>
        <div className="course-image course-private-mark" aria-hidden="true">
          1 : 1
        </div>
        <span className="course-link">
          Ask for a private class <ArrowUpRight aria-hidden />
        </span>
      </Link>
    </article>
  );
}

export function CourseCard({
  course,
  index = 0,
  priority = false,
}: {
  course: MarketingCourse;
  index?: number;
  priority?: boolean;
}) {
  const href = `/course/${course.slug || course.publicId}`;
  const start = formatCourseDate(course.startDate);

  return (
    <article className="course-card">
      <Link href={href}>
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
