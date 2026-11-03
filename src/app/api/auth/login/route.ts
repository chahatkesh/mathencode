import { type NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "~/lib/mongodb";
import Admin from "~/models/admin";
import { createSession, setSessionCookie } from "~/lib/auth";
import { loginSchema } from "~/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const connection = await dbConnect();
    if (!connection) {
      return NextResponse.json(
        { success: false, error: "Database is unavailable" },
        { status: 503 },
      );
    }

    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message ?? "Invalid input",
        },
        { status: 400 },
      );
    }

    const { username, password } = parsed.data;
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const token = await createSession(admin._id.toString());
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
    });
    response.cookies.set(setSessionCookie(token));
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Login failed" },
      { status: 500 },
    );
  }
}
