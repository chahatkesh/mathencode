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
        "Every student is unique! We adapt our teaching to match your learning style and pace, so you can succeed in your own way.",
      color: "secondary",
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Problem-Solving Focus",
      description:
        "Learn to tackle any math problem with confidence! We teach you step-by-step strategies that make even tough problems feel easy.",
      color: "accent",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Growth Mindset",
      description:
        "Mistakes are just learning opportunities! We help you build confidence and show you that with practice, you can master anything.",
      color: "purple",
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Real-World Applications",
      description:
        "See how math applies to your daily life and future career! We make every lesson relevant and exciting by connecting it to the real world.",
      color: "bright-yellow",
    },
    {
      icon: <BookText className="w-6 h-6" />,
      title: "Complete Curriculum",
      description:
        "From basic algebra to advanced calculus—we've got you covered! Our programs grow with you and prepare you for academic success.",
      color: "orange",
    },
  ];

  return (
    <section
      id="approach"
      className="py-16 md:py-24 bg-gradient-to-b from-white to-neutral">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center mb-4">
            <div className="h-1 w-12 bg-primary mr-4"></div>
            <h2 className="text-lg font-montserrat text-primary">
              OUR APPROACH
            </h2>
            <div className="h-1 w-12 bg-primary ml-4"></div>
          </div>
          <h3 className="section-title">Making Math Click for Every Student</h3>
          <p className="section-subtitle">
            From struggling with basics to mastering advanced concepts—our proven methods help students build confidence and achieve real results.
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
