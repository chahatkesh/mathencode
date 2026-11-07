import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

function OneIdea() {
  return (
    <div className="about-one" aria-hidden="true">
      <span>1</span>
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
  { title: "One idea", graphic: OneIdea },
  { title: "Live class", graphic: LiveClass },
  { title: "The test", graphic: TheTest },
];

const steps = [
  {
    title: "Take a test",
    text: "See where you stand.",
  },
  {
    title: "See the gaps",
    text: "Find what is missing.",
  },
  {
    title: "Choose a course",
    text: "Pick the one that fits.",
  },
  {
    title: "Learn one-on-one",
    text: "A teacher works with you, one idea at a time.",
  },
  {
    title: "Sit the exam",
    text: "Go in ready for the exam that course leads to.",
  },
];

export default function Founder() {
  return (
    <section id="about-us" className="public-section">
      <div className="site-container">
        <p className="public-eyebrow text-center">About us</p>
        <h2 className="about-statement">
          One idea <span className="scribble">at a time.</span>
        </h2>
        <ul className="about-board">
          {marks.map((mark) => (
            <li key={mark.title} className="about-tile">
              <mark.graphic />
              <h3>{mark.title}</h3>
            </li>
          ))}
        </ul>
        <div id="how-it-works" className="about-path">
          <h3 className="how-title">
            From a test to <span className="scribble">the exam.</span>
          </h3>
          <ol
            className="flow"
            aria-label="How a student goes from a test to the exam"
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
            <Link href="/which-course" className="text-link">
              Attempt free test <ArrowUpRight aria-hidden />
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
