import { NextResponse } from "next/server";
import sharp from "sharp";
import {
  GitHubAdminError,
  tryGetSha,
  writeFile,
} from "@/lib/admin-github";

/**
 * POST /api/admin/upload
 *
 * Body: multipart/form-data
 *   file       — the source image (any common format)
 *   targetPath — repo path to write to, e.g. "public/images/hero.webp"
 *                Must start with "public/images/". The .webp extension is
 *                enforced server-side; the path you pass is treated as the
 *                slug and the extension is rewritten.
 *   replace    — "1" to overwrite an existing file at that path
 *
 * Response: { ok, path, size, width, height, sha }
 *
 * Image processing:
 *   - Resize to max 1920px on long side (preserve aspect)
 *   - Convert to WebP with adaptive quality (target ≤ 300KB)
 *   - Strip metadata
 */

const MAX_DIMENSION = 1920;
const TARGET_BYTES = 300 * 1024;
const QUALITY_STEPS = [82, 76, 70, 64, 58];

type ProcessedImage = {
  buffer: Buffer;
  width: number;
  height: number;
  bytes: number;
  quality: number;
};

async function optimize(buffer: Buffer): Promise<ProcessedImage> {
  const meta = await sharp(buffer).metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  if (!width || !height) {
    throw new Error("Could not read image dimensions");
  }
  // Try descending quality steps until we land under target size, or
  // give up at the lowest one (still acceptable for the web).
  let last: ProcessedImage | null = null;
  for (const q of QUALITY_STEPS) {
    const out = await sharp(buffer)
      .rotate() // honour EXIF orientation before stripping it
      .resize({
        width: width > height ? Math.min(width, MAX_DIMENSION) : undefined,
        height: height >= width ? Math.min(height, MAX_DIMENSION) : undefined,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: q, effort: 4 })
      .toBuffer({ resolveWithObject: true });
    last = {
      buffer: out.data,
      width: out.info.width,
      height: out.info.height,
      bytes: out.info.size,
      quality: q,
    };
    if (last.bytes <= TARGET_BYTES) break;
  }
  if (!last) throw new Error("WebP encode failed");
  return last;
}

function ensureWebpPath(input: string): string {
  if (!input.startsWith("public/images/")) {
    throw new Error("targetPath must start with public/images/");
  }
  // Replace the extension with .webp regardless of what was provided.
  return input.replace(/\.[a-zA-Z0-9]+$/u, ".webp");
}

export async function POST(request: Request): Promise<NextResponse> {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid multipart body" },
      { status: 400 },
    );
  }

  const file = formData.get("file");
  const targetPathRaw = formData.get("targetPath");
  const replace = formData.get("replace") === "1";

  if (!(file instanceof Blob) || !targetPathRaw) {
    return NextResponse.json(
      { ok: false, error: "Body must include file and targetPath" },
      { status: 400 },
    );
  }
  let targetPath: string;
  try {
    targetPath = ensureWebpPath(String(targetPathRaw));
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 400 },
    );
  }

  const inputBytes = file.size;
  if (inputBytes > 30 * 1024 * 1024) {
    return NextResponse.json(
      { ok: false, error: "File too large (max 30MB)" },
      { status: 413 },
    );
  }

  let processed: ProcessedImage;
  try {
    const buf = Buffer.from(await file.arrayBuffer());
    processed = await optimize(buf);
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        error: e instanceof Error ? e.message : "Image processing failed",
        code: "image",
      },
      { status: 422 },
    );
  }

  try {
    const existingSha = replace ? await tryGetSha(targetPath) : null;

    const result = await writeFile({
      path: targetPath,
      content: processed.buffer,
      sha: existingSha ?? undefined,
      message: `admin: upload ${targetPath} (${processed.width}×${processed.height}, ${Math.round(processed.bytes / 1024)}KB)`,
    });

    return NextResponse.json({
      ok: true,
      path: targetPath,
      // Site-relative URL for direct use in content:
      publicUrl: targetPath.replace(/^public/u, ""),
      width: processed.width,
      height: processed.height,
      bytes: processed.bytes,
      quality: processed.quality,
      sha: result.sha,
      commitUrl: result.commitUrl,
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
