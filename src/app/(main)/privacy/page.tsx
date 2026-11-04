import JsonLd from "~/components/seo/json-ld";
import { privacyGraph, privacyMetadata, privacyUpdatedLabel } from "~/lib/seo";

export const metadata = privacyMetadata;

const sections = [
  {
    title: "Information you give us",
    paragraphs: [
      "When you book a demo, we ask for your name, email, phone number, and an optional note about grade or topic.",
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
      "Classes are for grades K–12. A parent, a guardian, or a student may send a name, a grade, and a phone number so we can place a class or score a test.",
      "A parent or guardian can ask us to delete that information.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <section className="bg-white pb-20 pt-[calc(var(--site-header)+2.5rem)]">
      <JsonLd data={privacyGraph()} />
      <div className="container-custom">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-dark md:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm font-medium text-dark/45">
            Last updated {privacyUpdatedLabel()}
          </p>
          <p className="mt-4 text-base leading-relaxed text-dark/65 md:text-lg">
            MathEncode teaches math one-to-one for grades K–12. This page
            explains what we collect on this site and how we use it.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-2xl space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold tracking-tight text-dark">
                {section.title}
              </h2>
              <div className="mt-3 space-y-3">
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-base leading-relaxed text-dark/65"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}

          <section>
            <h2 className="text-xl font-semibold tracking-tight text-dark">
              Contact
            </h2>
            <p className="mt-3 text-base leading-relaxed text-dark/65">
              Questions about this policy can go to{" "}
              <a
                href="mailto:learn@mathencode.com"
                className="font-medium text-secondary hover:text-secondary/80"
              >
                learn@mathencode.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
