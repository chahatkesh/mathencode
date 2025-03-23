// src/layout/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Send,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Contact Info */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-montserrat font-bold text-white">
                Math<span className="text-secondary">Encode</span>
              </span>
            </Link>
            <p className="text-sm text-gray-300">Learn Math with us</p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-gray-400" />
                <a
                  href="mailto:contact@mathencode.com"
                  className="text-gray-300 hover:text-white transition-colors">
                  contact@mathencode.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-gray-400" />
                <a
                  href="tel:+1234567890"
                  className="text-gray-300 hover:text-white transition-colors">
                  +1 (234) 567-890
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-gray-400 mt-1" />
                <p className="text-gray-300">
                  123 Math Street, Education City, Country
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-montserrat font-semibold">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/courses"
                  className="text-gray-300 hover:text-white transition-colors">
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-gray-300 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-6">
            <h3 className="text-lg font-montserrat font-semibold">
              Connect With Us
            </h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="bg-gray-700 p-2 rounded-full hover:bg-primary transition-colors"
                aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="bg-gray-700 p-2 rounded-full hover:bg-primary transition-colors"
                aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="bg-gray-700 p-2 rounded-full hover:bg-primary transition-colors"
                aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="bg-gray-700 p-2 rounded-full hover:bg-primary transition-colors"
                aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h3 className="text-lg font-montserrat font-semibold">
              Stay Updated
            </h3>
            <p className="text-gray-300 text-sm">
              Subscribe to our newsletter for the latest updates, resources, and
              offers.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 w-full rounded-l-lg focus:outline-none text-dark"
                required
              />
              <button
                type="submit"
                className="bg-primary hover:bg-bright-blue px-4 rounded-r-lg transition-colors"
                aria-label="Subscribe">
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>© 2025 Mathencode. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
