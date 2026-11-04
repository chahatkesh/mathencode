"use client";

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
  const isCourseDetailPage =
    pathname.startsWith("/course/") || pathname.startsWith("/diagnostic");
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

      const sections = ["hero", "founder", "courses", "testimonials", "join"];
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
    setIsMenuOpen(false);
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
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || isMenuOpen
          ? "border-b border-dark/5 bg-white/90 backdrop-blur-md"
          : "bg-white/75 backdrop-blur-md"
      }`}
    >
      <div className="container-custom flex h-16 items-center justify-between lg:h-[4.25rem]">
        <button
          onClick={() =>
            isHomePage ? scrollToSection("hero") : router.push("/")
          }
          className="flex cursor-pointer items-center gap-2.5"
        >
          <img src="/logo_color.svg" alt="" className="h-7" />
          <span className="text-xl font-bold tracking-tight text-primary">
            Math<span className="text-secondary">Encode</span>
          </span>
        </button>

        <div className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`group relative text-sm transition-colors duration-200 ${
                  isActive ? "text-primary" : "text-dark/55 hover:text-dark"
                }`}
              >
                <span className="invisible font-bold" aria-hidden="true">
                  {item.label}
                </span>
                <span
                  className={`absolute inset-0 flex items-center justify-center ${
                    isActive ? "font-bold" : "font-medium group-hover:font-bold"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleBookDemo}
          className="hidden rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-bright-blue lg:inline-flex"
        >
          Book Free Demo Class
        </button>

        <button
          className="p-2 text-dark/70 transition-colors hover:text-dark lg:hidden"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-dark/5 bg-white lg:hidden">
          <div className="container-custom flex flex-col py-3">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`py-3 text-left text-base transition-colors duration-200 ${
                    isActive
                      ? "font-bold text-primary"
                      : "font-medium text-dark/70 hover:font-bold hover:text-dark"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            <button
              onClick={handleBookDemo}
              className="mt-3 rounded-full bg-primary px-5 py-3 text-center text-sm font-semibold text-white transition-colors duration-200 hover:bg-bright-blue"
            >
              Book Free Demo Class
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
