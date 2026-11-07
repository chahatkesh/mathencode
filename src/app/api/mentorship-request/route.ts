import { type NextRequest, NextResponse } from "next/server";
import { ensureDb } from "~/lib/mongodb";
import {
  formatContactNumber,
  mentorshipMessage,
  mentorshipRequestSchema,
  normalizeStudentName,
  studentContactError,
} from "~/lib/validations";
import FormSubmission from "~/models/form-submission";

export async function POST(request: NextRequest) {
  try {
    await ensureDb("mentorship-request");

    const body = await request.json();
    const parsed = mentorshipRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            parsed.error.issues[0]?.message ?? "Check the form and try again.",
        },
        { status: 400 },
      );
    }

    const contactError = studentContactError({
      studentName: parsed.data.name,
      country: parsed.data.country,
      countryCode: parsed.data.countryCode,
      contactNumber: parsed.data.contactNumber,
    });
    if (contactError) {
      return NextResponse.json(
        { success: false, message: contactError },
        { status: 400 },
      );
    }

    const sourceCourse = parsed.data.sourceCourse.replace(/\s+/g, " ").trim();
    const name = normalizeStudentName(parsed.data.name);

    await FormSubmission.create({
      name,
      email: parsed.data.email.trim(),
      contactNumber: formatContactNumber(
        parsed.data.countryCode,
        parsed.data.contactNumber,
      ),
      countryCode: parsed.data.countryCode,
      country: parsed.data.country.trim(),
      message: mentorshipMessage({ ...parsed.data, sourceCourse }),
      goals: parsed.data.goals.trim(),
      expectations: parsed.data.expectations.trim(),
      sourceCourse,
      kind: "mentorship",
      isRead: false,
      contacted: false,
    });

    return NextResponse.json(
      { success: true, message: "Mentorship request submitted" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error saving mentorship request:", error);
    return NextResponse.json(
      { success: false, message: "Server error occurred" },
      { status: 500 },
    );
  }
}
