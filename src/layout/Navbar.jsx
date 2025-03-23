// src/layout/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [scrolled, setScrolled] = useState(false);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      // Add shadow to navbar when scrolled
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Determine active section based on scroll position
      const sections = [
        "hero",
        "founder",
        "approach",
        "courses",
        "achievements",
        "testimonials",
        "join",
      ];
      const scrollPosition = window.scrollY + 100; // Offset to trigger slightly before reaching section

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to section function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80, // Account for navbar height
        behavior: "smooth",
      });
    }
    setActiveSection(sectionId);

    // Close mobile menu if open
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  // Navigation items array for easy management
  const navItems = [
    { id: "hero", label: "Home" },
    { id: "approach", label: "Our Approach" },
    { id: "courses", label: "Courses" },
    { id: "achievements", label: "Success Stories" },
    { id: "about", label: "About Us" },
  ];

  return (
    <nav
      className={`bg-white ${
        scrolled ? "shadow-md" : ""
      } fixed top-0 left-0 w-full z-50 transition-shadow duration-300`}>
      <div className="container-custom py-4 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => scrollToSection("hero")}
          className="flex items-center cursor-pointer">
          <span className="text-2xl font-montserrat font-bold text-primary">
            Math<span className="text-secondary">Encode</span>
          </span>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`font-medium transition-colors ${
                activeSection === item.id
                  ? "text-primary font-semibold"
                  : "text-dark hover:text-primary"
              }`}>
              {item.label}
            </button>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={() => scrollToSection("join")}
          className="hidden md:block btn-primary">
          Book Free Class
        </button>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-dark"
          onClick={toggleMenu}
          aria-label="Toggle menu">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-4 px-6 shadow-inner">
          <div className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`font-medium py-2 text-left transition-colors ${
                  activeSection === item.id
                    ? "text-primary font-semibold"
                    : "text-dark hover:text-primary"
                }`}>
                {item.label}
              </button>
            ))}
            <button
              onClick={() => scrollToSection("join")}
              className="btn-primary text-center mt-2">
              Book Free Class
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
