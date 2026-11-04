import "server-only";
import { NextResponse } from "next/server";
import type { ZodError } from "zod/v4";
import { requireAuth } from "~/lib/auth";
import { RequestError } from "~/lib/request-error";

export function jsonError(message: string, status: number) {
  return NextResponse.json({ success: false, message }, { status });
}

export function jsonOk<T>(
  data: T,
  status = 200,
  extra?: Record<string, unknown>,
) {
  return NextResponse.json({ success: true, data, ...extra }, { status });
}

export function zodMessage(error: ZodError) {
  return error.issues[0]?.message ?? "Invalid data";
}

export async function requireAdmin() {
  const auth = await requireAuth();
  if (!auth.authenticated) {
    return { ok: false as const, response: auth.response };
  }
  return { ok: true as const };
}

export async function readJson(request: Request) {
  try {
    return { ok: true as const, body: (await request.json()) as unknown };
  } catch {
    return {
      ok: false as const,
      response: jsonError("Invalid JSON body", 400),
    };
  }
}

export function isDuplicateKey(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === 11000
  );
}

function isValidationError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    (error as { name?: unknown }).name === "ValidationError"
  );
}

export function serverError(error: unknown, context: string) {
  if (error instanceof RequestError) {
    return jsonError(error.message, error.status);
  }
  if (isValidationError(error)) {
    return jsonError(
      "Some fields are invalid. Check the form and try again.",
      400,
    );
  }
  console.error(context, error);
  return jsonError("Server error occurred", 500);
}
