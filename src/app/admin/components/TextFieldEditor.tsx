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
};

const SAVED_FLASH_MS = 2400;

function isEmDashy(value: string): boolean {
  return /[—–]/.test(value);
}

export function TextFieldEditor({
  field,
  source,
  fullPath,
  initialValue,
  onSaved,
}: Props) {
  const toast = useToast();
  const { save, status, reset } = useFieldSave();

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initialValue);
  const [committedValue, setCommittedValue] = useState(initialValue);
  const [showSaved, setShowSaved] = useState(false);
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

  const cancelEdit = useCallback(() => {
    setEditing(false);
    setDraft(committedValue);
    reset();
  }, [committedValue, reset]);

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
          {field.type === "textarea" ? (
            <textarea
              ref={textareaRef}
              id={`field-${fullPath}`}
              className={`em-input em-textarea${hasError ? " is-error" : ""}`}
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
              className={`em-input${hasError ? " is-error" : ""}`}
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
            <button
              type="button"
              className="em-btn em-btn-secondary"
              onClick={cancelEdit}
              disabled={saving}
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
                  : "Opslaan (Cmd+Enter)"
              }
            >
              {saving ? "Opslaan…" : "Opslaan"}
            </button>
          </div>
        </div>
      ) : (
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
      )}
      {field.helpText && !editing && (
        <p className="em-field-help is-static">{field.helpText}</p>
      )}
    </div>
  );
}
