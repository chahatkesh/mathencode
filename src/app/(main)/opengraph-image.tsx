import { ogContentType, ogSize, renderOgImage } from "~/lib/og";

export const alt = "MathEncode, AP Math preparation";
export const size = ogSize;
export const contentType = ogContentType;
export const runtime = "nodejs";

export default function Image() {
  return renderOgImage({
    eyebrow: "AP Math preparation",
    title: "Prepare for AP Math with a clear plan",
    description:
      "Live classes for AP Precalculus, Calculus AB, and Calculus BC.",
    detail: "Explore courses",
  });
}
