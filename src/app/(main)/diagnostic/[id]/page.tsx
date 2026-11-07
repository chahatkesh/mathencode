import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DiagnosticTest from "~/components/features/diagnostic-test";
import JsonLd from "~/components/seo/json-ld";
import { unavailableCatalog } from "~/lib/catalog-cache";
import { COMMON_TEST_KEY, listIndexableDiagnostics } from "~/lib/diagnostics";
import {
  readCommonDiagnosticPage,
  readDiagnosticPage,
} from "~/lib/public-reads";
import {
  diagnosticGraph,
  diagnosticMetadata,
  diagnosticSummary,
  missingMetadata,
} from "~/lib/seo";

export const revalidate = 120;

type DiagnosticPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const diagnostics = await listIndexableDiagnostics();
  return diagnostics.map((diagnostic) => ({
    id: diagnostic.path.slice("/diagnostic/".length),
  }));
}

const COMMON_DIAGNOSTIC_DESCRIPTION =
  "A free diagnostic for students who are not sure which MathEncode course to take.";

export async function generateMetadata({
  params,
}: DiagnosticPageProps): Promise<Metadata> {
  const { id } = await params;
  if (id === COMMON_TEST_KEY) {
    const result = await readCommonDiagnosticPage();
    if (result.status === "error") return unavailableCatalog();
    if (result.status !== "ok") {
      return missingMetadata(
        "Diagnostic test",
        COMMON_DIAGNOSTIC_DESCRIPTION,
        `/diagnostic/${id}`,
      );
    }
    return diagnosticMetadata({
      path: `/diagnostic/${COMMON_TEST_KEY}`,
      title: result.test.title,
      instructions: result.test.instructions,
      fallback: COMMON_DIAGNOSTIC_DESCRIPTION,
      keywords: ["math diagnostic test", "MathEncode", result.test.title],
    });
  }

  const result = await readDiagnosticPage(id);
  if (result.status === "error") return unavailableCatalog();
  if (result.status !== "ok") {
    return missingMetadata(
      "Diagnostic test",
      "This MathEncode diagnostic test is unavailable.",
      `/diagnostic/${id}`,
    );
  }
  return diagnosticMetadata({
    path: `/diagnostic/${result.course.slug}`,
    title: result.test.title,
    instructions: result.test.instructions,
    fallback: `A free ${result.course.title} diagnostic from MathEncode.`,
    keywords: [
      "math diagnostic test",
      "MathEncode",
      result.test.title,
      result.course.title,
    ],
  });
}

export default async function DiagnosticPage({ params }: DiagnosticPageProps) {
  const { id } = await params;

  if (id === COMMON_TEST_KEY) {
    const result = await readCommonDiagnosticPage();
    if (result.status === "missing") notFound();
    if (result.status === "error") return unavailableCatalog();
    const description = diagnosticSummary(
      result.test.instructions,
      COMMON_DIAGNOSTIC_DESCRIPTION,
    );
    return (
      <>
        <JsonLd
          data={diagnosticGraph({
            path: `/diagnostic/${COMMON_TEST_KEY}`,
            name: result.test.title,
            description,
            crumbs: [
              { name: "Home", path: "/" },
              {
                name: result.test.title,
                path: `/diagnostic/${COMMON_TEST_KEY}`,
              },
            ],
          })}
        />
        <DiagnosticTest
          context={{
            storageKey: COMMON_TEST_KEY,
            title: "Common test",
            attemptPath: `/api/diagnostic/${COMMON_TEST_KEY}/attempt`,
            submitPath: `/api/diagnostic/${COMMON_TEST_KEY}/submit`,
          }}
          test={result.test}
        />
      </>
    );
  }

  const result = await readDiagnosticPage(id);
  if (result.status === "missing") notFound();
  if (result.status === "error") return unavailableCatalog();

  const description = diagnosticSummary(
    result.test.instructions,
    `A free ${result.course.title} diagnostic from MathEncode.`,
  );

  return (
    <>
      <JsonLd
        data={diagnosticGraph({
          path: `/diagnostic/${result.course.slug}`,
          name: result.test.title,
          description,
          crumbs: [
            { name: "Home", path: "/" },
            { name: "Courses", path: "/#courses" },
            {
              name: result.course.title,
              path: `/course/${result.course.slug}`,
            },
            {
              name: result.test.title,
              path: `/diagnostic/${result.course.slug}`,
            },
          ],
        })}
      />
      <DiagnosticTest
        context={{
          storageKey: result.course.slug,
          title: result.course.title,
          attemptPath: `/api/diagnostic/${result.course.slug}/attempt`,
          submitPath: `/api/diagnostic/${result.course.slug}/submit`,
        }}
        test={result.test}
      />
    </>
  );
}
