"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import {
  LAUNCH_DISMISS_STORAGE,
  type CourseLaunch,
  type CourseLaunchItem,
} from "~/lib/course-launch";

function CourseLink({ item }: { item: CourseLaunchItem }) {
  return (
    <Link href={item.href} className="announce-item" aria-label={item.sentence}>
      <span className="announce-name">{item.title}</span>
      <span className="announce-when">{item.when}</span>
    </Link>
  );
}

const AnnouncementBar = ({ launch }: { launch: CourseLaunch }) => {
  const barRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [slide, setSlide] = useState(false);
  const [paused, setPaused] = useState(false);

  useLayoutEffect(() => {
    const root = document.querySelector(".public-site");
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(LAUNCH_DISMISS_STORAGE) === launch.key;
    } catch {
      dismissed = root?.getAttribute("data-launch-dismissed") === "true";
    }
    if (dismissed) root?.setAttribute("data-launch-dismissed", "true");
    else root?.removeAttribute("data-launch-dismissed");
  }, [launch.key]);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const measure = measureRef.current;
    const bar = barRef.current;
    if (!viewport || !measure || !bar) return;

    const apply = () => {
      const fits = measure.scrollWidth <= viewport.clientWidth + 1;
      if (fits) viewport.scrollTo({ left: 0 });
      setSlide((current) => (current === !fits ? current : !fits));
    };

    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(viewport);
    window.addEventListener("resize", apply);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, [launch.items]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !slide || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const count = launch.items.length;
    if (count < 2) return;
    let index = Math.round(viewport.scrollLeft / viewport.clientWidth);
    const id = window.setInterval(() => {
      index = (index + 1) % count;
      viewport.scrollTo({
        left: index * viewport.clientWidth,
        behavior: "smooth",
      });
    }, 4200);

    return () => window.clearInterval(id);
  }, [launch.items.length, launch.key, paused, slide]);

  const dismiss = () => {
    const returnFocus =
      barRef.current?.contains(document.activeElement) ?? false;
    try {
      localStorage.setItem(LAUNCH_DISMISS_STORAGE, launch.key);
    } catch {
      // Storage can be blocked. The strip still closes for this view.
    }
    document
      .querySelector(".public-site")
      ?.setAttribute("data-launch-dismissed", "true");
    if (returnFocus) document.querySelector<HTMLElement>(".brand")?.focus();
  };

  return (
    <div
      ref={barRef}
      className={slide ? "announce-bar announce-bar--slide" : "announce-bar"}
      role="region"
      aria-label="Upcoming courses"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setPaused(false);
      }}
      onKeyDown={(event) => {
        if (event.key !== "Escape") return;
        event.preventDefault();
        event.stopPropagation();
        dismiss();
      }}
    >
      <div className="announce-measure" ref={measureRef} aria-hidden="true">
        {launch.items.map((item) => (
          <span className="announce-item" key={item.key}>
            <span className="announce-name">{item.title}</span>
            <span className="announce-when">{item.when}</span>
          </span>
        ))}
      </div>
      <p className="announce-kicker">
        <span className="announce-kicker-dot" aria-hidden="true" />
        Next up
      </p>
      <div className="announce-viewport" ref={viewportRef}>
        <div className="announce-set">
          {launch.items.map((item) => (
            <CourseLink key={item.key} item={item} />
          ))}
        </div>
      </div>
      <button
        type="button"
        className="announce-dismiss"
        aria-label="Dismiss announcement"
        onClick={dismiss}
      >
        <X aria-hidden size={16} />
      </button>
    </div>
  );
};

export default AnnouncementBar;
