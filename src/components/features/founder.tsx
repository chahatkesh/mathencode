import Image from "next/image";
import { BookOpen, Lightbulb, Users } from "lucide-react";
import SectionHeading from "~/components/layout/section-heading";

const principles = [
  {
    title: "Small batches",
    text: "Each class is a group of about 4–5 students, small enough that questions get answered in the room.",
    icon: Users,
  },
  {
    title: "One idea",
    text: "We slow the hard part down, then stay with it until the batch can use it.",
    icon: Lightbulb,
  },
  {
    title: "A clear course",
    text: "Each course lists its topics and start date. A short diagnostic helps when the next course is not obvious.",
    icon: BookOpen,
  },
];

export default function Founder() {
  return (
    <section id="about-us" className="public-section">
      <div className="site-container">
        <p className="public-eyebrow text-center">The MathEncode way</p>
        <h2 className="about-statement">
          A small batch stays with an idea{" "}
          <span className="scribble">until it sticks.</span>
        </h2>
        <div className="about-grid">
          <div className="about-photo">
            <Image
              src="/assets/learning/learning-moment.jpg"
              alt="Student concentrating on her work"
              width={800}
              height={910}
              sizes="(max-width: 767px) 90vw, 45vw"
            />
            <div className="about-badge">
              <strong>4–5</strong>
              <span>students. Every voice heard.</span>
            </div>
          </div>
          <div>
            <SectionHeading
              align="left"
              title="About MathEncode"
              subtitle="Small-group classes that make math clear, one idea at a time."
            />
            <div className="public-lead mt-6 space-y-4">
              <p>
                MathEncode teaches live, in groups of about 4–5 students. A
                lesson slows down where the work is hard, then builds until the
                batch can use the idea.
              </p>
              <p>
                Each course has its own topics and start date. When the next
                course is unclear, a free diagnostic shows where to begin.
              </p>
            </div>
            <ol className="principles">
              {principles.map((item) => (
                <li key={item.title}>
                  <span className="principle-icon">
                    <item.icon size={22} aria-hidden />
                  </span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
