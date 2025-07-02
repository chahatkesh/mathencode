import React from "react";
import { School, Award, Users, BookOpen, GraduationCap, Star } from "lucide-react";

const Founder = () => {
  return (
    <section
      id="tutor"
      className="py-16 md:py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center mb-4">
            <div className="h-1 w-12 bg-primary mr-4"></div>
            <h2 className="text-lg font-montserrat text-primary">
              MEET YOUR INSTRUCTOR
            </h2>
            <div className="h-1 w-12 bg-primary ml-4"></div>
          </div>
          <h3 className="section-title">Your Math Success Partner</h3>
          <p className="section-subtitle">
            Learn from an expert educator dedicated to transforming your mathematical journey.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
            {/* Left side - Image */}
            <div className="lg:col-span-2 relative">
              <div className="h-full min-h-[400px] lg:min-h-[500px] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
                <img
                  src="/founder.png"
                  alt="Chirag Dang - Math Tutor"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right side - Content */}
            <div className="lg:col-span-3 p-8 lg:p-12">
              <div className="h-full flex flex-col justify-center">
                <h4 className="text-2xl md:text-3xl font-bold font-montserrat text-dark mb-2">
                  Chirag Dang
                </h4>
                <p className="text-secondary font-medium mb-6">Lead Math Educator</p>
                
                <div className="space-y-4 text-dark/80 mb-8">
                  <p>
                    With <span className="font-semibold text-primary">4+ years of experience</span> and 
                    a B.Tech from NIT Jalandhar, Chirag transforms complex math concepts into engaging, 
                    understandable lessons.
                  </p>
                  <p>
                    His innovative approach combines traditional teaching with real-world applications, 
                    making math accessible for students of all learning styles.
                  </p>
                </div>

                {/* Compact Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-primary/5 rounded-xl">
                    <div className="text-2xl font-bold text-primary mb-1">4+</div>
                    <div className="text-sm text-dark/70">Years Experience</div>
                  </div>
                  <div className="text-center p-4 bg-secondary/5 rounded-xl">
                    <div className="text-2xl font-bold text-secondary mb-1">50+</div>
                    <div className="text-sm text-dark/70">Students Taught</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Achievement Pills */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md">
            <School className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-dark">Expert Educator</span>
          </div>
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md">
            <BookOpen className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-dark">Innovative Methods</span>
          </div>
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md">
            <Users className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-dark">Student Success</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Founder;
