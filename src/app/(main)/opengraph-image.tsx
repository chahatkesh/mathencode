import { ogContentType, ogSize, renderOgImage } from "~/lib/og";

export const alt = "MathEncode, live math classes";
export const size = ogSize;
export const contentType = ogContentType;
export const runtime = "nodejs";

export default function Image() {
  return renderOgImage({
    eyebrow: "Live classes",
    title: "Math that stays until it sticks",
    description: "Live classes that stay with an idea until it sticks.",
    detail: "Book a free demo",
  });
}
