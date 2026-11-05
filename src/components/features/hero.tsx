"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { openDemoPopup } from "~/components/layout/book-demo-button";
import {
  BooksIcon,
  LiveIcon,
  MedalIcon,
  StudentsIcon,
} from "~/components/icons/brand-icons";
import DottedGrid from "~/components/layout/dotted-grid";
import { formatCourseDate } from "~/lib/course-format";
import type { MarketingCourse } from "~/types";

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

function CaretIcon({ direction }: { direction: "left" | "right" }) {
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
      <path d={direction === "left" ? "m14.5 6-6 6 6 6" : "m9.5 6 6 6-6 6"} />
    </svg>
  );
}

type Banner = {
  id: string;
  title: string;
  starts: string;
  description: string;
  href: string;
};

function bannersFromCourses(courses: MarketingCourse[]): Banner[] {
  const banners = courses
    .filter((course) => course.title.trim())
    .map((course) => ({
      id: course.id,
      title: course.title.trim(),
      starts: formatCourseDate(course.startDate) ?? "",
      description: course.description.trim(),
      href: `/course/${course.slug || course.publicId}`,
    }));

  if (banners.length > 0) return banners;

  return [
    {
      id: "mathencode",
      title: "Small-group math classes",
      starts: "",
      description: "Live classes in batches of about 4–5 students.",
      href: "#courses",
    },
  ];
}

