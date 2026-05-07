import { NextResponse } from "next/server";
import { ADMIN_PAGES, type ContentField, type ContentSection } from "@/lib/admin-content-schema";
import { GitHubAdminError, readFile } from "@/lib/admin-github";
import { readField, type FileType } from "@/lib/admin-file-parsers";
import { fullFieldPath } from "@/lib/admin-content-schema";
import { getAtPath } from "@/lib/admin-path";

/**
 * POST /api/admin/ai
 *
 * Body:
 *   { request: string }
 *
 * Returns:
 *   { ok: true, changes: ChangeProposal[], clarification?: string, model: string }
 *
 * Approach:
 *   1. Load every content file referenced by the schema (one fetch per
 *      unique file, in parallel).
 *   2. Build a flat list of editable fields with their current values.
 *   3. Send the user's request + that list to Claude with a strict
 *      system prompt.
 *   4. Parse Claude's JSON response into typed change proposals.
 *
 * Safety: this endpoint NEVER applies changes. It only proposes them.
 * The client renders the diff and the user approves field by field.
 */

export type ChangeProposal = {
  file: string;
  fileType: FileType;
  exportName?: string;
  path: string;
  oldValue: string;
  newValue: string;
  reason: string;
};

const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";
const DEFAULT_MODEL = "claude-sonnet-4-5";

const SYSTEM_PROMPT = `Je bent een content manager assistent voor de website Sloepenspel Amsterdam (sloepenspel.nl).
Je krijgt een verzoek van de site-eigenaar en een lijst van alle bewerkbare velden op de site, met hun huidige waarden.

Jouw taak: bepaal welke velden moeten worden aangepast om het verzoek door te voeren, en stel concrete nieuwe teksten voor in de stijl van de bestaande content.

Schrijfstijl-regels (kritiek):
- Positief, warm, zelfverzekerd, kort, ritmisch
- GEEN em-dashes (—); gebruik komma's of punten
- Actief, aanspreking jullie/je
- Nederlands met karakter
- Italic-accenten respecteren waar het schema dat aangeeft

Output: ALLEEN een geldig JSON object, niets anders. Geen markdown code-fences.

JSON formaat:
{
  "changes": [
    {
      "file": "content/pages/index.ts",
      "fileType": "ts-object",
      "exportName": "homePage",
      "path": "hero.headline",
      "oldValue": "huidige tekst exact zoals deze nu staat",
      "newValue": "voorgestelde nieuwe tekst",
      "reason": "korte uitleg in 1 zin waarom je dit veld aanpast"
    }
  ],
  "clarification": "optioneel — alleen invullen als het verzoek niet uit te voeren is met de huidige velden, of als er belangrijke aannames zijn"
}

Belangrijke regels:
- Wijzig alleen velden die het verzoek expliciet vraagt. Verzin geen extra wijzigingen.
- Gebruik EXACT het bestand, fileType, exportName en path zoals in de invoerlijst staat.
- "oldValue" moet letterlijk de huidige waarde zijn uit de invoerlijst.
- Houd je aan woordlimieten (maxWords) per veld.
- Als een verzoek onduidelijk of onmogelijk is met de huidige velden: lege "changes" array + zinvolle "clarification".
- Geef NOOIT meer dan 10 changes terug.`;

type ContentSnapshotEntry = {
  page: string;
  section: string;
  file: string;
  fileType: FileType;
  exportName?: string;
  path: string;
  label: string;
  fieldType: string;
  maxWords?: number;
  currentValue: string;
  helpText?: string;
};

type RequestBody = { request?: unknown };

type AnthropicResponse = {
  content?: Array<{ type: string; text?: string }>;
  error?: { type: string; message: string };
};

type AiPayload = {
  changes?: ChangeProposal[];
  clarification?: string;
};

function valueAsDisplayString(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return JSON.stringify(v);
}

/**
 * Load every unique file referenced by the schema, then walk each section
 * and emit a flat list of (page, section, field) entries with current
 * values resolved.
 */
async function buildContentSnapshot(): Promise<ContentSnapshotEntry[]> {
  // Collect unique source files.
  const fileSet = new Set<string>();
  const sources: Array<{
    file: string;
    fileType: FileType;
    exportName?: string;
  }> = [];
  for (const page of ADMIN_PAGES) {
    for (const section of page.sections) {
      const key = `${section.source.file}|${section.source.exportName ?? ""}`;
      if (fileSet.has(key)) continue;
      fileSet.add(key);
      sources.push({
        file: section.source.file,
        fileType: section.source.fileType,
        exportName: section.source.exportName,
      });
    }
  }

  // Fetch in parallel.
  const fileEntries = await Promise.all(
    sources.map(async (s) => {
      try {
        const content = await readFile(s.file);
        return { ...s, content: content.content };
      } catch (e) {
        if (e instanceof GitHubAdminError && e.code === "not-found") {
          return { ...s, content: null as string | null };
        }
        throw e;
      }
    }),
  );
  const fileMap = new Map(
    fileEntries.map((f) => [`${f.file}|${f.exportName ?? ""}`, f]),
  );

  // Walk the schema producing entries for every editable field.
  const entries: ContentSnapshotEntry[] = [];
  for (const page of ADMIN_PAGES) {
    for (const section of page.sections) {
      const key = `${section.source.file}|${section.source.exportName ?? ""}`;
      const fileInfo = fileMap.get(key);
      if (!fileInfo || !fileInfo.content) continue;

      // Parse the section's anchor value once per section.
      const anchorRead = readField(
        section.source.fileType,
        fileInfo.content,
        {
          file: section.source.file,
          exportName: section.source.exportName,
          path: section.source.anchor,
        },
      );
      if (!anchorRead.ok) continue;

      if (section.isArray && Array.isArray(anchorRead.value)) {
        anchorRead.value.forEach((item, idx) =>
          appendFields(entries, page.label, section, item, fileInfo, idx),
        );
      } else {
        appendFields(entries, page.label, section, anchorRead.value, fileInfo);
      }
    }
  }
  return entries;
}

