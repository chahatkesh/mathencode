import React from "react";
import Hero from "../components/Hero";
import Testimonial from "../components/Testimonial";
import Cta from "../components/Cta";
import Founder from "../components/Founder";
import StudentAchievement from "../components/StudentAchievement";
import UniqueApproach from "../components/UniqueApproach";

const Home = () => {
  return (
    <div>
      <Hero />
      <Founder />
      <UniqueApproach />
      <StudentAchievement />
      <Testimonial />
      <Cta />
    </div>
  );
};

export default Home;
