import type { Metadata } from "next";
import type { JobOpening } from "~/data/jobs";
import type { MarketingCourse } from "~/types";

export const SITE_NAME = "MathEncode";

export const SITE_DESCRIPTION =
  "Live, one-to-one math coaching for grades K–12. A lesson slows down where the work is hard, then stays until the student can use the idea.";

export const HOME_TITLE =
  "MathEncode — One-to-One Math Coaching for Grades K–12";

export const PRIVACY_DESCRIPTION =
  "How MathEncode collects and uses names, contact details, diagnostic results, and tutor applications on this site.";

export const PRIVACY_UPDATED = "2026-11-04";

export const CAREER_DESCRIPTION =
  "Open teaching roles at MathEncode. Live, one-to-one math for grades K–12, with remote classes and flexible hours.";

export const SITE_KEYWORDS = [
  "MathEncode",
  "math tutoring",
  "K-12 math",
  "one-to-one math coaching",
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
  return value.replace(/\s+/g, " ").trim();
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
    .replace(/[–—]/g, "-")
    .replace(/…/g, "...")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'");
}

export function metaDescription(
  value: string | undefined | null,
  fallback: string,
) {
  const clean = plainText(value ?? "");
  if (!clean) return fallback;
  return clipText(clean, 160);
}

export function metaTitle(value: string | undefined | null, fallback: string) {
  const clean = plainText(value ?? "");
  if (!clean) return fallback;
  if (clean.length <= 80) return clean;
  return clipText(clean, 80);
}

export function socialTitle(title: string) {
  return title.includes(SITE_NAME) ? title : `${title} · ${SITE_NAME}`;
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

export const careerMetadata = pageMetadata({
  title: "Careers",
  description: CAREER_DESCRIPTION,
  path: "/career",
  keywords: [...SITE_KEYWORDS, "math tutor jobs", "teaching jobs"],
});

export function courseSummary(
  course: Pick<MarketingCourse, "description" | "level">,
) {
  const level = plainText(course.level);
  return metaDescription(
    course.description,
    level
      ? `Live, one-to-one ${level} math coaching with MathEncode.`
      : "Live, one-to-one math coaching with MathEncode.",
  );
}

export function courseMetadata(
  course: Pick<MarketingCourse, "slug" | "title" | "description" | "level">,
): Metadata {
  return pageMetadata({
    title: metaTitle(course.title, "Course"),
    description: courseSummary(course),
    path: `/course/${course.slug}`,
    keywords: [...SITE_KEYWORDS, course.title, course.level, "math course"],
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
    keywords: [...SITE_KEYWORDS, job.title, "math tutor job"],
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
    "@graph": nodes,
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
    name: input.name,
    description: input.description,
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
      name: item.name,
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
  const teaches =
    course.objectives.length > 0 ? course.objectives : course.highlights;
  const instanceBits = [course.group, course.schedule, course.nextStart]
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    "@type": "Course",
    "@id": `${url}#course`,
    name: course.title,
    description: plainText(course.description),
    url,
    inLanguage: "en",
    ...(course.level.trim() ? { educationalLevel: course.level.trim() } : {}),
    provider: providerJsonLd(),
    ...(teaches.length > 0 ? { teaches } : {}),
    ...(course.prerequisites.trim()
      ? { coursePrerequisites: course.prerequisites.trim() }
      : {}),
    ...(instanceBits.length > 0
      ? {
          hasCourseInstance: {
            "@type": "CourseInstance",
            courseMode: "online",
            name: course.title,
            description: instanceBits.join(". "),
          },
        }
      : {}),
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
      { name: "Programs", path: "/#courses" },
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
    name: input.name,
    description: input.description,
    url,
    isAccessibleForFree: true,
    inLanguage: "en",
    ...(input.educationalLevel
      ? { educationalLevel: input.educationalLevel }
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
  courses: Pick<MarketingCourse, "slug" | "title" | "description">[];
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
      name: "MathEncode programs",
      itemListElement: programs.map((course, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: course.title,
        url: absoluteUrl(`/course/${course.slug}`),
        description: metaDescription(course.description, course.title),
      })),
    });
  }

  if (input.hasCommonTest) {
    nodes.push(
      diagnosticJsonLd({
        path: "/diagnostic/common",
        name: "Common diagnostic test",
        description: COMMON_DIAGNOSTIC_DESCRIPTION,
        educationalLevel: "K-12",
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
  return [
    job.description,
    `Students: ${job.students}.`,
    `Where: ${job.where}.`,
    `Hours: ${job.hours}.`,
    ...job.work.map((item) => `${item.title}. ${item.text}`),
    ...job.offer.map((item) => `${item.title}. ${item.text}`),
  ].join(" ");
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
