import { NextResponse } from "next/server";
import { GitHubAdminError, readFile } from "@/lib/admin-github";
import { batchCommit, type BatchFile } from "@/lib/admin-github-batch";
import { writeField, type FileType } from "@/lib/admin-file-parsers";

/**
 * PUT /api/admin/batch
 *
 * Apply N field-level changes as ONE GitHub commit.
 *
 * Body:
 *   {
 *     changes: [
 *       { file, fileType, exportName?, path, value }, …
 *     ],
 *     message: string
 *   }
 *
 * Server flow:
 *   1. Group changes by file path.
 *   2. For each file: read current content from GitHub, apply every
 *      change to that content sequentially via writeField.
 *   3. Collect (path, finalContent) pairs.
 *   4. If 1 file → use the contents API single PUT (cheaper).
 *      If >1 file → use the git-data API for an atomic multi-file commit.
 *
 * Skipped: files where every change leaves the content unchanged.
 */

type BatchChange = {
  file?: string;
  fileType?: FileType;
  exportName?: string;
  path?: string;
  value?: unknown;
};

type RequestBody = {
  changes?: BatchChange[];
  message?: string;
};

export async function PUT(request: Request): Promise<NextResponse> {
  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const changes = Array.isArray(body.changes) ? body.changes : [];
  const message = (body.message ?? "").trim() || "admin: batch update";

  if (changes.length === 0) {
    return NextResponse.json(
      { ok: false, error: "changes array is empty" },
      { status: 400 },
    );
  }
  for (const c of changes) {
    if (!c.file || !c.fileType || !c.path || c.value === undefined) {
      return NextResponse.json(
        {
          ok: false,
          error: "Every change needs file, fileType, path, value",
        },
        { status: 400 },
      );
    }
  }

  // Group changes per file (preserve order within each file).
  const grouped = new Map<string, BatchChange[]>();
  for (const c of changes) {
    const file = c.file as string;
    if (!grouped.has(file)) grouped.set(file, []);
    grouped.get(file)!.push(c);
  }

  // For each file: read once, apply all its changes, build final content.
  const finals: BatchFile[] = [];
  const skipped: string[] = [];

  try {
    for (const [filePath, fileChanges] of grouped) {
      const current = await readFile(filePath);
      let working = current.content;
      for (const change of fileChanges) {
        const r = writeField(
          change.fileType as FileType,
          working,
          {
            file: filePath,
            exportName: change.exportName,
            path: change.path as string,
          },
          change.value,
        );
        if (!r.ok) {
          return NextResponse.json(
            {
              ok: false,
              error: `Could not apply change to ${filePath} (${change.path}): ${r.error}`,
              code: "parse",
            },
            { status: 422 },
          );
        }
        working = r.source;
      }
      if (working === current.content) {
        skipped.push(filePath);
      } else {
        finals.push({ path: filePath, content: working });
      }
    }
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

  if (finals.length === 0) {
    return NextResponse.json({
      ok: true,
      unchanged: true,
      skipped,
    });
  }

  try {
    const commit = await batchCommit(finals, message);
    return NextResponse.json({
      ok: true,
      sha: commit.sha,
      commitUrl: commit.commitUrl,
      filesCommitted: finals.map((f) => f.path),
      skipped,
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