const Hero = ({ courses }: { courses: MarketingCourse[] }) => {
  const banners = bannersFromCourses(courses);
  const count = banners.length;
  const loop = count > 1;
  const slides = loop ? [banners[count - 1], ...banners, banners[0]] : banners;
  const [position, setPosition] = useState(loop ? 1 : 0);
  const [animate, setAnimate] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const positionRef = useRef(position);
  const frameRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<{ id: number; x: number; y: number } | null>(null);
  const suppressClick = useRef(false);
  const [frameWidth, setFrameWidth] = useState(0);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const update = () => setFrameWidth(frame.clientWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);
  const realIndex = loop ? (position - 1 + count) % count : 0;
  const active = banners[realIndex];

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!loop) return;
    if (position !== 0 && position !== count + 1) return;

    const timeout = window.setTimeout(
      () => {
        setAnimate(false);
        setPosition(position === 0 ? count : 1);
      },
      reduceMotion ? 0 : 520,
    );

    return () => window.clearTimeout(timeout);
  }, [position, loop, count, reduceMotion]);

  useEffect(() => {
    if (animate) return;
    let second = 0;
    const first = window.requestAnimationFrame(() => {
      second = window.requestAnimationFrame(() => setAnimate(true));
    });
    return () => {
      window.cancelAnimationFrame(first);
      window.cancelAnimationFrame(second);
    };
  }, [animate]);

  useEffect(() => {
    if (paused || !loop || reduceMotion) return;

    const timer = window.setInterval(() => {
      const current = positionRef.current;
      if (current === 0 || current === count + 1) return;
      setAnimate(true);
      setPosition(current + 1);
    }, 5600);

    return () => window.clearInterval(timer);
  }, [paused, loop, count, reduceMotion]);

  function step(delta: 1 | -1) {
    const current = positionRef.current;
    if (!loop || current === 0 || current === count + 1) return;
    setAnimate(true);
    setPosition(current + delta);
  }

  function goTo(index: number) {
    if (!loop) {
      setAnimate(true);
      setPosition(index);
      return;
    }
    const current = positionRef.current;
    if (current === 0 || current === count + 1) return;
    setAnimate(true);
    setPosition(index + 1);
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointerRef.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
    setPaused(true);
  }

  function onPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    const start = pointerRef.current;
    pointerRef.current = null;
    setPaused(false);
    if (!start || start.id !== event.pointerId || !loop) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    suppressClick.current = true;
    step(dx < 0 ? 1 : -1);
  }

  function onPointerCancel() {
    pointerRef.current = null;
    setPaused(false);
  }

  return (
    <section id="hero" className="bg-white pt-[var(--site-header)]">
      <div className="bg-[linear-gradient(270deg,#FFF1E8_0%,#FFE0CC_38%,#FFF6F0_72%,#FFE8D6_100%)] pb-32 sm:pb-24">
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div
            className="container-custom pt-4 sm:pt-5 lg:pt-6"
            aria-roledescription="carousel"
            aria-label="Courses"
          >
            <p className="sr-only" aria-live="polite">
              {active
                ? `${active.title}. Slide ${realIndex + 1} of ${count}.`
                : ""}
            </p>
            <div className="group relative">
              <div className="relative">
                <div
                  ref={frameRef}
                  className="touch-pan-y overflow-hidden rounded-2xl sm:rounded-3xl"
                  onPointerDown={onPointerDown}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerCancel}
                >
                  <div
                    className="flex"
                    style={{
                      transform: `translate3d(-${position * frameWidth}px, 0, 0)`,
                      transition:
                        animate && !reduceMotion && frameWidth > 0
                          ? "transform 500ms ease-out"
                          : "none",
                    }}
                  >
                    {slides.map((banner, slideIndex) => {
                      const isVisible = slideIndex === position;
                      return (
                        <Link
                          key={`${banner.id}-${slideIndex}`}
                          href={banner.href}
                          prefetch={isVisible}
                          draggable={false}
                          tabIndex={isVisible ? 0 : -1}
                          aria-hidden={!isVisible}
                          inert={!isVisible}
                          onClick={(event) => {
                            if (!suppressClick.current) return;
                            event.preventDefault();
                            suppressClick.current = false;
                          }}
                          className="relative block shrink-0 select-none overflow-hidden bg-secondary outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/80"
                          style={{
                            width: frameWidth > 0 ? frameWidth : "100%",
                          }}
                        >
                          <DottedGrid size={28} />
                          <div className="relative flex min-h-[12.5rem] flex-col justify-center px-5 py-6 sm:min-h-[14.5rem] sm:px-16 sm:py-8 lg:min-h-[15.5rem]">
                            <div className="flex items-center gap-4 sm:gap-8">
                              <div className="min-w-0 flex-1">
                                <h2 className="text-balance text-[1.45rem] font-semibold leading-[1.2] tracking-tight text-white sm:text-4xl lg:text-5xl">
                                  {banner.title}
                                </h2>
                                {banner.starts ? (
                                  <p className="mt-2 text-sm font-medium text-white/85 sm:mt-3 sm:text-base">
                                    Starts {banner.starts}
                                  </p>
                                ) : null}
                              </div>
                              {banner.description ? (
                                <p className="line-clamp-4 hidden max-w-[15rem] shrink-0 text-right text-sm leading-snug text-white/85 lg:block xl:max-w-xs xl:text-base">
                                  {banner.description}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
                {loop ? (
                  <>
                    <button
                      type="button"
                      aria-label="Previous course"
                      onClick={() => step(-1)}
                      className="absolute left-3 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/45 bg-white/15 text-white opacity-0 backdrop-blur-[2px] transition-opacity duration-200 hover:bg-white/25 focus-visible:opacity-100 group-hover:opacity-100 sm:flex [@media(hover:none)]:opacity-100"
                    >
                      <CaretIcon direction="left" />
                    </button>
                    <button
                      type="button"
                      aria-label="Next course"
                      onClick={() => step(1)}
                      className="absolute right-3 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/45 bg-white/15 text-white opacity-0 backdrop-blur-[2px] transition-opacity duration-200 hover:bg-white/25 focus-visible:opacity-100 group-hover:opacity-100 sm:flex [@media(hover:none)]:opacity-100"
                    >
                      <CaretIcon direction="right" />
                    </button>
                  </>
                ) : null}
              </div>
              {loop ? (
                <div className="mt-3 flex items-center justify-center gap-1 sm:mt-4">
                  <button
                    type="button"
                    aria-label="Previous course"
                    onClick={() => step(-1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white text-dark sm:hidden"
                  >
                    <CaretIcon direction="left" />
                  </button>
                  <div className="flex items-center justify-center">
                    {banners.map((banner, index) => {
                      const selected = index === realIndex;
                      return (
                        <button
                          key={banner.id}
                          type="button"
                          aria-label={`Show ${banner.title}`}
                          aria-current={selected ? "true" : undefined}
                          onClick={() => goTo(index)}
                          className="flex h-11 w-6 items-center justify-center"
                        >
                          <span
                            className={`h-1.5 rounded-full transition-all ${
                              selected ? "w-6 bg-secondary" : "w-1.5 bg-dark/25"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    aria-label="Next course"
                    onClick={() => step(1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white text-dark sm:hidden"
                  >
                    <CaretIcon direction="right" />
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>

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
