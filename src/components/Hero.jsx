import React, { useState, useEffect } from "react";
import { ArrowRight, BookOpen, Star, CheckCircle } from "lucide-react";

const Hero = ({ onBookDemo }) => {
  // State for image rotation
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const heroImages = [
    {
      src: "/hero-girl.png",
      alt: "Female student enjoying math learning experience"
    },
    {
      src: "/hero-boy.png", 
      alt: "Male student enjoying math learning experience"
    }
  ];

  // Auto-rotate images every 5.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? 1 : 0
      );
    }, 3500); // 3.5 seconds

    return () => clearInterval(interval);
  }, []);

  const currentImage = heroImages[currentImageIndex];

  return (
    <section
      id="hero"
      className="relative bg-white min-h-screen flex items-center pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-16 sm:pb-20 md:pb-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left side content */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <div className="inline-flex items-center justify-center lg:justify-start space-x-2 px-3 sm:px-4 py-1.5 bg-secondary/10 rounded-full mb-4 sm:mb-6">
              <Star className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2 text-secondary" />
              <h2 className="text-xs sm:text-sm font-montserrat font-medium text-secondary tracking-wider">
                Premium Math Education
              </h2>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-montserrat text-dark leading-tight mb-4 sm:mb-6">
              Transform Your
              <span className="text-primary relative block mt-1 sm:mt-2">
                Math Journey
                <svg
                  className="absolute -bottom-1 sm:-bottom-2 left-0 w-full"
                  height="4"
                  viewBox="0 0 200 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M0 3C50 -1 150 7 200 3"
                    stroke="#FF6700"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span className="text-accent block mt-1 sm:mt-2">Today</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-dark/70 mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              From struggling with concepts to mastering complex problems - our
              personalized approach builds confidence and excellence for
              students in grades <span className="font-semibold text-primary">K-12</span>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-6 sm:mb-8 max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center justify-center lg:justify-start text-dark/80 text-sm sm:text-base">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-secondary mr-2 flex-shrink-0" />
                <span>Personalized Learning Plans</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start text-dark/80 text-sm sm:text-base">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-secondary mr-2 flex-shrink-0" />
                <span>Monthly Progress Reports</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start text-dark/80 text-sm sm:text-base">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-secondary mr-2 flex-shrink-0" />
                <span>Expert Math Coaches</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start text-dark/80 text-sm sm:text-base">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-secondary mr-2 flex-shrink-0" />
                <span>Test Prep Specialization</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5 mb-4 sm:mb-6 justify-center lg:justify-start">
              <button
                onClick={onBookDemo}
                className="bg-secondary text-white hover:bg-secondary/90 font-montserrat font-semibold py-3 sm:py-3.5 px-6 sm:px-8 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center text-sm sm:text-base">
                <span>Book a Demo Class</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("courses")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-montserrat font-semibold py-3 sm:py-3.5 px-6 sm:px-8 rounded-lg transition-all duration-300 flex items-center justify-center text-sm sm:text-base">
                <BookOpen className="mr-2 h-4 w-4" />
                <span>View Curriculum</span>
              </button>
            </div>
          </div>

          {/* RIGHT SIDE WITH IMAGE */}
          <div className="order-1 lg:order-2 mb-8 lg:mb-0">
            <div className="relative w-full flex justify-center">
              {/* Main hero image without background or box */}
              <div className="relative w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-none h-64 sm:h-80 md:h-96 lg:h-full">
                {/* Hero image */}
                <img
                  src={currentImage.src}
                  alt={currentImage.alt}
                  className="w-full h-full object-cover object-center transition-opacity duration-1000 pointer-events-none select-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
