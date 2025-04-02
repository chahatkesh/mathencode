import React from "react";
import { School, Award, Users, BookOpen, Star } from "lucide-react";

const Founder = () => {
  return (
    <section
      id="about"
      className="py-20 md:py-28 bg-gradient-to-b from-white to-neutral/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left side with image - Now spans 5 columns for better proportions */}
          <div className="order-1 lg:order-1 lg:col-span-5 relative">
            <div className="relative z-10 transform transition-all duration-500 hover:scale-105 hover:rotate-1">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <div className="bg-gradient-to-tr from-accent/5 to-white p-3">
                  <div className="w-full aspect-square bg-primary/5 rounded-xl overflow-hidden">
                    {/* Founder's image */}
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-primary/10 to-secondary/10">
                      <img
                        src="/founder.png"
                        alt="Chirag Dang - Math Tutor"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-10 -right-10 w-64 h-64 bg-purple/10 rounded-full -z-0 animate-pulse-slow"></div>
            <div
              className="absolute -bottom-8 -left-8 w-48 h-48 bg-accent/10 rounded-full -z-0 animate-pulse-slow"
              style={{ animationDelay: "1.5s" }}></div>

            {/* Quote card with enhanced design */}
            <div className="absolute -bottom-6 right-4 bg-white px-6 py-5 rounded-xl shadow-xl z-20 border-l-4 border-primary max-w-xs transform transition-all duration-500 hover:shadow-2xl">
              <div className="text-primary opacity-30 mb-1">
                <Star className="w-4 h-4 inline-block mr-1 fill-primary" />
                <Star className="w-4 h-4 inline-block mr-1 fill-primary" />
                <Star className="w-4 h-4 inline-block mr-1 fill-primary" />
                <Star className="w-4 h-4 inline-block mr-1 fill-primary" />
                <Star className="w-4 h-4 inline-block fill-primary" />
              </div>
              <p className="font-montserrat text-dark/80 italic">
                "Mathematics is not about numbers, equations, or algorithms.
                It's about understanding."
              </p>
              <p className="mt-3 text-right text-primary font-montserrat font-semibold">
                — Chirag Dang
              </p>
            </div>
          </div>

          {/* Right side with content - Now spans 7 columns for better text space */}
          <div className="order-2 lg:order-2 lg:col-span-7 lg:pl-8">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-primary/10 rounded-full mb-6">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <h2 className="text-sm font-montserrat font-medium text-primary tracking-wider">
                ABOUT OUR TUTOR
              </h2>
            </div>

            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold font-montserrat text-dark mb-6">
              Meet Chirag Dang
              <span className="block mt-2 text-lg font-normal text-secondary">
                A passionate math educator dedicated to student success
              </span>
            </h3>

            <div className="space-y-6 text-lg">
              <p className="text-dark/80">
                A very young mentor with over{" "}
                <span className="font-medium text-primary">
                  4 years of experience
                </span>{" "}
                in mathematics education and a Bachelor in Technology from NIT
                Jalandhar, Chirag Dang founded MathEncode with a mission: to
                make learning math enjoyable, accessible, and impactful.
              </p>

              <p className="text-dark/80">
                Through a unique blend of traditional concepts and real-world
                applications, his innovative teaching approach simplifies
                complex topics, making them engaging and easier to grasp for
                students of all learning styles, which makes them{" "}
                <span className="italic font-medium">'woahhh!'</span>
              </p>
            </div>

            {/* Stats with improved visual design */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
              <div className="flex items-start group">
                <div className="mr-4 p-3 rounded-xl bg-gradient-to-br from-neutral to-white shadow-md group-hover:shadow-lg transition-all duration-300">
                  <School className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-dark text-xl mb-1 group-hover:text-primary transition-colors duration-300">
                    4+ Years
                  </h4>
                  <p className="text-dark/70">Teaching Experience</p>
                </div>
              </div>

              <div className="flex items-start group">
                <div className="mr-4 p-3 rounded-xl bg-gradient-to-br from-neutral to-white shadow-md group-hover:shadow-lg transition-all duration-300">
                  <Award className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h4 className="font-bold text-dark text-xl mb-1 group-hover:text-secondary transition-colors duration-300">
                    B.Tech
                  </h4>
                  <p className="text-dark/70">NIT Jalandhar</p>
                </div>
              </div>

              <div className="flex items-start group">
                <div className="mr-4 p-3 rounded-xl bg-gradient-to-br from-neutral to-white shadow-md group-hover:shadow-lg transition-all duration-300">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-bold text-dark text-xl mb-1 group-hover:text-accent transition-colors duration-300">
                    500+ Students
                  </h4>
                  <p className="text-dark/70">Taught & Inspired</p>
                </div>
              </div>

              <div className="flex items-start group">
                <div className="mr-4 p-3 rounded-xl bg-gradient-to-br from-neutral to-white shadow-md group-hover:shadow-lg transition-all duration-300">
                  <BookOpen className="w-6 h-6 text-purple" />
                </div>
                <div>
                  <h4 className="font-bold text-dark text-xl mb-1 group-hover:text-purple transition-colors duration-300">
                    Innovative Method
                  </h4>
                  <p className="text-dark/70">Real-world Applications</p>
                </div>
              </div>
            </div>

            {/* Student feedback badge */}
            <div className="mt-12 inline-flex items-center px-5 py-3 bg-secondary/10 text-secondary rounded-full">
              <Star className="w-5 h-5 fill-secondary text-secondary mr-2" />
              <span className="font-medium">
                98% of students report improved grades after just 1 month
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Founder;
