import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CircleCheck,
  Clock,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import MentorshipRequestForm from "~/components/features/mentorship-request-form";
import SectionHeading from "~/components/layout/section-heading";
import JsonLd from "~/components/seo/json-ld";
import { readPublicCourse } from "~/lib/public-reads";
import { premiumGraph, premiumMetadata } from "~/lib/seo";
import "~/styles/public-premium.css";

export const metadata = premiumMetadata;

const facts = [
  ["1 : 1", "Teacher and student"],
  ["Live", "Online class"],
  ["Topic", "School or a test"],
  ["Pace", "Set by the student"],
];

const reasons = [
  {
    kicker: "School",
    title: "A topic from class",
    text: "A chapter, a grade, or an idea that is hard right now.",
    tone: "peach",
    icon: BookOpen,
  },
  {
    kicker: "A test",
    title: "Help before an exam",
    text: "Practice for a school test, or an AP exam, with a teacher.",
    tone: "sky",
    icon: CalendarDays,
  },
  {
    kicker: "Pace",
    title: "A pace that fits",
    text: "The next idea starts when this student is ready.",
    tone: "lime",
    icon: Clock,
  },
];

const steps = [
  {
    title: "You write",
    text: "Share the topic, the grade, and what you want to change.",
  },
  {
    title: "We reply",
    text: "An email with a way to start. Nothing to pay on this page.",
  },
  {
    title: "Class starts",
    text: "One teacher and one student, live and online.",
  },
];

const points = [
  "Your name, email, and mobile number",
  "The topic, the grade, or the test",
  "What you hope will change",
];

function courseParam(value: string | undefined) {
  const param = value?.trim() ?? "";
  if (!param || param.length > 80) return null;
  if (!/^[a-z0-9-]+$/i.test(param)) return null;
  return param;
}

export default async function PremiumPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  const param = courseParam(from);
  let sourceCourse = "";
  if (param) {
    const result = await readPublicCourse(param);
    if (result.status === "ok") sourceCourse = result.course.title;
  }

  return (
    <div className="premium-page">
      <JsonLd data={premiumGraph()} />
      <section className="premium-hero" aria-labelledby="premium-title">
        <div className="site-container premium-hero-grid">
          <div className="premium-hero-copy">
            <p className="public-pill">One teacher. One student.</p>
            <h1 id="premium-title">
              A class for
              <br />
              <span className="scribble">one student.</span>
            </h1>
            <p className="public-lead">
              A live online class with one teacher and one student. A parent or
              a student can ask about a school topic, a test, or a pace that
              fits. We reply by email.
            </p>
            <div className="premium-hero-actions">
              <a
                href="#request"
                className="public-button public-button--orange"
              >
                Tell us what you need
              </a>
              <Link
                href="/courses"
                className="public-button public-button--outline"
              >
                Explore courses
              </Link>
            </div>
          </div>
          <div className="premium-photo-scene">
            <span className="premium-photo-equation" aria-hidden="true">
              1 teacher + 1 student
            </span>
            <div className="premium-photo-frame">
              <Image
                src="/assets/learning/professor.svg"
                alt="Illustration of a teacher"
                fill
                priority
                sizes="(max-width: 767px) 90vw, 46vw"
              />
            </div>
            <div className="premium-photo-note">
              <Sparkles size={22} aria-hidden="true" />
              <span>
                Just this
                <br />
                student.
              </span>
            </div>
          </div>
        </div>
        <div className="site-container">
          <dl className="hero-facts">
            {facts.map(([value, label]) => (
              <div key={label}>
                <dt>{value}</dt>
                <dd>{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section
        className="public-section premium-fit"
        aria-labelledby="premium-fit-title"
      >
        <div className="site-container">
          <SectionHeading
            id="premium-fit-title"
            eyebrow="A good fit"
            title={
              <>
                Made for <span className="scribble">this student.</span>
              </>
            }
            subtitle="A few plain sentences are enough. You do not need a course name."
          />
          <ul className="premium-reasons">
            {reasons.map((reason) => (
              <li key={reason.title} data-tone={reason.tone}>
                <span className="premium-reason-icon" aria-hidden="true">
                  <reason.icon size={22} />
                </span>
                <p className="premium-reason-kicker">{reason.kicker}</p>
                <h3>{reason.title}</h3>
                <p>{reason.text}</p>
              </li>
            ))}
          </ul>
          <p className="premium-aside-link">
            <Link href="/courses" className="text-link">
              Prefer a group class? Explore courses <ArrowUpRight aria-hidden />
            </Link>
          </p>
        </div>
      </section>

      <section
        className="public-section premium-steps"
        aria-labelledby="premium-steps-title"
      >
        <div className="site-container">
          <SectionHeading
            id="premium-steps-title"
            eyebrow="What happens next"
            title={
              <>
                From a note to <span className="scribble">a class.</span>
              </>
            }
            subtitle="Three short steps. We take it from there."
          />
          <ol className="premium-step-list">
            {steps.map((step, index) => (
              <li key={step.title}>
                <span aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        id="request"
        className="public-section premium-request"
        aria-labelledby="premium-request-title"
      >
        <div className="site-container contact-grid">
          <div>
            <SectionHeading
              id="premium-request-title"
              align="left"
              eyebrow="Write to us"
              title={
                <>
                  Tell us what <span className="scribble">you need.</span>
                </>
              }
              subtitle="A parent or a student can send this. We read every note."
            />
            <ul className="contact-points">
              {points.map((point) => (
                <li key={point}>
                  <CircleCheck aria-hidden />
                  {point}
                </li>
              ))}
            </ul>
            <div className="contact-note">
              <Image
                src="/assets/learning/smile.svg"
                alt=""
                width={80}
                height={74}
              />
              <p>A course does not have to be chosen yet.</p>
            </div>
          </div>
          <div className="demo-form-card premium-form-card">
            <h3>About the student</h3>
            <MentorshipRequestForm sourceCourse={sourceCourse} />
          </div>
        </div>
      </section>
    </div>
  );
}
