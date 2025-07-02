import React, { useState } from "react";
import Hero from "../components/Hero";
import Testimonial from "../components/Testimonial";
import ContactForm from "../components/ContactForm";
import Founder from "../components/Founder";
import UniqueApproach from "../components/UniqueApproach";
import Courses from "../components/Courses";
import ContactFormPopup from "../components/ContactFormPopup";

const Home = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  return (
    <div>
      <Hero onBookDemo={openPopup} />
      <Founder />
      <UniqueApproach />
      <Courses />
      <Testimonial />
      <ContactForm />
      <ContactFormPopup isOpen={isPopupOpen} setIsOpen={setIsPopupOpen} />
    </div>
  );
};

export default Home;
