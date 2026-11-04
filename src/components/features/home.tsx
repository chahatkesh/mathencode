"use client";

import { useEffect, useState } from "react";
import ContactForm from "~/components/features/contact-form";
import ContactFormPopup from "~/components/features/contact-form-popup";
import Courses from "~/components/features/courses";
import Founder from "~/components/features/founder";
import Hero from "~/components/features/hero";
import Testimonial from "~/components/features/testimonial";
import UniqueApproach from "~/components/features/unique-approach";
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
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  useEffect(() => {
    const handleOpenDemoPopup = () => {
      openPopup();
    };

    window.addEventListener("openDemoPopup", handleOpenDemoPopup);

    return () => {
      window.removeEventListener("openDemoPopup", handleOpenDemoPopup);
    };
  }, []);

  return (
    <div>
      <Hero onBookDemo={openPopup} />
      <Founder />
      <UniqueApproach />
      <Courses
        courses={courses}
        unavailable={coursesUnavailable}
        hasCommonTest={hasCommonTest}
      />
      <Testimonial onBookDemo={openPopup} />
      <ContactForm />
      <ContactFormPopup isOpen={isPopupOpen} setIsOpen={setIsPopupOpen} />
    </div>
  );
}
