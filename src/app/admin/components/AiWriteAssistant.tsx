"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { useToast } from "./Toast";

/**
 * AiWriteAssistant — slide-down panel with a sparkle header, an
 * instruction textarea, and a "Herschrijf" button. On success the
 * parent receives the new text via `onResult`. The parent decides
 * what to do with it (typically: replace draft + flash green).
 *
 * Visual: lives ABOVE the regular text input while editing. The
 * panel itself is an unobtrusive amber/violet card so the user
 * always knows AI is active.
 */

type Props = {
  open: boolean;
  fieldLabel: string;
  /** Current value of the field — sent to the model as starting point. */
  currentValue: string;
  /** Optional word limit, surfaced in the prompt and as a hint. */
  maxWords?: number | null;
  /** Called when the model returns text. Parent applies it. */
  onResult: (text: string) => void;
  /** Close the panel without applying anything. */
  onClose: () => void;
};

type ApiResponse =
  | { ok: true; text: string; model: string }
  | { ok: false; error: string; code?: string };

const PLACEHOLDER_EXAMPLES = [
  "Maak het korter en pakkender.",
  "Schrijf in de jij-vorm, warmer en uitnodigender.",
  "Voeg een subtiele call-to-action toe richting offerte.",
  "Maak het zakelijker, minder informeel.",
].join("\n");

export function AiWriteAssistant({
  open,
  fieldLabel,
  currentValue,
  maxWords,
  onResult,
  onClose,
}: Props) {
  const toast = useToast();
  const [instruction, setInstruction] = useState("");
  const [busy, setBusy] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Reset instruction when the panel opens fresh.
  useEffect(() => {
    if (open) {
      setInstruction("");
      setBusy(false);
      queueMicrotask(() => textareaRef.current?.focus());
    }
  }, [open]);

  const submit = useCallback(async () => {
    const trimmed = instruction.trim();
    if (!trimmed) {
      toast.warning("Geef een korte instructie, bijvoorbeeld: maak het korter.");
      textareaRef.current?.focus();
      return;
    }
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/ai-write", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentValue,
          instruction: trimmed,
          fieldLabel,
          maxWords: maxWords ?? null,
        }),
      });
      const data = (await res.json()) as ApiResponse;
      if (!data.ok) {
        toast.error(`AI mislukt: ${data.error}`);
        return;
      }
      if (!data.text || !data.text.trim()) {
        toast.error("AI gaf geen bruikbare tekst terug.");
        return;
      }
      onResult(data.text);
      toast.success("AI-tekst geplaatst. Bekijk en sla op.");
    } catch (e) {
      toast.error(
        `Netwerkfout: ${e instanceof Error ? e.message : "onbekend"}`,
      );
    } finally {
      setBusy(false);
    }
  }, [instruction, busy, currentValue, fieldLabel, maxWords, onResult, toast]);

  const onKey = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (!busy) onClose();
        return;
      }
      const isCmdEnter = (e.metaKey || e.ctrlKey) && e.key === "Enter";
      if (isCmdEnter) {
        e.preventDefault();
        void submit();
      }
    },
    [busy, onClose, submit],
  );

  if (!open) return null;

  return (
    <div className="em-ai-write-panel" role="region" aria-label={`AI Schrijfassistent voor ${fieldLabel}`}>
      <div className="em-ai-write-header">
        <span className="em-ai-write-icon" aria-hidden>
          ✨
        </span>
        <div className="em-ai-write-titles">
          <strong className="em-ai-write-title">AI Schrijfassistent</strong>
          <span className="em-ai-write-sub">
            Geef een korte instructie. Claude herschrijft in de stijl van de site.
            {typeof maxWords === "number" ? ` Max ${maxWords} woorden.` : ""}
          </span>
        </div>
        <button
          type="button"
          className="em-ai-write-close"
          onClick={onClose}
          disabled={busy}
          aria-label="Sluit AI-paneel"
          title="Sluit (Esc)"
        >
          ✕
        </button>
      </div>
      <textarea
        ref={textareaRef}
        className="em-input em-textarea em-ai-write-input"
        value={instruction}
        onChange={(e) => setInstruction(e.target.value)}
        onKeyDown={onKey}
        placeholder={PLACEHOLDER_EXAMPLES}
        rows={3}
        disabled={busy}
      />
      <div className="em-ai-write-actions">
        <span className="em-ai-write-hint">
          {busy ? "Claude schrijft…" : "⌘ + Enter om te herschrijven"}
        </span>
        <button
          type="button"
          className={`em-btn em-btn-accent${busy ? " em-btn-loading" : ""}`}
          onClick={() => void submit()}
          disabled={busy || !instruction.trim()}
        >
          {busy ? "Aan het schrijven…" : "Herschrijf"}
        </button>
      </div>
    </div>
  );
}
