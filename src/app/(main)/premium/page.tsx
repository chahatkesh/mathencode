import { ArrowDown, ArrowUpRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "~/components/seo/json-ld";
import MentorshipRequestForm from "~/components/features/mentorship-request-form";
import { readPublicCourse } from "~/lib/public-reads";
import { premiumGraph, premiumMetadata } from "~/lib/seo";
import "~/styles/public-premium.css";

export const metadata = premiumMetadata;

const reasons = [
  {
    title: "A topic that is not listed",
    text: "A school unit, an exam, or a gap between two courses.",
    tone: "peach",
  },
  {
    title: "One student's pace",
    text: "The lesson moves when that student is ready for the next topic.",
    tone: "sky",
  },
  {
    title: "A plan you describe",
    text: "Tell us the goal. We reply by email with a way to begin.",
    tone: "lime",
  },
];

const steps = [
  {
    title: "Tell us the goal",
    text: "The course, the level, and what should change.",
  },
  {
    title: "We reply by email",
    text: "You get a note with a way to start.",
  },
  {
    title: "Learn one-on-one",
    text: "A teacher works with one student.",
  },
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
      <section
        className="site-container premium-hero"
        aria-labelledby="premium-title"
      >
        <div className="premium-hero-copy">
          <p className="public-pill">One teacher. One student.</p>
          <h1 id="premium-title" className="public-display">
            A private plan <span className="scribble">for one student.</span>
          </h1>
          <p className="public-lead">
            Listed courses are live cohorts. Premium is one teacher with one
            student, for a topic the course list does not cover.
          </p>
          <div className="premium-hero-actions">
            <a href="#request" className="public-button public-button--orange">
              Request a private plan <ArrowDown size={18} aria-hidden="true" />
            </a>
            <Link
              href="/courses"
              className="public-button public-button--outline"
            >
              Explore courses
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="premium-photo-scene">
          <span className="premium-photo-equation" aria-hidden="true">
            1 student + 1 plan
          </span>
          <div className="premium-photo-frame">
            <Image
              src="/assets/learning/professor.svg"
              alt="Illustration of a teacher working with one student"
              fill
              priority
              sizes="(max-width: 767px) 90vw, 46vw"
            />
          </div>
          <div className="premium-photo-note">
            <Sparkles size={22} aria-hidden="true" />
            <span>
              Private.
              <br />
              One student.
            </span>
          </div>
        </div>
      </section>

      <section
        className="public-section premium-fit"
        aria-labelledby="premium-fit-title"
      >
        <div className="site-container">
          <p className="public-eyebrow">
            When a listed course is not the right fit
          </p>
          <h2 id="premium-fit-title" className="public-title">
            Tell us what you want to learn.
          </h2>
          <ul className="premium-reasons">
            {reasons.map((reason) => (
              <li key={reason.title} data-tone={reason.tone}>
                <h3>{reason.title}</h3>
                <p>{reason.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        className="public-section premium-steps"
        aria-labelledby="premium-steps-title"
      >
        <div className="site-container">
          <p className="public-eyebrow">From a note to a class</p>
          <h2 id="premium-steps-title" className="public-title">
            How a request <span className="scribble">becomes a class.</span>
          </h2>
          <ol>
            {steps.map((step, index) => (
              <li key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
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
        <div className="site-container premium-request-grid">
          <div>
            <p className="public-eyebrow">Request</p>
            <h2 id="premium-request-title" className="public-title">
              Request a private plan.
            </h2>
            <p className="public-lead">
              A parent or a student can send this. Name the topic, the level,
              and what should change.
            </p>
            <ul className="premium-points">
              <li>Your name, email, country, and mobile number</li>
              <li>The course or topic, including one we do not list</li>
              <li>What you want the student to be able to do</li>
            </ul>
          </div>
          <div className="demo-form-card premium-form-card">
            <h3>Request a private plan</h3>
            <MentorshipRequestForm sourceCourse={sourceCourse} />
          </div>
        </div>
      </section>
    </div>
  );
}
