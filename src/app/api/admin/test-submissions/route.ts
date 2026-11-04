import { type NextRequest } from "next/server";
import { listSubmissions } from "~/lib/diagnostics";
import { jsonOk, requireAdmin, serverError } from "~/lib/http";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const result = await listSubmissions(request.nextUrl.searchParams);
    return jsonOk(result.items, 200, {
      page: result.page,
      pageSize: result.pageSize,
      total: result.total,
      pageCount: result.pageCount,
    });
  } catch (error) {
    return serverError(error, "Error listing diagnostic submissions");
  }
}
