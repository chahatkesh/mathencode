import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { BookDemoButton } from "~/components/layout/book-demo-button";

const stats = [
  ["5+ years", "Teaching experience"],
  ["50+", "Students coached"],
  ["4–5", "Students per batch"],
  ["Live", "Small-group classes"],
];

export default function Hero() {
  return (
    <section id="hero" className="home-hero" aria-labelledby="hero-title">
      <div className="site-container hero-heading">
        <span className="public-pill">Small groups. Big possibilities.</span>
        <h1 id="hero-title" className="public-display">
          Transform your math
          <br /> <span className="scribble">journey today.</span>
        </h1>
        <p className="public-lead">
          Live lessons in batches of about 4–5 students. We slow each idea down
          until it sticks, then build the confidence to use it.
        </p>
        <div className="hero-actions">
          <BookDemoButton className="public-button public-button--orange">
            Book a free demo <ArrowUpRight aria-hidden />
          </BookDemoButton>
          <a href="#courses" className="public-button public-button--outline">
            Explore courses
          </a>
        </div>
      </div>
      <div className="hero-collage">
        <svg className="hero-ribbon" viewBox="0 0 1440 380" aria-hidden="true">
          <defs>
            <path
              id="learning-ribbon"
              d="M-80 210 C180 470 340 -60 650 160 S1040 340 1200 150 S1420 60 1530 190"
            />
          </defs>
          <use
            href="#learning-ribbon"
            fill="none"
            stroke="#37474f"
            strokeWidth="54"
          />
          <text dy="8">
            <textPath href="#learning-ribbon" startOffset="6%">
              Small-group classes · One idea at a time · Build your confidence ·
              Learn together · Make math click ·
            </textPath>
          </text>
        </svg>
        <div className="hero-photo hero-photo--left">
          <Image
            src="/assets/learning/young-learner.jpg"
            alt="Young learner working through a lesson"
            width={259}
            height={313}
            sizes="(max-width: 767px) 118px, 200px"
          />
        </div>
        <div className="hero-photo hero-photo--center">
          <Image
            src="/assets/learning/hero-student.jpg"
            alt="Student holding her books in a classroom"
            width={553}
            height={662}
            sizes="(max-width: 767px) 235px, 330px"
            priority
          />
        </div>
        <div className="hero-photo hero-photo--right">
          <Image
            src="/assets/learning/learning-together.jpg"
            alt="Two students learning together"
            width={259}
            height={313}
            sizes="(max-width: 767px) 118px, 200px"
          />
        </div>
        <Image
          className="hero-smile"
          src="/assets/learning/smile.svg"
          alt=""
          width={80}
          height={74}
        />
        <span className="hero-equation" aria-hidden="true">
          x + y
        </span>
        <p className="hero-note">One concept, fully understood.</p>
      </div>
      <div className="site-container">
        <dl className="hero-facts">
          {stats.map(([value, label]) => (
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
