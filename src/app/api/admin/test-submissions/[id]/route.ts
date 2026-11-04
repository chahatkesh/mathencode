import { type NextRequest } from "next/server";
import { getSubmission } from "~/lib/diagnostics";
import { jsonError, jsonOk, requireAdmin, serverError } from "~/lib/http";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    const submission = await getSubmission(id);
    if (!submission) return jsonError("Submission not found", 404);
    return jsonOk(submission);
  } catch (error) {
    return serverError(error, "Error loading diagnostic submission");
  }
}
