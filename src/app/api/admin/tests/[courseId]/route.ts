import { type NextRequest } from "next/server";
import {
  deleteAdminTest,
  getAdminTest,
  saveAdminTest,
  setTestPublished,
} from "~/lib/diagnostics";
import {
  jsonError,
  jsonOk,
  readJson,
  requireAdmin,
  serverError,
  zodMessage,
} from "~/lib/http";
import { testInputSchema, testPublishSchema } from "~/lib/validations";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ courseId: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const { courseId } = await context.params;
    const result = await getAdminTest(courseId);
    if (!result) return jsonError("Course not found", 404);
    return jsonOk(result);
  } catch (error) {
    return serverError(error, "Error loading diagnostic test");
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const body = await readJson(request);
  if (!body.ok) return body.response;

  const parsed = testInputSchema.safeParse(body.body);
  if (!parsed.success) return jsonError(zodMessage(parsed.error), 400);

  try {
    const { courseId } = await context.params;
    const test = await saveAdminTest(courseId, parsed.data);
    if (!test) return jsonError("Course not found", 404);
    return jsonOk(test);
  } catch (error) {
    return serverError(error, "Error saving diagnostic test");
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const body = await readJson(request);
  if (!body.ok) return body.response;

  const parsed = testPublishSchema.safeParse(body.body);
  if (!parsed.success) return jsonError(zodMessage(parsed.error), 400);

  try {
    const { courseId } = await context.params;
    const test = await setTestPublished(courseId, parsed.data.published);
    if (!test) return jsonError("Course not found", 404);
    return jsonOk(test);
  } catch (error) {
    return serverError(error, "Error updating diagnostic test");
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const { courseId } = await context.params;
    const deleted = await deleteAdminTest(courseId);
    if (!deleted) return jsonError("Diagnostic test not found", 404);
    return jsonOk({ deleted: true });
  } catch (error) {
    return serverError(error, "Error deleting diagnostic test");
  }
}
