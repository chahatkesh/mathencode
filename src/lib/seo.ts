import type { Metadata } from "next";
import type { JobOpening } from "~/data/jobs";
import { coursePublicDescription } from "~/lib/course-format";
import type { MarketingCourse } from "~/types";

export const SITE_NAME = "MathEncode";

export const SITE_DESCRIPTION =
  "Live small-group math classes. Each batch has about 4–5 students, and a lesson stays with an idea until the class can use it.";

export const HOME_TITLE = "MathEncode | Small-Group Math Classes";

export const PRIVACY_DESCRIPTION =
  "How MathEncode collects and uses names, contact details, diagnostic results, and tutor applications on this site.";

export const PRIVACY_UPDATED = "2026-11-05";

export const CAREER_DESCRIPTION =
  "Open teaching roles at MathEncode. Live small-group math classes, with about 4–5 students in each batch.";

export const SITE_KEYWORDS = [
  "MathEncode",
  "small-group math classes",
  "online math classes",
  "math diagnostic test",
  "live math lessons",
];

const PRODUCTION_ORIGIN = "https://mathencode.com";

function normalizeOrigin(value: string) {
  const trimmed = value.trim().replace(/\/+$/, "");
  if (!trimmed) return null;
  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  try {
    const url = new URL(withProtocol);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.origin;
  } catch {
    return null;
  }
}

export function allowIndexing() {
  return process.env.VERCEL_ENV !== "preview";
}

export function siteOrigin() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL
    ? normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL)
    : null;
  if (configured) return configured;

  if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL) {
    const preview = normalizeOrigin(process.env.VERCEL_URL);
    if (preview) return preview;
  }

  if (
    process.env.VERCEL_ENV === "production" &&
    process.env.VERCEL_PROJECT_PRODUCTION_URL
  ) {
    const production = normalizeOrigin(
      process.env.VERCEL_PROJECT_PRODUCTION_URL,
    );
    if (production) return production;
  }

  if (process.env.NODE_ENV === "development") return "http://localhost:3000";
  return PRODUCTION_ORIGIN;
}

export function siteHost() {
  return new URL(siteOrigin()).host;
}

export function absoluteUrl(path: string) {
  if (path === "/") return siteOrigin();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, siteOrigin()).toString();
}

export function plainText(value: string) {
  return value
    .replace(/\u2014/g, " - ")
    .replace(/\s+/g, " ")
    .trim();
}

// Copy structured output at the boundary; never alter source records.
function seoStrings(value: unknown): unknown {
  if (typeof value === "string") return value.replace(/\u2014/g, "-");
  if (Array.isArray(value)) return value.map(seoStrings);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, seoStrings(item)]),
    );
  }
  return value;
}

export function clipText(value: string, max: number) {
  const clean = plainText(value);
  if (clean.length <= max) return clean;
  const room = Math.max(1, max - 1);
  const sliced = clean.slice(0, room);
  const lastSpace = sliced.lastIndexOf(" ");
  const cut = lastSpace > room * 0.6 ? sliced.slice(0, lastSpace) : sliced;
  return `${cut.trimEnd()}…`;
}

export function ogSafe(value: string) {
  return value
    .replace(/[–\u2014]/g, "-")
    .replace(/…/g, "...")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'");
}

export function metaDescription(
  value: string | undefined | null,
  fallback: string,
) {
  const clean = plainText(value ?? "");
  return clipText(clean || fallback, 160);
}

export function metaTitle(value: string | undefined | null, fallback: string) {
  const clean = plainText(value ?? "");
  return clipText(clean || fallback, 80);
}

export function socialTitle(title: string) {
  const clean = plainText(title);
  return clean.includes(SITE_NAME) ? clean : `${clean} · ${SITE_NAME}`;
}

