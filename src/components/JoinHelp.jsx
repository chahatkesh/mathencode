import React from "react";
import { Phone, Mail, Calendar, ArrowRight } from "lucide-react";

const JoinHelp = () => {
  return (
    <section
      id="join"
      className="py-16 md:py-24 bg-gradient-to-r from-primary to-bright-blue text-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Math Skills?
            </h2>
            <p className="text-white/90 mb-8 text-lg">
              Take the first step toward mathematical excellence. Schedule a
              free consultation to learn how our personalized programs can help
              you achieve your academic goals.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mr-4">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">Flexible Scheduling</h3>
                  <p className="text-white/80">
                    Weekday afternoons and weekend options available
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mr-4">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">Talk to an Expert</h3>
                  <p className="text-white/80">
                    Get personalized program recommendations
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mr-4">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">Stay Connected</h3>
                  <p className="text-white/80">
                    Regular updates on your child's progress
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-primary hover:bg-white/90 font-montserrat font-semibold py-2 px-6 rounded-lg transition-colors duration-300 flex items-center">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <button className="border-2 border-white text-white hover:bg-white/10 font-montserrat font-semibold py-2 px-6 rounded-lg transition-colors duration-300">
                Learn More
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-dark mb-6">Contact Us</h3>
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-dark/80 mb-1 font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-dark/80 mb-1 font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-dark/80 mb-1 font-medium">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-4 py-2 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="(123) 456-7890"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-dark/80 mb-1 font-medium">
                  Message (Optional)
                </label>
                <textarea
                  id="message"
                  rows="3"
                  className="w-full px-4 py-2 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Tell us about your goals or questions..."></textarea>
              </div>

              <button type="submit" className="w-full btn-primary py-3">
                Schedule Consultation
              </button>

              <p className="text-center text-dark/60 text-sm">
                We'll respond within 24 hours to schedule your free
                consultation.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinHelp;
