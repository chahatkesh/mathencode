import React from "react";
import {
  BrainCircuit,
  Target,
  Lightbulb,
  TrendingUp,
  Star,
  BookText,
  ChevronRight,
} from "lucide-react";

const UniqueApproach = () => {
  const approaches = [
    {
      icon: <BrainCircuit className="w-6 h-6" />,
      title: "Conceptual Clarity",
      description:
        "We go beyond memorization, ensuring students truly understand the why behind mathematical concepts for long-term retention.",
      color: "primary",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Personalized Learning",
      description:
        "Every student learns differently. Our curriculum adapts to individual learning styles, pacing, and strengths to maximize their potential.",
      color: "secondary",
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Problem-Solving Focus",
      description:
        "We teach students how to approach problems systematically, helping them develop critical thinking skills that go beyond the classroom.",
      color: "accent",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Growth Mindset",
      description:
        "We instill a positive attitude toward challenges, showing students that dedication and practice lead to mastery.",
      color: "purple",
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Real-World Applications",
      description:
        "From everyday scenarios to future careers, we connect math to real life, making learning meaningful and motivating.",
      color: "bright-yellow",
    },
    {
      icon: <BookText className="w-6 h-6" />,
      title: "Comprehensive Curriculum",
      description:
        "Covering everything from pre-algebra to advanced calculus, our courses align with school standards and go beyond to ensure deep understanding.",
      color: "orange",
    },
  ];

  return (
    <section
      id="approach"
      className="py-16 md:py-24 bg-gradient-to-b from-white to-neutral">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
            OUR METHODOLOGY
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-montserrat text-dark mb-6">
            Beyond Numbers: <span className="text-primary">Our Approach</span>
          </h2>
          <p className="text-lg text-dark/70">
            We believe math isn't just about numbers—it's about thinking,
            problem-solving, and applying knowledge to the real world. Our
            coaching approach is designed to help students not only understand
            math but also enjoy learning it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {approaches.map((approach, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
              <div className={`h-2 bg-${approach.color} w-full`}></div>
              <div className="p-6 md:p-8">
                <div
                  className={`w-14 h-14 bg-${approach.color}/10 rounded-xl flex items-center justify-center mb-5 text-${approach.color} group-hover:bg-${approach.color} transition-colors duration-300`}>
                  {approach.icon}
                </div>
                <h3 className="text-xl font-bold text-dark mb-3">
                  {approach.title}
                </h3>
                <p className="text-dark/70 mb-4">{approach.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UniqueApproach;
