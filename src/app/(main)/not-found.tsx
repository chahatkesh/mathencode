import Link from "next/link";

export default function PublicNotFound() {
  return (
    <div className="site-container py-24 pt-[calc(var(--site-header)+5rem)] text-center">
      <span className="public-pill">A small detour</span>
      <h1 className="public-display mt-8">
        This page doesn’t <span className="scribble">add up.</span>
      </h1>
      <p className="public-lead mx-auto mt-8 max-w-lg">
        That course, test, or role isn’t available. There’s still a next step
        waiting for you.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-5">
        <Link href="/" className="public-button public-button--orange">
          Back to home
        </Link>
        <Link
          href="/which-course"
          className="public-button public-button--outline"
        >
          Explore courses
        </Link>
      </div>
    </div>
  );
}
