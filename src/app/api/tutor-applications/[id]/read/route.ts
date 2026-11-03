import { type NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { requireAuth } from "~/lib/auth";
import { ensureDb } from "~/lib/mongodb";
import TutorApplication from "~/models/tutor-application";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(_request: NextRequest, context: RouteContext) {
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

    await ensureDb("tutor-applications-read");
    const application = await TutorApplication.findById(id);
    if (!application) {
      return NextResponse.json(
        { success: false, message: "Application not found" },
        { status: 404 },
      );
    }

    application.isRead = !application.isRead;
    await application.save();

    return NextResponse.json({
      success: true,
      message: "Read status updated",
      data: application,
    });
  } catch (error) {
    console.error("Error updating read status:", error);
    return NextResponse.json(
      { success: false, message: "Server error occurred" },
      { status: 500 },
    );
  }
}
