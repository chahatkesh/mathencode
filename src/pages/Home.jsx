import React, { useState, useEffect } from "react";
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

  // Listen for custom event from Navbar
  useEffect(() => {
    const handleOpenDemoPopup = () => {
      openPopup();
    };

    window.addEventListener('openDemoPopup', handleOpenDemoPopup);
    
    return () => {
      window.removeEventListener('openDemoPopup', handleOpenDemoPopup);
    };
  }, []);

  return (
    <div>
      <Hero onBookDemo={openPopup} />
      <Founder />
      <UniqueApproach />
      <Courses />
      <Testimonial onBookDemo={openPopup} />
      <ContactForm />
      <ContactFormPopup isOpen={isPopupOpen} setIsOpen={setIsPopupOpen} />
    </div>
  );
};

export default Home;
