import dynamic from "next/dynamic";
import Courses from "~/components/features/courses";
import Founder from "~/components/features/founder";
import Hero from "~/components/features/hero";
import type { MarketingCourse } from "~/types";

const Testimonial = dynamic(() => import("~/components/features/testimonial"));
const ContactForm = dynamic(() => import("~/components/features/contact-form"));

export default function Home({
  courses,
  coursesUnavailable = false,
  hasCommonTest = false,
}: {
  courses: MarketingCourse[];
  coursesUnavailable?: boolean;
  hasCommonTest?: boolean;
}) {
  return (
    <div>
      <Hero courses={courses} />
      <Courses
        courses={courses}
        unavailable={coursesUnavailable}
        hasCommonTest={hasCommonTest}
      />
      <Founder />
      <Testimonial />
      <ContactForm />
    </div>
  );
}
