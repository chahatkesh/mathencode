import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  CoursesArt,
  DiagnosticArt,
  ExamArt,
  LiveArt,
  MatchArt,
  PracticeArt,
  RateArt,
  ScoresArt,
  StudentsArt,
  YearsArt,
} from "~/components/features/about-art";
import { outcomeStats } from "~/data/public-facts";

const steps = [
  {
    key: "diagnostic",
    title: "Diagnostic",
    text: "A free assessment shows what the student already understands.",
    art: DiagnosticArt,
  },
  {
    key: "match",
    title: "Course match",
    text: "The result points to a course at the right level.",
    art: MatchArt,
  },
  {
    key: "live",
    title: "Live classes",
    text: "The cohort studies that course with a teacher.",
    art: LiveArt,
  },
  {
    key: "practice",
    title: "AP-style practice",
    text: "Students apply the concepts to questions in exam form.",
    art: PracticeArt,
  },
  {
    key: "exam",
    title: "The exam",
    text: "Students sit the exam that course prepares them for.",
    art: ExamArt,
  },
];

function statKey(label: string) {
  if (label === "Students taught") return "students";
  if (label === "Teaching experience") return "years";
  if (label === "Qualifying AP scores") return "scores";
  if (label === "AP success rate") return "rate";
  return "courses";
}

function StatArt({ statKey: key, value }: { statKey: string; value: string }) {
  if (key === "students") return <StudentsArt />;
  if (key === "years") return <YearsArt value={value} />;
  if (key === "scores") return <ScoresArt />;
  if (key === "rate") return <RateArt value={value} />;
  return <CoursesArt />;
}

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
        <h2 className="about-statement">
          About <span className="scribble">MathEncode.</span>
        </h2>
        <p className="public-lead about-intro">
          Students learn why a method works, build a clear picture of the idea,
          and use it on AP-style questions.
        </p>

        <div id="how-it-works" className="about-path">
          <ol
            className="path-grid"
            aria-label="How a student goes from a diagnostic to the AP exam"
          >
            {steps.map((step, index) => (
              <li
                key={step.title}
                className={`path-card path-card--${step.key}`}
              >
                <span className="path-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="path-art">
                  <step.art />
                </div>
                <div className="path-copy">
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

        <div className="about-trust" aria-labelledby="about-trust-title">
          <h3 id="about-trust-title" className="how-title">
            In numbers.
          </h3>
          <dl className={`stat-grid stat-grid--${facts.length}`}>
            {facts.map((fact) => {
              const key = statKey(fact.label);
              return (
                <div key={fact.label} className={`stat-card stat-card--${key}`}>
                  <div className="stat-art">
                    <StatArt statKey={key} value={fact.value} />
                  </div>
                  <div className="stat-copy">
                    <dt>{fact.value}</dt>
                    <dd>{fact.label}</dd>
                  </div>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}
