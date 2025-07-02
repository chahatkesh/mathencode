import React from "react";
import { GraduationCap } from "lucide-react";
import { 
  FaChalkboardTeacher, 
  FaAward, 
  FaUsers, 
  FaBookOpen, 
  FaStar,
  FaUniversity,
  FaTrophy,
  FaMedal
} from "react-icons/fa";
import { 
  HiOutlineSparkles, 
  HiOutlineAcademicCap 
} from "react-icons/hi";
import { 
  GiTeacher, 
  GiDiploma 
} from "react-icons/gi";

const Founder = () => {
  return (
    <section
      id="founder"
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
            Learn from a beloved tutor dedicated to making your mathematical journey enjoyable and effective.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
            {/* Left side - Image */}
            <div className="lg:col-span-2 relative">
              <div className="h-full min-h-[200px] lg:min-h-[200px] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
                <img
                  src="/founder.png"
                  alt="Chirag Dang - Math Tutor"
                  className="w-full h-full object-cover"
                />
                {/* Experience badge */}
                <div className="absolute bottom-6 left-6 bg-gradient-to-r from-secondary to-secondary/80 px-4 py-2 rounded-lg shadow-lg">
                  <div className="flex items-center space-x-2">
                    <FaMedal className="w-4 h-4 text-white" />
                    <span className="text-white font-semibold text-sm">4+ Years Experience</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Content */}
            <div className="lg:col-span-3 p-8 lg:p-12">
              <div className="h-full flex flex-col justify-center">
                <h4 className="text-2xl md:text-3xl font-bold font-montserrat text-dark mb-2">
                  Chirag Dang
                </h4>
                <p className="text-secondary font-medium mb-6">Your Math Tutor</p>
                
                <div className="space-y-4 text-dark/80 mb-8">
                  <p>
                    With <span className="font-semibold text-primary">4+ years of experience</span> and 
                    a B.Tech from NIT Jalandhar, Chirag has successfully taught <span className="font-semibold text-secondary">50+ students</span>, 
                    transforming complex math concepts into engaging, understandable lessons.
                  </p>
                  <p>
                    His innovative approach combines traditional teaching with real-world applications, 
                    making math accessible for students of all learning styles.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Achievement Pills */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md">
            <FaChalkboardTeacher className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-dark">Expert Educator</span>
          </div>
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md">
            <HiOutlineSparkles className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-dark">Innovative Methods</span>
          </div>
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md">
            <FaTrophy className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-dark">Student Success</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Founder;
