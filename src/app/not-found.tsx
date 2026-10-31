import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="font-montserrat text-4xl font-bold text-dark">
        Page not found
      </h1>
      <p className="mt-3 text-dark/70">That page is not part of MathEncode.</p>
      <Link href="/" className="btn-primary mt-6">
        Back to home
      </Link>
    </div>
  );
}
