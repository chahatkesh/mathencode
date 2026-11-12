import { notFound } from "next/navigation";
import AdminTestEditor from "~/components/features/admin-test-editor";
import { requireAdminPage } from "~/lib/auth";
import { getAdminTest } from "~/lib/diagnostics";

export default async function TestEditorPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  await requireAdminPage();
  const { courseId } = await params;
  const test = await getAdminTest(courseId);
  if (!test) notFound();
  return <AdminTestEditor courseId={courseId} initial={test} />;
}
