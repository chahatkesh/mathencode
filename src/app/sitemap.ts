import type { MetadataRoute } from "next";
import { jobs } from "~/data/jobs";
import { listIndexableCourses } from "~/lib/courses";
import { listIndexableDiagnostics } from "~/lib/diagnostics";
import { PRIVACY_UPDATED, absoluteUrl } from "~/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const courses = await listIndexableCourses();
  const diagnostics = await listIndexableDiagnostics();
  const latestCourse = courses.reduce<Date | null>((latest, course) => {
    if (!latest || course.updatedAt > latest) return course.updatedAt;
    return latest;
  }, null);

  return [
    {
      url: absoluteUrl("/"),
      lastModified: latestCourse ?? undefined,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/career"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...jobs.map((job) => ({
      url: absoluteUrl(`/career/${job.slug}`),
      lastModified: new Date(`${job.postedOn}T00:00:00Z`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...courses.map((course) => ({
      url: absoluteUrl(`/course/${course.slug}`),
      lastModified: course.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...diagnostics.map((diagnostic) => ({
      url: absoluteUrl(diagnostic.path),
      lastModified: diagnostic.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    {
      url: absoluteUrl("/privacy"),
      lastModified: new Date(`${PRIVACY_UPDATED}T00:00:00Z`),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ];
}
