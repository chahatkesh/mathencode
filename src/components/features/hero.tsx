"use client";

import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, Star, CheckCircle } from "lucide-react";

const Hero = ({ onBookDemo }: { onBookDemo: () => void }) => {
  // State for image rotation
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const heroImages = [
    {
      src: "/hero-girl.png",
      alt: "Female student enjoying math learning experience",
    },
    {
      src: "/hero-boy.png",
      alt: "Male student enjoying math learning experience",
    },
  ];

  // Auto-rotate images every 5.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? 1 : 0));
    }, 3500); // 3.5 seconds

    return () => clearInterval(interval);
  }, []);

  const currentImage = heroImages[currentImageIndex];

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center bg-white pb-16 pt-20 sm:pb-20 sm:pt-24 md:pb-32 md:pt-28 lg:pt-32"
    >
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 md:gap-12 lg:grid-cols-2">
          {/* Left side content */}
          <div className="order-2 text-center lg:order-1 lg:text-left">
            <div className="mb-4 inline-flex items-center justify-center space-x-2 rounded-full bg-secondary/10 px-3 py-1.5 sm:mb-6 sm:px-4 lg:justify-start">
              <Star className="mr-1 h-3 w-3 text-secondary sm:mr-2 sm:h-4 sm:w-4" />
              <h2 className="text-xs font-medium tracking-wider text-secondary sm:text-sm">
                Premium Math Education
              </h2>
            </div>

            <h1 className="mb-4 text-3xl font-bold leading-tight text-dark sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              Transform Your
              <span className="relative mt-1 block text-primary sm:mt-2">
                Math Journey
                <svg
                  className="absolute -bottom-1 left-0 w-full sm:-bottom-2"
                  height="4"
                  viewBox="0 0 200 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 3C50 -1 150 7 200 3"
                    stroke="#FF6700"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span className="mt-1 block text-accent sm:mt-2">Today</span>
            </h1>

            <p className="mx-auto mb-6 max-w-2xl text-base leading-relaxed text-dark/70 sm:mb-8 sm:text-lg md:text-xl lg:mx-0">
              From struggling with concepts to mastering complex problems - our
              personalized approach builds confidence and excellence for
              students in grades{" "}
              <span className="font-semibold text-primary">K-12</span>.
            </p>

            <div className="mx-auto mb-6 grid max-w-lg grid-cols-1 gap-2 sm:mb-8 sm:grid-cols-2 sm:gap-3 lg:mx-0">
              <div className="flex items-center justify-center text-sm text-dark/80 sm:text-base lg:justify-start">
                <CheckCircle className="mr-2 h-4 w-4 flex-shrink-0 text-secondary sm:h-5 sm:w-5" />
                <span>Personalized Learning Plans</span>
              </div>
              <div className="flex items-center justify-center text-sm text-dark/80 sm:text-base lg:justify-start">
                <CheckCircle className="mr-2 h-4 w-4 flex-shrink-0 text-secondary sm:h-5 sm:w-5" />
                <span>Monthly Progress Reports</span>
              </div>
              <div className="flex items-center justify-center text-sm text-dark/80 sm:text-base lg:justify-start">
                <CheckCircle className="mr-2 h-4 w-4 flex-shrink-0 text-secondary sm:h-5 sm:w-5" />
                <span>Expert Math Coaches</span>
              </div>
              <div className="flex items-center justify-center text-sm text-dark/80 sm:text-base lg:justify-start">
                <CheckCircle className="mr-2 h-4 w-4 flex-shrink-0 text-secondary sm:h-5 sm:w-5" />
                <span>Test Prep Specialization</span>
              </div>
            </div>

            <div className="mb-4 flex flex-col justify-center gap-3 sm:mb-6 sm:flex-row sm:gap-4 md:gap-5 lg:justify-start">
              <button
                onClick={onBookDemo}
                className="flex items-center justify-center rounded-lg bg-secondary px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-secondary/90 hover:shadow-lg sm:px-8 sm:py-3.5 sm:text-base"
              >
                <span>Book a Demo Class</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("courses")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="flex items-center justify-center rounded-lg border-2 border-primary px-6 py-3 text-sm font-semibold text-primary transition-all duration-300 hover:bg-primary hover:text-white sm:px-8 sm:py-3.5 sm:text-base"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                <span>View Curriculum</span>
              </button>
            </div>
          </div>

          {/* RIGHT SIDE WITH IMAGE */}
          <div className="order-1 mb-8 lg:order-2 lg:mb-0">
            <div className="relative flex w-full justify-center">
              {/* Main hero image without background or box */}
              <div className="relative h-64 w-full max-w-md sm:h-80 sm:max-w-lg md:h-96 md:max-w-xl lg:h-full lg:max-w-none">
                {/* Hero image */}
                <img
                  src={currentImage.src}
                  alt={currentImage.alt}
                  className="pointer-events-none h-full w-full select-none object-cover object-center transition-opacity duration-1000"
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
