"use client";

import {
  BookOpen,
  Brain,
  Lightbulb,
  Star,
  Target,
  TrendingUp,
} from "lucide-react";

const UniqueApproach = () => {
  const approaches = [
    {
      icon: <Brain className="h-7 w-7" />,
      title: "Conceptual Clarity",
      description:
        "We go beyond memorization to ensure students truly understand the why behind maths concepts for lasting retention.",
      gradient: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-100",
      textColor: "text-blue-600",
      borderColor: "border-blue-200",
    },
    {
      icon: <Target className="h-7 w-7" />,
      title: "Personalized Learning",
      description:
        "Every student is unique. We adapt our teaching methods to match your individual learning style and pace for success.",
      gradient: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      iconBg: "bg-emerald-100",
      textColor: "text-emerald-600",
      borderColor: "border-emerald-200",
    },
    {
      icon: <Lightbulb className="h-7 w-7" />,
      title: "Problem-Solving Focus",
      description:
        "Learn systematic approaches to tackle any math problem with confidence using proven step-by-step strategies.",
      gradient: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      iconBg: "bg-amber-100",
      textColor: "text-amber-600",
      borderColor: "border-amber-200",
    },
    {
      icon: <TrendingUp className="h-7 w-7" />,
      title: "Growth Mindset",
      description:
        "Mistakes are learning opportunities. We help you build resilience and confidence to master any mathematical concept.",
      gradient: "from-violet-500 to-violet-600",
      bgColor: "bg-violet-50",
      iconBg: "bg-violet-100",
      textColor: "text-violet-600",
      borderColor: "border-violet-200",
    },
    {
      icon: <Star className="h-7 w-7" />,
      title: "Real-World Applications",
      description:
        "Discover how math connects to daily life and career goals through relevant, engaging lessons and practical examples.",
      gradient: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50",
      iconBg: "bg-pink-100",
      textColor: "text-pink-600",
      borderColor: "border-pink-200",
    },
    {
      icon: <BookOpen className="h-7 w-7" />,
      title: "Complete Curriculum",
      description:
        "From basic algebra to advanced calculus, our comprehensive programs prepare you for academic success at every level.",
      gradient: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      iconBg: "bg-red-100",
      textColor: "text-red-600",
      borderColor: "border-red-200",
    },
  ];

  return (
    <section
      id="approach"
      className="bg-gradient-to-b from-gray-50 to-white py-20 md:py-28"
    >
      <div className="container mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <div className="mx-auto mb-20 max-w-4xl text-center">
          <div className="mb-4 flex items-center justify-center">
            <div className="mr-4 h-1 w-12 bg-primary"></div>
            <h2 className="font-montserrat text-lg text-primary">
              OUR APPROACH
            </h2>
            <div className="ml-4 h-1 w-12 bg-primary"></div>
          </div>
          <h3 className="section-title">Making Math Click for Every Student</h3>
          <p className="section-subtitle">
            From struggling with basics to mastering advanced concepts—our
            proven methods help students build confidence and achieve real
            results.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {approaches.map((approach, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-2xl border bg-white shadow-lg transition-all duration-500 hover:shadow-2xl ${approach.borderColor} cursor-pointer hover:scale-105`}
            >
              {/* Gradient Header */}
              <div
                className={`h-2 bg-gradient-to-r ${approach.gradient}`}
              ></div>

              {/* Card Content */}
              <div
                className={`p-8 ${approach.bgColor} transition-colors duration-300 group-hover:bg-white`}
              >
                {/* Icon Container */}
                <div
                  className={`relative h-16 w-16 ${approach.iconBg} mb-6 flex items-center justify-center rounded-2xl ${approach.textColor} shadow-sm transition-all duration-300 group-hover:scale-110`}
                >
                  {approach.icon}

                  {/* Decorative ring */}
                  <div
                    className={`absolute inset-0 rounded-2xl border-2 ${approach.borderColor} opacity-20 transition-opacity duration-300 group-hover:opacity-60`}
                  ></div>
                </div>

                {/* Title */}
                <h3 className="mb-4 text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-gray-800">
                  {approach.title}
                </h3>

                {/* Description */}
                <p className="leading-relaxed text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
                  {approach.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UniqueApproach;
