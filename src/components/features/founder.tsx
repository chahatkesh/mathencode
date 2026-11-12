import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { outcomeStats } from "~/data/public-facts";

function Concepts() {
  return (
    <div className="about-one" aria-hidden="true">
      <svg className="about-concept" viewBox="0 0 120 120">
        <path
          d="M18 96h86M28 104V24"
          fill="none"
          stroke="#263238"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M34 80c14-6 22-40 34-40s16 24 30 8"
          fill="none"
          stroke="#ff6700"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function LiveClass() {
  return (
    <svg className="about-live" viewBox="0 0 200 180" aria-hidden="true">
      <rect
        x="36"
        y="16"
        width="128"
        height="84"
        rx="16"
        fill="#fffdf8"
        stroke="#263238"
        strokeWidth="3"
      />
      <circle cx="100" cy="58" r="16" fill="#ff6700" />
      <circle cx="62" cy="146" r="16" fill="#263238" />
      <circle cx="100" cy="136" r="18" fill="#263238" />
      <circle cx="138" cy="146" r="16" fill="#263238" />
    </svg>
  );
}

function TheTest() {
  return (
    <svg className="about-test" viewBox="0 0 180 180" aria-hidden="true">
      <rect
        x="42"
        y="24"
        width="96"
        height="128"
        rx="14"
        fill="#fffdf8"
        stroke="#263238"
        strokeWidth="3"
      />
      <path
        d="M68 92l16 16 32-36"
        fill="none"
        stroke="#ff6700"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const marks = [
  {
    title: "Reasoning",
    text: "Students learn why a method works, and how each step follows.",
    graphic: Concepts,
  },
  {
    title: "Live guidance",
    text: "A teacher explains the idea with the cohort and works the problems live.",
    graphic: LiveClass,
  },
  {
    title: "Application",
    text: "Students use those ideas on questions in AP exam form.",
    graphic: TheTest,
  },
];

const steps = [
  {
    title: "Diagnostic",
    text: "A free assessment shows what the student already understands.",
  },
  {
    title: "Course match",
    text: "The result points to a course at the right level.",
  },
  {
    title: "Live classes",
    text: "The cohort studies that course with a teacher.",
  },
  {
    title: "AP-style practice",
    text: "Students apply the concepts to questions in exam form.",
  },
  {
    title: "The exam",
    text: "Students sit the exam that course prepares them for.",
  },
];

export default function Founder({
  courseCount,
  hasCommonTest,
}: {
  courseCount: number;
  hasCommonTest: boolean;
}) {
  const facts = [
    ...outcomeStats,
    ...(courseCount > 0
      ? [
          {
            value: String(courseCount),
            label: courseCount === 1 ? "Course open now" : "Courses open now",
          },
        ]
      : []),
  ];
  const diagnosticHref = hasCommonTest
    ? "/diagnostic/common"
    : "/courses#diagnostic";

  return (
    <section id="about-us" className="public-section">
      <div className="site-container">
        <p className="public-eyebrow text-center">Our approach</p>
        <h2 className="about-statement">
          Understanding mathematics.{" "}
          <span className="scribble">Not memorizing it.</span>
        </h2>
        <p className="public-lead about-intro">
          Students learn why a method works, build a clear picture of the idea,
          and use it on AP-style questions.
        </p>
        <ul className="about-board">
          {marks.map((mark) => (
            <li key={mark.title} className="about-tile">
              <div className="about-art">
                <mark.graphic />
              </div>
              <div className="about-tile-copy">
                <h3>{mark.title}</h3>
                <p>{mark.text}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="about-trust" aria-labelledby="about-trust-title">
          <h3 id="about-trust-title" className="how-title">
            In numbers.
          </h3>
          <dl className="fact-row">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className={
                  fact.label === "Students taught" ||
                  fact.label === "AP success rate"
                    ? "fact-card fact-card--lead"
                    : "fact-card"
                }
              >
                <dt>{fact.value}</dt>
                <dd>{fact.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div id="how-it-works" className="about-path">
          <h3 className="how-title">
            From the diagnostic to <span className="scribble">the exam.</span>
          </h3>
          <ol
            className="flow"
            aria-label="How a student goes from a diagnostic to the AP exam"
          >
            {steps.map((step, index) => (
              <li key={step.title}>
                <span className="step-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="how-next">
            <Link
              href={diagnosticHref}
              className="public-button public-button--orange"
            >
              Take the free diagnostic <ArrowUpRight aria-hidden />
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
