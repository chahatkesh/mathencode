import { type NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { requireAuth } from "~/lib/auth";
import { ensureDb } from "~/lib/mongodb";
import TutorApplication from "~/models/tutor-application";
import { applicationStatusSchema } from "~/lib/validations";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  const auth = await requireAuth();
  if (!auth.authenticated) return auth.response;

  try {
    const { id } = await context.params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Application not found" },
        { status: 404 },
      );
    }

    const body = await request.json();
    const parsed = applicationStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid status value" },
        { status: 400 },
      );
    }

    await ensureDb("tutor-applications-status");
    const application = await TutorApplication.findById(id);
    if (!application) {
      return NextResponse.json(
        { success: false, message: "Application not found" },
        { status: 404 },
      );
    }

    application.status = parsed.data.status;
    await application.save();

    return NextResponse.json({
      success: true,
      message: "Application status updated",
      data: application,
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    return NextResponse.json(
      { success: false, message: "Server error occurred" },
      { status: 500 },
    );
  }
}
