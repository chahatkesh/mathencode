"use client";

import { useEffect, useState } from "react";
import {
  Award,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  Send,
  Users,
} from "lucide-react";
import ContactFormPopup from "~/components/features/contact-form-popup";

const Career = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const handleOpenDemoPopup = () => setIsPopupOpen(true);
    window.addEventListener("openDemoPopup", handleOpenDemoPopup);
    return () =>
      window.removeEventListener("openDemoPopup", handleOpenDemoPopup);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/submit-tutor-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus({
          type: "success",
          message:
            "Application submitted successfully! We'll get back to you soon.",
        });
        setFormData({
          name: "",
          email: "",
          contactNumber: "",
          subject: "",
          message: "",
        });
      } else {
        setSubmitStatus({
          type: "error",
          message:
            result.message || "Failed to submit application. Please try again.",
        });
      }
    } catch (submitError) {
      console.error("Error submitting tutor application:", submitError);
      setSubmitStatus({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    "Competitive compensation package",
    "Flexible working hours",
    "Work from home opportunity",
    "Professional development support",
    "Collaborative teaching environment",
    "Performance-based incentives",
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white py-16 md:py-24">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute left-10 top-20 h-64 w-64 animate-pulse rounded-full bg-primary mix-blend-multiply blur-xl filter"></div>
          <div className="absolute bottom-20 right-10 h-64 w-64 animate-pulse rounded-full bg-secondary mix-blend-multiply blur-xl filter"></div>
          <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform animate-pulse rounded-full bg-accent mix-blend-multiply blur-xl filter"></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold leading-tight text-dark md:text-5xl lg:text-6xl">
              Join Our
              <span className="mt-2 block bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                Teaching Team
              </span>
            </h1>

            <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-dark/70 md:text-xl">
              Are you passionate about mathematics and teaching? Join MathEncode
              as a tutor and help students transform their mathematical journey
              from confusion to confidence.
            </p>

            <div className="mb-8 flex flex-wrap justify-center gap-4">
              <div className="flex items-center space-x-2 rounded-full bg-primary/10 px-4 py-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-medium text-primary">Remote Work</span>
              </div>
              <div className="flex items-center space-x-2 rounded-full bg-secondary/10 px-4 py-2">
                <Clock className="h-5 w-5 text-secondary" />
                <span className="font-medium text-secondary">
                  Flexible Hours
                </span>
              </div>
              <div className="flex items-center space-x-2 rounded-full bg-accent/10 px-4 py-2">
                <Award className="h-5 w-5 text-accent" />
                <span className="font-medium text-accent">Competitive Pay</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section className="bg-gray-50 py-16">
        <div className="container-custom">
          <div className="mx-auto max-w-2xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-dark md:text-4xl">
                Apply Now
              </h2>
              <p className="text-dark/70">
                Ready to make a difference? Fill out the application form below
                and join our team of dedicated educators.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-xl">
              {submitStatus && (
                <div
                  className={`mb-6 rounded-lg p-4 ${
                    submitStatus.type === "success"
                      ? "border border-green-200 bg-green-50 text-green-800"
                      : "border border-red-200 bg-red-50 text-red-800"
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-dark/80"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-primary"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-dark/80"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-primary"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contactNumber"
                      className="mb-2 block text-sm font-medium text-dark/80"
                    >
                      Contact Number *
                    </label>
                    <input
                      type="tel"
                      id="contactNumber"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-primary"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="mb-2 block text-sm font-medium text-dark/80"
                    >
                      Subject Expertise *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-primary"
                      placeholder="e.g., Algebra, Calculus, SAT Math, Competition Math"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-dark/80"
                  >
                    Tell Us About Yourself *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-primary"
                    placeholder="Please share your teaching experience, qualifications, and why you'd like to join MathEncode..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full transform items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Submit Application</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-16">
        <div className="container-custom">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-dark md:text-4xl">
              Why Join MathEncode?
            </h2>
            <p className="mx-auto max-w-2xl text-dark/70">
              We offer a supportive environment where passionate educators can
              thrive and make a real impact.
            </p>
          </div>

          <div className="mx-auto max-w-3xl">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 rounded-lg bg-gray-50 p-4 transition-colors duration-300 hover:bg-primary/5"
                >
                  <CheckCircle className="h-5 w-5 flex-shrink-0 text-secondary" />
                  <span className="font-medium text-dark/80">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="border-t bg-white py-8">
        <div className="container-custom">
          <div className="text-center">
            <h3 className="mb-4 text-lg font-semibold text-dark">
              Have Questions?
            </h3>
            <div className="flex flex-col items-center justify-center gap-6 text-dark/70 sm:flex-row">
              <a
                href="https://wa.me/918287357311"
                className="flex items-center space-x-2 transition-colors hover:text-primary"
              >
                <Phone className="h-4 w-4" />
                <span>+91-8287357311</span>
              </a>
              <a
                href="mailto:careers@mathencode.com"
                className="flex items-center space-x-2 transition-colors hover:text-primary"
              >
                <Mail className="h-4 w-4" />
                <span>careers@mathencode.com</span>
              </a>
            </div>
          </div>
        </div>
      </section>
      <ContactFormPopup isOpen={isPopupOpen} setIsOpen={setIsPopupOpen} />
    </div>
  );
};

export default Career;
