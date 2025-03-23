import React from "react";
import { School, Award, Users, BookOpen } from "lucide-react";

const Founder = () => {
  return (
    <section id="about" className="py-16 md:py-24 bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="flex items-center mb-4">
              <div className="h-1 w-12 bg-primary mr-4"></div>
              <h2 className="text-lg font-montserrat text-primary">
                ABOUT OUR FOUNDER
              </h2>
            </div>
            <h3 className="section-title">Meet Dr. Sarah Johnson</h3>
            <p className="text-dark/80 mb-6">
              With over 15 years of experience in mathematics education and a
              PhD in Mathematics from Stanford University, Dr. Johnson founded
              MathEncode with a vision to revolutionize how students learn and
              appreciate mathematics.
            </p>
            <p className="text-dark/80 mb-8">
              Her innovative teaching methodology combines traditional
              mathematical concepts with real-world applications, making complex
              topics accessible and engaging for students of all learning
              styles.
            </p>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-start">
                <div className="mr-3 p-2 bg-neutral rounded-lg">
                  <School className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-dark mb-1">6+ Years</h4>
                  <p className="text-dark/70 text-sm">Teaching Experience</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mr-3 p-2 bg-neutral rounded-lg">
                  <Award className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h4 className="font-bold text-dark mb-1">
                    Bachelor in Technology
                  </h4>
                  <p className="text-dark/70 text-sm">NIT Jalandhar</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mr-3 p-2 bg-neutral rounded-lg">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-bold text-dark mb-1">2,500+ Students</h4>
                  <p className="text-dark/70 text-sm">Taught & Mentored</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mr-3 p-2 bg-neutral rounded-lg">
                  <BookOpen className="w-6 h-6 text-purple" />
                </div>
                <div>
                  <h4 className="font-bold text-dark mb-1">8 Publications</h4>
                  <p className="text-dark/70 text-sm">On Math Education</p>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="relative z-10">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <div className="bg-neutral p-2">
                  <div className="w-full aspect-[1] bg-primary/10 rounded overflow-hidden">
                    {/* Placeholder for founder's image */}
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-primary/20 to-secondary/20">
                      <img src="/founder.png" alt="Founder's Image" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute top-8 -right-8 w-64 h-64 bg-purple/10 rounded-full -z-0"></div>
            <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-accent/10 rounded-full -z-0"></div>

            <div className="absolute -bottom-4 right-8 bg-white px-6 py-4 rounded-lg shadow-lg z-20">
              <p className="font-montserrat text-sm text-dark/80">
                "Mathematics is not about numbers, equations, or algorithms.
                It's about understanding."
              </p>
              <p className="mt-2 text-right text-primary font-montserrat font-semibold text-sm">
                — Er. Chirag Dang
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Founder;
