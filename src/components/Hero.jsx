import React from "react";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section id="hero" className="bg-neutral h-screen flex items-center">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark leading-tight mb-4">
              Expert <span className="text-primary">Math Coaching</span> for{" "}
              <span className="text-accent">6th-12th</span> Grade Students
            </h1>
            <p className="text-lg text-dark/80 mb-8">
              Our specialized approach strengthens mathematical foundations and
              problem-solving skills, preparing students for academic excellence
              and future success in STEM fields.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="btn-primary flex items-center">
                Enroll Now <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <button className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-montserrat font-semibold py-2 px-6 rounded-lg transition-colors duration-300">
                Explore Programs
              </button>
            </div>
          </div>
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-20 h-20 bg-bright-yellow rounded-full opacity-60 blur-sm"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple rounded-full opacity-40 blur-sm"></div>
              <div className="bg-white p-6 rounded-xl shadow-lg z-10 relative">
                <div className="bg-neutral p-4 rounded-lg mb-4">
                  <div className="text-dark font-mono text-sm space-y-2">
                    <div className="flex items-center">
                      <span className="text-secondary font-bold">Algebra:</span>
                      <span className="ml-2">y = 2x² + 3x - 5</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-primary font-bold">Geometry:</span>
                      <span className="ml-2">A = πr²</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-accent font-bold">Calculus:</span>
                      <span className="ml-2">∫ 2x dx = x² + C</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-purple font-bold">Statistics:</span>
                      <span className="ml-2">σ = √[(Σ(x-μ)²)/N]</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-orange"></div>
                    <div className="w-3 h-3 rounded-full bg-bright-yellow"></div>
                    <div className="w-3 h-3 rounded-full bg-secondary"></div>
                  </div>
                  <span className="text-dark/60 text-xs">
                    MathEncode Formulas
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-16 left-0 right-0 border-t border-dark/10 pt-8 bg-neutral">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-primary mb-1">
                  2,500+
                </span>
                <p className="text-dark/80">Students Coached</p>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-secondary mb-1">
                  15+
                </span>
                <p className="text-dark/80">Math Programs</p>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-accent mb-1">95%</span>
                <p className="text-dark/80">Grade Improvement</p>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-purple mb-1">98%</span>
                <p className="text-dark/80">Parent Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
