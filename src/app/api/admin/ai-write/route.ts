import { NextResponse } from "next/server";

/**
 * POST /api/admin/ai-write
 *
 * Single-field copywriting helper. The user types a draft or an
 * instruction; Claude rewrites the value matching the site's voice.
 * The endpoint never writes to GitHub — it only returns the
 * suggested text. The user reviews it inline and the regular
 * save-confirm flow picks it up from there.
 *
 * Body:
 *   {
 *     currentValue: string,
 *     instruction:  string,
 *     fieldLabel:   string,
 *     maxWords:     number | null,
 *     siteContext:  string,
 *   }
 *
 * Response (success):
 *   { ok: true, text: string, model: string }
 *
 * Response (error):
 *   { ok: false, error: string, code?: string }
 */

const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";
const DEFAULT_MODEL = "claude-sonnet-4-5";

const DEFAULT_SITE_CONTEXT = `Sloepenspel Amsterdam — interactief teambuilding bedrijfsuitje op sloepen door de Amsterdamse grachten. Schrijfstijl: positief, warm, zelfverzekerd, kort, ritmisch. Geen em-dashes, gebruik komma's of punten. Nederlands, informeel maar professioneel.`;

function buildSystemPrompt(siteContext: string): string {
  return `Je bent een copywriter voor de website Sloepenspel Amsterdam.

CONTEXT VAN DE SITE:
${siteContext}

WERKWIJZE:
- Je krijgt één tekstveld met de huidige waarde en een instructie van de redacteur.
- Lever ALLEEN de nieuwe tekst op. Geen uitleg, geen aanhalingstekens, geen markdown, geen voorvoegsels zoals "Hier is de nieuwe tekst:".
- Respecteer de woordlimiet (als gegeven). Tel woorden zorgvuldig.
- Houd je strikt aan de schrijfstijl van de site: geen em-dashes (—), gebruik komma's of punten.
- Geen onnodig gebruik van Engelse leenwoorden tenzij ze al in de huidige tekst staan.
- Output is direct bruikbaar als veldwaarde.`;
}

type RequestBody = {
  currentValue?: unknown;
  instruction?: unknown;
  fieldLabel?: unknown;
  maxWords?: unknown;
  siteContext?: unknown;
};

type AnthropicResponse = {
  content?: Array<{ type: string; text?: string }>;
  error?: { type: string; message: string };
};

function cleanText(s: string): string {
  // Strip leading/trailing whitespace, surrounding quotes, and a
  // possible "Hier is de tekst:" preamble that the model sometimes
  // produces despite instructions.
  let v = s.trim();
  v = v.replace(/^(?:Hier(?:bij)?\s*(?:is|komt)?\s*(?:de|je)\s*nieuwe?\s*tekst[:.]?\s*)/iu, "");
  v = v.replace(/^["“]([\s\S]*)["”]$/u, "$1");
  return v.trim();
}

export async function POST(request: Request): Promise<NextResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "ANTHROPIC_API_KEY niet geconfigureerd. Voeg een sk-ant-… key toe in .env.local en Netlify env vars.",
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

  const currentValue =
    typeof body.currentValue === "string" ? body.currentValue : "";
  const instruction =
    typeof body.instruction === "string" ? body.instruction.trim() : "";
  const fieldLabel =
    typeof body.fieldLabel === "string" ? body.fieldLabel.trim() : "Tekst";
  const maxWords =
    typeof body.maxWords === "number" && Number.isFinite(body.maxWords)
      ? body.maxWords
      : null;
  const siteContext =
    typeof body.siteContext === "string" && body.siteContext.trim()
      ? body.siteContext.trim()
      : DEFAULT_SITE_CONTEXT;

  if (!instruction) {
    return NextResponse.json(
      { ok: false, error: "instruction is required" },
      { status: 400 },
    );
  }

  const userMessage = `VELD: ${fieldLabel}
${maxWords ? `WOORDLIMIET: ${maxWords} woorden\n` : ""}
HUIDIGE WAARDE:
${currentValue || "(leeg)"}

INSTRUCTIE VAN DE REDACTEUR:
${instruction}

Geef nu alleen de nieuwe veldwaarde terug, niets anders.`;

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
        max_tokens: 600,
        system: buildSystemPrompt(siteContext),
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
  const text = (data.content?.find((c) => c.type === "text")?.text ?? "").trim();
  if (!text) {
    return NextResponse.json(
      { ok: false, error: "AI gaf geen bruikbare tekst terug." },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    text: cleanText(text),
    model,
  });
}

export const maxDuration = 30;
