import Image from "next/image";
import { CircleCheck } from "lucide-react";
import DemoRequestForm from "~/components/features/demo-request-form";
import SectionHeading from "~/components/layout/section-heading";

const points = [
  "A live class in a cohort of about 4–5",
  "Weekday and weekend times",
  "No commitment after the demo",
];

const ContactForm = () => {
  return (
    <section id="join" className="public-section">
      <div className="site-container contact-grid">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Your next chapter starts here"
            title={
              <>
                Book a <span className="scribble">free demo.</span>
              </>
            }
            subtitle="Tell us the course and what feels hard. We’ll suggest a cohort that fits."
          />
          <ul className="contact-points">
            {points.map((point) => (
              <li key={point}>
                <CircleCheck aria-hidden />
                {point}
              </li>
            ))}
          </ul>
          <div className="contact-note">
            <Image
              src="/assets/learning/smile.svg"
              alt=""
              width={80}
              height={74}
            />
            <p>
              No pressure to have it all figured out. That’s what the first
              conversation is for.
            </p>
          </div>
        </div>
        <div className="demo-form-card">
          <h3>Let’s make math click.</h3>
          <DemoRequestForm />
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
