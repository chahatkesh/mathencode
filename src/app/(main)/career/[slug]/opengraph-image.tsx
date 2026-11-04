import { getJob } from "~/data/jobs";
import { ogContentType, ogSize, renderOgImage } from "~/lib/og";

export const alt = "Open teaching role at MathEncode";
export const size = ogSize;
export const contentType = ogContentType;
export const runtime = "nodejs";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = getJob(slug);
  if (!job) {
    return renderOgImage({
      eyebrow: "Careers",
      title: "Role unavailable",
      description: "This MathEncode role is not open.",
    });
  }

  return renderOgImage({
    eyebrow: "Careers",
    title: job.title,
    description: job.summary,
    detail: `${job.where} · ${job.hours}`,
  });
}
