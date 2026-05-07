import { NextResponse } from "next/server";
import {
  GitHubAdminError,
  readFile,
  writeFile,
  type WriteFileInput,
} from "@/lib/admin-github";

/**
 * Generic content GET/PUT against GitHub. Used as the low-level transport
 * for the admin; higher-level field operations live in /api/admin/field.
 *
 * Auth is handled by src/proxy.ts — by the time this route runs, the
 * admin_session cookie is already validated.
 */

function errorResponse(e: unknown): NextResponse {
  if (e instanceof GitHubAdminError) {
    return NextResponse.json(
      { ok: false, error: e.message, code: e.code },
      { status: e.status },
    );
  }
  const message = e instanceof Error ? e.message : "Unknown error";
  return NextResponse.json(
    { ok: false, error: message, code: "unknown" },
    { status: 500 },
  );
}

export async function GET(request: Request): Promise<NextResponse> {
  const url = new URL(request.url);
  const path = url.searchParams.get("path");
  if (!path) {
    return NextResponse.json(
      { ok: false, error: "Missing ?path= query parameter" },
      { status: 400 },
    );
  }
  try {
    const result = await readFile(path);
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    return errorResponse(e);
  }
}

type PutBody = Partial<WriteFileInput>;

export async function PUT(request: Request): Promise<NextResponse> {
  let body: PutBody;
  try {
    body = (await request.json()) as PutBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const { path, content, sha, message } = body;
  if (!path || typeof content !== "string" || !sha || !message) {
    return NextResponse.json(
      {
        ok: false,
        error: "Body must include { path, content, sha, message }",
      },
      { status: 400 },
    );
  }
  try {
    const result = await writeFile({ path, content, sha, message });
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    return errorResponse(e);
  }
}
