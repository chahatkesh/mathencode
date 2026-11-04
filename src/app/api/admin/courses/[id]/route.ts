import { type NextRequest } from "next/server";
import {
  deleteCourse,
  getAdminCourse,
  setCourseVisibility,
  updateCourse,
} from "~/lib/courses";
import {
  jsonError,
  jsonOk,
  readJson,
  requireAdmin,
  serverError,
  zodMessage,
} from "~/lib/http";
import { courseInputSchema, courseVisibilitySchema } from "~/lib/validations";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    const course = await getAdminCourse(id);
    if (!course) return jsonError("Course not found", 404);
    return jsonOk(course);
  } catch (error) {
    return serverError(error, "Error loading course");
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const body = await readJson(request);
  if (!body.ok) return body.response;

  const parsed = courseInputSchema.safeParse(body.body);
  if (!parsed.success) return jsonError(zodMessage(parsed.error), 400);

  try {
    const { id } = await context.params;
    const course = await updateCourse(id, parsed.data);
    if (!course) return jsonError("Course not found", 404);
    return jsonOk(course);
  } catch (error) {
    return serverError(error, "Error updating course");
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const body = await readJson(request);
  if (!body.ok) return body.response;

  const parsed = courseVisibilitySchema.safeParse(body.body);
  if (!parsed.success) return jsonError(zodMessage(parsed.error), 400);

  try {
    const { id } = await context.params;
    const course = await setCourseVisibility(id, parsed.data.visible);
    if (!course) return jsonError("Course not found", 404);
    return jsonOk(course);
  } catch (error) {
    return serverError(error, "Error updating course visibility");
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    const deleted = await deleteCourse(id);
    if (!deleted) return jsonError("Course not found", 404);
    return jsonOk({ deleted: true });
  } catch (error) {
    return serverError(error, "Error deleting course");
  }
}
