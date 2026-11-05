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
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="bg-white pt-8 sm:pt-10"
    >
      <h2 id="how-it-works-heading" className="sr-only">
        How it works
      </h2>
      <div className="container-custom">
        <ol className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[#f0f0f0] bg-[#ededed] sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="bg-white px-6 py-7 sm:px-7 sm:py-8">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[13px] font-semibold tabular-nums tracking-[0.16em] text-secondary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-xs font-medium text-dark/55">
                  {step.meta}
                </span>
              </div>
              <h3 className="mt-5 text-[17px] font-semibold leading-snug tracking-tight text-dark">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-dark/60">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
