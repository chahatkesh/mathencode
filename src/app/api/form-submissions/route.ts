import { NextResponse } from "next/server";
import { requireAuth } from "~/lib/auth";
import { ensureDb } from "~/lib/mongodb";
import FormSubmission from "~/models/form-submission";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAuth();
  if (!auth.authenticated) return auth.response;

  try {
    await ensureDb("form-submissions");
    const submissions = await FormSubmission.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      count: submissions.length,
      data: submissions.map((item) => ({
        ...item,
        contacted: item.contacted === true,
        kind: item.kind === "mentorship" ? "mentorship" : "demo",
        country: item.country ?? "",
        goals: item.goals ?? "",
        expectations: item.expectations ?? "",
        sourceCourse: item.sourceCourse ?? "",
      })),
    });
  } catch (error) {
    console.error("Error fetching form data:", error);
    return NextResponse.json(
      { success: false, message: "Server error occurred" },
      { status: 500 },
    );
  }
}
