import Link from "next/link";

const facts = [
  ["Live", "Online classes"],
  ["Small", "Learning cohorts"],
  ["Free", "Diagnostic to start"],
  ["Practice", "AP-style questions"],
];

const steps = [
  {
    title: "Course content",
    text: "The AP course topics.",
  },
  {
    title: "Guided work",
    text: "Problems with a teacher.",
  },
  {
    title: "Exam practice",
    text: "AP exam questions.",
  },
];

const scores = ["1", "2", "3", "4", "5"] as const;

export default function Hero({ hasCommonTest }: { hasCommonTest: boolean }) {
  const diagnosticHref = hasCommonTest
    ? "/diagnostic/common"
    : "/courses#diagnostic";

  return (
    <section id="hero" className="home-hero" aria-labelledby="hero-title">
      <div className="site-container">
        <div className="hero-layout">
          <div className="hero-copy">
            <span className="public-pill">AP exam preparation</span>
            <h1 id="hero-title">
              Prepare for AP Math
              <br /> <span className="scribble">with a clear plan.</span>
            </h1>
            <p className="public-lead">
              A live class that teaches the ideas first, then practices them the
              way the AP exam asks.{" "}
              {hasCommonTest
                ? "Take a free diagnostic, or explore the courses."
                : "Explore the courses to see what is open."}
            </p>
            <div className="hero-actions">
              <Link
                href="/courses"
                className="public-button public-button--orange"
              >
                Explore courses
              </Link>
              <Link
                href={diagnosticHref}
                className="public-button public-button--outline"
              >
                Take the free diagnostic
              </Link>
            </div>
          </div>

          <article className="hero-panel" aria-labelledby="hero-panel-title">
            <p className="hero-kicker">Inside a live class</p>
            <h2 id="hero-panel-title">From the lesson to the score</h2>
            <ol className="hero-steps">
              {steps.map((step, index) => (
                <li key={step.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>
            <div className="hero-score">
              <div className="hero-score-top">
                <h3 id="hero-score-title">Scored from 1 to 5</h3>
                <ul
                  className="score-pips"
                  aria-label="AP exam scores from 1 to 5"
                >
                  {scores.map((score) => (
                    <li
                      key={score}
                      data-credit={Number(score) >= 3 ? "true" : undefined}
                    >
                      {score}
                      {Number(score) >= 3 ? (
                        <span className="sr-only">
                          , a score many colleges use for credit or placement
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
              <p>
                Many colleges use a 3, 4, or 5 for credit or placement. Each
                college sets its own rule.
              </p>
            </div>
          </article>
        </div>
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
  );
}
