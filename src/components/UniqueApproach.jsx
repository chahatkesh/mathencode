import React from "react";
import {
  BrainCircuit,
  Target,
  Lightbulb,
  TrendingUp,
  Star,
  BookText,
} from "lucide-react";

const UniqueApproach = () => {
  return (
    <section id="approach" className="py-16 md:py-24 bg-neutral">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center mb-4">
            <div className="h-1 w-12 bg-primary mr-4"></div>
            <h2 className="text-lg font-montserrat text-primary">
              OUR APPROACH
            </h2>
            <div className="h-1 w-12 bg-primary ml-4"></div>
          </div>
          <h3 className="section-title">Why Our Math Coaching Works</h3>
          <p className="section-subtitle">
            At MathEncode, we've developed a unique methodology that makes
            mathematics approachable, engaging, and relevant to students' lives.
            Our approach focuses on building strong foundations while developing
            critical thinking skills.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <BrainCircuit className="w-6 h-6 text-primary" />
            </div>
            <h4 className="text-xl font-bold text-dark mb-2">
              Conceptual Understanding
            </h4>
            <p className="text-dark/80">
              We emphasize the "why" behind mathematical concepts, not just
              memorization, helping students develop deeper understanding and
              retention.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-secondary" />
            </div>
            <h4 className="text-xl font-bold text-dark mb-2">
              Personalized Learning
            </h4>
            <p className="text-dark/80">
              Our curriculum adapts to each student's learning style, pace, and
              areas of strength or challenge to maximize their potential.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <Lightbulb className="w-6 h-6 text-accent" />
            </div>
            <h4 className="text-xl font-bold text-dark mb-2">
              Problem-Solving Focus
            </h4>
            <p className="text-dark/80">
              Students learn to approach problems methodically, developing
              critical thinking skills that extend beyond mathematics.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-purple/10 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-purple" />
            </div>
            <h4 className="text-xl font-bold text-dark mb-2">Growth Mindset</h4>
            <p className="text-dark/80">
              We foster a positive attitude toward challenges, teaching students
              that abilities can be developed through dedication and hard work.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-bright-yellow/10 rounded-lg flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-bright-yellow" />
            </div>
            <h4 className="text-xl font-bold text-dark mb-2">
              Real-World Application
            </h4>
            <p className="text-dark/80">
              Students see how mathematics applies to everyday situations and
              future careers, increasing engagement and motivation.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-orange/10 rounded-lg flex items-center justify-center mb-4">
              <BookText className="w-6 h-6 text-orange" />
            </div>
            <h4 className="text-xl font-bold text-dark mb-2">
              Comprehensive Curriculum
            </h4>
            <p className="text-dark/80">
              Our programs cover all key mathematical areas from pre-algebra to
              advanced calculus, aligned with school standards and beyond.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button className="btn-primary">
            Learn More About Our Methodology
          </button>
        </div>
      </div>
    </section>
  );
};

export default UniqueApproach;
