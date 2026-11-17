import Image from "next/image";
import Link from "next/link";
import { BookDemoButton } from "~/components/layout/book-demo-button";

const sectionHref = (id: string) => {
  if (id === "career") return "/career";
  if (id === "premium") return "/premium";
  if (id === "hero") return "/#hero";
  return `/#${id}`;
};

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="footer-whatsapp shrink-0"
      aria-hidden="true"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3.35a8.4 8.4 0 0 0-7.28 12.62L3.2 20.65l4.9-1.3A8.4 8.4 0 1 0 12 3.35Z"
      />
      <path
        fill="currentColor"
        d="M8.15 7.55c.26-.34.76-.42 1.12-.16l1.02.6c.34.2.46.62.3 1l-.46 1.02c-.12.26-.04.56.18.72 1.02 1.1 2.08 2.08 3.28 2.96.2.16.48.2.7.06l1.02-.46c.38-.18.84-.02 1.04.36l.6 1.02c.26.36.18.86-.16 1.12l-.52.4c-.42.32-1 .4-1.52.2-1.42-.52-3.2-1.52-4.56-3.08-1.36-1.56-2.12-3.28-2.36-4.62-.12-.52.04-1.1.42-1.46l.4-.48Z"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="mt-0.5 h-4 w-4 shrink-0 text-white/70"
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-invitation text-[#263238]">
        <div className="site-container">
          <div>
            <h2 className="public-title">
              Find the right <span className="scribble">AP Math course.</span>
            </h2>
            <p className="public-lead">
              Book a free demo and tell us what you want to prepare for.
            </p>
          </div>
          <BookDemoButton className="public-button public-button--dark">
            Book a free demo
          </BookDemoButton>
        </div>
      </div>
      <div className="site-container">
        <div className="footer-main">
          <div className="footer-brand">
            <Link href="/" className="brand" aria-label="MathEncode home">
              <Image
                src="/logo_white.svg"
                alt=""
                width={34}
                height={38}
                unoptimized
              />
              <span>
                Math<em>Encode</em>
              </span>
            </Link>
            <p>
              Live classes for AP Precalculus, Calculus AB, and Calculus BC.
            </p>
          </div>
          <div>
            <h3>Explore</h3>
            <ul>
              {[
                ["hero", "Home"],
                ["about-us", "About us"],
                ["career", "Careers"],
              ].map(([id, label]) => (
                <li key={id}>
                  <Link href={sectionHref(id!)}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Learn with us</h3>
            <ul>
              <li>
                <Link href="/courses">Courses</Link>
              </li>
              <li>
                <Link href="/courses#diagnostic">Free diagnostic</Link>
              </li>
              <li>
                <Link href="/premium">Premium mentorship</Link>
              </li>
              <li>
                <Link href="/#how-it-works">How it works</Link>
              </li>
              <li>
                <Link href="/#testimonials">Success stories</Link>
              </li>
            </ul>
          </div>
          <div className="footer-contact">
            <h3>Say hello</h3>
            <ul>
              <li>
                <a
                  href="https://wa.me/918287357311"
                  aria-label="Chat on WhatsApp at +91-8287357311"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon />
                  +91-8287357311
                </a>
              </li>
              <li>
                <a href="mailto:learn@mathencode.com">
                  <MailIcon />
                  learn@mathencode.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        <p className="footer-wordmark" aria-hidden="true">
          MathEncode.
        </p>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} MathEncode</p>
          <p>
            Developed by{" "}
            <a
              href="https://chahatkesh.me"
              target="_blank"
              rel="noopener noreferrer"
            >
              chahatkesh.me
            </a>
          </p>
          <Link href="/privacy">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
