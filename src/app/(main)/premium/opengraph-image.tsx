import { ogContentType, ogSize, renderOgImage } from "~/lib/og";

export const alt = "One-on-one mentorship at MathEncode";
export const size = ogSize;
export const contentType = ogContentType;
export const runtime = "nodejs";

export default function Image() {
  return renderOgImage({
    eyebrow: "Premium",
    title: "One-on-one mentorship",
    description: "A course shaped around what you need.",
  });
}
