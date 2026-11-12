import Link from "next/link";

export default function NotFoundContent() {
  return (
    <div className="site-container py-24 pt-[calc(var(--site-header)+5rem)] text-center">
      <p className="public-eyebrow">404</p>
      <h1 className="public-display mt-5">
        This page is <span className="scribble">not available.</span>
      </h1>
      <p className="public-lead mx-auto mt-6 max-w-lg">
        That address is not part of MathEncode. Explore the courses that are
        open, or go back home.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-5">
        <Link href="/" className="public-button public-button--orange">
          Back to home
        </Link>
        <Link href="/courses" className="public-button public-button--outline">
          Explore courses
        </Link>
      </div>
    </div>
  );
}
