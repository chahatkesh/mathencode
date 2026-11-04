"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

function headerOffset() {
  return document.querySelector("nav")?.getBoundingClientRect().height ?? 64;
}

const Navbar = () => {
  const [openPath, setOpenPath] = useState<string | null>(null);
  const [scrollSection, setScrollSection] = useState("hero");
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isMenuOpen = openPath === pathname;
  const router = useRouter();
  const [hash, setHash] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

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
  const isCareerPage =
    pathname === "/career" || pathname.startsWith("/career/");
  const activeSection = isCourseDetailPage
    ? "courses"
    : isCareerPage
      ? "career"
      : scrollSection;

  const toggleMenu = () => {
    setOpenPath((current) => (current === pathname ? null : pathname));
  };

  const closeMenu = () => setOpenPath(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenPath(null);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const close = () => {
      if (media.matches) setOpenPath(null);
    };
    media.addEventListener("change", close);
    return () => media.removeEventListener("change", close);
  }, []);

  // Enhanced scroll handling with better section detection
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 10);
      if (!isHomePage) return;

      const sections = ["hero", "courses", "about-us", "testimonials", "join"];
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
          const offset = sectionId === "hero" ? 0 : headerOffset();
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
      closeMenu();
      router.push("/career");
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 100);
      return;
    }

    if (!isHomePage) {
      closeMenu();
      router.push(`/#${sectionId}`);
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      const offset = sectionId === "hero" ? 0 : headerOffset();

      window.scrollTo({
        top: element.offsetTop - offset,
        behavior: "smooth",
      });
    }

    // Immediately update active section for responsive feel
    setScrollSection(sectionId);

    // Close mobile menu if open
    if (isMenuOpen) {
      closeMenu();
    }
  };

  // Function to trigger demo booking
  const handleBookDemo = () => {
    closeMenu();
    window.dispatchEvent(new CustomEvent("openDemoPopup"));
  };

  const navItems = [
    { id: "hero", label: "Home" },
    { id: "courses", label: "Courses" },
    { id: "about-us", label: "About Us" },
    { id: "testimonials", label: "Success Stories" },
    { id: "career", label: "Career" },
  ];

  return (
    <nav className="fixed inset-x-0 top-0 z-50">
      <div
        className={`border-b pt-[env(safe-area-inset-top)] transition-colors duration-300 ${
          scrolled || isMenuOpen
            ? "border-dark/5 bg-white/95 backdrop-blur-md"
            : "border-transparent bg-white/80 backdrop-blur-md"
        }`}
      >
        <div className="container-custom flex h-16 items-center justify-between gap-3">
          <button
            onClick={() =>
              isHomePage ? scrollToSection("hero") : router.push("/")
            }
            className="flex min-w-0 cursor-pointer items-center gap-2"
          >
            <Image
              src="/logo_color.svg"
              alt=""
              width={28}
              height={28}
              unoptimized
              className="h-7 w-auto shrink-0"
            />
            <span className="truncate text-lg font-bold tracking-tight text-primary sm:text-xl">
              Math<span className="text-secondary">Encode</span>
            </span>
          </button>

          <div className="hidden items-center gap-4 md:flex lg:gap-8">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`group relative inline-flex min-h-11 items-center whitespace-nowrap text-sm transition-colors duration-200 ${
                    isActive ? "text-primary" : "text-dark/55 hover:text-dark"
                  }`}
                >
                  <span className="invisible font-bold" aria-hidden="true">
                    {item.label}
                  </span>
                  <span
                    className={`absolute inset-0 flex items-center justify-center ${
                      isActive
                        ? "font-bold"
                        : "font-medium group-hover:font-bold"
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
            className="hidden min-h-11 shrink-0 items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-bright-blue md:inline-flex lg:px-5"
          >
            Book a demo
          </button>

          <div className="flex shrink-0 items-center gap-1 md:hidden">
            <button
              type="button"
              onClick={handleBookDemo}
              className="min-h-11 rounded-full bg-primary px-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-bright-blue"
            >
              Demo
            </button>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full text-dark/70 transition-colors hover:bg-neutral hover:text-dark"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="site-menu"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen ? (
        <div
          ref={menuRef}
          id="site-menu"
          className="fixed inset-x-0 bottom-0 z-50 overflow-y-auto overscroll-contain border-t border-dark/5 bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 md:hidden"
          style={{ top: "var(--site-header)" }}
        >
          <div className="mx-auto flex w-full max-w-6xl flex-col">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className={`flex min-h-12 items-center rounded-xl px-3 text-left text-base transition-colors duration-200 ${
                    isActive
                      ? "bg-neutral font-bold text-primary"
                      : "font-medium text-dark/75 hover:bg-neutral hover:text-dark"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            <button
              type="button"
              onClick={handleBookDemo}
              className="mt-4 min-h-12 rounded-full bg-primary px-5 text-center text-sm font-semibold text-white transition-colors duration-200 hover:bg-bright-blue"
            >
              Book a free demo
            </button>
          </div>
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;
