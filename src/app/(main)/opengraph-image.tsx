import { ogContentType, ogSize, renderOgImage } from "~/lib/og";

export const alt = "MathEncode, one-to-one math coaching for grades K-12";
export const size = ogSize;
export const contentType = ogContentType;
export const runtime = "nodejs";

export default function Image() {
  return renderOgImage({
    eyebrow: "Grades K-12",
    title: "One-to-one math coaching",
    description: "Live classes that stay with an idea until it sticks.",
    detail: "Book a free demo",
  });
}
