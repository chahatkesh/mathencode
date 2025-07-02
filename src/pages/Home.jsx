import React from "react";
import Hero from "../components/Hero";
import Testimonial from "../components/Testimonial";
import ContactForm from "../components/ContactForm";
import Founder from "../components/Founder";
import UniqueApproach from "../components/UniqueApproach";
import Courses from "../components/Courses";
import ContactFormPopup from "../components/ContactFormPopup";

const Home = () => {
  return (
    <div>
      <Hero />
      <Founder />
      <UniqueApproach />
      <Courses />
      <Testimonial />
      <ContactForm />
      <ContactFormPopup />
    </div>
  );
};

export default Home;
