import { type NextRequest } from "next/server";
import { toggleSubmissionSeen } from "~/lib/diagnostics";
import { jsonError, jsonOk, requireAdmin, serverError } from "~/lib/http";

export const dynamic = "force-dynamic";

export async function PATCH(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    const seen = await toggleSubmissionSeen(id);
    if (seen === null) return jsonError("Submission not found", 404);
    return jsonOk({ seen });
  } catch (error) {
    return serverError(error, "Error updating submission seen status");
  }
}
