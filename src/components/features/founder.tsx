import {
  BooksIcon,
  GradesIcon,
  IdeaIcon,
  LiveIcon,
  MedalIcon,
  OneStudentIcon,
  StudentsIcon,
} from "~/components/icons/brand-icons";
import SectionHeading from "~/components/layout/section-heading";

const principles = [
  {
    title: "One student",
    text: "Live, one-to-one lessons. The class moves at the pace of the person in it.",
    wash: "bg-[#FFF1E6]",
    icon: OneStudentIcon,
  },
  {
    title: "One idea",
    text: "We slow the hard part down, then stay with it until the student can use it.",
    wash: "bg-[#FFF8E8]",
    icon: IdeaIcon,
  },
  {
    title: "Every grade",
    text: "Programs run from K through 12. A short diagnostic helps when the right course is not obvious.",
    wash: "bg-[#F3F6F7]",
    icon: GradesIcon,
  },
];

const facts = [
  { value: "5+ years", label: "Teaching", icon: MedalIcon },
  { value: "50+", label: "Students", icon: StudentsIcon },
  { value: "K–12", label: "Every grade", icon: BooksIcon },
  { value: "1:1", label: "Live classes", icon: LiveIcon },
];

const Founder = () => {
  return (
    <section
      id="about-us"
      className="scroll-mt-[var(--site-header)] bg-white py-16 md:py-24"
    >
      <div className="container-custom">
        <SectionHeading
          title="About MathEncode"
          subtitle="Personal coaching that makes math clear, one idea at a time."
        />

        <div className="mt-14 grid items-center gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <p className="text-balance text-xl font-semibold tracking-tight text-dark sm:text-2xl md:text-3xl md:leading-snug">
            We teach one student at a time, and stay with an idea until it
            sticks.
          </p>
          <div className="space-y-4 text-base leading-relaxed text-dark/70">
            <p>
              MathEncode is live coaching for grades K–12. A lesson slows down
              where the work is hard, then builds until the student can use the
              idea alone.
            </p>
            <p>
              Each program follows a grade. When the next course is unclear, a
              free diagnostic shows where to begin.
            </p>
          </div>
        </div>

        <ol className="mt-14 grid gap-4 md:grid-cols-3">
          {principles.map((item) => (
            <li key={item.title} className={`rounded-2xl p-6 ${item.wash}`}>
              <item.icon />
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-dark">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-dark/70">
                {item.text}
              </p>
            </li>
          ))}
        </ol>

        <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="rounded-2xl border border-black/[0.06] bg-white px-5 py-5"
            >
              <fact.icon />
              <dt className="mt-4 text-xl font-semibold tracking-tight text-dark sm:text-2xl">
                {fact.value}
              </dt>
              <dd className="mt-1 text-sm text-dark/50">{fact.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default Founder;
