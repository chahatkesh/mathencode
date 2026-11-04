"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FaEnvelope, FaWhatsapp } from "react-icons/fa";

const sectionHref = (id: string) => {
  if (id === "career") return "/career";
  if (id === "hero") return "/";
  return `/#${id}`;
};

const Footer = () => {
  const pathname = usePathname();
  const router = useRouter();

  const goToSection = (
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }

    event.preventDefault();

    if (id === "career") {
      if (pathname !== "/career") router.push("/career");
      else window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (pathname !== "/") {
      router.push(sectionHref(id));
      return;
    }

    const element = document.getElementById(id);
    if (!element) return;

    const offset = id === "hero" ? 0 : 80;
    window.scrollTo({
      top: element.offsetTop - offset,
      behavior: "smooth",
    });
  };

  // Function to trigger demo booking
  const handleBookDemo = () => {
    window.dispatchEvent(new CustomEvent("openDemoPopup"));
  };

  return (
    <footer className="bg-dark text-white">
      {/* Main Footer Content */}
      <div className="pb-12 pt-16">
        <div className="container-custom">
          {/* Top Section - CTA */}
          <div className="mb-14 border-b border-white/10 pb-12 text-center">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Book a free demo
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
              Tell us the grade and what feels hard. We’ll suggest a class that
              fits.
            </p>
            <button
              type="button"
              onClick={handleBookDemo}
              className="mt-8 inline-flex rounded-xl bg-secondary px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-secondary/90"
            >
              Book a free demo
            </button>
          </div>

          <div className="mb-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Image
                src="/logo_white.svg"
                alt=""
                width={32}
                height={32}
                unoptimized
                className="h-8 w-auto"
              />
              <p className="mt-4 text-xl font-bold tracking-tight text-white">
                Math<span className="text-secondary">Encode</span>
              </p>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/65">
                Live, one-to-one coaching for grades{" "}
                <span className="whitespace-nowrap">K–12.</span>
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">Explore</h3>
              <ul className="mt-4 space-y-2.5">
                {(
                  [
                    ["hero", "Home"],
                    ["about-us", "About Us"],
                    ["career", "Career"],
                  ] as const
                ).map(([id, label]) => (
                  <li key={id}>
                    <a
                      href={sectionHref(id)}
                      onClick={(event) => goToSection(event, id)}
                      className="text-sm text-white/65 transition-colors hover:text-white"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">Programs</h3>
              <ul className="mt-4 space-y-2.5">
                {(
                  [
                    ["courses", "Courses"],
                    ["testimonials", "Success Stories"],
                  ] as const
                ).map(([id, label]) => (
                  <li key={id}>
                    <a
                      href={sectionHref(id)}
                      onClick={(event) => goToSection(event, id)}
                      className="text-sm text-white/65 transition-colors hover:text-white"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">Contact</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a
                    href="https://wa.me/918287357311"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 text-sm text-white/80 transition-colors hover:text-white"
                  >
                    <FaWhatsapp className="mt-0.5 h-4 w-4 shrink-0 text-white/70" />
                    <span>
                      <span className="block text-white/45">WhatsApp</span>
                      +91-8287357311
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:learn@mathencode.com"
                    className="flex items-start gap-3 text-sm text-white/80 transition-colors hover:text-white"
                  >
                    <FaEnvelope className="mt-0.5 h-4 w-4 shrink-0 text-white/70" />
                    <span>
                      <span className="block text-white/45">Email</span>
                      learn@mathencode.com
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Copyright */}
      <div className="border-t border-white/10 py-6">
        <div className="container-custom">
          <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
            <p className="text-sm text-white/55">
              © {new Date().getFullYear()} MathEncode
            </p>
            <p className="text-sm text-white/60">
              Developed by{" "}
              <a
                href="https://chahatkesh.me"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 transition-colors hover:text-white"
              >
                chahatkesh.me
              </a>
            </p>
            <a
              href="/privacy"
              className="text-sm text-white/60 transition-colors hover:text-white"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
