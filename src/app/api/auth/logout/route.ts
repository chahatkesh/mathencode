import { NextResponse } from "next/server";
import { clearSessionCookie } from "~/lib/auth";

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Logout successful",
    });
    response.cookies.set(clearSessionCookie());
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, error: "Logout failed" },
      { status: 500 },
    );
  }
}
