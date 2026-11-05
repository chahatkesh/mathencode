import { batchSizeLabel, formatCourseDate } from "~/lib/course-format";
import { ogContentType, ogSize, renderOgImage } from "~/lib/og";
import { readPublicCourse } from "~/lib/public-reads";

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
  const result = await readPublicCourse(id);
  if (result.status !== "ok") {
    return renderOgImage({
      eyebrow: "Course",
      title: "Course unavailable",
      description: "This MathEncode course could not be loaded.",
    });
  }

  const course = result.course;
  const start = formatCourseDate(course.startDate);

  return renderOgImage({
    eyebrow: "Small group",
    title: course.title,
    description:
      course.description.trim() ||
      (start
        ? `Starts ${start}. ${batchSizeLabel(course.batchSize)}.`
        : `${batchSizeLabel(course.batchSize)}.`),
    detail: batchSizeLabel(course.batchSize),
  });
}
