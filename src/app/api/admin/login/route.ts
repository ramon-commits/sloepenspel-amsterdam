import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  ADMIN_COOKIE_MAX_AGE,
  hashPassword,
  safeEqual,
} from "@/lib/admin-auth";

type LoginBody = {
  password?: unknown;
};

export async function POST(request: Request): Promise<NextResponse> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json(
      { success: false, error: "Admin not configured" },
      { status: 503 },
    );
  }

  let body: LoginBody;
  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 },
    );
  }

  const submitted = typeof body.password === "string" ? body.password : "";
  if (!submitted) {
    return NextResponse.json(
      { success: false, error: "Wachtwoord ontbreekt" },
      { status: 400 },
    );
  }

  // Constant-time compare on hashed values to avoid both timing leak
  // and exposing the plaintext expected password to RAM repeatedly.
  const submittedHash = hashPassword(submitted);
  const expectedHash = hashPassword(expected);
  if (!safeEqual(submittedHash, expectedHash)) {
    return NextResponse.json(
      { success: false, error: "Wachtwoord onjuist" },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: ADMIN_COOKIE,
    value: expectedHash,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/", // path '/' so /api/admin/* requests also include the cookie
    maxAge: ADMIN_COOKIE_MAX_AGE,
  });
  return response;
}
