import { NextResponse } from "next/server";

/**
 * POST /api/admin/kie
 *
 * Generate or edit an image via the kie.ai (nano-banana-2) API. The key
 * lives only on the server — the client never sees it.
 *
 * Body (JSON):
 *   {
 *     prompt: string;          // required
 *     aspectRatio?: string;    // "16:9" (default) | "1:1" | "4:5" | …
 *     imageBase64?: string;    // optional reference for "edit" mode
 *     imageMime?: string;      // mime type of the reference, default png
 *   }
 *
 * Response (success):
 *   { ok: true, imageBase64: string, mime: string, jobId: string }
 *
 * The client receives the result as base64; if the user accepts, the same
 * client-side code that handles uploads can POST it to /api/admin/upload
 * (already optimised) and update the field reference.
 */

const KIE_BASE = "https://api.kie.ai/api/v1/jobs";
const POLL_INTERVAL_MS = 3000;
const POLL_MAX_MS = 120_000; // 2 min

type CreateTaskBody = {
  prompt: string;
  model: "nano-banana-2";
  resolution: "2K";
  output_format: "png";
  aspect_ratio: string;
  image_input?: Array<{ type: "base64"; data: string }>;
};

type CreateTaskResponse = {
  data?: { jobId?: string };
  jobId?: string;
  message?: string;
};

type JobStatusResponse = {
  data?: {
    status?: string;
    output?: Array<{ url?: string }>;
    outputs?: Array<{ url?: string }>;
    imageUrl?: string;
    error?: string;
    message?: string;
  };
  status?: string;
  output?: Array<{ url?: string }>;
  outputs?: Array<{ url?: string }>;
  imageUrl?: string;
  error?: string;
  message?: string;
};

type RequestBody = {
  prompt?: unknown;
  aspectRatio?: unknown;
  imageBase64?: unknown;
  imageMime?: unknown;
};

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

function pickJobId(data: CreateTaskResponse): string | undefined {
  return data.data?.jobId ?? data.jobId;
}

function pickResultUrl(data: JobStatusResponse): string | undefined {
  const root = data.data ?? data;
  if (root.output && root.output.length > 0) return root.output[0]?.url;
  if (root.outputs && root.outputs.length > 0) return root.outputs[0]?.url;
  return root.imageUrl;
}

function readStatus(data: JobStatusResponse): string | undefined {
  return data.data?.status ?? data.status;
}

export async function POST(request: Request): Promise<NextResponse> {
  const apiKey = process.env.KIE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        ok: false,
        error: "KIE_API_KEY not configured",
        code: "config",
      },
      { status: 503 },
    );
  }

  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  const aspectRatio =
    typeof body.aspectRatio === "string" ? body.aspectRatio : "16:9";
  const referenceB64 =
    typeof body.imageBase64 === "string" ? body.imageBase64 : undefined;

  if (!prompt) {
    return NextResponse.json(
      { ok: false, error: "Prompt is required" },
      { status: 400 },
    );
  }
  if (prompt.length < 12) {
    return NextResponse.json(
      {
        ok: false,
        error: "Prompt is te kort — geef meer detail (min. 12 tekens).",
      },
      { status: 400 },
    );
  }

  const taskBody: CreateTaskBody = {
    prompt,
    model: "nano-banana-2",
    resolution: "2K",
    output_format: "png",
    aspect_ratio: aspectRatio,
  };
  if (referenceB64) {
    taskBody.image_input = [{ type: "base64", data: referenceB64 }];
  }

  // 1. Create the task
  let createRes: Response;
  try {
    createRes = await fetch(`${KIE_BASE}/createTask`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskBody),
    });
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        error: `Network error contacting kie.ai: ${e instanceof Error ? e.message : "unknown"}`,
        code: "network",
      },
      { status: 502 },
    );
  }

  if (!createRes.ok) {
    let detail = `kie.ai responded ${createRes.status}`;
    try {
      const j = (await createRes.json()) as CreateTaskResponse;
      if (j.message) detail = j.message;
    } catch {
      /* ignore */
    }
    return NextResponse.json(
      { ok: false, error: detail, code: "kie" },
      { status: 502 },
    );
  }

  const createJson = (await createRes.json()) as CreateTaskResponse;
  const jobId = pickJobId(createJson);
  if (!jobId) {
    return NextResponse.json(
      {
        ok: false,
        error: createJson.message ?? "kie.ai did not return a jobId",
        code: "kie",
      },
      { status: 502 },
    );
  }

  // 2. Poll until success/fail/timeout
  const deadline = Date.now() + POLL_MAX_MS;
  let resultUrl: string | undefined;
  let lastStatus = "pending";
  while (Date.now() < deadline) {
    await sleep(POLL_INTERVAL_MS);
    let pollRes: Response;
    try {
      pollRes = await fetch(
        `${KIE_BASE}/getJobDetail?jobId=${encodeURIComponent(jobId)}`,
        { headers: { Authorization: `Bearer ${apiKey}` } },
      );
    } catch {
      continue; // transient — try again
    }
    if (!pollRes.ok) continue;
    const pollJson = (await pollRes.json()) as JobStatusResponse;
    lastStatus = readStatus(pollJson) ?? lastStatus;

    if (lastStatus === "success" || lastStatus === "completed") {
      resultUrl = pickResultUrl(pollJson);
      break;
    }
    if (lastStatus === "failed" || lastStatus === "error") {
      const root = pollJson.data ?? pollJson;
      return NextResponse.json(
        {
          ok: false,
          error: root.error ?? root.message ?? "kie.ai generation failed",
          code: "kie",
          jobId,
        },
        { status: 502 },
      );
    }
  }
  if (!resultUrl) {
    return NextResponse.json(
      {
        ok: false,
        error: "Generatie duurde te lang — probeer opnieuw met een kortere prompt.",
        code: "timeout",
        jobId,
      },
      { status: 504 },
    );
  }

  // 3. Download the result and return as base64 to the client.
  let downloadRes: Response;
  try {
    downloadRes = await fetch(resultUrl, { cache: "no-store" });
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        error: `Download mislukt: ${e instanceof Error ? e.message : "unknown"}`,
        code: "download",
      },
      { status: 502 },
    );
  }
  if (!downloadRes.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: `Download mislukt (${downloadRes.status})`,
        code: "download",
      },
      { status: 502 },
    );
  }
  const buf = Buffer.from(await downloadRes.arrayBuffer());
  const mime = downloadRes.headers.get("content-type") ?? "image/png";
  return NextResponse.json({
    ok: true,
    imageBase64: buf.toString("base64"),
    mime,
    jobId,
    bytes: buf.byteLength,
  });
}

// Long-running poll — bump the route timeout headroom on Node runtime.
export const maxDuration = 130;
