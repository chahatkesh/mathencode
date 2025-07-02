import React from "react";
import { CheckCircle, Clock, Users, ChevronRight } from "lucide-react";

const Courses = () => {
  // Sample courses data
  const courses = [
    {
      id: 1,
      title: "Middle School Math Foundations",
      description:
        "Build solid foundational skills in arithmetic, pre-algebra, and geometry concepts for 6th-8th grade students.",
      level: "Grades 6-8",
      duration: "16 weeks",
      group: "Small groups (4-6)",
      highlights: [
        "Number systems and operations",
        "Introduction to algebraic thinking",
        "Basic geometric concepts",
        "Data analysis fundamentals",
      ],
      color: "primary",
    },
    {
      id: 2,
      title: "Algebra Mastery Program",
      description:
        "Comprehensive algebra course covering linear equations, quadratics, functions, and more for high school students.",
      level: "Grades 9-10",
      duration: "20 weeks",
      group: "Small groups (4-6)",
      highlights: [
        "Linear equations and inequalities",
        "Quadratic functions",
        "Systems of equations",
        "Polynomial expressions",
      ],
      color: "secondary",
    },
    {
      id: 3,
      title: "Advanced Mathematics",
      description:
        "Higher-level math course covering precalculus, calculus concepts, and advanced problem-solving techniques.",
      level: "Grades 11-12",
      duration: "24 weeks",
      group: "Small groups (4-6)",
      highlights: [
        "Trigonometric functions",
        "Limits and derivatives",
        "Integration techniques",
        "Applications of calculus",
      ],
      color: "purple",
    },
  ];

  return (
    <section id="courses" className="py-16 md:py-24 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center mb-4">
            <div className="h-1 w-12 bg-primary mr-4"></div>
            <h2 className="text-lg font-montserrat text-primary">
              OUR PROGRAMS
            </h2>
            <div className="h-1 w-12 bg-primary ml-4"></div>
          </div>
          <h3 className="section-title">Programs That Get Results</h3>
          <p className="section-subtitle">
            Choose the perfect math program for your grade level and watch your confidence soar as you master every concept.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="border border-neutral rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className={`h-2 bg-${course.color}`}></div>
              <div className="p-6">
                <h4 className="text-xl font-bold text-dark mb-3">
                  {course.title}
                </h4>
                <p className="text-dark/80 mb-6">{course.description}</p>

                <div className="flex items-center mb-2">
                  <div className="w-5 h-5 mr-3 flex-shrink-0">
                    <Users className={`w-5 h-5 text-${course.color}`} />
                  </div>
                  <span className="text-dark/80">{course.level}</span>
                </div>

                <div className="flex items-center mb-2">
                  <div className="w-5 h-5 mr-3 flex-shrink-0">
                    <Clock className={`w-5 h-5 text-${course.color}`} />
                  </div>
                  <span className="text-dark/80">{course.duration}</span>
                </div>

                <div className="flex items-center mb-6">
                  <div className="w-5 h-5 mr-3 flex-shrink-0">
                    <Users className={`w-5 h-5 text-${course.color}`} />
                  </div>
                  <span className="text-dark/80">{course.group}</span>
                </div>

                <div className="mb-6">
                  <h5 className="font-semibold mb-2">Key Topics:</h5>
                  <ul className="space-y-1">
                    {course.highlights.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle
                          className={`w-4 h-4 text-${course.color} mr-2 mt-1 flex-shrink-0`}
                        />
                        <span className="text-dark/80 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  // href={`#course-${course.id}`}
                  href={""}
                  className={`flex items-center font-semibold text-${course.color} hover:underline`}>
                  View Course Details <ChevronRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;
