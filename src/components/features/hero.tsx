"use client";

import Image from "next/image";
import { openDemoPopup } from "~/components/layout/book-demo-button";
import {
  BooksIcon,
  LiveIcon,
  MedalIcon,
  StudentsIcon,
} from "~/components/icons/brand-icons";

const STATS: {
  icon: () => React.ReactNode;
  value: string;
  label: string;
}[] = [
  { icon: MedalIcon, value: "5+ years", label: "Teaching experience" },
  { icon: StudentsIcon, value: "50+", label: "Students coached" },
  { icon: BooksIcon, value: "4–5", label: "Students per batch" },
  { icon: LiveIcon, value: "Live", label: "Small-group classes" },
];

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

const Hero = () => {
  return (
    <section id="hero" className="bg-white pt-[var(--site-header)]">
      <div className="bg-[linear-gradient(270deg,#FFF1E8_0%,#FFE0CC_38%,#FFF6F0_72%,#FFE8D6_100%)] pb-32 sm:pb-24">
        <div className="container-custom grid items-center gap-8 pt-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14 lg:pt-10">
          <div className="max-w-xl">
            <h1 className="text-balance text-[2.15rem] font-semibold leading-[1.08] tracking-tight text-dark sm:text-5xl lg:text-[3.35rem]">
              Transform Your Math
              <span className="mt-1 block text-secondary">Journey Today</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-dark/65 sm:text-lg">
              Live lessons in batches of about 4–5 students. We slow each idea
              down until it sticks, then build the confidence to use it.
            </p>
            <button
              type="button"
              onClick={openDemoPopup}
              className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-secondary px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-secondary/90 sm:w-auto"
            >
              Book a free demo
              <ArrowRightIcon />
            </button>
          </div>

          <div className="relative mx-auto h-[17.5rem] w-full max-w-md min-[400px]:h-[19rem] sm:h-[23rem]">
            <div className="absolute inset-x-8 bottom-4 top-6 rounded-full bg-white/80" />
            <div className="absolute inset-x-4 bottom-0 top-2 rounded-full border border-dashed border-secondary/25" />
            <span className="absolute left-6 top-10 h-2.5 w-2.5 rounded-full bg-secondary" />
            <span className="absolute right-8 top-6 h-2 w-2 rounded-full bg-accent" />
            <span className="absolute bottom-10 right-4 h-2.5 w-2.5 rounded-full bg-purple" />
            <Image
              src="/hero-girl.png"
              alt="Student reading during a math lesson"
              width={750}
              height={750}
              priority
              sizes="(min-width: 1024px) 280px, 62vw"
              className="absolute bottom-2 left-0 h-[78%] w-auto max-w-[62%] object-contain object-bottom"
            />
            <Image
              src="/hero-boy.png"
              alt="Student studying with a notebook"
              width={500}
              height={500}
              loading="eager"
              sizes="(min-width: 1024px) 220px, 48vw"
              className="absolute bottom-6 right-0 h-[62%] w-auto max-w-[48%] object-contain object-bottom"
            />
            <div className="absolute left-1/2 top-1 z-10 w-[11.5rem] -translate-x-1/2 rounded-2xl border border-black/[0.04] bg-white px-3 py-2.5 text-sm leading-snug text-dark">
              One concept, fully understood.
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom relative z-10 -mt-28 sm:-mt-[4.5rem]">
        <ul className="grid grid-cols-2 gap-x-3.5 gap-y-4 rounded-xl border border-[#f0f0f0] bg-white px-2.5 py-4 sm:grid-cols-4 sm:gap-0 sm:divide-x sm:divide-[#ededed] sm:px-5">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <li
                key={stat.label}
                className="flex flex-col items-center px-2 text-center sm:px-4"
              >
                <Icon />
                <p className="mt-2.5 text-sm font-semibold tracking-tight text-[#1b2124] sm:mt-3.5 sm:text-base">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-xs leading-snug text-[#3D3D3D] sm:text-sm">
                  {stat.label}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default Hero;
