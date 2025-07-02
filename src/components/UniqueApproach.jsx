import React from "react";
import {
  Brain,
  Target,
  Lightbulb,
  TrendingUp,
  Star,
  BookOpen,
  ArrowRight,
} from "lucide-react";

const UniqueApproach = () => {
  const approaches = [
    {
      icon: <Brain className="w-7 h-7" />,
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
      icon: <Target className="w-7 h-7" />,
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
      icon: <Lightbulb className="w-7 h-7" />,
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
      icon: <TrendingUp className="w-7 h-7" />,
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
      icon: <Star className="w-7 h-7" />,
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
      icon: <BookOpen className="w-7 h-7" />,
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
      className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-20">
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

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {approaches.map((approach, index) => (
            <div
              key={index}
              className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border ${approach.borderColor} hover:scale-105 cursor-pointer`}>
              
              {/* Gradient Header */}
              <div className={`h-2 bg-gradient-to-r ${approach.gradient}`}></div>
              
              {/* Card Content */}
              <div className={`p-8 ${approach.bgColor} group-hover:bg-white transition-colors duration-300`}>
                
                {/* Icon Container */}
                <div className={`relative w-16 h-16 ${approach.iconBg} rounded-2xl flex items-center justify-center mb-6 ${approach.textColor} group-hover:scale-110 transition-all duration-300 shadow-sm`}>
                  {approach.icon}
                  
                  {/* Decorative ring */}
                  <div className={`absolute inset-0 rounded-2xl border-2 ${approach.borderColor} opacity-20 group-hover:opacity-60 transition-opacity duration-300`}></div>
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors duration-300">
                  {approach.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
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
