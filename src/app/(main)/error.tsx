"use client";

import Link from "next/link";

export default function PublicError({ reset }: { reset: () => void }) {
  return (
    <div className="site-container py-24 pt-[calc(var(--site-header)+5rem)] text-center">
      <span className="public-pill">A small pause</span>
      <h1 className="public-display mt-8">
        This page couldn’t <span className="scribble">load.</span>
      </h1>
      <p className="public-lead mx-auto mt-8 max-w-lg">
        Something went wrong while loading this page. Try again in a moment.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-5">
        <button
          type="button"
          onClick={() => reset()}
          className="public-button public-button--orange"
        >
          Try again
        </button>
        <Link href="/courses" className="public-button public-button--outline">
          Explore courses
        </Link>
      </div>
    </div>
  );
}
