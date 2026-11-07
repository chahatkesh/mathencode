import { jobs } from "~/data/jobs";
import { ogContentType, ogSize, renderOgImage } from "~/lib/og";

export const alt = "Open teaching roles at MathEncode";
export const size = ogSize;
export const contentType = ogContentType;
export const runtime = "nodejs";

export default function Image() {
  const count = jobs.length === 1 ? "1 open role" : `${jobs.length} open roles`;

  return renderOgImage({
    eyebrow: "Careers",
    title: "Open roles",
    description: "Teach a small cohort, from home.",
    detail: count,
  });
}
