import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  SLIDE_AFTER_SECONDS,
  readSession,
  signSession,
  type SessionPayload,
} from "~/lib/session-token";

export type { SessionPayload };

export async function createSession(userId: string) {
  return signSession(userId);
}

export async function verifySession(token: string) {
  return readSession(token);
}

async function maybeRefreshSession(session: SessionPayload) {
  const now = Math.floor(Date.now() / 1000);
  if (
    typeof session.iat === "number" &&
    now - session.iat < SLIDE_AFTER_SECONDS
  ) {
    return;
  }

  const token = await createSession(session.userId);
  const cookieStore = await cookies();
  cookieStore.set(setSessionCookie(token));
}

export async function getSession(options: { refresh?: boolean } = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) return null;

  const session = await verifySession(token);
  if (!session) return null;

  if (options.refresh) {
    await maybeRefreshSession(session);
  }

  return session;
}

export function setSessionCookie(token: string) {
  return {
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
  };
}

export function clearSessionCookie() {
  return {
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 0,
    path: "/",
  };
}

/**
 * Verifies the admin session from cookies.
 * Returns the session payload or a 401 response.
 */
export async function requireAuth(): Promise<
  | { authenticated: true; session: SessionPayload }
  | { authenticated: false; response: NextResponse }
> {
  const session = await getSession({ refresh: true });
  if (!session) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { success: false, error: "Unauthorized", code: "UNAUTHENTICATED" },
        { status: 401 },
      ),
    };
  }
  return { authenticated: true, session };
}

/** Page-level gate. The proxy already redirects; this covers a missed match. */
export async function requireAdminPage() {
  const session = await getSession();
  if (!session) redirect("/admin?reason=expired");
  return session;
}
