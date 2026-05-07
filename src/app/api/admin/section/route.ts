import { NextResponse } from "next/server";
import {
  GitHubAdminError,
  readFile,
} from "@/lib/admin-github";
import {
  readField,
  type FieldLocator,
  type FileType,
} from "@/lib/admin-file-parsers";

/**
 * Read a section's data from GitHub.
 *
 * Query parameters:
 *   file       — repo path, e.g. "content/services.json"
 *   fileType   — "json" | "ts-object" | "markdown-frontmatter"
 *   exportName — required for ts-object
 *   anchor     — path inside the parsed content (empty = whole file/export)
 *
 * Response: { ok, value, sha, path }
 *   value is the parsed JS value at the anchor.
 *   sha is the file-level sha needed for subsequent writes.
 */
export async function GET(request: Request): Promise<NextResponse> {
  const url = new URL(request.url);
  const file = url.searchParams.get("file");
  const fileTypeParam = url.searchParams.get("fileType");
  const exportName = url.searchParams.get("exportName") ?? undefined;
  const anchor = url.searchParams.get("anchor") ?? "";

  if (!file || !fileTypeParam) {
    return NextResponse.json(
      { ok: false, error: "Missing required query: file, fileType" },
      { status: 400 },
    );
  }
  const fileType = fileTypeParam as FileType;

  try {
    const fileResult = await readFile(file);
    const locator: FieldLocator = {
      file,
      exportName,
      path: anchor,
    };
    const parsed = readField(fileType, fileResult.content, locator);
    if (!parsed.ok) {
      return NextResponse.json(
        { ok: false, error: parsed.error, code: "parse" },
        { status: 422 },
      );
    }
    return NextResponse.json({
      ok: true,
      value: parsed.value,
      sha: fileResult.sha,
      path: fileResult.path,
    });
  } catch (e) {
    if (e instanceof GitHubAdminError) {
      return NextResponse.json(
        { ok: false, error: e.message, code: e.code },
        { status: e.status },
      );
    }
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 },
    );
  }
}
