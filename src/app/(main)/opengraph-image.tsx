import { ogContentType, ogSize, renderOgImage } from "~/lib/og";

export const alt = "MathEncode, small-group math classes";
export const size = ogSize;
export const contentType = ogContentType;
export const runtime = "nodejs";

export default function Image() {
  return renderOgImage({
    eyebrow: "Small groups",
    title: "Math classes in batches of 4-5",
    description: "Live classes that stay with an idea until it sticks.",
    detail: "Book a free demo",
  });
}
