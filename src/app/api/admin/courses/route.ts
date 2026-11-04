import { type NextRequest } from "next/server";
import { createCourse, listAdminCourses } from "~/lib/courses";
import {
  jsonError,
  jsonOk,
  readJson,
  requireAdmin,
  serverError,
  zodMessage,
} from "~/lib/http";
import { courseInputSchema } from "~/lib/validations";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    return jsonOk(await listAdminCourses());
  } catch (error) {
    return serverError(error, "Error listing courses");
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const body = await readJson(request);
  if (!body.ok) return body.response;

  const parsed = courseInputSchema.safeParse(body.body);
  if (!parsed.success) return jsonError(zodMessage(parsed.error), 400);

  try {
    return jsonOk(await createCourse(parsed.data), 201);
  } catch (error) {
    return serverError(error, "Error creating course");
  }
}
