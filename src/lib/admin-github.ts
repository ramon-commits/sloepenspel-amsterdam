/**
 * Endless Minds Site Admin — GitHub Contents API client.
 *
 * Server-side only (uses GITHUB_TOKEN). All writes are commits, so every
 * save round-trips through GitHub and triggers a Netlify rebuild. Reads
 * never use the cache so the admin always shows the live state.
 */

const GITHUB_API = "https://api.github.com";

type GitHubFileResponse = {
  content: string; // base64
  sha: string;
  encoding: string;
  path: string;
  name: string;
};

export type AdminEnv = {
  token: string;
  owner: string;
  repo: string;
  branch: string;
};

export class GitHubAdminError extends Error {
  status: number;
  code: "config" | "auth" | "not-found" | "conflict" | "rate-limit" | "unknown";
  constructor(
    message: string,
    code: GitHubAdminError["code"],
    status = 500,
  ) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export function readAdminEnv(): AdminEnv {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH ?? "main";

  if (!token || !owner || !repo) {
    throw new GitHubAdminError(
      "Admin GitHub env vars missing (GITHUB_TOKEN / GITHUB_OWNER / GITHUB_REPO).",
      "config",
      500,
    );
  }
  return { token, owner, repo, branch };
}

function authHeaders(env: AdminEnv): HeadersInit {
  return {
    Authorization: `Bearer ${env.token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

function buildContentsUrl(env: AdminEnv, path: string): string {
  // Encode each path segment but keep slashes.
  const encoded = path
    .split("/")
    .map(encodeURIComponent)
    .join("/");
  return `${GITHUB_API}/repos/${env.owner}/${env.repo}/contents/${encoded}?ref=${env.branch}`;
}

function decodeBase64(content: string): string {
  // GitHub returns base64 wrapped at 76 chars per line.
  const cleaned = content.replace(/\n/g, "");
  return Buffer.from(cleaned, "base64").toString("utf8");
}

function encodeBase64(content: string): string {
  return Buffer.from(content, "utf8").toString("base64");
}

export type ReadFileResult = {
  content: string;
  sha: string;
  path: string;
};

/**
 * Read a file from the configured repo+branch. Throws GitHubAdminError on
 * any non-success status so the route handler can map to HTTP responses.
 */
export async function readFile(path: string): Promise<ReadFileResult> {
  const env = readAdminEnv();
  const res = await fetch(buildContentsUrl(env, path), {
    headers: authHeaders(env),
    cache: "no-store",
  });
  if (res.status === 404) {
    throw new GitHubAdminError(`File not found: ${path}`, "not-found", 404);
  }
  if (res.status === 401 || res.status === 403) {
    throw new GitHubAdminError(
      "GitHub token rejected. Check GITHUB_TOKEN permissions.",
      "auth",
      res.status,
    );
  }
  if (!res.ok) {
    throw new GitHubAdminError(
      `GitHub read failed (${res.status})`,
      "unknown",
      res.status,
    );
  }
  const data = (await res.json()) as GitHubFileResponse;
  if (data.encoding !== "base64") {
    throw new GitHubAdminError(
      `Unexpected GitHub encoding: ${data.encoding}`,
      "unknown",
      500,
    );
  }
  return {
    content: decodeBase64(data.content),
    sha: data.sha,
    path: data.path,
  };
}

export type WriteFileInput = {
  path: string;
  content: string;
  sha: string;
  message: string;
};

export type WriteFileResult = {
  sha: string;
  commitUrl?: string;
};

/**
 * Write a file via the GitHub Contents API. The caller MUST pass the sha
 * from the most recent read of this file; if it doesn't match GitHub's
 * current sha the request is rejected (409). That race-condition guard
 * keeps two admin sessions from silently overwriting each other.
 */
export async function writeFile(
  input: WriteFileInput,
): Promise<WriteFileResult> {
  const env = readAdminEnv();
  const res = await fetch(buildContentsUrl(env, input.path), {
    method: "PUT",
    headers: {
      ...authHeaders(env),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: input.message,
      content: encodeBase64(input.content),
      sha: input.sha,
      branch: env.branch,
    }),
  });

  if (res.status === 409 || res.status === 422) {
    throw new GitHubAdminError(
      "Conflict: file changed since last read. Refresh and try again.",
      "conflict",
      409,
    );
  }
  if (res.status === 401 || res.status === 403) {
    // 403 may also be rate limit — surface a hint when applicable.
    const rateRemaining = res.headers.get("x-ratelimit-remaining");
    if (rateRemaining === "0") {
      throw new GitHubAdminError(
        "GitHub rate limit exceeded. Try again later.",
        "rate-limit",
        429,
      );
    }
    throw new GitHubAdminError(
      "GitHub token rejected. Check GITHUB_TOKEN write permissions.",
      "auth",
      res.status,
    );
  }
  if (!res.ok) {
    throw new GitHubAdminError(
      `GitHub write failed (${res.status})`,
      "unknown",
      res.status,
    );
  }
  const data = (await res.json()) as {
    content: { sha: string };
    commit: { html_url: string };
  };
  return { sha: data.content.sha, commitUrl: data.commit?.html_url };
}
