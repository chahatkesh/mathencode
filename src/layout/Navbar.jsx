// src/layout/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if we're on the home page
  const isHomePage = location.pathname === '/';
  const isCourseDetailPage = location.pathname.startsWith('/course/');
  const isCareerPage = location.pathname === '/career';

  // Set initial active section based on current page
  useEffect(() => {
    if (isCourseDetailPage) {
      setActiveSection("courses");
    } else if (isCareerPage) {
      setActiveSection("career");
    } else if (isHomePage && location.hash) {
      const sectionId = location.hash.replace('#', '');
      setActiveSection(sectionId);
    } else if (isHomePage) {
      setActiveSection("hero");
    }
  }, [location.pathname, location.hash, isHomePage, isCourseDetailPage, isCareerPage]);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Enhanced scroll handling with better section detection
  useEffect(() => {
    // Only handle scroll-based section detection on home page
    if (!isHomePage) {
      setScrolled(window.scrollY > 10);
      return;
    }

    const handleScroll = () => {
      // Add shadow to navbar when scrolled
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 10);

      // Enhanced active section detection - only on home page
      const sections = [
        "hero",
        "founder", 
        "approach",
        "courses",
        "testimonials",
        "join",
      ];
      
      // Get viewport height for better calculation
      const viewportHeight = window.innerHeight;
      const scrollPosition = currentScrollY + (viewportHeight * 0.3); // Trigger when section is 30% in view

      // Find the current section
      let currentSection = "hero"; // Default to hero
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const element = document.getElementById(section);
        
        if (element) {
          const offsetTop = element.offsetTop;
          if (scrollPosition >= offsetTop) {
            currentSection = section;
            break;
          }
        }
      }

      // Update active section only if it changed
      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    // Initial call
    handleScroll();
    
    // Add scroll listener with throttling for better performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [activeSection, isHomePage, isCourseDetailPage, isCareerPage]);

  // Handle hash navigation when coming from other pages
  useEffect(() => {
    if (isHomePage && location.hash) {
      const sectionId = location.hash.replace('#', '');
      const element = document.getElementById(sectionId);
      if (element) {
        setTimeout(() => {
          const navHeight = 80;
          const offset = sectionId === "hero" ? 0 : navHeight;
          window.scrollTo({
            top: element.offsetTop - offset,
            behavior: "smooth",
          });
          setActiveSection(sectionId);
        }, 100);
      }
    }
  }, [location.hash, isHomePage]);

  // Scroll to section function with improved offset calculation
  const scrollToSection = (sectionId) => {
    // Handle Career page navigation
    if (sectionId === "career") {
      navigate("/career");
      // Scroll to top after navigation
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 100);
      // Close mobile menu if open
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
      return;
    }

    // If we're not on the home page, navigate to home first
    if (!isHomePage) {
      navigate(`/#${sectionId}`);
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 80; // Navbar height
      const offset = sectionId === "hero" ? 0 : navHeight;
      
      window.scrollTo({
        top: element.offsetTop - offset,
        behavior: "smooth",
      });
    }
    
    // Immediately update active section for responsive feel
    setActiveSection(sectionId);

    // Close mobile menu if open
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  // Function to trigger demo booking
  const handleBookDemo = () => {
    // Dispatch custom event that ContactFormPopup can listen to
    window.dispatchEvent(new CustomEvent('openDemoPopup'));
  };

  const navItems = [
    { id: "hero", label: "Home" },
    { id: "founder", label: "About Us" },
    { id: "courses", label: "Courses" },
    { id: "testimonials", label: "Success Stories" },
    { id: "career", label: "Career" },
  ];

  return (
    <nav
      className={`bg-white/95 backdrop-blur-sm ${
        scrolled ? "shadow-lg border-b border-gray-100" : "shadow-sm"
      } fixed top-0 left-0 w-full z-50 transition-all duration-300`}>
      <div className="container-custom py-4 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => isHomePage ? scrollToSection("hero") : navigate('/')}
          className="flex items-center cursor-pointer group">
          {/* Logo Image */}
          <img src="/logo_color.svg" alt="Logo" className="h-8 mr-2 transition-transform group-hover:scale-105" />
          {/* Logo Text */}
          <span className="text-2xl font-montserrat font-bold text-primary">
            Math<span className="text-secondary">Encode</span>
          </span>
        </button>

        {/* Desktop Navigation with Enhanced Active States */}
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`relative px-4 py-2 font-medium rounded-lg transition-all duration-300 ${
                activeSection === item.id
                  ? "text-primary bg-primary/10 font-semibold shadow-sm"
                  : "text-gray-700 hover:text-primary hover:bg-gray-50"
              }`}>
              {item.label}
              
              {/* Hover indicator */}
              <span className={`absolute inset-0 rounded-lg border-2 transition-all duration-300 ${
                activeSection === item.id 
                  ? "border-primary/20" 
                  : "border-transparent hover:border-primary/10"
              }`}></span>
            </button>
          ))}
        </div>

        {/* Enhanced CTA Button */}
        <button
          onClick={handleBookDemo}
          className="hidden md:block bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
          Book Free Demo Class
        </button>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 hover:text-primary p-2 rounded-lg hover:bg-gray-50 transition-colors"
          onClick={toggleMenu}
          aria-label="Toggle menu">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Enhanced Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-100 shadow-lg">
          <div className="container-custom py-4">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative text-left px-4 py-3 font-medium rounded-lg transition-all duration-300 ${
                    activeSection === item.id
                      ? "text-primary bg-primary/10 font-semibold border-l-4 border-primary"
                      : "text-gray-700 hover:text-primary hover:bg-gray-50"
                  }`}>
                  {item.label}
                  
                  {/* Mobile active indicator */}
                  {activeSection === item.id && (
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary rounded-full"></span>
                  )}
                </button>
              ))}
              
              {/* Mobile CTA */}
              <button
                onClick={handleBookDemo}
                className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg mt-4 text-center">
                Book Free Demo Class
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
