import { ogContentType, ogSize, renderOgImage } from "~/lib/og";
import { COURSES_DESCRIPTION } from "~/lib/seo";

export const alt = "MathEncode courses for AP exam preparation";
export const size = ogSize;
export const contentType = ogContentType;
export const runtime = "nodejs";

export default function Image() {
  return renderOgImage({
    eyebrow: "AP courses",
    title: "Courses for AP preparation",
    description: COURSES_DESCRIPTION,
    detail: "Free diagnostic if you are unsure",
  });
}
