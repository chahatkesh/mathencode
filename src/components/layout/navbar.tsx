"use client";

// src/layout/Navbar.jsx
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollSection, setScrollSection] = useState("hero");
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash);
    const frame = requestAnimationFrame(syncHash);
    window.addEventListener("hashchange", syncHash);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", syncHash);
    };
  }, [pathname]);

  const isHomePage = pathname === "/";
  const isCourseDetailPage = pathname.startsWith("/course/");
  const isCareerPage = pathname === "/career";
  const activeSection = isCourseDetailPage
    ? "courses"
    : isCareerPage
      ? "career"
      : scrollSection;

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Enhanced scroll handling with better section detection
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 10);
      if (!isHomePage) return;

      const sections = [
        "hero",
        "founder",
        "approach",
        "courses",
        "testimonials",
        "join",
      ];
      const viewportHeight = window.innerHeight;
      const scrollPosition = currentScrollY + viewportHeight * 0.3;
      let currentSection = "hero";

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const element = section ? document.getElementById(section) : null;
        if (element && scrollPosition >= element.offsetTop) {
          currentSection = section ?? "hero";
          break;
        }
      }

      setScrollSection((current) =>
        current === currentSection ? current : currentSection,
      );
    };

    const frame = requestAnimationFrame(handleScroll);
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
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", throttledScroll);
    };
  }, [isHomePage]);

  // Handle hash navigation when coming from other pages
  useEffect(() => {
    if (isHomePage && hash) {
      const sectionId = hash.replace("#", "");
      const element = document.getElementById(sectionId);
      if (element) {
        setTimeout(() => {
          const navHeight = 80;
          const offset = sectionId === "hero" ? 0 : navHeight;
          window.scrollTo({
            top: element.offsetTop - offset,
            behavior: "smooth",
          });
          setScrollSection(sectionId);
        }, 100);
      }
    }
  }, [hash, isHomePage]);

  // Scroll to section function with improved offset calculation
  const scrollToSection = (sectionId: string) => {
    // Handle Career page navigation
    if (sectionId === "career") {
      router.push("/career");
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
      router.push(`/#${sectionId}`);
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
    setScrollSection(sectionId);

    // Close mobile menu if open
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  // Function to trigger demo booking
  const handleBookDemo = () => {
    // Dispatch custom event that ContactFormPopup can listen to
    window.dispatchEvent(new CustomEvent("openDemoPopup"));
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
        scrolled ? "border-b border-gray-100 shadow-lg" : "shadow-sm"
      } fixed left-0 top-0 z-50 w-full transition-all duration-300`}
    >
      <div className="container-custom flex items-center justify-between py-4">
        {/* Logo */}
        <button
          onClick={() =>
            isHomePage ? scrollToSection("hero") : router.push("/")
          }
          className="group flex cursor-pointer items-center"
        >
          {/* Logo Image */}
          <img
            src="/logo_color.svg"
            alt="Logo"
            className="mr-2 h-8 transition-transform group-hover:scale-105"
          />
          {/* Logo Text */}
          <span className="font-montserrat text-2xl font-bold text-primary">
            Math<span className="text-secondary">Encode</span>
          </span>
        </button>

        {/* Desktop Navigation with Enhanced Active States */}
        <div className="hidden items-center space-x-1 md:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`relative rounded-lg px-4 py-2 font-medium transition-all duration-300 ${
                activeSection === item.id
                  ? "bg-primary/10 font-semibold text-primary shadow-sm"
                  : "text-gray-700 hover:bg-gray-50 hover:text-primary"
              }`}
            >
              {item.label}

              {/* Hover indicator */}
              <span
                className={`absolute inset-0 rounded-lg border-2 transition-all duration-300 ${
                  activeSection === item.id
                    ? "border-primary/20"
                    : "border-transparent hover:border-primary/10"
                }`}
              ></span>
            </button>
          ))}
        </div>

        {/* Enhanced CTA Button */}
        <button
          onClick={handleBookDemo}
          className="hidden transform rounded-lg bg-primary px-6 py-2.5 font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-primary/90 hover:shadow-lg md:block"
        >
          Book Free Demo Class
        </button>

        {/* Mobile Menu Button */}
        <button
          className="rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-50 hover:text-primary md:hidden"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Enhanced Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t border-gray-100 bg-white/95 shadow-lg backdrop-blur-sm md:hidden">
          <div className="container-custom py-4">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative rounded-lg px-4 py-3 text-left font-medium transition-all duration-300 ${
                    activeSection === item.id
                      ? "border-l-4 border-primary bg-primary/10 font-semibold text-primary"
                      : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                  }`}
                >
                  {item.label}

                  {/* Mobile active indicator */}
                  {activeSection === item.id && (
                    <span className="absolute right-4 top-1/2 h-2 w-2 -translate-y-1/2 transform rounded-full bg-primary"></span>
                  )}
                </button>
              ))}

              {/* Mobile CTA */}
              <button
                onClick={handleBookDemo}
                className="mt-4 rounded-lg bg-primary px-6 py-3 text-center font-semibold text-white shadow-md transition-all duration-300 hover:bg-primary/90 hover:shadow-lg"
              >
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
