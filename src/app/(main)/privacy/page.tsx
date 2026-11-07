import { ArrowUpRight, Mail, ShieldCheck } from "lucide-react";
import JsonLd from "~/components/seo/json-ld";
import { privacyGraph, privacyMetadata, privacyUpdatedLabel } from "~/lib/seo";
import "~/styles/public-careers.css";

export const metadata = privacyMetadata;

const sections = [
  {
    title: "Information you give us",
    paragraphs: [
      "When you book a demo, we ask for your name, email, phone number, and an optional note about the course or topic.",
      "When a student takes a diagnostic test, we ask for the student’s name, phone number, and country. We also store the answers, the score, and how long the test took.",
      "When you apply to teach, we ask for your name, email, phone number, the subject you teach, and a note about your teaching.",
    ],
  },
  {
    title: "Information stored on your device",
    paragraphs: [
      "While a diagnostic test is open, the answers stay in that browser until you submit the test or leave the page.",
      "We do not use advertising or analytics cookies. People who sign in to the admin area get a session cookie so they stay signed in.",
    ],
  },
  {
    title: "How we use it",
    paragraphs: [
      "We use this information to reply to a demo request, score a diagnostic and follow up, review a tutor application, and run the site.",
      "We do not sell personal information.",
    ],
  },
  {
    title: "Who can see it",
    paragraphs: [
      "People at MathEncode who schedule classes, review tests, or read applications can see the details they need for that work.",
      "The companies that host the site and store our database process this information so the site can run.",
      "If you write to us on WhatsApp or by email, those services receive what you send them.",
    ],
  },
  {
    title: "How long we keep it",
    paragraphs: [
      "We keep a demo request, a test result, or an application for as long as we need it to respond, teach, and keep a record of that request.",
      "You can ask us to delete your information. Write to learn@mathencode.com.",
    ],
  },
  {
    title: "Students",
    paragraphs: [
      "Classes run in small cohorts of about 4–5 students. A parent, a guardian, or a student may send a name, a course, and a phone number so we can place a class or score a test.",
      "A parent or guardian can ask us to delete that information.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="privacy-page">
      <JsonLd data={privacyGraph()} />
      <section className="site-container privacy-hero">
        <div>
          <p className="public-eyebrow">The important details</p>
          <h1 className="public-display">Privacy Policy</h1>
          <p className="public-pill privacy-updated">
            Last updated {privacyUpdatedLabel()}
          </p>
          <p className="public-lead">
            MathEncode teaches math in small groups of about 4–5 students. This
            page explains what we collect on this site and how we use it.
          </p>
        </div>
        <div className="privacy-illustration" aria-hidden="true">
          <span className="privacy-illustration-star">✳</span>
          <ShieldCheck size={76} strokeWidth={1.4} />
          <span>
            Your information.
            <br />
            Explained simply.
          </span>
        </div>
      </section>

      <div className="site-container privacy-content-grid">
        <nav className="privacy-contents" aria-label="Privacy policy contents">
          <p className="public-eyebrow">On this page</p>
          <ol>
            {sections.map((section, index) => (
              <li key={section.title}>
                <a href={`#privacy-section-${index + 1}`}>
                  <span aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {section.title}
                </a>
              </li>
            ))}
            <li>
              <a href="#privacy-contact">
                <Mail size={16} aria-hidden="true" /> Contact
              </a>
            </li>
          </ol>
        </nav>

        <div className="privacy-policy-panel">
          {sections.map((section, index) => (
            <section
              key={section.title}
              id={`privacy-section-${index + 1}`}
              className="privacy-policy-section"
            >
              <div className="privacy-section-heading">
                <span className="privacy-section-number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2>{section.title}</h2>
              </div>
              <div className="privacy-paragraphs">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}

          <section id="privacy-contact" className="privacy-contact">
            <Mail size={28} aria-hidden="true" />
            <h2>Contact</h2>
            <p>
              Questions about this policy can go to{" "}
              <a href="mailto:learn@mathencode.com">
                learn@mathencode.com
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
