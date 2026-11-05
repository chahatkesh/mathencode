import dynamic from "next/dynamic";
import Courses from "~/components/features/courses";
import Founder from "~/components/features/founder";
import Hero from "~/components/features/hero";
import HowItWorks from "~/components/features/how-it-works";
import type { MarketingCourse } from "~/types";

const Testimonial = dynamic(() => import("~/components/features/testimonial"));
const ContactForm = dynamic(() => import("~/components/features/contact-form"));

export default function Home({
  courses,
  coursesUnavailable = false,
}: {
  courses: MarketingCourse[];
  coursesUnavailable?: boolean;
}) {
  return (
    <div>
      <Hero />
      <HowItWorks />
      <Courses courses={courses} unavailable={coursesUnavailable} />
      <Founder />
      <Testimonial />
      <ContactForm />
    </div>
  );
}
