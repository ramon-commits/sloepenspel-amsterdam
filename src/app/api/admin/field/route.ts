import { NextResponse } from "next/server";
import {
  GitHubAdminError,
  readFile,
  writeFile,
} from "@/lib/admin-github";
import {
  writeField,
  type FieldLocator,
  type FileType,
} from "@/lib/admin-file-parsers";

/**
 * Write a single field value to GitHub atomically.
 *
 * Request body:
 *   {
 *     file:        string,        // "content/services.json"
 *     fileType:    "json" | "ts-object" | "markdown-frontmatter",
 *     exportName?: string,        // required for ts-object
 *     path:        string,        // "positiveReasons[0].title"
 *     value:       unknown,       // string for ts-object writes
 *     message?:    string,        // commit message override
 *   }
 *
 * Server flow: read latest file → mutate → PUT back with that sha.
 * Per-field optimistic concurrency is intentionally not enforced here:
 * the server-side read-modify-write only fails on whole-file races,
 * which GitHub's sha mechanism already protects against.
 */

type PutBody = {
  file?: string;
  fileType?: FileType;
  exportName?: string;
  path?: string;
  value?: unknown;
  message?: string;
};

function defaultCommitMessage(file: string, path: string): string {
  // Short, informative, prefixed so we can grep history later.
  return `admin: update ${file} (${path || "root"})`;
}

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

  const { file, fileType, exportName, path, value, message } = body;

  if (!file || !fileType || !path || value === undefined) {
    return NextResponse.json(
      {
        ok: false,
        error: "Body must include file, fileType, path, value",
      },
      { status: 400 },
    );
  }

  const locator: FieldLocator = {
    file,
    exportName,
    path,
  };

  try {
    const current = await readFile(file);
    const writeResult = writeField(fileType, current.content, locator, value);
    if (!writeResult.ok) {
      return NextResponse.json(
        { ok: false, error: writeResult.error, code: "parse" },
        { status: 422 },
      );
    }

    // Skip the round-trip if the source didn't actually change. Saves a
    // commit and a Netlify rebuild when an editor "saves" without changes.
    if (writeResult.source === current.content) {
      return NextResponse.json({
        ok: true,
        unchanged: true,
        sha: current.sha,
      });
    }

    const written = await writeFile({
      path: file,
      content: writeResult.source,
      sha: current.sha,
      message: message ?? defaultCommitMessage(file, path),
    });

    return NextResponse.json({
      ok: true,
      sha: written.sha,
      commitUrl: written.commitUrl,
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
