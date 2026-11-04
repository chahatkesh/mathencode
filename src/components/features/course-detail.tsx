"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Award,
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Target,
  Users,
} from "lucide-react";
import ContactFormPopup from "~/components/features/contact-form-popup";
import type { MarketingCourse } from "~/types";

const CourseDetail = ({ course }: { course: MarketingCourse }) => {
  const router = useRouter();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  // Listen for custom event from Navbar (if needed)
  useEffect(() => {
    const handleOpenDemoPopup = () => {
      openPopup();
    };

    window.addEventListener("openDemoPopup", handleOpenDemoPopup);

    return () => {
      window.removeEventListener("openDemoPopup", handleOpenDemoPopup);
    };
  }, []);

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
    <div className="mt-16 min-h-screen bg-gradient-to-br from-neutral to-white">
      {/* Header */}
      <div
        className={`bg-gradient-to-r ${course.colorScheme.gradient} py-16 md:py-20`}
      >
        <div className="container-custom">
          <button
            onClick={() => router.push("/")}
            className="mb-8 flex items-center text-white/80 transition-colors duration-300 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Courses
          </button>

          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-4 flex items-center">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                  <span className="text-xl font-bold text-white">
                    {course.publicId}
                  </span>
                </div>
                <span className="text-lg text-white/80">{course.level}</span>
              </div>
              <h1 className="mb-6 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                {course.title}
              </h1>
              <p className="mb-8 text-lg leading-relaxed text-white/90 md:text-xl">
                {course.description}
              </p>

              {course.hasDiagnosticTest ? (
                <a
                  href={`/diagnostic/${course.slug}`}
                  className="mb-6 inline-flex rounded-lg bg-white px-5 py-3 font-semibold text-dark transition hover:bg-neutral"
                >
                  Take Diagnostic Test
                </a>
              ) : null}

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm">
                  <Clock className="mr-2 h-5 w-5 text-white" />
                  <span className="font-medium text-white">
                    {course.duration}
                  </span>
                </div>
                <div className="flex items-center rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm">
                  <Users className="mr-2 h-5 w-5 text-white" />
                  <span className="font-medium text-white">{course.group}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white/10 p-8 backdrop-blur-sm">
              <h3 className="mb-6 text-xl font-bold text-white">
                Course Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Calendar className="mr-3 mt-1 h-5 w-5 text-white" />
                  <div>
                    <span className="block text-sm text-white/80">
                      Next Start Date
                    </span>
                    <span className="font-medium text-white">
                      {course.nextStart}
                    </span>
                  </div>
                </div>
                <div className="flex items-start">
                  <BookOpen className="mr-3 mt-1 h-5 w-5 text-white" />
                  <div>
                    <span className="block text-sm text-white/80">
                      Schedule
                    </span>
                    <span className="font-medium text-white">
                      {course.schedule}
                    </span>
                  </div>
                </div>
                <div className="flex items-start">
                  <Award className="mr-3 mt-1 h-5 w-5 text-white" />
                  <div>
                    <span className="block text-sm text-white/80">
                      Prerequisites
                    </span>
                    <span className="font-medium text-white">
                      {course.prerequisites}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* Learning Objectives */}
            <section className="mb-12">
              <h2 className="mb-6 flex items-center text-2xl font-bold text-dark md:text-3xl">
                <Target
                  className={`h-8 w-8 ${getIconColorClass(course.colorScheme.accent)} mr-3`}
                />
                Learning Objectives
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {course.objectives.map((objective, index) => (
                  <div
                    key={index}
                    className="flex items-start rounded-lg border border-gray-100 bg-white p-4 shadow-sm"
                  >
                    <CheckCircle
                      className={`h-5 w-5 ${getIconColorClass(course.colorScheme.accent)} mr-3 mt-1 flex-shrink-0`}
                    />
                    <span className="text-dark/80">{objective}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Curriculum */}
            <section className="mb-12">
              <h2 className="mb-6 flex items-center text-2xl font-bold text-dark md:text-3xl">
                <BookOpen
                  className={`h-8 w-8 ${getIconColorClass(course.colorScheme.accent)} mr-3`}
                />
                Curriculum
              </h2>
              <div className="rounded-xl bg-white p-8 shadow-lg">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {course.highlights.map((topic, index) => (
                    <div key={index} className="flex items-start">
                      <div
                        className={`h-8 w-8 rounded-full bg-gradient-to-br ${course.colorScheme.gradient} mr-3 flex flex-shrink-0 items-center justify-center`}
                      >
                        <span className="text-sm font-bold text-white">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <h4 className="mb-1 font-semibold text-dark">
                          {topic}
                        </h4>
                        <p className="text-sm text-dark/60">
                          Comprehensive coverage with practical examples
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Course Features */}
            <section className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-dark md:text-3xl">
                What's Included
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {[
                  {
                    icon: "👨‍🏫",
                    title: "Expert Instruction",
                    desc: "Learn from experienced math educators",
                  },
                  {
                    icon: "📚",
                    title: "Course Materials",
                    desc: "Comprehensive study materials and resources",
                  },
                  {
                    icon: "🎯",
                    title: "Practice Problems",
                    desc: "Extensive problem sets with solutions",
                  },
                  {
                    icon: "📊",
                    title: "Progress Tracking",
                    desc: "Regular assessments and feedback",
                  },
                  {
                    icon: "🏆",
                    title: "Certification",
                    desc: "Certificate of completion",
                  },
                  {
                    icon: "💬",
                    title: "Support",
                    desc: "Ongoing support and mentorship",
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start rounded-lg border border-gray-100 bg-white p-6 shadow-sm"
                  >
                    <span className="mr-4 text-2xl">{feature.icon}</span>
                    <div>
                      <h4 className="mb-2 font-semibold text-dark">
                        {feature.title}
                      </h4>
                      <p className="text-dark/70">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="mb-8 rounded-xl bg-white p-8 shadow-lg">
                <h3 className="mb-6 text-xl font-bold text-dark">
                  Course Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <span className="text-dark/70">Duration</span>
                    <span className="font-medium text-dark">
                      {course.duration}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <span className="text-dark/70">Level</span>
                    <span className="font-medium text-dark">
                      {course.level}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <span className="text-dark/70">Class Size</span>
                    <span className="font-medium text-dark">
                      {course.group}
                    </span>
                  </div>
                  {course.hasDiagnosticTest ? (
                    <a
                      href={`/diagnostic/${course.slug}`}
                      className={`mt-2 inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r px-6 py-3 font-semibold text-white ${course.colorScheme.gradient}`}
                    >
                      Take Diagnostic Test
                    </a>
                  ) : null}
                </div>
              </div>

              <div className="rounded-xl bg-white p-8 shadow-lg">
                <h3 className="mb-4 text-xl font-bold text-dark">Need Help?</h3>
                <p className="mb-6 text-dark/70">
                  Have questions about this course? Our education counselors are
                  here to help you choose the right program.
                </p>
                <button
                  onClick={openPopup}
                  className="w-full rounded-lg border-2 border-primary px-6 py-3 font-semibold text-primary transition-all duration-300 hover:bg-primary hover:text-white"
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ContactFormPopup isOpen={isPopupOpen} setIsOpen={setIsPopupOpen} />
    </div>
  );
};

export default CourseDetail;
