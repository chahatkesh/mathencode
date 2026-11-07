import { type NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { requireAuth } from "~/lib/auth";
import { ensureDb } from "~/lib/mongodb";
import FormSubmission from "~/models/form-submission";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(_request: NextRequest, context: RouteContext) {
  const auth = await requireAuth();
  if (!auth.authenticated) return auth.response;

  try {
    const { id } = await context.params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Submission not found" },
        { status: 404 },
      );
    }

    await ensureDb("form-submissions-contacted");
    const submission = await FormSubmission.findById(id);
    if (!submission) {
      return NextResponse.json(
        { success: false, message: "Submission not found" },
        { status: 404 },
      );
    }

    submission.contacted = submission.contacted !== true;
    await submission.save();

    return NextResponse.json({
      success: true,
      message: submission.contacted
        ? "Marked as contacted"
        : "Marked as non contacted",
      data: submission,
    });
  } catch (error) {
    console.error("Error updating contact status:", error);
    return NextResponse.json(
      { success: false, message: "Server error occurred" },
      { status: 500 },
    );
  }
}
