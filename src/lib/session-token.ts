import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "admin_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const SESSION_EXPIRY = "30d";
export const SLIDE_AFTER_SECONDS = 60 * 60 * 24;

export type SessionPayload = {
  userId: string;
  iat?: number;
  exp?: number;
};

export function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      "JWT_SECRET environment variable is required. " +
        "Generate one with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"",
    );
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(userId: string) {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_EXPIRY)
    .sign(getJwtSecret());
}

export async function readSession(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const verified = await jwtVerify(token, getJwtSecret());
    const { userId, iat, exp } = verified.payload;
    if (typeof userId !== "string") return null;
    return { userId, iat, exp };
  } catch {
    return null;
  }
}
