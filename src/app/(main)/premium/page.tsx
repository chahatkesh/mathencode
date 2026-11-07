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
    text: "A school syllabus, an exam, or a gap between two courses. If it is not on the course list, start here.",
    tone: "peach",
  },
  {
    title: "A pace for one student",
    text: "Stay with one idea until it is solid, then move on. There is no cohort to wait for.",
    tone: "sky",
  },
  {
    title: "A plan in your words",
    text: "A parent or a student says what done looks like. We reply with a way to begin.",
    tone: "lime",
  },
];

const steps = [
  {
    title: "Tell us the goal",
    text: "What to learn, and what you are hoping will change.",
  },
  {
    title: "We reply with a plan",
    text: "A note back by email, with a way to start.",
  },
  {
    title: "Learn one-on-one",
    text: "A teacher works with one student, one idea at a time.",
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
            A course of <span className="scribble">your own.</span>
          </h1>
          <p className="public-lead">
            Listed classes are small groups on a shared path. Premium mentorship
            is private. If the topic you want is not on the course list, tell us
            what to teach and what you hope to get from it.
          </p>
          <div className="premium-hero-actions">
            <a href="#request" className="public-button public-button--orange">
              Request mentorship <ArrowDown size={18} aria-hidden="true" />
            </a>
            <Link
              href="/#courses"
              className="public-button public-button--outline"
            >
              See listed courses
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
              src="/assets/learning/learning-moment.jpg"
              alt="A student working through a lesson on their own"
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
              One idea at a time.
            </span>
          </div>
        </div>
      </section>

      <section
        className="public-section premium-fit"
        aria-labelledby="premium-fit-title"
      >
        <div className="site-container">
          <p className="public-eyebrow">When a listed course is not enough</p>
          <h2 id="premium-fit-title" className="public-title">
            Tell us the course you wish existed.
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
            How a request <span className="scribble">becomes a plan.</span>
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
            <p className="public-eyebrow">Reach out</p>
            <h2 id="premium-request-title" className="public-title">
              What you want, in your words.
            </h2>
            <p className="public-lead">
              A parent or a student can send this. Share the topic, the level,
              and what you are hoping for. If a listed course is close but not
              quite right, say what you would change.
            </p>
            <ul className="premium-points">
              <li>Your name, email, country, and a mobile number</li>
              <li>The course or topic you want, even if we do not list it</li>
              <li>What you expect from the teaching</li>
            </ul>
          </div>
          <div className="demo-form-card premium-form-card">
            <h3>Request one-on-one mentorship</h3>
            <MentorshipRequestForm sourceCourse={sourceCourse} />
          </div>
        </div>
      </section>
    </div>
  );
}