export function privacyUpdatedLabel() {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${PRIVACY_UPDATED}T00:00:00Z`));
}

const publicRobots: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

export const adminRobots: Metadata["robots"] = {
  index: false,
  follow: false,
  nocache: true,
  googleBot: {
    index: false,
    follow: false,
    noimageindex: true,
    nocache: true,
  },
};

export function robotsDirective(
  index: boolean,
  follow = true,
): Metadata["robots"] {
  if (index && allowIndexing()) return publicRobots;
  const hiddenOnPurpose = !index;
  return {
    index: false,
    follow,
    ...(hiddenOnPurpose ? { nocache: true } : {}),
    googleBot: {
      index: false,
      follow,
      ...(hiddenOnPurpose ? { noimageindex: true } : {}),
    },
  };
}

type PageSeo = {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
  index?: boolean;
  keywords?: string[];
};

export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  index = true,
  keywords,
}: PageSeo): Metadata {
  title = plainText(title);
  description = plainText(description);
  keywords = keywords?.map(plainText);
  const social = absoluteTitle ? title : socialTitle(title);
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords,
    alternates: { canonical: path },
    robots: robotsDirective(index),
    openGraph: {
      type: "website",
      locale: "en_US",
      url: path,
      siteName: SITE_NAME,
      title: social,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: social,
      description,
    },
  };
}

export const homeMetadata = pageMetadata({
  title: HOME_TITLE,
  description: SITE_DESCRIPTION,
  path: "/",
  absoluteTitle: true,
  keywords: SITE_KEYWORDS,
});

export const privacyMetadata = pageMetadata({
  title: "Privacy Policy",
  description: PRIVACY_DESCRIPTION,
  path: "/privacy",
  keywords: [...SITE_KEYWORDS, "privacy policy"],
});

export const WHICH_COURSE_DESCRIPTION =
  "Not sure which MathEncode course to take? See the available courses, or attempt the free test to find where to start.";

export const whichCourseMetadata = pageMetadata({
  title: "Not sure which course?",
  description: WHICH_COURSE_DESCRIPTION,
  path: "/which-course",
  keywords: [...SITE_KEYWORDS, "which math course", "free diagnostic"],
});

export const careerMetadata = pageMetadata({
  title: "Careers",
  description: CAREER_DESCRIPTION,
  path: "/career",
  keywords: [...SITE_KEYWORDS, "math teaching jobs", "teaching jobs"],
});

export function courseSummary(
  course: Pick<
    MarketingCourse,
    "title" | "description" | "startDate" | "topics" | "batchSize"
  >,
) {
  return metaDescription(
    coursePublicDescription(course),
    `Live small-group classes for ${course.title} with MathEncode.`,
  );
}

export function courseMetadata(
  course: Pick<
    MarketingCourse,
    "slug" | "title" | "description" | "startDate" | "topics" | "batchSize"
  >,
): Metadata {
  return pageMetadata({
    title: metaTitle(course.title, "Course"),
    description: courseSummary(course),
    path: `/course/${course.slug}`,
    keywords: [...SITE_KEYWORDS, course.title, "math course"],
  });
}

export function jobSummary(
  job: Pick<JobOpening, "summary" | "where" | "hours">,
) {
  return metaDescription(
    `${job.summary} ${job.where}. ${job.hours}. Apply to teach with MathEncode.`,
    job.summary,
  );
}

export function jobMetadata(job: JobOpening): Metadata {
  return pageMetadata({
    title: metaTitle(job.title, "Role"),
    description: jobSummary(job),
    path: `/career/${job.slug}`,
    keywords: [...SITE_KEYWORDS, job.title, "math teaching job"],
  });
}

export function diagnosticSummary(instructions: string, fallback: string) {
  return metaDescription(instructions, fallback);
}

export function diagnosticMetadata(input: {
  path: string;
  title: string;
  instructions: string;
  fallback: string;
  keywords?: string[];
}): Metadata {
  return pageMetadata({
    title: metaTitle(input.title, "Diagnostic test"),
    description: diagnosticSummary(input.instructions, input.fallback),
    path: input.path,
    keywords: input.keywords ?? [...SITE_KEYWORDS, "diagnostic test"],
  });
}

export function missingMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return pageMetadata({
    title,
    description,
    path,
    index: false,
  });
}

type BreadcrumbItem = { name: string; path: string };

function organizationId() {
  return `${siteOrigin()}/#organization`;
}

