import React from "react";
import { Trophy, TrendingUp } from "lucide-react";

const StudentAchievement = () => {
  return (
    <section id="achievements" className="py-12 bg-neutral">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8 text-center">
          <h2 className="text-sm font-montserrat text-primary uppercase tracking-wider mb-2">
            STUDENT SUCCESS
          </h2>
          <h3 className="text-2xl font-bold mb-4">
            Our Students Achieve Remarkable Results
          </h3>
          <p className="text-dark/80 max-w-2xl mx-auto">
            At MathEncode, we take pride in our students' achievements. Our
            specialized coaching methods have consistently helped students
            improve their grades, develop stronger problem-solving skills, and
            build confidence in their mathematical abilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-primary/10 rounded-full mr-4">
                <Trophy className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-bold text-dark">Math Competition Winners</h4>
            </div>
            <p className="text-dark/80">
              Our students have won prizes in the top competitive exams like{" "}
              <span className="font-semibold">Rocket City Math League</span> and
              different <span className="font-semibold">Math Olympiads</span>{" "}
              across <span className="font-semibold">USA</span> and{" "}
              <span className="font-semibold">India</span>.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-secondary/10 rounded-full mr-4">
                <TrendingUp className="w-5 h-5 text-secondary" />
              </div>
              <h4 className="font-bold text-dark">Grade Improvement</h4>
            </div>
            <p className="text-dark/80">
              More than 90% of our students have scored{" "}
              <span className="font-semibold">90% or above (A Grade)</span> in
              the last academic year.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentAchievement;
