"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import type { ContentField, ContentSource } from "@/lib/admin-content-schema";
import { countWords } from "@/lib/admin-path";
import { useFieldSave } from "../hooks/useFieldSave";
import { useToast } from "./Toast";
import { useDirtyTracker } from "./UnsavedChanges";
import { useConfirmDiff } from "./ConfirmDiff";
import { AiWriteAssistant } from "./AiWriteAssistant";

type Props = {
  field: ContentField;
  /** Source file/anchor this field belongs to. */
  source: ContentSource;
  /** Full path inside the file: e.g. "hero.headline" or "items[2].title". */
  fullPath: string;
  /** Current value from the loaded section data (string-coerced when needed). */
  initialValue: string;
  /** Notify parent when a save commits — used to refresh section data. */
  onSaved?: (newValue: string) => void;
  /** Optional breadcrumb shown in the save-confirm modal, e.g. "Homepage › Hero". */
  contextPath?: string;
};

const SAVED_FLASH_MS = 2400;
const AI_FLASH_MS = 2200;

function isEmDashy(value: string): boolean {
  return /[—–]/.test(value);
}

export function TextFieldEditor({
  field,
  source,
  fullPath,
  initialValue,
  onSaved,
  contextPath,
}: Props) {
  const toast = useToast();
  const { save, status, reset } = useFieldSave();
  const confirmDiff = useConfirmDiff();

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initialValue);
  const [committedValue, setCommittedValue] = useState(initialValue);
  const [showSaved, setShowSaved] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiFlash, setAiFlash] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Keep local state in sync if the parent reloads with new data.
  useEffect(() => {
    setCommittedValue(initialValue);
    if (!editing) setDraft(initialValue);
  }, [initialValue, editing]);

  const wordCount = useMemo(() => countWords(draft), [draft]);
  const hasMaxWords = typeof field.maxWords === "number";
  const wordsOver = hasMaxWords && wordCount > (field.maxWords as number);
  const hasEmDash = isEmDashy(draft);
  const hasError = wordsOver || hasEmDash;
  const dirty = draft !== committedValue;
  const saving = status.status === "saving";

  // Register with the unsaved-changes provider so the global banner +
  // beforeunload guard fire when this editor has work in progress.
  useDirtyTracker(editing && dirty);

  const startEdit = useCallback(() => {
    if (editing) return;
    setEditing(true);
    setDraft(committedValue);
    reset();
    setShowSaved(false);
    queueMicrotask(() => {
      const el = textareaRef.current ?? inputRef.current;
      el?.focus();
      // Move cursor to end of value on first focus.
      if (el && "setSelectionRange" in el) {
        const len = el.value.length;
        el.setSelectionRange(len, len);
      }
    });
  }, [editing, committedValue, reset]);

  // Open the AI panel — also flips the field into edit mode so the
  // user immediately sees the textarea where the AI text will land.
  const startAi = useCallback(() => {
    if (!editing) {
      setEditing(true);
      setDraft(committedValue);
      reset();
      setShowSaved(false);
    }
    setAiOpen(true);
  }, [editing, committedValue, reset]);

  const cancelEdit = useCallback(() => {
    setEditing(false);
    setAiOpen(false);
    setDraft(committedValue);
    reset();
  }, [committedValue, reset]);

  // When the AI returns text, drop it straight into the draft, close
  // the panel, and flash the textarea green so the user sees AI did
  // something. The user can still edit before saving.
  const onAiResult = useCallback(
    (text: string) => {
      setDraft(text);
      setAiOpen(false);
      setAiFlash(true);
      queueMicrotask(() => {
        const el = textareaRef.current ?? inputRef.current;
        el?.focus();
        if (el && "setSelectionRange" in el) {
          const len = el.value.length;
          el.setSelectionRange(len, len);
        }
      });
      setTimeout(() => setAiFlash(false), AI_FLASH_MS);
    },
    [],
  );

  const commitSave = useCallback(async () => {
    if (saving) return;
    if (!dirty) {
      setEditing(false);
      return;
    }
    if (hasError) {
      if (wordsOver) {
        toast.warning(
          `${field.label}: ${wordCount}/${field.maxWords} woorden, maak het korter.`,
        );
      } else if (hasEmDash) {
        toast.warning(`${field.label}: gebruik een komma of punt, geen em-dash.`);
      }
      return;
    }

    // Always show a diff confirmation before committing to GitHub.
    // The user sees exactly what's about to land on the live site.
    const ok = await confirmDiff({
      fieldLabel: field.label,
      contextPath,
      oldValue: committedValue,
      newValue: draft,
    });
    if (!ok) return;

    const trimmed = draft;
    const result = await save({
      source,
      path: fullPath,
      value: trimmed,
      message: `admin: update ${field.label} (${source.file})`,
    });
    if (result.ok) {
      setCommittedValue(trimmed);
      setEditing(false);
      setAiOpen(false);
      setShowSaved(true);
      onSaved?.(trimmed);
      toast.success(`${field.label} opgeslagen.`);
      setTimeout(() => setShowSaved(false), SAVED_FLASH_MS);
    } else {
      const detail = result.error || "Onbekende fout";
      toast.error(`Opslaan mislukt: ${detail}`);
    }
  }, [
    saving,
    dirty,
    hasError,
    wordsOver,
    hasEmDash,
    draft,
    source,
    fullPath,
    field.label,
    field.maxWords,
    onSaved,
    save,
    toast,
    wordCount,
    committedValue,
    confirmDiff,
    contextPath,
  ]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (e.key === "Escape") {
        e.preventDefault();
        cancelEdit();
        return;
      }
      const isCmdEnter = (e.metaKey || e.ctrlKey) && e.key === "Enter";
      // For single-line inputs Enter alone also saves; textarea uses Cmd+Enter.
      const isPlainEnterOnInput =
        e.key === "Enter" && field.type !== "textarea" && !e.shiftKey;
      if (isCmdEnter || isPlainEnterOnInput) {
        e.preventDefault();
        void commitSave();
      }
    },
    [cancelEdit, commitSave, field.type],
  );

  // Auto-resize textarea while editing.
  useEffect(() => {
    if (!editing) return;
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [editing, draft]);

  return (
    <div className={`em-field-row${editing ? " is-editing" : ""}${showSaved ? " is-saved-flash" : ""}`}>
      <div className="em-field-header">
        <label className="em-label" htmlFor={`field-${fullPath}`}>
          {field.label}
        </label>
        {hasMaxWords && (editing || wordsOver) && (
          <span
            className={`em-word-counter${wordsOver ? " is-over" : ""}`}
            aria-live="polite"
          >
            {wordCount}/{field.maxWords} woorden
          </span>
        )}
        {showSaved && (
          <span className="em-field-saved" aria-live="polite">
            ✓ Opgeslagen
          </span>
        )}
      </div>

      {editing ? (
        <div className="em-field-edit">
          <AiWriteAssistant
            open={aiOpen}
            fieldLabel={field.label}
            currentValue={draft}
            maxWords={field.maxWords ?? null}
            onResult={onAiResult}
            onClose={() => setAiOpen(false)}
          />
          {field.type === "textarea" ? (
            <textarea
              ref={textareaRef}
              id={`field-${fullPath}`}
              className={`em-input em-textarea${hasError ? " is-error" : ""}${aiFlash ? " is-ai-flash" : ""}`}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
              rows={3}
              placeholder={field.placeholder}
              disabled={saving}
              aria-invalid={hasError || undefined}
            />
          ) : (
            <input
              ref={(el) => {
                inputRef.current = el;
              }}
              id={`field-${fullPath}`}
              type={
                field.type === "url"
                  ? "url"
                  : field.type === "email"
                    ? "email"
                    : field.type === "phone"
                      ? "tel"
                      : "text"
              }
              className={`em-input${hasError ? " is-error" : ""}${aiFlash ? " is-ai-flash" : ""}`}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={field.placeholder}
              disabled={saving}
              aria-invalid={hasError || undefined}
            />
          )}
          {hasEmDash && (
            <p className="em-field-warning" role="alert">
              Gebruik een komma of punt, geen em-dash (—).
            </p>
          )}
          {field.helpText && !hasEmDash && (
            <p className="em-field-help">{field.helpText}</p>
          )}
          <div className="em-field-actions">
            {!aiOpen && (
              <button
                type="button"
                className="em-btn em-btn-ghost em-btn-ai"
                onClick={() => setAiOpen(true)}
                disabled={saving}
                title="Vraag AI om de tekst te herschrijven"
              >
                <span className="em-btn-ai-icon" aria-hidden>✨</span>
                AI Schrijfassistent
              </button>
            )}
            <button
              type="button"
              className="em-btn em-btn-secondary"
              onClick={cancelEdit}
              disabled={saving}
              title="Annuleer (Esc)"
            >
              Annuleer
            </button>
            <button
              type="button"
              className={`em-btn em-btn-primary${saving ? " em-btn-loading" : ""}`}
              onClick={() => void commitSave()}
              disabled={saving || hasError}
              title={
                hasError
                  ? wordsOver
                    ? "Maak de tekst korter"
                    : "Verwijder de em-dash"
                  : "Opslaan (⌘ + Enter)"
              }
            >
              {saving ? "Opslaan…" : "Opslaan"}
            </button>
          </div>
        </div>
      ) : (
        <div className="em-field-display-row">
          <button
            type="button"
            className="em-field-display"
            onClick={startEdit}
            aria-label={`Bewerk ${field.label}`}
          >
            <span
              className={`em-field-value${committedValue ? "" : " is-empty"}`}
            >
              {committedValue || (
                <span className="em-field-empty">Geen waarde — klik om te bewerken</span>
              )}
            </span>
            <span className="em-field-edit-icon" aria-hidden>
              ✎
            </span>
          </button>
          <button
            type="button"
            className="em-sparkle-btn"
            onClick={startAi}
            aria-label={`AI Schrijfassistent voor ${field.label}`}
            title="AI Schrijfassistent — laat Claude een variant schrijven"
          >
            <span aria-hidden>✨</span>
          </button>
        </div>
      )}
      {field.helpText && !editing && (
        <p className="em-field-help is-static">{field.helpText}</p>
      )}
    </div>
  );
}
