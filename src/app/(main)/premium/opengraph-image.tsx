import { ogContentType, ogSize, renderOgImage } from "~/lib/og";

export const alt = "A class for one student at MathEncode";
export const size = ogSize;
export const contentType = ogContentType;
export const runtime = "nodejs";

export default function Image() {
  return renderOgImage({
    eyebrow: "Private classes",
    title: "A class for one student",
    description: "One teacher, live online, at a pace that fits.",
  });
}
