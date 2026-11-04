"use client";

import Link from "next/link";
import { CheckCircle, Clock, Users, ChevronRight } from "lucide-react";
import type { MarketingCourse } from "~/types";

const Courses = ({
  courses,
  unavailable = false,
  hasCommonTest = false,
}: {
  courses: MarketingCourse[];
  unavailable?: boolean;
  hasCommonTest?: boolean;
}) => {
  // Helper function to get icon color classes
  const getIconColorClass = (accent: string) => {
    switch (accent) {
      case "primary":
        return "text-primary";
      case "secondary":
        return "text-secondary";
      case "purple":
        return "text-purple";
      case "accent":
        return "text-accent";
      case "orange":
        return "text-orange";
      default:
        return "text-primary";
    }
  };

  return (
    <section
      id="courses"
      className="bg-gradient-to-br from-neutral to-white py-16 md:py-24"
    >
      <div className="container-custom">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-4 flex items-center justify-center">
            <div className="mr-4 h-1 w-12 bg-primary"></div>
            <h2 className="text-lg text-primary">OUR PROGRAMS</h2>
            <div className="ml-4 h-1 w-12 bg-primary"></div>
          </div>
          <h3 className="section-title">Programs That Get Results</h3>
          <p className="section-subtitle">
            Choose the perfect math program for your grade level and watch your
            confidence soar as you master every concept.
          </p>
          {hasCommonTest ? (
            <div className="rounded-2xl border border-primary/15 bg-white px-6 py-6 shadow-sm">
              <h4 className="text-xl font-bold text-dark">
                Not sure which course to take?
              </h4>
              <p className="mt-2 text-dark/70">
                Take the common diagnostic and see where you are before you
                choose a program.
              </p>
              <Link
                href="/diagnostic/common"
                className="btn-primary mt-5 inline-flex"
              >
                Take the common test
              </Link>
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {unavailable ? (
            <p className="col-span-full text-center text-dark/70">
              Programs are temporarily unavailable.
            </p>
          ) : courses.length === 0 ? (
            <p className="col-span-full text-center text-dark/70">
              New programs will be listed here soon.
            </p>
          ) : null}
          {courses.map((course) => (
            <div
              key={course.id}
              className={`group relative transform overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${course.colorScheme.border} border-2`}
            >
              {/* Gradient Header */}
              <div
                className={`h-3 bg-gradient-to-r ${course.colorScheme.gradient}`}
              ></div>

              {/* Course Content */}
              <div className="p-8">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-xl font-bold text-dark transition-colors duration-300 group-hover:text-primary">
                    {course.title}
                  </h4>
                  <div
                    className={`h-12 w-12 rounded-full bg-gradient-to-br ${course.colorScheme.gradient} flex flex-shrink-0 items-center justify-center`}
                  >
                    <span className="text-lg font-bold text-white">
                      {course.publicId}
                    </span>
                  </div>
                </div>

                <p className="mb-6 leading-relaxed text-dark/80">
                  {course.description.length > 100
                    ? `${course.description.substring(0, 100)}...`
                    : course.description}
                </p>

                {/* Course Details */}
                <div className="mb-6 space-y-3">
                  <div className="flex items-center">
                    <div
                      className={`h-10 w-10 rounded-lg bg-gradient-to-br ${course.colorScheme.gradient} mr-3 flex flex-shrink-0 items-center justify-center`}
                    >
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <span className="block text-xs text-dark/60">
                        Grade Level
                      </span>
                      <span className="font-medium text-dark">
                        {course.level}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div
                      className={`h-10 w-10 rounded-lg bg-gradient-to-br ${course.colorScheme.gradient} mr-3 flex flex-shrink-0 items-center justify-center`}
                    >
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <span className="block text-xs text-dark/60">
                        Duration
                      </span>
                      <span className="font-medium text-dark">
                        {course.duration}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div
                      className={`h-10 w-10 rounded-lg bg-gradient-to-br ${course.colorScheme.gradient} mr-3 flex flex-shrink-0 items-center justify-center`}
                    >
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <span className="block text-xs text-dark/60">
                        Class Size
                      </span>
                      <span className="font-medium text-dark">
                        {course.group}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Key Topics */}
                <div className="mb-8">
                  <h5 className="mb-4 flex items-center font-semibold text-dark">
                    <span
                      className={`h-2 w-2 rounded-full bg-gradient-to-r ${course.colorScheme.gradient} mr-2`}
                    ></span>
                    Key Topics:
                  </h5>
                  <ul className="space-y-2">
                    {course.highlights.slice(0, 3).map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle
                          className={`h-4 w-4 ${getIconColorClass(course.colorScheme.accent)} mr-2 mt-1 flex-shrink-0`}
                        />
                        <span className="text-sm leading-relaxed text-dark/80">
                          {item}
                        </span>
                      </li>
                    ))}
                    {course.highlights.length > 3 && (
                      <li className="flex items-start">
                        <div className="mr-2 mt-1 h-4 w-4 flex-shrink-0"></div>
                        <span
                          className={`${getIconColorClass(course.colorScheme.accent)} text-sm font-medium`}
                        >
                          +{course.highlights.length - 3} more topics
                        </span>
                      </li>
                    )}
                  </ul>
                </div>

                {/* CTA Button */}
                <div className="space-y-3">
                  <a
                    href={`/course/${course.slug}`}
                    className={`inline-flex w-full items-center justify-center bg-gradient-to-r px-6 py-3 ${course.colorScheme.gradient} group/btn rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-lg`}
                  >
                    <span>View Course Details</span>
                    <ChevronRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </a>
                  {course.hasDiagnosticTest ? (
                    <a
                      href={`/diagnostic/${course.slug}`}
                      className={`inline-flex w-full items-center justify-center rounded-lg border-2 px-6 py-3 font-semibold transition-all duration-300 hover:bg-neutral ${course.colorScheme.border} ${getIconColorClass(course.colorScheme.accent)}`}
                    >
                      Take Diagnostic Test
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;
