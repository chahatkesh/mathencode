import React from "react";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  // Smooth scroll function
  const scrollToSection = (e, id) => {
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
    window.dispatchEvent(new CustomEvent('openDemoPopup'));
  };

  return (
    <footer className="bg-dark text-white">
      {/* Main Footer Content */}
      <div className="pt-16 pb-12">
        <div className="container-custom">
          {/* Top Section - CTA */}
          <div className="text-center mb-16 pb-12 border-b border-white/10">
            <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-4">
              Ready to Excel in Math?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Join hundreds of students who've transformed their math skills with our proven teaching methods.
            </p>
            <button
              onClick={handleBookDemo}
              className="bg-secondary hover:bg-secondary/90 text-white font-montserrat font-semibold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
              Book Your Free Demo Class
            </button>
          </div>

          {/* Middle Section - 4 Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <img src="/logo_white.svg" alt="MathEncode" className="h-8 mb-4" />
                <p className="text-white/70 leading-relaxed">
                  Personalized math coaching that makes learning easy for grades K–12.
                </p>
              </div>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors group">
                  <FaXTwitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors group">
                  <FaInstagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors group">
                  <FaLinkedinIn className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>

            {/* Quick Links - Column 1 */}
            <div>
              <h3 className="font-montserrat font-semibold text-lg mb-6 text-white">
                Quick Links
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    onClick={(e) => scrollToSection(e, "hero")}
                    className="text-white/70 hover:text-white cursor-pointer transition-colors flex items-center group">
                    Home
                  </a>
                </li>
                <li>
                  <a
                    onClick={(e) => scrollToSection(e, "founder")}
                    className="text-white/70 hover:text-white cursor-pointer transition-colors flex items-center group">
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    onClick={(e) => scrollToSection(e, "approach")}
                    className="text-white/70 hover:text-white cursor-pointer transition-colors flex items-center group">
                    Our Approach
                  </a>
                </li>
              </ul>
            </div>

            {/* Quick Links - Column 2 */}
            <div>
              <h3 className="font-montserrat font-semibold text-lg mb-6 text-white">
                Programs
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    onClick={(e) => scrollToSection(e, "courses")}
                    className="text-white/70 hover:text-white cursor-pointer transition-colors flex items-center group">
                    Our Programs
                  </a>
                </li>
                <li>
                  <a
                    onClick={(e) => scrollToSection(e, "testimonials")}
                    className="text-white/70 hover:text-white cursor-pointer transition-colors flex items-center group">
                    Success Stories
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-montserrat font-semibold text-lg mb-6 text-white">
                Get in Touch
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start group">
                  <div className="mr-3 mt-1 p-2 bg-white/10 rounded-lg group-hover:bg-primary transition-colors">
                    <FaPhone className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Call us</p>
                    <a 
                      href="tel:+917357016611"
                      className="text-white/90 hover:text-white transition-colors">
                      +91 73570 16611
                    </a>
                  </div>
                </li>
                <li className="flex items-start group">
                  <div className="mr-3 mt-1 p-2 bg-white/10 rounded-lg group-hover:bg-primary transition-colors">
                    <FaEnvelope className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Email us</p>
                    <a 
                      href="mailto:learn@mathencode.com"
                      className="text-white/90 hover:text-white transition-colors">
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
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} MathEncode. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
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
