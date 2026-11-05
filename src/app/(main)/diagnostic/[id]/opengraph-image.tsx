import { COMMON_TEST_KEY } from "~/lib/diagnostics";
import { ogContentType, ogSize, renderOgImage } from "~/lib/og";
import {
  readCommonDiagnosticPage,
  readDiagnosticPage,
} from "~/lib/public-reads";

export const alt = "Free MathEncode diagnostic test";
export const size = ogSize;
export const contentType = ogContentType;
export const runtime = "nodejs";
export const revalidate = 3600;

function detailFor(minutes: number) {
  return minutes > 0 ? `${minutes} min` : "Free";
}

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (id === COMMON_TEST_KEY) {
    const result = await readCommonDiagnosticPage();
    if (result.status !== "ok") {
      return renderOgImage({
        eyebrow: "Free diagnostic",
        title: "Test unavailable",
        description: "This MathEncode diagnostic could not be loaded.",
      });
    }
    return renderOgImage({
      eyebrow: "Free diagnostic",
      title: result.test.title,
      description:
        result.test.instructions ||
        "For students who are not sure which course to take.",
      detail: detailFor(result.test.timeLimitMinutes),
    });
  }

  const result = await readDiagnosticPage(id);
  if (result.status !== "ok") {
    return renderOgImage({
      eyebrow: "Free diagnostic",
      title: "Test unavailable",
      description: "This MathEncode diagnostic could not be loaded.",
    });
  }

  return renderOgImage({
    eyebrow: "Free diagnostic",
    title: result.test.title,
    description:
      result.test.instructions ||
      `A free ${result.course.title} diagnostic from MathEncode.`,
    detail: detailFor(result.test.timeLimitMinutes),
  });
}
