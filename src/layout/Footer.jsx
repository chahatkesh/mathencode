import React from "react";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

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

  return (
    <footer className="bg-dark text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <div className="mb-4">
              <span className="font-montserrat font-bold text-2xl">
                <img src="/logo_white.svg" alt="Logo" className="h-8 mr-2" />
              </span>
            </div>
            <p className="text-white/70 mb-6">
              Transforming mathematics education for students in grades 6-12
              with personalized coaching and proven methodology.
            </p>
            <div className="flex space-x-3">
              <a
                href="#"
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-montserrat font-semibold text-lg mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  onClick={(e) => scrollToSection(e, "hero")}
                  className="text-white/70 hover:text-white cursor-pointer transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a
                  onClick={(e) => scrollToSection(e, "founder")}
                  className="text-white/70 hover:text-white cursor-pointer transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a
                  onClick={(e) => scrollToSection(e, "approach")}
                  className="text-white/70 hover:text-white cursor-pointer transition-colors">
                  Our Approach
                </a>
              </li>
              <li>
                <a
                  onClick={(e) => scrollToSection(e, "courses")}
                  className="text-white/70 hover:text-white cursor-pointer transition-colors">
                  Programs
                </a>
              </li>
              <li>
                <a
                  onClick={(e) => scrollToSection(e, "testimonials")}
                  className="text-white/70 hover:text-white cursor-pointer transition-colors">
                  Success Stories
                </a>
              </li>
              <li>
                <a
                  onClick={(e) => scrollToSection(e, "join")}
                  className="text-white/70 hover:text-white cursor-pointer transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-montserrat font-semibold text-lg mb-4">
              Contact Info
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="mr-3 mt-1">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <span className="text-white/70">(123) 456-7890</span>
              </li>
              <li className="flex items-start">
                <div className="mr-3 mt-1">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <span className="text-white/70">learn@mathencode.com</span>
              </li>
              <li className="flex items-start">
                <div className="mr-3 mt-1">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <span className="text-white/70">
                  123 Learning Lane
                  <br />
                  Education City, EC 12345
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center text-white/60 text-sm">
          <p>© {new Date().getFullYear()} MathEncode. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
