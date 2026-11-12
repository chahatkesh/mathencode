import { type NextRequest, NextResponse } from "next/server";
import { requireAuth } from "~/lib/auth";
import { listFormSubmissions } from "~/lib/admin-inbox";
import { parseInboxPage } from "~/lib/inbox-page";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await requireAuth();
  if (!auth.authenticated) return auth.response;

  try {
    const page = parseInboxPage(request.nextUrl.searchParams.get("page"));
    const result = await listFormSubmissions(page);
    return NextResponse.json({
      success: true,
      count: result.total,
      data: result.items,
      page: result.page,
      pageSize: result.pageSize,
      total: result.total,
      pageCount: result.pageCount,
    });
  } catch (error) {
    console.error("Error fetching form data:", error);
    return NextResponse.json(
      { success: false, message: "Server error occurred" },
      { status: 500 },
    );
  }
}
