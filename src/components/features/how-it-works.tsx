import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "~/components/layout/section-heading";

const steps = [
  {
    meta: "35 min",
    title: "Take the diagnostic",
    text: "Course-specific, or the Placement Test if you're unsure.",
  },
  {
    meta: "Instant",
    title: "Get the gap report",
    text: "Strengths, gaps in plain English, and a placement parents get by email.",
  },
  {
    meta: "15 min",
    title: "Review call with your instructor",
    text: "Agree on a target AP score and a plan for the semester.",
  },
  {
    meta: "48 hours",
    title: "Join your cohort",
    text: "Five students, live, with the same instructor through the AP exam.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="public-section how-section">
      <div className="site-container how-grid">
        <div className="how-intro">
          <SectionHeading
            align="left"
            eyebrow="A little clarity goes a long way"
            title={
              <>
                How it <span className="scribble">works.</span>
              </>
            }
            subtitle="From the first diagnostic to your first class. A clear next step, every step of the way."
          />
          <Image
            src="/assets/learning/online-learning.jpg"
            alt="Students working together at computers"
            width={800}
            height={616}
            sizes="(max-width: 767px) 90vw, 45vw"
          />
          <Link href="/which-course" className="text-link">
            Find your starting point <ArrowUpRight aria-hidden />
          </Link>
        </div>
        <ol className="steps">
          {steps.map((step, index) => (
            <li key={step.title}>
              <span className="step-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3>{step.title}</h3>
                <span className="step-meta">{step.meta}</span>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