function websiteId() {
  return `${siteOrigin()}/#website`;
}

export function organizationJsonLd() {
  return {
    "@type": "EducationalOrganization",
    "@id": organizationId(),
    name: SITE_NAME,
    url: siteOrigin(),
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/favicon.png"),
      width: 400,
      height: 400,
    },
    image: absoluteUrl("/favicon.png"),
    email: "learn@mathencode.com",
    telephone: "+918287357311",
    description: SITE_DESCRIPTION,
    areaServed: "Worldwide",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "learn@mathencode.com",
      telephone: "+918287357311",
      availableLanguage: ["English"],
    },
  };
}

export function websiteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": websiteId(),
    name: SITE_NAME,
    url: siteOrigin(),
    description: SITE_DESCRIPTION,
    inLanguage: "en",
    publisher: { "@id": organizationId() },
  };
}

export function jsonLdGraph(nodes: object[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.map((node) => seoStrings(node) as object),
  };
}

export function webPageJsonLd(input: {
  path: string;
  name: string;
  description: string;
  dateModified?: string;
}) {
  const url = absoluteUrl(input.path);
  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: plainText(input.name),
    description: plainText(input.description),
    isPartOf: { "@id": websiteId() },
    about: { "@id": organizationId() },
    inLanguage: "en",
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
  };
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: plainText(item.name),
      item: absoluteUrl(item.path),
    })),
  };
}

function providerJsonLd() {
  return {
    "@type": "EducationalOrganization",
    name: SITE_NAME,
    url: siteOrigin(),
  };
}

export function courseJsonLd(course: MarketingCourse) {
  const url = absoluteUrl(`/course/${course.slug}`);

  return {
    "@type": "Course",
    "@id": `${url}#course`,
    name: plainText(course.title),
    description: plainText(coursePublicDescription(course)),
    url,
    inLanguage: "en",
    provider: providerJsonLd(),
    ...(course.topics.length > 0
      ? { teaches: course.topics.map(plainText) }
      : {}),
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      name: plainText(course.title),
      maximumAttendeeCapacity: course.batchSize,
      ...(course.startDate ? { startDate: course.startDate } : {}),
    },
  };
}

export function courseGraph(course: MarketingCourse) {
  const description = courseSummary(course);
  const path = `/course/${course.slug}`;
  return jsonLdGraph([
    webPageJsonLd({
      path,
      name: socialTitle(metaTitle(course.title, "Course")),
      description,
    }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Courses", path: "/#courses" },
      { name: course.title, path },
    ]),
    courseJsonLd(course),
  ]);
}

export function diagnosticJsonLd(input: {
  path: string;
  name: string;
  description: string;
  educationalLevel?: string;
}) {
  const url = absoluteUrl(input.path);
  return {
    "@type": "LearningResource",
    "@id": `${url}#diagnostic`,
    learningResourceType: "Quiz",
    name: plainText(input.name),
    description: plainText(input.description),
    url,
    isAccessibleForFree: true,
    inLanguage: "en",
    ...(input.educationalLevel
      ? { educationalLevel: plainText(input.educationalLevel) }
      : {}),
    provider: providerJsonLd(),
  };
}

export function diagnosticGraph(input: {
  path: string;
  name: string;
  description: string;
  educationalLevel?: string;
  crumbs: BreadcrumbItem[];
}) {
  return jsonLdGraph([
    webPageJsonLd({
      path: input.path,
      name: socialTitle(metaTitle(input.name, "Diagnostic test")),
      description: input.description,
    }),
    breadcrumbJsonLd(input.crumbs),
    diagnosticJsonLd(input),
  ]);
}

