import { type NextRequest } from "next/server";
import { submitDiagnostic } from "~/lib/diagnostics";
import { jsonOk, readJson, serverError } from "~/lib/http";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const body = await readJson(request);
  if (!body.ok) return body.response;

  try {
    const { id } = await context.params;
    const result = await submitDiagnostic(id, body.body);
    return jsonOk(result, 201);
  } catch (error) {
    return serverError(error, "Error submitting diagnostic test");
  }
}
