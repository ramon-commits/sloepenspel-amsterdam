import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * HMAC-SHA256 of `password` keyed with a fixed salt.
 * Used both to set the cookie value (login route) and to verify it (proxy).
 *
 * The salt is intentionally a constant — security comes from not knowing
 * the password (server-only env var). Anyone reading the source can compute
 * the hash *if* they know the password.
 */
export function hashPassword(password: string): string {
  return createHmac("sha256", "endless-minds-salt")
    .update(password)
    .digest("hex");
}

/**
 * Constant-time comparison of two hex strings.
 * Returns false on length mismatch (without timing leak about content).
 */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
  } catch {
    return false;
  }
}

/**
 * The cookie name shared by proxy.ts and the login/logout routes.
 */
export const ADMIN_COOKIE = "admin_session";

/**
 * 24 hours, in seconds.
 */
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24;
