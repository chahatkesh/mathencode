"use client";

"use client";

import ContactForm from "~/components/features/contact-form";
import Courses from "~/components/features/courses";
import Founder from "~/components/features/founder";
import Hero from "~/components/features/hero";
import Testimonial from "~/components/features/testimonial";
import { openDemoPopup } from "~/components/layout/demo-help-button";
import type { MarketingCourse } from "~/types";

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
      <Hero onBookDemo={openDemoPopup} courses={courses} />
      <Courses
        courses={courses}
        unavailable={coursesUnavailable}
        hasCommonTest={hasCommonTest}
      />
      <Founder />
      <Testimonial onBookDemo={openDemoPopup} />
      <ContactForm />
    </div>
  );
}
