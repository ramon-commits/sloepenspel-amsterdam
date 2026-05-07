"use client";

import { useCallback, useState, type FormEvent } from "react";
import type { FileType } from "@/lib/admin-file-parsers";
import { useToast } from "./Toast";
import { useConfirm } from "./ConfirmDialog";

/**
 * The AI Change Request killer feature.
 *
 *   1. User types/pastes a klantverzoek into the textarea.
 *   2. We POST it to /api/admin/ai which returns a list of proposed
 *      field changes (file, path, oldValue, newValue, reason).
 *   3. We render each proposal as a diff card with a checkbox.
 *   4. On approve we apply each checked change via /api/admin/field —
 *      one commit per change, in sequence.
 *
 * Anything destructive remains gated behind a confirm dialog.
 */

type ChangeProposal = {
  file: string;
  fileType: FileType;
  exportName?: string;
  path: string;
  oldValue: string;
  newValue: string;
  reason: string;
};

type AiResponse =
  | {
      ok: true;
      model: string;
      changes: ChangeProposal[];
      clarification?: string;
      snapshotCount: number;
    }
  | { ok: false; error: string; code?: string };

type BatchResponse =
  | {
      ok: true;
      sha?: string;
      commitUrl?: string;
      filesCommitted?: string[];
      unchanged?: boolean;
      skipped?: string[];
    }
  | { ok: false; error: string; code?: string };

type Phase =
  | { kind: "idle" }
  | { kind: "loading" }
  | {
      kind: "preview";
      changes: ChangeProposal[];
      checked: boolean[];
      clarification?: string;
      model: string;
    }
  | { kind: "applying"; checked: boolean[] }
  | { kind: "error"; error: string };

const SUGGESTIONS: Array<{ label: string; template: string }> = [
  {
    label: "Wijzig hero tekst",
    template: "Verander de hero headline van de homepage naar: ",
  },
  {
    label: "Voeg review toe",
    template: "Voeg een nieuwe review toe van … (naam, bedrijf, quote)",
  },
  { label: "Nieuwe FAQ", template: "Voeg een FAQ-vraag toe: " },
  { label: "Update prijs", template: "Werk de prijs bij naar: " },
  {
    label: "Korter maken",
    template: "Maak de hero subheadline iets korter en informeler.",
  },
];

