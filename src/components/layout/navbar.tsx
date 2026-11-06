"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { openDemoPopup } from "~/components/layout/book-demo-button";

function headerOffset() {
  return (
    document.querySelector(".header-inner")?.getBoundingClientRect().bottom ??
    88
  );
}

function scrollToPosition(top: number) {
  window.scrollTo({
    top,
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
  });
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
    pathname.startsWith("/course/") ||
    pathname.startsWith("/diagnostic") ||
    pathname === "/which-course";
  const isCareerPage =
    pathname === "/career" || pathname.startsWith("/career/");
  const activeSection = isCourseDetailPage
    ? "courses"
    : isCareerPage
      ? "career"
      : isHomePage
        ? scrollSection
        : "";

  const toggleMenu = () => {
    setOpenPath((current) => (current === pathname ? null : pathname));
  };

  const closeMenu = () => setOpenPath(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenPath(null);
        document.querySelector<HTMLButtonElement>(".menu-toggle")?.focus();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1101px)");
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
          scrollToPosition(element.offsetTop - offset);
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
        scrollToPosition(0);
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

      scrollToPosition(element.offsetTop - offset);
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
    openDemoPopup();
  };

  const navItems = [
    { id: "hero", label: "Home" },
    { id: "courses", label: "Courses" },
    { id: "about-us", label: "About Us" },
    { id: "testimonials", label: "Success Stories" },
    { id: "career", label: "Career" },
  ];

  const itemHref = (id: string) => (id === "career" ? "/career" : `/#${id}`);

  return (
    <nav
      className="site-header"
      aria-label="Main navigation"
      data-scrolled={scrolled}
    >
      <div className="site-container header-inner">
        <Link
          href="/"
          className="brand"
          aria-label="MathEncode home"
          onClick={closeMenu}
        >
          <Image
            src="/logo_color.svg"
            alt=""
            width={34}
            height={38}
            unoptimized
          />
          <span>
            Math<em>Encode</em>
          </span>
        </Link>
        <div className="desktop-nav">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={itemHref(item.id)}
              aria-current={activeSection === item.id ? "location" : undefined}
              onClick={(event) => {
                event.preventDefault();
                scrollToSection(item.id);
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
        <div className="header-actions">
          <button
            type="button"
            onClick={handleBookDemo}
            className="public-button public-button--dark"
          >
            Book a free demo
          </button>
          <button
            type="button"
            className="menu-toggle"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="site-menu"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {isMenuOpen ? (
        <div ref={menuRef} id="site-menu" className="mobile-nav">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={itemHref(item.id)}
              aria-current={activeSection === item.id ? "location" : undefined}
              onClick={(event) => {
                event.preventDefault();
                scrollToSection(item.id);
              }}
            >
              {item.label}
            </a>
          ))}
          <a href="/which-course" onClick={closeMenu}>
            Find your course
          </a>
          <button
            type="button"
            onClick={handleBookDemo}
            className="public-button public-button--orange"
          >
            Book a free demo
          </button>
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;
