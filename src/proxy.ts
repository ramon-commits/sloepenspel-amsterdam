import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_COOKIE,
  hashPassword,
  safeEqual,
} from "@/lib/admin-auth";

/**
 * Endless Minds Site Admin — request gate.
 *
 * Protects:
 *   - /admin/*       (HTML pages)        → redirect to /admin/login on failure
 *   - /api/admin/*   (route handlers)    → 401 JSON on failure
 *
 * Bypassed:
 *   - /admin/login          (the login page itself)
 *   - /api/admin/login      (the auth POST endpoint)
 *   - /api/admin/logout     (no-op if not logged in; safer to allow)
 *   - any /_next/*, public assets (handled by matcher exclusion)
 *
 * Special case: if ADMIN_PASSWORD env var is unset, the entire admin
 * surface returns 404 (page) / 503 (api). This means a misconfigured
 * deployment can never accidentally expose an unprotected admin.
 */
export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith("/api/admin");

  // Pass the current path to RSC via a request header so the root layout
  // can skip site chrome (skip-link, JSON-LD) on admin pages.
  const forwardHeaders = new Headers(request.headers);
  forwardHeaders.set("x-pathname", pathname);
  const passThrough = () =>
    NextResponse.next({ request: { headers: forwardHeaders } });

  // Bypass auth checks for the login flow itself
  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return passThrough();
  }
  if (pathname === "/api/admin/logout") {
    // Logout should be callable even with an invalid session (it just clears cookie).
    return passThrough();
  }

  // No password configured → admin surface does not exist
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    if (isApi) {
      return NextResponse.json(
        { success: false, error: "Admin not configured" },
        { status: 503 },
      );
    }
    return new NextResponse("Not Found", { status: 404 });
  }

  // Validate session cookie
  const cookie = request.cookies.get(ADMIN_COOKIE)?.value;
  const expected = hashPassword(password);
  const valid = !!cookie && safeEqual(cookie, expected);

  if (valid) return passThrough();

  if (isApi) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  // Redirect to login, preserving the intended destination
  const loginUrl = new URL("/admin/login", request.url);
  if (pathname !== "/admin") {
    loginUrl.searchParams.set("from", pathname);
  }
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
