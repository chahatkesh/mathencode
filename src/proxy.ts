import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, readSession } from "~/lib/session-token";

function isProtectedPath(pathname: string) {
  return (
    pathname.startsWith("/admin/submissions") ||
    pathname.startsWith("/admin/applications") ||
    pathname.startsWith("/admin/courses") ||
    pathname.startsWith("/admin/tests") ||
    pathname.startsWith("/api/form-submissions") ||
    pathname.startsWith("/api/tutor-applications") ||
    pathname.startsWith("/api/admin/")
  );
}

function unauthorized(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json(
      { success: false, message: "Unauthorized", code: "UNAUTHENTICATED" },
      { status: 401 },
    );
  }

  const url = request.nextUrl.clone();
  const from = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  url.pathname = "/admin";
  url.search = "";
  url.searchParams.set("reason", "expired");
  if (from.startsWith("/admin/")) {
    url.searchParams.set("from", from);
  }
  return NextResponse.redirect(url);
}

export async function proxy(request: NextRequest) {
  if (!isProtectedPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return unauthorized(request);

  const session = await readSession(token);
  if (!session) return unauthorized(request);

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/submissions",
    "/admin/submissions/:path*",
    "/admin/applications",
    "/admin/applications/:path*",
    "/admin/courses",
    "/admin/courses/:path*",
    "/admin/tests",
    "/admin/tests/:path*",
    "/api/form-submissions",
    "/api/form-submissions/:path*",
    "/api/tutor-applications",
    "/api/tutor-applications/:path*",
    "/api/admin/:path*",
  ],
};
