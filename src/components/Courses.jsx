import React from "react";
import { CheckCircle, Clock, Users, ChevronRight } from "lucide-react";
import { coursesData } from "../data/coursesData";

const Courses = () => {
  // Helper function to get icon color classes
  const getIconColorClass = (accent) => {
    switch(accent) {
      case 'primary': return 'text-primary';
      case 'secondary': return 'text-secondary';
      case 'purple': return 'text-purple';
      case 'accent': return 'text-accent';
      case 'orange': return 'text-orange';
      default: return 'text-primary';
    }
  };

  return (
    <section id="courses" className="py-16 md:py-24 bg-gradient-to-br from-neutral to-white">
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
          {coursesData.map((course) => (
            <div
              key={course.id}
              className={`group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 ${course.colorScheme.border} border-2`}>
              
              {/* Gradient Header */}
              <div className={`h-3 bg-gradient-to-r ${course.colorScheme.gradient}`}></div>
              
              {/* Course Content */}
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold text-dark group-hover:text-primary transition-colors duration-300">
                    {course.title}
                  </h4>
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${course.colorScheme.gradient} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white font-bold text-lg">{course.id}</span>
                  </div>
                </div>
                
                <p className="text-dark/80 mb-6 leading-relaxed">{course.description}</p>

                {/* Course Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${course.colorScheme.gradient} flex items-center justify-center mr-3 flex-shrink-0`}>
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-xs text-dark/60 block">Grade Level</span>
                      <span className="text-dark font-medium">{course.level}</span>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${course.colorScheme.gradient} flex items-center justify-center mr-3 flex-shrink-0`}>
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-xs text-dark/60 block">Duration</span>
                      <span className="text-dark font-medium">{course.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${course.colorScheme.gradient} flex items-center justify-center mr-3 flex-shrink-0`}>
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-xs text-dark/60 block">Class Size</span>
                      <span className="text-dark font-medium">{course.group}</span>
                    </div>
                  </div>
                </div>

                {/* Key Topics */}
                <div className="mb-8">
                  <h5 className="font-semibold mb-4 text-dark flex items-center">
                    <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${course.colorScheme.gradient} mr-2`}></span>
                    Key Topics:
                  </h5>
                  <ul className="space-y-2">
                    {course.highlights.slice(0, 3).map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle
                          className={`w-4 h-4 ${getIconColorClass(course.colorScheme.accent)} mr-2 mt-1 flex-shrink-0`}
                        />
                        <span className="text-dark/80 text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                    {course.highlights.length > 3 && (
                      <li className="flex items-start">
                        <div className="w-4 h-4 mr-2 mt-1 flex-shrink-0"></div>
                        <span className={`${getIconColorClass(course.colorScheme.accent)} text-sm font-medium`}>
                          +{course.highlights.length - 3} more topics
                        </span>
                      </li>
                    )}
                  </ul>
                </div>

                {/* CTA Button */}
                <a
                  href={`/course/${course.id}`}
                  className={`inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r ${course.colorScheme.gradient} text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 group/btn`}>
                  <span>View Course Details</span>
                  <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
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
