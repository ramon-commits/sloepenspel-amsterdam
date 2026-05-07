import { NextResponse } from "next/server";
import { GitHubAdminError, readAdminEnv } from "@/lib/admin-github";
import { batchCommit, type BatchFile } from "@/lib/admin-github-batch";

/**
 * POST /api/admin/revert
 * Body: { sha: string }
 *
 * Restore the state of every file the given commit touched to the
 * version *before* that commit, in one atomic commit. Files that the
 * commit added (i.e. didn't exist in the parent) are intentionally
 * skipped — admin doesn't perform deletes today; we surface a warning.
 */

const GITHUB_API = "https://api.github.com";

type CommitDetail = {
  sha: string;
  parents: Array<{ sha: string }>;
  commit: { message: string };
  files: Array<{
    filename: string;
    status:
      | "added"
      | "modified"
      | "removed"
      | "renamed"
      | "copied"
      | "changed";
    previous_filename?: string;
  }>;
};

type RawContent = {
  type: string;
  encoding?: string;
  content?: string;
};

type RequestBody = { sha?: unknown };

async function gh<T>(path: string): Promise<T> {
  const env = readAdminEnv();
  const res = await fetch(`${GITHUB_API}${path}`, {
    headers: {
      Authorization: `Bearer ${env.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    cache: "no-store",
  });
  if (res.status === 404) {
    throw new GitHubAdminError(`GitHub 404: ${path}`, "not-found", 404);
  }
  if (res.status === 401 || res.status === 403) {
    throw new GitHubAdminError("GitHub auth rejected.", "auth", res.status);
  }
  if (!res.ok) {
    let message = `GitHub responded ${res.status}`;
    try {
      const body = (await res.json()) as { message?: string };
      if (body.message) message = body.message;
    } catch {
      /* ignore */
    }
    throw new GitHubAdminError(message, "unknown", res.status);
  }
  return (await res.json()) as T;
}

function decode(content: string): string {
  return Buffer.from(content.replace(/\n/g, ""), "base64").toString("utf8");
}

export async function POST(request: Request): Promise<NextResponse> {
  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }
  const sha = typeof body.sha === "string" ? body.sha : "";
  if (!sha) {
    return NextResponse.json(
      { ok: false, error: "sha is required" },
      { status: 400 },
    );
  }

  const env = readAdminEnv();

  let detail: CommitDetail;
  try {
    detail = await gh<CommitDetail>(
      `/repos/${env.owner}/${env.repo}/commits/${sha}`,
    );
  } catch (e) {
    if (e instanceof GitHubAdminError) {
      return NextResponse.json(
        { ok: false, error: e.message, code: e.code },
        { status: e.status },
      );
    }
    throw e;
  }

  if (!detail.parents || detail.parents.length === 0) {
    return NextResponse.json(
      {
        ok: false,
        error: "Commit heeft geen parent (initial commit). Niet terug te draaien.",
      },
      { status: 422 },
    );
  }
  const parentSha = detail.parents[0].sha;

  const files: BatchFile[] = [];
  const skipped: Array<{ path: string; reason: string }> = [];

  for (const f of detail.files) {
    if (f.status === "added") {
      // We'd need to delete the file to revert an add. The contents API
      // can do this but our batch helper currently doesn't model deletes
      // (would need explicit "tree entry without sha" semantics).
      skipped.push({
        path: f.filename,
        reason: "toegevoegd in deze commit — handmatig verwijderen",
      });
      continue;
    }
    if (f.status === "removed") {
      // Restore the file from the parent.
    }
    try {
      const raw = await gh<RawContent>(
        `/repos/${env.owner}/${env.repo}/contents/${encodeURI(f.filename)}?ref=${parentSha}`,
      );
      if (!raw.content || raw.encoding !== "base64") {
        skipped.push({
          path: f.filename,
          reason: "kan parent-content niet lezen",
        });
        continue;
      }
      files.push({ path: f.filename, content: decode(raw.content) });
    } catch (e) {
      if (e instanceof GitHubAdminError && e.code === "not-found") {
        skipped.push({
          path: f.filename,
          reason: "bestond niet in parent",
        });
        continue;
      }
      throw e;
    }
  }

  if (files.length === 0) {
    return NextResponse.json({
      ok: false,
      error:
        "Geen bestanden om te herstellen. Wijzigingen waren mogelijk allemaal nieuwe bestanden — verwijder die handmatig.",
      skipped,
    });
  }

  const summary = detail.commit.message
    .split("\n")[0]
    .replace(/^admin:\s*/u, "")
    .slice(0, 80);
  const message = `admin: revert "${summary}" (${detail.sha.slice(0, 7)})`;

  try {
    const commit = await batchCommit(files, message);
    return NextResponse.json({
      ok: true,
      sha: commit.sha,
      commitUrl: commit.commitUrl,
      filesReverted: files.map((f) => f.path),
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
