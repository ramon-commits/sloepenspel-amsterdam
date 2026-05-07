import { NextResponse } from "next/server";
import { GitHubAdminError, readAdminEnv } from "@/lib/admin-github";

/**
 * GET /api/admin/history?limit=20[&path=content][&adminOnly=1]
 *
 * Lists recent commits on the active branch. Defaults to filtering to the
 * `content/` and `public/images/` paths and to commits whose message
 * starts with "admin:" (the prefix our routes use). Returns the bare
 * minimum the UI needs.
 */

const GITHUB_API = "https://api.github.com";

type CommitListResponseItem = {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author?: { name?: string; email?: string; date?: string };
    committer?: { date?: string };
  };
  author?: { login?: string; avatar_url?: string } | null;
};

export type AdminCommit = {
  sha: string;
  shortSha: string;
  message: string;
  date: string;
  author: string;
  url: string;
  isAdmin: boolean;
};

function shortSha(sha: string): string {
  return sha.slice(0, 7);
}

export async function GET(request: Request): Promise<NextResponse> {
  let env;
  try {
    env = readAdminEnv();
  } catch (e) {
    if (e instanceof GitHubAdminError) {
      return NextResponse.json(
        { ok: false, error: e.message, code: e.code },
        { status: e.status },
      );
    }
    return NextResponse.json(
      { ok: false, error: "Config error" },
      { status: 500 },
    );
  }

  const url = new URL(request.url);
  const limitRaw = Number(url.searchParams.get("limit") ?? "20");
  const limit = Math.min(Math.max(1, Number.isFinite(limitRaw) ? limitRaw : 20), 100);
  const adminOnly = url.searchParams.get("adminOnly") !== "0";
  const pathFilter = url.searchParams.get("path");

  const params = new URLSearchParams({
    sha: env.branch,
    per_page: String(limit),
  });
  if (pathFilter) params.set("path", pathFilter);

  try {
    const res = await fetch(
      `${GITHUB_API}/repos/${env.owner}/${env.repo}/commits?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${env.token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        cache: "no-store",
      },
    );
    if (res.status === 401 || res.status === 403) {
      return NextResponse.json(
        { ok: false, error: "GitHub token rejected", code: "auth" },
        { status: res.status },
      );
    }
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: `GitHub responded ${res.status}` },
        { status: res.status },
      );
    }
    const items = (await res.json()) as CommitListResponseItem[];
    const commits: AdminCommit[] = items
      .map((item) => {
        const isAdmin = (item.commit.message ?? "").startsWith("admin:");
        const date =
          item.commit.committer?.date ??
          item.commit.author?.date ??
          new Date().toISOString();
        const author =
          item.author?.login ??
          item.commit.author?.name ??
          "Onbekend";
        return {
          sha: item.sha,
          shortSha: shortSha(item.sha),
          message: item.commit.message.split("\n")[0] ?? "",
          date,
          author,
          url: item.html_url,
          isAdmin,
        } satisfies AdminCommit;
      })
      .filter((c) => (adminOnly ? c.isAdmin : true));

    return NextResponse.json({ ok: true, commits });
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        error: e instanceof Error ? e.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
