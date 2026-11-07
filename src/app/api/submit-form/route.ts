import { type NextRequest, NextResponse } from "next/server";
import { ensureDb } from "~/lib/mongodb";
import FormSubmission from "~/models/form-submission";
import { contactFormSchema } from "~/lib/validations";

export async function POST(request: NextRequest) {
  try {
    await ensureDb("submit-form");

    const body = await request.json();
    const parsed = contactFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.error.issues[0]?.message ?? "All fields are required",
        },
        { status: 400 },
      );
    }

    const formData = await FormSubmission.create({
      name: parsed.data.name,
      email: parsed.data.email,
      contactNumber: parsed.data.contactNumber,
      countryCode: parsed.data.countryCode || "+1",
      message: parsed.data.message,
      isRead: false,
      contacted: false,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Form data submitted successfully",
        data: formData,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error saving form data:", error);
    return NextResponse.json(
      { success: false, message: "Server error occurred" },
      { status: 500 },
    );
  }
}
