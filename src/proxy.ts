import { NextResponse, type NextRequest } from "next/server";
import {
  SESSION_COOKIE,
  readSession,
  setSessionCookie,
  shouldSlideSession,
  signSession,
} from "~/lib/session-token";

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

function isSlidingPath(pathname: string) {
  return pathname === "/admin" || pathname === "/api/auth/session";
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
  const { pathname } = request.nextUrl;
  const protectedPath = isProtectedPath(pathname);
  if (!protectedPath && !isSlidingPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await readSession(token) : null;
  if (protectedPath && !session) return unauthorized(request);

  const response = NextResponse.next();
  // Server Components cannot write cookies, so active sessions slide here.
  if (session && shouldSlideSession(session)) {
    response.cookies.set(setSessionCookie(await signSession(session.userId)));
  }
  return response;
}

export const config = {
  matcher: [
    "/admin",
    "/api/auth/session",
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
