import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import DiagnosticTest from "~/components/features/diagnostic-test";
import {
  COMMON_TEST_KEY,
  getCommonDiagnosticPage,
  getDiagnosticPage,
} from "~/lib/diagnostics";

export const dynamic = "force-dynamic";

type DiagnosticPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: DiagnosticPageProps): Promise<Metadata> {
  const { id } = await params;
  if (id === COMMON_TEST_KEY) {
    const result = await getCommonDiagnosticPage();
    if (result.status !== "ok") return { title: "Common diagnostic test" };
    return {
      title: result.test.title,
      description:
        result.test.instructions ||
        "A diagnostic for students who are not sure which course to take.",
    };
  }

  const result = await getDiagnosticPage(id);
  if (result.status !== "ok") return { title: "Diagnostic test" };
  return {
    title: result.test.title,
    description: result.test.instructions || result.course.description,
  };
}

function unavailable() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 text-center">
      <div>
        <h1 className="text-2xl font-bold text-dark">Test unavailable</h1>
        <p className="mt-2 text-dark/70">
          This diagnostic test could not be loaded. Try again shortly.
        </p>
        <Link href="/" className="btn-primary mt-6 inline-flex">
          Back to home
        </Link>
      </div>
    </div>
  );
}

export default async function DiagnosticPage({ params }: DiagnosticPageProps) {
  const { id } = await params;

  if (id === COMMON_TEST_KEY) {
    const result = await getCommonDiagnosticPage();
    if (result.status === "missing") notFound();
    if (result.status === "error") return unavailable();
    return (
      <DiagnosticTest
        context={{
          storageKey: COMMON_TEST_KEY,
          title: "Common test",
          backHref: "/#courses",
          backLabel: "Back to programs",
          gradient: "from-primary to-bright-blue",
          attemptPath: `/api/diagnostic/${COMMON_TEST_KEY}/attempt`,
          submitPath: `/api/diagnostic/${COMMON_TEST_KEY}/submit`,
        }}
        test={result.test}
      />
    );
  }

  const result = await getDiagnosticPage(id);
  if (result.status === "missing") notFound();
  if (result.status === "error") return unavailable();

  return (
    <DiagnosticTest
      context={{
        storageKey: result.course.slug,
        title: result.course.title,
        backHref: `/course/${result.course.slug}`,
        backLabel: `Back to ${result.course.title}`,
        gradient: result.course.colorScheme.gradient,
        attemptPath: `/api/diagnostic/${result.course.slug}/attempt`,
        submitPath: `/api/diagnostic/${result.course.slug}/submit`,
      }}
      test={result.test}
    />
  );
}
