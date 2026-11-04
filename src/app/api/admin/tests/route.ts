import { listAdminTests } from "~/lib/diagnostics";
import { jsonOk, requireAdmin, serverError } from "~/lib/http";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    return jsonOk(await listAdminTests());
  } catch (error) {
    return serverError(error, "Error listing diagnostic tests");
  }
}
