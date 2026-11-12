import { jsonOk, requireAdmin, serverError } from "~/lib/http";
import { loadAdminDashboard } from "~/lib/admin-dashboard";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const response = jsonOk(await loadAdminDashboard());
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  } catch (error) {
    return serverError(error, "Error loading admin dashboard");
  }
}
