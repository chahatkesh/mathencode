/**
 * Clearer public lines for courses already in the catalog.
 * Each line restates that course's published description.
 * It does not add topics, prerequisites, or exam claims the catalog does not support.
 * Unknown courses fall back to the stored description.
 */

const blurbs: Record<string, string> = {
  "ap-precalculus":
    "Functions and trigonometry for the AP Precalculus exam, including the ideas that lead into calculus.",
  "ap precalculus":
    "Functions and trigonometry for the AP Precalculus exam, including the ideas that lead into calculus.",
  "ap-calculus-ab":
    "Limits, derivatives, and integrals for the AP Calculus AB exam.",
  "ap calculus ab":
    "Limits, derivatives, and integrals for the AP Calculus AB exam.",
  "ap-calculus-bc":
    "Calculus AB topics, plus series, parametric equations, and polar functions, for the AP Calculus BC exam.",
  "ap calculus bc":
    "Calculus AB topics, plus series, parametric equations, and polar functions, for the AP Calculus BC exam.",
  algebra: "Equations and functions that later mathematics courses build on.",
};

export function isApCourse(course: { title: string }) {
  return /^ap\b/i.test(course.title.trim());
}

export function courseKindLabel(course: { title: string }) {
  return isApCourse(course) ? "AP course" : "Foundation";
}

export function courseBlurb(course: {
  slug?: string;
  title: string;
  description?: string | null;
}) {
  const slug = course.slug?.trim().toLowerCase();
  const title = course.title.trim().toLowerCase();
  return (
    (slug ? blurbs[slug] : undefined) ??
    blurbs[title] ??
    course.description?.trim() ??
    ""
  );
}
