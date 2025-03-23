import React from "react";
import Hero from "../components/Hero";
import Testimonial from "../components/Testimonial";
import JoinHelp from "../components/JoinHelp";
import Founder from "../components/Founder";
import StudentAchievement from "../components/StudentAchievement";
import UniqueApproach from "../components/UniqueApproach";
import Courses from "../components/Courses";

const Home = () => {
  return (
    <div>
      <Hero />
      <Founder />
      <UniqueApproach />
      <Courses />
      <StudentAchievement />
      <Testimonial />
      <JoinHelp />
    </div>
  );
};

export default Home;
