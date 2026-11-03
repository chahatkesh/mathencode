import { type NextRequest, NextResponse } from "next/server";
import { ensureDb } from "~/lib/mongodb";
import TutorApplication from "~/models/tutor-application";
import { tutorApplicationSchema } from "~/lib/validations";

export async function POST(request: NextRequest) {
  try {
    await ensureDb("submit-tutor-application");

    const body = await request.json();
    const parsed = tutorApplicationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.error.issues[0]?.message ?? "All fields are required",
        },
        { status: 400 },
      );
    }

    const tutorApplication = await TutorApplication.create({
      ...parsed.data,
      isRead: false,
      status: "pending",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Tutor application submitted successfully",
        data: tutorApplication,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error saving tutor application:", error);
    return NextResponse.json(
      { success: false, message: "Server error occurred" },
      { status: 500 },
    );
  }
}
