"use client";

import { FaChalkboardTeacher, FaMedal, FaTrophy } from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi";

const Founder = () => {
  return (
    <section
      id="founder"
      className="bg-gradient-to-br from-slate-50 to-blue-50 py-16 md:py-20"
    >
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-4 flex items-center justify-center">
            <div className="mr-4 h-1 w-12 bg-primary"></div>
            <h2 className="font-montserrat text-lg text-primary">
              MEET YOUR INSTRUCTOR
            </h2>
            <div className="ml-4 h-1 w-12 bg-primary"></div>
          </div>
          <h3 className="section-title">Your Math Success Partner</h3>
          <p className="section-subtitle">
            Learn from a beloved tutor dedicated to making your mathematical
            journey enjoyable and effective.
          </p>
        </div>

        {/* Main Content */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
          <div className="grid grid-cols-1 gap-0 lg:grid-cols-5">
            {/* Left side - Image */}
            <div className="relative lg:col-span-2">
              <div className="relative h-full min-h-[200px] overflow-hidden lg:min-h-[200px]">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
                <img
                  src="/founder.png"
                  alt="Chirag Dang - Math Tutor"
                  className="h-full w-full object-cover"
                />
                {/* Experience badge */}
                <div className="absolute bottom-6 left-6 rounded-lg bg-gradient-to-r from-secondary to-secondary/80 px-4 py-2 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <FaMedal className="h-4 w-4 text-white" />
                    <span className="text-sm font-semibold text-white">
                      5+ Years Experience
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Content */}
            <div className="p-8 lg:col-span-3 lg:p-12">
              <div className="flex h-full flex-col justify-center">
                <h4 className="mb-2 font-montserrat text-2xl font-bold text-dark md:text-3xl">
                  Chirag Dang
                </h4>
                <p className="mb-6 font-medium text-secondary">
                  Your Math Tutor
                </p>

                <div className="mb-8 space-y-4 text-dark/80">
                  <p>
                    With{" "}
                    <span className="font-semibold text-primary">
                      5+ years of experience
                    </span>{" "}
                    and a B.Tech from NIT Jalandhar, Chirag has successfully
                    taught{" "}
                    <span className="font-semibold text-secondary">
                      50+ students
                    </span>
                    , transforming complex math concepts into engaging,
                    understandable lessons.
                  </p>
                  <p>
                    His innovative approach combines traditional teaching with
                    real-world applications, making math accessible for students
                    of all learning styles.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Achievement Pills */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <div className="flex items-center space-x-2 rounded-full bg-white px-4 py-2 shadow-md">
            <FaChalkboardTeacher className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-dark">
              Expert Educator
            </span>
          </div>
          <div className="flex items-center space-x-2 rounded-full bg-white px-4 py-2 shadow-md">
            <HiOutlineSparkles className="h-4 w-4 text-secondary" />
            <span className="text-sm font-medium text-dark">
              Innovative Methods
            </span>
          </div>
          <div className="flex items-center space-x-2 rounded-full bg-white px-4 py-2 shadow-md">
            <FaTrophy className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-dark">
              Student Success
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Founder;
