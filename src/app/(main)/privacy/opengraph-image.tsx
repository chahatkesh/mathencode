import { ogContentType, ogSize, renderOgImage } from "~/lib/og";

export const alt = "MathEncode privacy policy";
export const size = ogSize;
export const contentType = ogContentType;
export const runtime = "nodejs";

export default function Image() {
  return renderOgImage({
    eyebrow: "Privacy",
    title: "Privacy Policy",
    description: "What this site collects, and how MathEncode uses it.",
    detail: "learn@mathencode.com",
  });
}