export function AiChangePanel({ onAfterApply }: { onAfterApply?: () => void }) {
  const toast = useToast();
  const confirm = useConfirm();
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });

  const reset = () => setPhase({ kind: "idle" });

  const analyse = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const request = input.trim();
      if (request.length < 4) {
        toast.warning("Geef wat meer detail in het verzoek.");
        return;
      }
      setPhase({ kind: "loading" });
      try {
        const res = await fetch("/api/admin/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ request }),
        });
        const data = (await res.json()) as AiResponse;
        if (!data.ok) {
          setPhase({ kind: "error", error: data.error });
          return;
        }
        if (data.changes.length === 0) {
          setPhase({
            kind: "preview",
            changes: [],
            checked: [],
            clarification:
              data.clarification ??
              "AI vond geen wijzigingen. Probeer specifieker te zijn.",
            model: data.model,
          });
          return;
        }
        setPhase({
          kind: "preview",
          changes: data.changes,
          checked: data.changes.map(() => true),
          clarification: data.clarification,
          model: data.model,
        });
      } catch (err) {
        setPhase({
          kind: "error",
          error: err instanceof Error ? err.message : "Onbekende fout",
        });
      }
    },
    [input, toast],
  );

  const apply = useCallback(async () => {
    if (phase.kind !== "preview") return;
    const toApply = phase.changes.filter((_, i) => phase.checked[i]);
    if (toApply.length === 0) {
      toast.warning("Vink minstens één wijziging aan om toe te passen.");
      return;
    }
    const ok = await confirm({
      title: `Pas ${toApply.length} wijziging${toApply.length === 1 ? "" : "en"} toe?`,
      description:
        "Alle wijzigingen worden als één commit naar GitHub gepusht. Netlify rebuildt automatisch en de site staat binnen 1-2 minuten bijgewerkt live.",
      confirmLabel: "Ja, doorvoeren",
      cancelLabel: "Annuleer",
    });
    if (!ok) return;

    setPhase({ kind: "applying", checked: phase.checked });

    // Batch all approved changes into one commit. Even when they touch
    // multiple files (reviews.json + pages/index.ts + …) the git-data
    // backend pushes a single atomic commit → one Netlify rebuild.
    const summary = toApply.length === 1
      ? toApply[0].reason
      : `${toApply.length} wijzigingen via AI assistent`;
    const message = `admin: ${summary}`.slice(0, 200);

    try {
      const res = await fetch("/api/admin/batch", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          changes: toApply.map((c) => ({
            file: c.file,
            fileType: c.fileType,
            exportName: c.exportName,
            path: c.path,
            value: c.newValue,
          })),
          message,
        }),
      });
      const data = (await res.json()) as BatchResponse;
      if (!data.ok) {
        toast.error(`Doorvoeren mislukt: ${data.error}`);
        // Restore preview phase so the user can adjust and retry.
        setPhase({
          kind: "preview",
          changes: phase.changes,
          checked: phase.checked,
          model: "(retry)",
        });
        return;
      }
      if (data.unchanged) {
        toast.info("Geen verandering nodig — content was al up-to-date.");
      } else {
        toast.success(
          `✓ ${toApply.length} wijziging${toApply.length === 1 ? "" : "en"} in 1 commit doorgevoerd.`,
        );
      }
      setInput("");
      setPhase({ kind: "idle" });
      onAfterApply?.();
    } catch (e) {
      toast.error(
        `Netwerkfout: ${e instanceof Error ? e.message : "onbekend"}`,
      );
      setPhase({
        kind: "preview",
        changes: phase.changes,
        checked: phase.checked,
        model: "(retry)",
      });
    }
  }, [phase, confirm, toast, onAfterApply]);

  return (
    <form className="em-ai-card" onSubmit={analyse}>
      <h2>
        <span aria-hidden>✨</span> AI Assistent
      </h2>
      <p>
        Plak een klantverzoek of beschrijf wat je wilt aanpassen. De
        AI zoekt de juiste velden, toont een preview en jij keurt af of goed.
      </p>
      <textarea
        className="em-input em-textarea em-ai-textarea"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Bijv: 'Maak de hero subheadline iets korter en informeler.'"
        rows={3}
        disabled={phase.kind === "loading" || phase.kind === "applying"}
      />
      <div className="em-suggestion-row">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.label}
            type="button"
            className="em-chip"
            onClick={() => setInput(s.template)}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        {phase.kind === "preview" && (
          <button
            type="button"
            className="em-btn em-btn-secondary"
            onClick={reset}
          >
            Verwerp
          </button>
        )}
        <button
          type="submit"
          className={`em-btn em-btn-primary${phase.kind === "loading" ? " em-btn-loading" : ""}`}
          disabled={!input.trim() || phase.kind === "loading" || phase.kind === "applying"}
        >
          {phase.kind === "loading" ? "Analyseren…" : "Analyseer →"}
        </button>
      </div>

      {phase.kind === "error" && (
        <div className="em-ai-error" role="alert">
          {phase.error}
        </div>
      )}

      {phase.kind === "preview" && (
        <div className="em-ai-preview">
          <div className="em-ai-preview-header">
            <strong>
              AI Analyse — {phase.changes.length} wijziging
              {phase.changes.length === 1 ? "" : "en"} gevonden
            </strong>
            <span className="em-ai-model">{phase.model}</span>
          </div>
          {phase.clarification && (
            <div className="em-ai-clarification">{phase.clarification}</div>
          )}
          {phase.changes.map((change, idx) => (
            <ChangeCard
              key={`${change.file}|${change.path}|${idx}`}
              change={change}
              checked={phase.checked[idx]}
              onToggle={() => {
                const next = [...phase.checked];
                next[idx] = !next[idx];
                setPhase({ ...phase, checked: next });
              }}
            />
          ))}
          {phase.changes.length > 0 && (
            <div className="em-modal-actions" style={{ marginTop: 16 }}>
              <button
                type="button"
                className="em-btn em-btn-primary"
                onClick={() => void apply()}
              >
                ✓ Pas geselecteerde wijzigingen toe
              </button>
            </div>
          )}
        </div>
      )}

      {phase.kind === "applying" && (
        <div className="em-ai-applying">
          <div className="em-ai-spinner" aria-hidden />
          Wijzigingen worden doorgevoerd via GitHub-commits…
        </div>
      )}
    </form>
  );
}

function ChangeCard({
  change,
  checked,
  onToggle,
}: {
  change: ChangeProposal;
  checked: boolean;
  onToggle: () => void;
}) {
  const isNew = !change.oldValue;
  return (
    <div className={`em-ai-change${checked ? "" : " is-unchecked"}`}>
      <label className="em-ai-change-head">
        <input type="checkbox" checked={checked} onChange={onToggle} />
        <div>
          <div className="em-ai-change-path">
            <code>{change.file}</code>
            <span className="em-ai-change-sep">·</span>
            <code>{change.path}</code>
          </div>
          <div className="em-ai-change-reason">{change.reason}</div>
        </div>
      </label>
      <div className="em-ai-diff">
        {isNew ? (
          <div className="em-ai-diff-row em-ai-diff-new">
            <span className="em-ai-diff-tag">Nieuw</span>
            <span className="em-ai-diff-text">{change.newValue}</span>
          </div>
        ) : (
          <>
            <div className="em-ai-diff-row em-ai-diff-old">
              <span className="em-ai-diff-tag">Oud</span>
              <span className="em-ai-diff-text">{change.oldValue}</span>
            </div>
            <div className="em-ai-diff-row em-ai-diff-new">
              <span className="em-ai-diff-tag">Nieuw</span>
              <span className="em-ai-diff-text">{change.newValue}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
