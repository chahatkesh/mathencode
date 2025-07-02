import React from "react";
import { ArrowRight, BookOpen, Star, CheckCircle } from "lucide-react";

const Hero = ({ onBookDemo }) => {
  return (
    <section
      id="hero"
      className="relative bg-white min-h-screen flex items-center pt-16 pb-32">
      {/* Added animated shapes for visual interest */}
      <div
        className="absolute right-1/3 bottom-1/3 w-16 h-16 bg-purple/10 rounded-full animate-pulse z-0"
        style={{ animationDelay: "1s" }}></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side content (unchanged) */}
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-secondary/10 rounded-full mb-6">
              <Star className="w-4 h-4 mr-2 text-secondary" />
              <h2 className="text-sm font-montserrat font-medium text-secondary tracking-wider">
                Premium Math Education
              </h2>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-montserrat text-dark leading-tight mb-6">
              Transform Your
              <span className="text-primary relative block mt-2">
                Math Journey
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="6"
                  viewBox="0 0 200 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M0 3C50 -1 150 7 200 3"
                    stroke="#FF6700"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span className="text-accent block mt-2">Today</span>
            </h1>

            <p className="text-lg text-dark/70 mb-8 max-w-xl">
              From struggling with concepts to mastering complex problems - our
              personalized approach builds confidence and excellence for
              students in grades <span className="font-semibold">6-12</span>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
              <div className="flex items-center text-dark/80">
                <CheckCircle className="h-5 w-5 text-secondary mr-2" />
                <span>Personalized Learning Plans</span>
              </div>
              <div className="flex items-center text-dark/80">
                <CheckCircle className="h-5 w-5 text-secondary mr-2" />
                <span>Weekly Progress Reports</span>
              </div>
              <div className="flex items-center text-dark/80">
                <CheckCircle className="h-5 w-5 text-secondary mr-2" />
                <span>Expert Math Coaches</span>
              </div>
              <div className="flex items-center text-dark/80">
                <CheckCircle className="h-5 w-5 text-secondary mr-2" />
                <span>Test Prep Specialization</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-5 mb-6">
              <button
                onClick={onBookDemo}
                className="bg-secondary text-white hover:bg-secondary/90 font-montserrat font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center">
                Book a Demo Class <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("courses")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-montserrat font-semibold py-3 px-8 rounded-lg transition-all duration-300 flex items-center">
                <BookOpen className="mr-2 h-4 w-4" /> View Curriculum
              </button>
            </div>
          </div>

          {/* REDESIGNED RIGHT SIDE WITH IMAGE */}
          <div className="order-1 lg:order-2">
            <div className="relative w-full flex justify-center">
              {/* Main hero image with overlay and interactive elements */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                {/* Hero image */}
                <img
                  src="/hero.webp"
                  alt="Student enjoying math learning experience"
                  className="w-full h-full object-cover rounded-2xl"
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
