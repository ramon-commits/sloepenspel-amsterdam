import {
  GitHubAdminError,
  readAdminEnv,
  type AdminEnv,
} from "./admin-github";

/**
 * Single-commit-multi-file writes via the GitHub git data API.
 *
 * The contents API can only PUT one file per commit. When we want to
 * apply N changes as a single commit (e.g. an AI Change Request that
 * touches reviews.json + pages/index.ts + services.json), we build the
 * commit ourselves:
 *
 *   1. ref:    GET /git/ref/heads/{branch}        → head commit sha
 *   2. commit: GET /git/commits/{sha}             → tree sha
 *   3. blob*:  POST /git/blobs (per file)         → blob sha
 *   4. tree:   POST /git/trees with base_tree     → new tree sha
 *   5. commit: POST /git/commits (parents: head)  → new commit sha
 *   6. ref:    PATCH /git/refs/heads/{branch}     → fast-forward
 */

const GITHUB_API = "https://api.github.com";

export type BatchFile = {
  /** Repo path, e.g. "content/services.json". */
  path: string;
  /** Final file contents AFTER all mutations. UTF-8 string. */
  content: string;
};

export type BatchCommitResult = {
  sha: string;
  commitUrl: string;
  treeSha: string;
};

function authHeaders(env: AdminEnv): HeadersInit {
  return {
    Authorization: `Bearer ${env.token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

async function ghJson<T>(
  env: AdminEnv,
  path: string,
  init: RequestInit,
): Promise<T> {
  const res = await fetch(`${GITHUB_API}${path}`, {
    ...init,
    headers: {
      ...authHeaders(env),
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
  if (res.status === 401 || res.status === 403) {
    const remaining = res.headers.get("x-ratelimit-remaining");
    if (remaining === "0") {
      throw new GitHubAdminError(
        "GitHub rate limit exceeded.",
        "rate-limit",
        429,
      );
    }
    throw new GitHubAdminError("GitHub auth rejected.", "auth", res.status);
  }
  if (res.status === 404) {
    throw new GitHubAdminError(`GitHub 404: ${path}`, "not-found", 404);
  }
  if (res.status === 409 || res.status === 422) {
    throw new GitHubAdminError(
      "Conflict: branch moved while building the commit. Try again.",
      "conflict",
      409,
    );
  }
  if (!res.ok) {
    let message = `GitHub responded ${res.status} on ${path}`;
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

/**
 * Build a single commit that applies all `files`. Returns the new commit
 * sha + URL. The caller is responsible for ensuring `files[].content`
 * already reflects the desired final state of each file.
 */
export async function batchCommit(
  files: BatchFile[],
  message: string,
): Promise<BatchCommitResult> {
  if (files.length === 0) {
    throw new GitHubAdminError(
      "batchCommit called with empty file list",
      "config",
      400,
    );
  }
  const env = readAdminEnv();

  // 1. Resolve current head + tree
  const ref = await ghJson<{ object: { sha: string } }>(
    env,
    `/repos/${env.owner}/${env.repo}/git/ref/heads/${env.branch}`,
    { method: "GET" },
  );
  const headSha = ref.object.sha;
  const headCommit = await ghJson<{ tree: { sha: string } }>(
    env,
    `/repos/${env.owner}/${env.repo}/git/commits/${headSha}`,
    { method: "GET" },
  );
  const baseTreeSha = headCommit.tree.sha;

  // 2. Create blobs in parallel
  const blobs = await Promise.all(
    files.map(async (f) => {
      const blob = await ghJson<{ sha: string }>(
        env,
        `/repos/${env.owner}/${env.repo}/git/blobs`,
        {
          method: "POST",
          body: JSON.stringify({
            content: Buffer.from(f.content, "utf8").toString("base64"),
            encoding: "base64",
          }),
        },
      );
      return { path: f.path, sha: blob.sha };
    }),
  );

  // 3. Build new tree
  const tree = await ghJson<{ sha: string }>(
    env,
    `/repos/${env.owner}/${env.repo}/git/trees`,
    {
      method: "POST",
      body: JSON.stringify({
        base_tree: baseTreeSha,
        tree: blobs.map((b) => ({
          path: b.path,
          mode: "100644",
          type: "blob",
          sha: b.sha,
        })),
      }),
    },
  );

  // 4. Create commit pointing at the new tree
  const newCommit = await ghJson<{ sha: string; html_url: string }>(
    env,
    `/repos/${env.owner}/${env.repo}/git/commits`,
    {
      method: "POST",
      body: JSON.stringify({
        message,
        tree: tree.sha,
        parents: [headSha],
      }),
    },
  );

  // 5. Fast-forward branch ref
  await ghJson<{ object: { sha: string } }>(
    env,
    `/repos/${env.owner}/${env.repo}/git/refs/heads/${env.branch}`,
    {
      method: "PATCH",
      body: JSON.stringify({ sha: newCommit.sha, force: false }),
    },
  );

  return {
    sha: newCommit.sha,
    commitUrl: newCommit.html_url,
    treeSha: tree.sha,
  };
}
