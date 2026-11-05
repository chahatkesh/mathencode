"use client";

import DemoRequestForm from "~/components/features/demo-request-form";
import SectionHeading from "~/components/layout/section-heading";

const points = [
  "A live class in a batch of about 4–5",
  "Weekday and weekend times",
  "No commitment after the demo",
];

const ContactForm = () => {
  return (
    <section
      id="join"
      className="scroll-mt-[var(--site-header)] bg-[#FFF7F2] py-16 md:py-24"
    >
      <div className="container-custom">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-16">
          <div className="lg:pt-4">
            <SectionHeading
              align="left"
              title="Book a free demo"
              subtitle="Tell us the course and what feels hard. We’ll suggest a batch that fits."
            />
            <ul className="mt-8 space-y-3">
              {points.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 text-sm text-dark/80"
                >
                  <span
                    aria-hidden
                    className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-secondary"
                  />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-black/[0.06] bg-white p-6 sm:p-8">
            <DemoRequestForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
