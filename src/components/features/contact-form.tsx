import Image from "next/image";
import { CircleCheck } from "lucide-react";
import DemoRequestForm from "~/components/features/demo-request-form";
import SectionHeading from "~/components/layout/section-heading";

const points = [
  "A live class with a teacher",
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
            eyebrow="Free demo"
            title={
              <>
                Book a <span className="scribble">free demo.</span>
              </>
            }
            subtitle="Tell us the course you are considering. We will help you choose a next step."
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
            <p>A course does not have to be chosen yet.</p>
          </div>
        </div>
        <div className="demo-form-card">
          <h3>Tell us where to start.</h3>
          <DemoRequestForm />
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
