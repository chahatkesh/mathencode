import { type NextRequest } from "next/server";
import { startDiagnosticAttempt } from "~/lib/diagnostics";
import { jsonError, jsonOk, serverError } from "~/lib/http";

export const dynamic = "force-dynamic";

export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const attempt = await startDiagnosticAttempt(id);
    if (!attempt) {
      return jsonError("This diagnostic test is not available.", 404);
    }
    return jsonOk(attempt, 201);
  } catch (error) {
    return serverError(error, "Error starting diagnostic test");
  }
}
