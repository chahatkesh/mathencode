import Image from "next/image";
import Link from "next/link";
import { BookDemoButton } from "~/components/layout/book-demo-button";

const sectionHref = (id: string) => {
  if (id === "career") return "/career";
  if (id === "hero") return "/#hero";
  return `/#${id}`;
};

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="footer-whatsapp shrink-0"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.45L3 20l1.1-4.6A8.5 8.5 0 1 1 20.5 11.5Z" />
      <path d="M8.3 7.5c-.4 0-.8.3-.9.7-.5 1.4.4 3.3 2.1 5s3.6 2.6 5 2.1c.4-.1.7-.5.7-.9v-1l-2.1-1-.9.9a7.6 7.6 0 0 1-2.7-2.7l.9-.9-1-2.2H8.3Z" />
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
            <p className="public-eyebrow">A fresh start with math</p>
            <h2 className="public-title">
              Small steps. <span className="scribble">Lasting confidence.</span>
            </h2>
            <p className="public-lead">
              Tell us the course and what feels hard. We’ll suggest a batch that
              fits.
            </p>
          </div>
          <BookDemoButton className="public-button public-button--dark">
            Book a free demo <span aria-hidden="true">↗</span>
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
              Live small-group classes, with about 4–5 students in each batch.
              One concept, fully understood.
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
                <Link href="/#courses">Courses</Link>
              </li>
              <li>
                <Link href="/which-course">Find your course</Link>
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