const COMMON_DIAGNOSTIC_DESCRIPTION =
  "A free diagnostic for students who are not sure which MathEncode course to take.";

export function homeGraph(input: {
  courses: Pick<
    MarketingCourse,
    "slug" | "title" | "description" | "startDate" | "topics" | "batchSize"
  >[];
  hasCommonTest: boolean;
}) {
  const nodes: object[] = [
    webPageJsonLd({
      path: "/",
      name: HOME_TITLE,
      description: SITE_DESCRIPTION,
    }),
  ];

  const programs = input.courses.filter((course) => course.slug);
  if (programs.length > 0) {
    nodes.push({
      "@type": "ItemList",
      name: "MathEncode courses",
      itemListElement: programs.map((course, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: course.title,
        url: absoluteUrl(`/course/${course.slug}`),
        description: metaDescription(
          coursePublicDescription(course),
          course.title,
        ),
      })),
    });
  }

  if (input.hasCommonTest) {
    nodes.push(
      diagnosticJsonLd({
        path: "/diagnostic/common",
        name: "Common diagnostic test",
        description: COMMON_DIAGNOSTIC_DESCRIPTION,
      }),
    );
  }

  return jsonLdGraph(nodes);
}

export function careerGraph(openings: JobOpening[]) {
  return jsonLdGraph([
    {
      "@type": "CollectionPage",
      "@id": `${absoluteUrl("/career")}#webpage`,
      url: absoluteUrl("/career"),
      name: socialTitle("Careers"),
      description: CAREER_DESCRIPTION,
      isPartOf: { "@id": websiteId() },
      about: { "@id": organizationId() },
      inLanguage: "en",
      mainEntity: {
        "@type": "ItemList",
        itemListElement: openings.map((job, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: job.title,
          url: absoluteUrl(`/career/${job.slug}`),
          description: job.summary,
        })),
      },
    },
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Careers", path: "/career" },
    ]),
  ]);
}

export function jobPlainDescription(job: JobOpening) {
  return plainText(
    [
      job.description,
      `Students: ${job.students}.`,
      `Where: ${job.where}.`,
      `Hours: ${job.hours}.`,
      ...job.work.map((item) => `${item.title}. ${item.text}`),
      ...job.offer.map((item) => `${item.title}. ${item.text}`),
    ].join(" "),
  );
}

export function jobGraph(job: JobOpening) {
  const path = `/career/${job.slug}`;
  const url = absoluteUrl(path);
  return jsonLdGraph([
    webPageJsonLd({
      path,
      name: socialTitle(job.title),
      description: jobSummary(job),
    }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Careers", path: "/career" },
      { name: job.title, path },
    ]),
    {
      "@type": "JobPosting",
      "@id": `${url}#job`,
      title: job.title,
      description: jobPlainDescription(job),
      datePosted: job.postedOn,
      directApply: true,
      url,
      jobLocationType: "TELECOMMUTE",
      jobLocation: {
        "@type": "Place",
        name: job.where,
      },
      hiringOrganization: {
        "@type": "Organization",
        name: SITE_NAME,
        sameAs: siteOrigin(),
        logo: absoluteUrl("/favicon.png"),
      },
      identifier: {
        "@type": "PropertyValue",
        name: SITE_NAME,
        value: job.slug,
      },
      industry: "Education",
    },
  ]);
}

export function privacyGraph() {
  return jsonLdGraph([
    webPageJsonLd({
      path: "/privacy",
      name: socialTitle("Privacy Policy"),
      description: PRIVACY_DESCRIPTION,
      dateModified: PRIVACY_UPDATED,
    }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Privacy Policy", path: "/privacy" },
    ]),
  ]);
}

export const publicSiteMetadata: Metadata = {
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  category: "education",
  robots: robotsDirective(true),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    description: SITE_DESCRIPTION,
  },
};
