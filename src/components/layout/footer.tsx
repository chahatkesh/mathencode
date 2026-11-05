import Image from "next/image";
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
      className="mt-0.5 h-4 w-4 shrink-0 fill-current text-white/70"
      aria-hidden
    >
      <path d="M20.5 3.5A11 11 0 0 0 2.1 16.8L1 23l6.4-1.1A11 11 0 0 0 20.5 3.5zM12 20.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3.8.6.6-3.7-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.7.8c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.5-.6.2-.4c0-.1 0-.3-.1-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4a9.2 9.2 0 0 0 3.5 3.1c1.3.6 1.8.6 2.4.5.4-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.1-.4-.2z" />
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
    <footer className="bg-dark text-white">
      <div className="pb-12 pt-16">
        <div className="container-custom">
          <div className="mb-14 border-b border-white/10 pb-12 text-center">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Book a free demo
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
              Tell us the course and what feels hard. We’ll suggest a batch that
              fits.
            </p>
            <BookDemoButton className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-secondary px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-secondary/90 sm:w-auto">
              Book a free demo
            </BookDemoButton>
          </div>

          <div className="mb-12 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            <div className="col-span-2 lg:col-span-1">
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
                Live small-group classes, with about 4–5 students in each batch.
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
                      className="inline-flex min-h-11 items-center text-sm text-white/65 transition-colors hover:text-white"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">Courses</h3>
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
                      className="inline-flex min-h-11 items-center text-sm text-white/65 transition-colors hover:text-white"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 lg:col-span-1">
              <h3 className="text-sm font-semibold text-white">Contact</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a
                    href="https://wa.me/918287357311"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-11 items-start gap-3 py-1 text-sm text-white/80 transition-colors hover:text-white"
                  >
                    <WhatsAppIcon />
                    <span>
                      <span className="block text-white/45">WhatsApp</span>
                      +91-8287357311
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:learn@mathencode.com"
                    className="flex min-h-11 items-start gap-3 py-1 text-sm text-white/80 transition-colors hover:text-white"
                  >
                    <MailIcon />
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

      <div className="border-t border-white/10 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6">
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
              className="inline-flex min-h-11 items-center text-sm text-white/60 transition-colors hover:text-white"
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
