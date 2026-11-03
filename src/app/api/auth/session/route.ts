import { NextResponse } from "next/server";
import { getSession } from "~/lib/auth";

export async function GET() {
  try {
    const session = await getSession({ refresh: true });

    if (!session) {
      return NextResponse.json(
        { success: false, authenticated: false, code: "UNAUTHENTICATED" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
    });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json(
      { success: false, authenticated: false },
      { status: 500 },
    );
  }
}
