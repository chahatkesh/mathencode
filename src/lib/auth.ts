import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  readSession,
  signSession,
  type SessionPayload,
} from "~/lib/session-token";

export type { SessionPayload };
export { clearSessionCookie, setSessionCookie } from "~/lib/session-token";

export async function createSession(userId: string) {
  return signSession(userId);
}

export async function verifySession(token: string) {
  return readSession(token);
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) return null;

  const session = await verifySession(token);
  if (!session) return null;

  return session;
}

/**
 * Verifies the admin session from cookies.
 * Returns the session payload or a 401 response.
 */
export async function requireAuth(): Promise<
  | { authenticated: true; session: SessionPayload }
  | { authenticated: false; response: NextResponse }
> {
  const session = await getSession();
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
