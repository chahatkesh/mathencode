import React from "react";
import { Trophy, TrendingUp, BarChart3, Award } from "lucide-react";

const StudentAchievement = () => {
  return (
    <section id="achievements" className="py-16 md:py-24 bg-neutral">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center mb-4">
              <div className="h-1 w-12 bg-primary mr-4"></div>
              <h2 className="text-lg font-montserrat text-primary">
                STUDENT SUCCESS
              </h2>
            </div>
            <h3 className="section-title">
              Our Students Achieve Remarkable Results
            </h3>
            <p className="text-dark/80 mb-8">
              At MathEncode, we take pride in our students' achievements. Our
              specialized coaching methods have consistently helped students
              improve their grades, develop stronger problem-solving skills, and
              build confidence in their mathematical abilities.
            </p>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="mr-4 p-3 bg-primary/10 rounded-full">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-dark mb-1">
                    Math Competition Winners
                  </h4>
                  <p className="text-dark/80">
                    Over 75% of our students who participate in regional and
                    national math competitions place in the top 10% of
                    contestants.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mr-4 p-3 bg-secondary/10 rounded-full">
                  <TrendingUp className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-dark mb-1">
                    Grade Improvement
                  </h4>
                  <p className="text-dark/80">
                    On average, our students see a 2-grade-level improvement
                    within the first semester of our program.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mr-4 p-3 bg-accent/10 rounded-full">
                  <BarChart3 className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-dark mb-1">
                    Test Score Increases
                  </h4>
                  <p className="text-dark/80">
                    Students in our SAT/ACT prep programs improve their math
                    scores by an average of 120 points.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mr-4 p-3 bg-purple/10 rounded-full">
                  <Award className="w-6 h-6 text-purple" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-dark mb-1">
                    College Admissions
                  </h4>
                  <p className="text-dark/80">
                    92% of our high school seniors are admitted to their first
                    or second choice colleges, with many receiving mathematics
                    scholarships.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl font-bold text-primary mb-2">94%</div>
              <p className="text-dark/80">
                Students improve by at least one letter grade
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl font-bold text-secondary mb-2">87%</div>
              <p className="text-dark/80">
                Students report increased confidence in math
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl font-bold text-accent mb-2">95%</div>
              <p className="text-dark/80">
                Parent satisfaction with student progress
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl font-bold text-purple mb-2">89%</div>
              <p className="text-dark/80">
                Students continue to advanced math courses
              </p>
            </div>

            <div className="col-span-2 bg-gradient-to-r from-primary/10 to-purple/10 p-6 rounded-lg shadow-md">
              <blockquote className="text-dark/80 italic mb-4">
                "MathEncode transformed my son's relationship with math. He went
                from dreading math class to enthusiastically solving problems
                for fun."
              </blockquote>
              <div className="font-montserrat font-semibold text-dark">
                — Parent of 8th Grade Student
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentAchievement;
