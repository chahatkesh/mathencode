import { NextResponse } from "next/server";
import { requireAuth } from "~/lib/auth";
import { ensureDb } from "~/lib/mongodb";
import TutorApplication from "~/models/tutor-application";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAuth();
  if (!auth.authenticated) return auth.response;

  try {
    await ensureDb("tutor-applications");
    const applications = await TutorApplication.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    console.error("Error fetching tutor applications:", error);
    return NextResponse.json(
      { success: false, message: "Server error occurred" },
      { status: 500 },
    );
  }
}
