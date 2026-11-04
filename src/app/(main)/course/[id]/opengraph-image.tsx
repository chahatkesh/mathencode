import { ogContentType, ogSize, renderOgImage } from "~/lib/og";
import { getPublicCourse } from "~/lib/courses";

export const alt = "MathEncode math course";
export const size = ogSize;
export const contentType = ogContentType;
export const runtime = "nodejs";
export const revalidate = 3600;

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getPublicCourse(id);
  if (result.status !== "ok") {
    return renderOgImage({
      eyebrow: "Course",
      title: "Course unavailable",
      description: "This MathEncode course could not be loaded.",
    });
  }

  const course = result.course;
  const detail = [course.duration, course.group]
    .map((item) => item.trim())
    .filter(Boolean)
    .join(" · ");

  return renderOgImage({
    eyebrow: course.level.trim() || "Program",
    title: course.title,
    description: course.description,
    detail: detail || "Live 1:1",
  });
}
