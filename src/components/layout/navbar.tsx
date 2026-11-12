"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

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

const HEADER_HIDE_AFTER = 12;
const HEADER_SHOW_AFTER = 8;
const HEADER_PINNED_UNTIL = 64;

function scrollOffset() {
  return Math.min(
    Math.max(0, window.scrollY),
    Math.max(0, document.documentElement.scrollHeight - window.innerHeight),
  );
}

const Navbar = () => {
  const [openPath, setOpenPath] = useState<string | null>(null);
  const [scrollSection, setScrollSection] = useState("hero");
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();
  const isMenuOpen = openPath === pathname;
  const router = useRouter();
  const [hash, setHash] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const scrollDelta = useRef(0);

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
    pathname === "/courses" ||
    pathname.startsWith("/course/") ||
    pathname.startsWith("/diagnostic");
  const isCareerPage =
    pathname === "/career" || pathname.startsWith("/career/");
  const isPremiumPage = pathname === "/premium";
  const activeSection = isCourseDetailPage
    ? "courses"
    : isCareerPage
      ? "career"
      : isPremiumPage
        ? "premium"
        : isHomePage
          ? scrollSection
          : "";

  const toggleMenu = () => {
    scrollDelta.current = 0;
    setHidden(false);
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
      const currentScrollY = scrollOffset();
      const delta = currentScrollY - lastScrollY.current;
      lastScrollY.current = currentScrollY;
      setScrolled(currentScrollY > 10);

      if (isMenuOpen || currentScrollY <= HEADER_PINNED_UNTIL) {
        scrollDelta.current = 0;
        setHidden(false);
      } else if (delta !== 0) {
        if (
          scrollDelta.current !== 0 &&
          Math.sign(delta) !== Math.sign(scrollDelta.current)
        ) {
          scrollDelta.current = 0;
        }
        scrollDelta.current += delta;
        if (scrollDelta.current >= HEADER_HIDE_AFTER) {
          scrollDelta.current = 0;
          setHidden(true);
        } else if (scrollDelta.current <= -HEADER_SHOW_AFTER) {
          scrollDelta.current = 0;
          setHidden(false);
        }
      }

      if (!isHomePage) return;

      const sections = ["hero", "about-us", "testimonials", "join"];
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

    lastScrollY.current = scrollOffset();
    const frame = requestAnimationFrame(handleScroll);
    let ticking = false;
    const throttledScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        handleScroll();
      });
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", throttledScroll);
    };
  }, [isHomePage, isMenuOpen]);

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

    if (sectionId === "premium") {
      closeMenu();
      router.push("/premium");
      setTimeout(() => {
        scrollToPosition(0);
      }, 100);
      return;
    }

    if (sectionId === "courses") {
      closeMenu();
      router.push("/courses");
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

  const navItems = [
    { id: "hero", label: "Home" },
    { id: "courses", label: "Courses" },
    { id: "premium", label: "Premium" },
    { id: "about-us", label: "About Us" },
    { id: "testimonials", label: "Success Stories" },
    { id: "career", label: "Career" },
  ];

  const itemHref = (id: string) => {
    if (id === "career") return "/career";
    if (id === "premium") return "/premium";
    if (id === "courses") return "/courses";
    return `/#${id}`;
  };

  return (
    <nav
      className="site-header"
      aria-label="Main navigation"
      data-scrolled={scrolled}
      data-hidden={!isMenuOpen && hidden ? "true" : "false"}
      onFocusCapture={() => {
        scrollDelta.current = 0;
        setHidden(false);
      }}
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
          <Link
            href="/courses#diagnostic"
            className="public-button public-button--dark"
            onClick={closeMenu}
          >
            Free diagnostic
          </Link>
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
          <Link
            href="/courses#diagnostic"
            onClick={closeMenu}
            className="public-button public-button--orange"
          >
            Take the free diagnostic
          </Link>
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;