function appendFields(
  out: ContentSnapshotEntry[],
  pageLabel: string,
  section: ContentSection,
  data: unknown,
  fileInfo: { file: string; fileType: FileType; exportName?: string },
  arrayIndex?: number,
): void {
  const isArrayItem = typeof arrayIndex === "number";
  const sectionLabel =
    isArrayItem
      ? `${section.label} #${(arrayIndex as number) + 1}`
      : section.label;

  for (const field of section.fields) {
    // Skip image fields from AI text snapshot — handled separately.
    if (field.type === "image") continue;
    const raw = getAtPath(data, field.key);
    const valueStr = valueAsDisplayString(raw);

    let pathForFile: string;
    if (isArrayItem) {
      const baseAnchor = section.source.anchor;
      const indexPart = `[${arrayIndex as number}]`;
      const arrayPath = baseAnchor ? `${baseAnchor}${indexPart}` : indexPart;
      pathForFile = fullFieldPath(arrayPath, field.key);
    } else {
      pathForFile = fullFieldPath(section.source.anchor, field.key);
    }

    out.push({
      page: pageLabel,
      section: sectionLabel,
      file: fileInfo.file,
      fileType: fileInfo.fileType,
      exportName: fileInfo.exportName,
      path: pathForFile,
      label: field.label,
      fieldType: field.type,
      maxWords: field.maxWords,
      currentValue: valueStr,
      helpText: field.helpText,
    });
  }
}

function tryParseJson(text: string): AiPayload | null {
  // Strip leading/trailing whitespace and possible markdown fencing.
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n/u, "").replace(/```$/u, "");
    cleaned = cleaned.trim();
  }
  try {
    return JSON.parse(cleaned) as AiPayload;
  } catch {
    return null;
  }
}

function isProposal(c: unknown): c is ChangeProposal {
  if (!c || typeof c !== "object") return false;
  const r = c as Record<string, unknown>;
  return (
    typeof r.file === "string" &&
    typeof r.fileType === "string" &&
    typeof r.path === "string" &&
    typeof r.oldValue === "string" &&
    typeof r.newValue === "string" &&
    typeof r.reason === "string"
  );
}

export async function POST(request: Request): Promise<NextResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "ANTHROPIC_API_KEY niet geconfigureerd. Voeg een sk-ant-… key toe in Netlify env vars en .env.local.",
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

  const userRequest =
    typeof body.request === "string" ? body.request.trim() : "";
  if (!userRequest) {
    return NextResponse.json(
      { ok: false, error: "request is required" },
      { status: 400 },
    );
  }
  if (userRequest.length < 4) {
    return NextResponse.json(
      { ok: false, error: "request te kort om iets zinvols te doen" },
      { status: 400 },
    );
  }

  let snapshot: ContentSnapshotEntry[];
  try {
    snapshot = await buildContentSnapshot();
  } catch (e) {
    if (e instanceof GitHubAdminError) {
      return NextResponse.json(
        { ok: false, error: e.message, code: e.code },
        { status: e.status },
      );
    }
    return NextResponse.json(
      {
        ok: false,
        error: e instanceof Error ? e.message : "snapshot error",
      },
      { status: 500 },
    );
  }

  const userMessage = `KLANTVERZOEK:
${userRequest}

BEWERKBARE VELDEN (huidige waarden + metadata):
${JSON.stringify(snapshot, null, 2)}

Geef je antwoord als JSON object met "changes" (array) en optioneel "clarification" (string).`;

  const model = process.env.ANTHROPIC_MODEL ?? DEFAULT_MODEL;

  let aiRes: Response;
  try {
    aiRes = await fetch(ANTHROPIC_API, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        max_tokens: 4000,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      }),
    });
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        error: `Network error contacting Anthropic: ${e instanceof Error ? e.message : "unknown"}`,
        code: "network",
      },
      { status: 502 },
    );
  }

  if (!aiRes.ok) {
    let detail = `Anthropic responded ${aiRes.status}`;
    try {
      const err = (await aiRes.json()) as AnthropicResponse;
      if (err.error?.message) detail = err.error.message;
    } catch {
      /* ignore */
    }
    return NextResponse.json(
      { ok: false, error: detail, code: "anthropic" },
      { status: 502 },
    );
  }

  const data = (await aiRes.json()) as AnthropicResponse;
  const text =
    data.content?.find((c) => c.type === "text")?.text ?? "";
  const parsed = tryParseJson(text);
  if (!parsed) {
    return NextResponse.json(
      {
        ok: false,
        error: "AI antwoord was niet geldig JSON.",
        rawPreview: text.slice(0, 400),
      },
      { status: 502 },
    );
  }

  const changes = (parsed.changes ?? [])
    .filter(isProposal)
    .slice(0, 10);

  return NextResponse.json({
    ok: true,
    model,
    changes,
    clarification: parsed.clarification,
    snapshotCount: snapshot.length,
  });
}

export const maxDuration = 60;
