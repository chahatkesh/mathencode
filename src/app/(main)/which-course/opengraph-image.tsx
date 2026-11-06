import { ogContentType, ogSize, renderOgImage } from "~/lib/og";
import { WHICH_COURSE_DESCRIPTION } from "~/lib/seo";

export const alt = "Find your MathEncode math course";
export const size = ogSize;
export const contentType = ogContentType;
export const runtime = "nodejs";

export default function Image() {
  return renderOgImage({
    eyebrow: "Find your course",
    title: "Not sure which course?",
    description: WHICH_COURSE_DESCRIPTION,
    detail: "Explore courses. Find your starting point.",
  });
}
