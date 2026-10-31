"use client";

import {
  FaEnvelope,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  // Smooth scroll function
  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Function to trigger demo booking
  const handleBookDemo = () => {
    window.dispatchEvent(new CustomEvent("openDemoPopup"));
  };

  return (
    <footer className="bg-dark text-white">
      {/* Main Footer Content */}
      <div className="pb-12 pt-16">
        <div className="container-custom">
          {/* Top Section - CTA */}
          <div className="mb-16 border-b border-white/10 pb-12 text-center">
            <h2 className="mb-4 font-montserrat text-3xl font-bold md:text-4xl">
              Ready to Excel in Math?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-white/80">
              Join hundreds of students who've transformed their math skills
              with our proven teaching methods.
            </p>
            <button
              onClick={handleBookDemo}
              className="rounded-lg bg-secondary px-8 py-4 font-montserrat font-semibold text-white shadow-lg transition-all duration-300 hover:bg-secondary/90 hover:shadow-xl"
            >
              Book Your Free Demo Class
            </button>
          </div>

          {/* Middle Section - 4 Column Layout */}
          <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <img
                  src="/logo_white.svg"
                  alt="MathEncode"
                  className="mb-4 h-8"
                />
                <p className="leading-relaxed text-white/70">
                  Personalized math coaching that makes learning easy for grades
                  K–12.
                </p>
              </div>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="group flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 transition-colors hover:bg-primary"
                >
                  <FaXTwitter className="h-5 w-5 transition-transform group-hover:scale-110" />
                </a>
                <a
                  href="#"
                  className="group flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 transition-colors hover:bg-primary"
                >
                  <FaInstagram className="h-5 w-5 transition-transform group-hover:scale-110" />
                </a>
                <a
                  href="#"
                  className="group flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 transition-colors hover:bg-primary"
                >
                  <FaLinkedinIn className="h-5 w-5 transition-transform group-hover:scale-110" />
                </a>
              </div>
            </div>

            {/* Quick Links - Column 1 */}
            <div>
              <h3 className="mb-6 font-montserrat text-lg font-semibold text-white">
                Quick Links
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    onClick={(e) => scrollToSection(e, "hero")}
                    className="group flex cursor-pointer items-center text-white/70 transition-colors hover:text-white"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    onClick={(e) => scrollToSection(e, "founder")}
                    className="group flex cursor-pointer items-center text-white/70 transition-colors hover:text-white"
                  >
                    About Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Quick Links - Column 2 */}
            <div>
              <h3 className="mb-6 font-montserrat text-lg font-semibold text-white">
                Programs
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    onClick={(e) => scrollToSection(e, "courses")}
                    className="group flex cursor-pointer items-center text-white/70 transition-colors hover:text-white"
                  >
                    Our Programs
                  </a>
                </li>
                <li>
                  <a
                    onClick={(e) => scrollToSection(e, "testimonials")}
                    className="group flex cursor-pointer items-center text-white/70 transition-colors hover:text-white"
                  >
                    Success Stories
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="mb-6 font-montserrat text-lg font-semibold text-white">
                Get in Touch
              </h3>
              <ul className="space-y-4">
                <li className="group flex items-start">
                  <div className="mr-3 mt-1 rounded-lg bg-white/10 p-2 transition-colors group-hover:bg-green-500">
                    <FaWhatsapp className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">WhatsApp us</p>
                    <a
                      href="https://wa.me/918287357311"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/90 transition-colors hover:text-white"
                    >
                      +91-8287357311
                    </a>
                  </div>
                </li>
                <li className="group flex items-start">
                  <div className="mr-3 mt-1 rounded-lg bg-white/10 p-2 transition-colors group-hover:bg-primary">
                    <FaEnvelope className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Email us</p>
                    <a
                      href="mailto:learn@mathencode.com"
                      className="text-white/90 transition-colors hover:text-white"
                    >
                      learn@mathencode.com
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Copyright */}
      <div className="bg-black/30 py-6">
        <div className="container-custom">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <p className="mb-4 text-sm text-white/60 md:mb-0">
              © {new Date().getFullYear()} MathEncode. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a
                href="#"
                className="text-white/60 transition-colors hover:text-white"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-white/60 transition-colors hover:text-white"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
