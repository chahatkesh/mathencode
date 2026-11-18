import {
  ClassScene,
  CoursesArt,
  DiagnosticScene,
  RateArt,
  ScoreScene,
  ScoresArt,
  StudentsArt,
  YearsArt,
} from "~/components/features/about-art";
import { outcomeStats } from "~/data/public-facts";

const steps = [
  {
    key: "find",
    index: "01",
    label: "Find",
    title: "Diagnostic",
    text: "A free assessment shows what the student already understands, and which course fits.",
    art: DiagnosticScene,
  },
  {
    key: "learn",
    index: "02",
    label: "Learn",
    title: "Live classes",
    text: "The matched course is taught live, in a small cohort with a teacher.",
    art: ClassScene,
  },
  {
    key: "score",
    index: "03",
    label: "Score",
    title: "The AP exam",
    text: "Students practice AP-style questions, then sit the exam.",
    art: ScoreScene,
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

export default function Founder({ courseCount }: { courseCount: number }) {
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

  return (
    <section id="about-us" className="public-section">
      <div className="site-container">
        <h2 className="about-statement">
          About <span className="scribble">MathEncode.</span>
        </h2>
        <p className="public-lead about-intro">
          Live small-group classes for AP mathematics.
        </p>

        <div id="how-it-works" className="about-path">
          <ol
            className="path-grid"
            aria-label="How a student goes from a diagnostic to the AP exam"
          >
            {steps.map((step) => (
              <li key={step.key} className={`path-step path-step--${step.key}`}>
                <div className="path-stage" aria-hidden="true">
                  <step.art />
                </div>
                <div className="path-heading">
                  <p className="path-kicker">
                    <span>{step.index}</span>
                    {step.label}
                  </p>
                  <h3>{step.title}</h3>
                </div>
                <p className="path-caption">{step.text}</p>
              </li>
            ))}
          </ol>
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
