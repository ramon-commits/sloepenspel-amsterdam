"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import type { ContentField, ContentSource } from "@/lib/admin-content-schema";
import { useFieldSave } from "../hooks/useFieldSave";
import { useToast } from "./Toast";

type Props = {
  field: ContentField;
  source: ContentSource;
  fullPath: string;
  /** Current public-URL value, e.g. "/images/hero-bedrijfsuitje-v5.jpg". */
  initialValue: string;
  /** Aspect ratio hint for kie.ai generation, default 16:9. */
  aspectRatio?: string;
  onSaved?: (newValue: string) => void;
};

type UploadResponse =
  | {
      ok: true;
      path: string;
      publicUrl: string;
      width: number;
      height: number;
      bytes: number;
    }
  | { ok: false; error: string; code?: string };

type KieResponse =
  | { ok: true; imageBase64: string; mime: string; jobId: string }
  | { ok: false; error: string; code?: string };

type AiMode = "edit" | "new" | null;

/**
 * Convert "/images/foo.jpg" → "public/images/foo.jpg" (the repo path).
 * Falls back to the literal value when it doesn't match the expected
 * pattern, so misconfigured fields don't crash the editor.
 */
function siteUrlToRepoPath(url: string): string {
  if (url.startsWith("/")) return `public${url}`;
  return url;
}

function repoPathToPublicUrl(p: string): string {
  return p.startsWith("public/") ? p.slice("public".length) : p;
}

function fileToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      // result is "data:image/jpeg;base64,xxx" — strip the prefix.
      const idx = result.indexOf(",");
      resolve(idx >= 0 ? result.slice(idx + 1) : result);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

export function ImageFieldEditor({
  field,
  source,
  fullPath,
  initialValue,
  aspectRatio = "16:9",
  onSaved,
}: Props) {
  const toast = useToast();
  const { save: saveField } = useFieldSave();

  const [currentUrl, setCurrentUrl] = useState(initialValue);
  const [uploading, setUploading] = useState(false);
  const [aiMode, setAiMode] = useState<AiMode>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [busVersion, setBumpVersion] = useState(0);

  // Reset when parent provides a new initial value.
  useEffect(() => {
    setCurrentUrl(initialValue);
  }, [initialValue]);

  /** Replace the file at the given target path; if it differs from the
   *  current URL, also update the content field reference. */
  const uploadBlob = useCallback(
    async (blob: Blob, opts: { sourceLabel: string }) => {
      setUploading(true);
      try {
        const repoPath = siteUrlToRepoPath(currentUrl || "/images/upload.webp");
        const fd = new FormData();
        fd.append("file", blob, "upload.bin");
        fd.append("targetPath", repoPath);
        fd.append("replace", "1");

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: fd,
        });
        const data = (await res.json()) as UploadResponse;
        if (!data.ok) {
          toast.error(`Upload mislukt: ${data.error}`);
          return;
        }

        // If the upload route normalised the extension to .webp, the URL
        // changed — update the content field reference too.
        const newPublicUrl = data.publicUrl;
        if (newPublicUrl !== currentUrl) {
          const fieldRes = await saveField({
            source,
            path: fullPath,
            value: newPublicUrl,
            message: `admin: foto vervangen voor ${field.label}`,
          });
          if (!fieldRes.ok) {
            toast.error(
              `Foto staat in repo, maar veld-referentie updaten mislukte: ${fieldRes.error}`,
            );
            return;
          }
          setCurrentUrl(newPublicUrl);
          onSaved?.(newPublicUrl);
        } else {
          // Same URL — bust the local <img> cache so the new bytes show.
          setBumpVersion((v) => v + 1);
        }

        toast.success(
          `${opts.sourceLabel} opgeslagen — ${data.width}×${data.height}, ${Math.round(
            data.bytes / 1024,
          )}KB. Live in ~60 sec.`,
        );
      } finally {
        setUploading(false);
      }
    },
    [
      currentUrl,
      source,
      fullPath,
      field.label,
      saveField,
      toast,
      onSaved,
    ],
  );

  const handleFile = useCallback(
    async (file: File | undefined | null) => {
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        toast.error("Kies een afbeeldingsbestand.");
        return;
      }
      await uploadBlob(file, { sourceLabel: "Foto upload" });
    },
    [uploadBlob, toast],
  );

  const onPickFile = (e: ChangeEvent<HTMLInputElement>) => {
    void handleFile(e.target.files?.[0]);
    // Reset so picking the same file twice still triggers change.
    e.target.value = "";
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };
  const onDragLeave = () => setDragOver(false);
  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    void handleFile(file);
  };

  const cacheBuster =
    busVersion > 0 ? `${currentUrl.includes("?") ? "&" : "?"}v=${busVersion}` : "";

  return (
    <div className="em-field-row em-image-row">
      <div className="em-field-header">
        <label className="em-label">{field.label}</label>
        {currentUrl && (
          <span className="em-image-meta-inline" title={currentUrl}>
            {currentUrl}
          </span>
        )}
      </div>

      <div
        className={`em-image-preview${dragOver ? " is-drag-over" : ""}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {currentUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`${currentUrl}${cacheBuster}`}
            alt={`Voorbeeld van ${field.label}`}
          />
        ) : (
          <div className="em-image-empty">Geen foto gekoppeld.</div>
        )}
        {dragOver && (
          <div className="em-image-drop-overlay">Laat los om te uploaden</div>
        )}
      </div>

      <div className="em-image-actions">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onPickFile}
          style={{ display: "none" }}
        />
        <button
          type="button"
          className="em-btn em-btn-secondary"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? "Uploaden…" : "Upload nieuwe foto"}
        </button>
        <button
          type="button"
          className="em-btn em-btn-secondary"
          onClick={() => setAiMode("edit")}
          disabled={uploading || !currentUrl}
          title="Pas deze foto aan via kie.ai"
        >
          ✨ AI aanpassen
        </button>
        <button
          type="button"
          className="em-btn em-btn-secondary"
          onClick={() => setAiMode("new")}
          disabled={uploading}
          title="Genereer een nieuwe foto via kie.ai"
        >
          ✨ AI nieuwe foto
        </button>
      </div>

      {aiMode && (
        <AiImageModal
          mode={aiMode}
          referenceUrl={currentUrl}
          aspectRatio={aspectRatio}
          fieldLabel={field.label}
          onCancel={() => setAiMode(null)}
          onAccept={async (blob) => {
            setAiMode(null);
            await uploadBlob(blob, {
              sourceLabel: aiMode === "edit" ? "AI-aanpassing" : "AI-foto",
            });
          }}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// AI modal — handles both "edit existing" and "generate new" flows.
// ─────────────────────────────────────────────────────────────────────

type AiModalProps = {
  mode: "edit" | "new";
  referenceUrl: string;
  aspectRatio: string;
  fieldLabel: string;
  onCancel: () => void;
  onAccept: (blob: Blob) => void | Promise<void>;
};

type AiState =
  | { phase: "prompt" }
  | { phase: "loading"; startedAt: number }
  | {
      phase: "preview";
      blob: Blob;
      previewUrl: string;
      jobId: string;
    }
  | { phase: "error"; error: string };

async function fetchAsBlob(url: string): Promise<Blob | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.blob();
  } catch {
    return null;
  }
}

function base64ToBlob(b64: string, mime: string): Blob {
  const byteString = atob(b64);
  const arr = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) arr[i] = byteString.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

function AiImageModal({
  mode,
  referenceUrl,
  aspectRatio,
  fieldLabel,
  onCancel,
  onAccept,
}: AiModalProps) {
  const toast = useToast();
  const [prompt, setPrompt] = useState(
    mode === "edit"
      ? `Houd de foto identiek qua scene en compositie. Pas alleen aan: `
      : `Realistische foto, ${aspectRatio}. Onderwerp: `,
  );
  const [state, setState] = useState<AiState>({ phase: "prompt" });

  const close = useCallback(() => {
    if (state.phase === "preview") URL.revokeObjectURL(state.previewUrl);
    onCancel();
  }, [state, onCancel]);

  // Escape closes the modal.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [close]);

  const generate = useCallback(async () => {
    if (state.phase === "loading") return;
    if (prompt.trim().length < 12) {
      toast.warning("Geef wat meer detail in de prompt (min. 12 tekens).");
      return;
    }
    setState({ phase: "loading", startedAt: Date.now() });

    let imageBase64: string | undefined;
    if (mode === "edit" && referenceUrl) {
      const refBlob = await fetchAsBlob(referenceUrl);
      if (!refBlob) {
        setState({
          phase: "error",
          error: "Kon de huidige foto niet downloaden voor referentie.",
        });
        return;
      }
      imageBase64 = await fileToBase64(refBlob);
    }

    try {
      const res = await fetch("/api/admin/kie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          aspectRatio,
          imageBase64,
        }),
      });
      const data = (await res.json()) as KieResponse;
      if (!data.ok) {
        setState({ phase: "error", error: data.error });
        return;
      }
      const blob = base64ToBlob(data.imageBase64, data.mime);
      const previewUrl = URL.createObjectURL(blob);
      setState({ phase: "preview", blob, previewUrl, jobId: data.jobId });
    } catch (e) {
      setState({
        phase: "error",
        error: e instanceof Error ? e.message : "Onbekende fout",
      });
    }
  }, [state.phase, prompt, mode, referenceUrl, aspectRatio, toast]);

  return (
    <div className="em-modal-backdrop" onClick={close} role="presentation">
      <div
        className="em-modal em-modal-wide"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="em-modal-title">
          {mode === "edit" ? "AI: pas deze foto aan" : "AI: genereer een nieuwe foto"}
        </div>
        <div className="em-modal-desc">
          {mode === "edit"
            ? `Beschrijf wat er moet veranderen aan ${fieldLabel}. De huidige foto wordt als referentie meegestuurd.`
            : `Beschrijf de gewenste foto voor ${fieldLabel}. Houd het concreet — locatie, sfeer, mensen, kleuren.`}
        </div>

        {state.phase === "prompt" && (
          <>
            <textarea
              className="em-input em-textarea"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              autoFocus
              placeholder={
                mode === "edit"
                  ? "Bijv: maak de lucht blauwer en verwijder de tekst op de boot."
                  : "Bijv: zonnige Amsterdamse gracht met sloepen, golden hour, editorial."
              }
            />
            <div className="em-modal-actions">
              <button
                type="button"
                className="em-btn em-btn-secondary"
                onClick={close}
              >
                Annuleer
              </button>
              <button
                type="button"
                className="em-btn em-btn-primary"
                onClick={generate}
              >
                Genereer →
              </button>
            </div>
          </>
        )}

        {state.phase === "loading" && (
          <div className="em-ai-loading">
            <div className="em-ai-spinner" aria-hidden />
            <p>Foto wordt gegenereerd via kie.ai. Dit duurt 30-90 seconden.</p>
          </div>
        )}

        {state.phase === "preview" && (
          <>
            <div className="em-ai-compare">
              {mode === "edit" && referenceUrl && (
                <figure className="em-ai-compare-fig">
                  <figcaption>Origineel</figcaption>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={referenceUrl} alt="Origineel" />
                </figure>
              )}
              <figure className="em-ai-compare-fig">
                <figcaption>AI resultaat</figcaption>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={state.previewUrl} alt="AI resultaat" />
              </figure>
            </div>
            <div className="em-modal-actions">
              <button
                type="button"
                className="em-btn em-btn-secondary"
                onClick={() => setState({ phase: "prompt" })}
              >
                ↻ Opnieuw
              </button>
              <button
                type="button"
                className="em-btn em-btn-secondary"
                onClick={close}
              >
                Annuleer
              </button>
              <button
                type="button"
                className="em-btn em-btn-primary"
                onClick={() => void onAccept(state.blob)}
              >
                Gebruik deze foto
              </button>
            </div>
          </>
        )}

        {state.phase === "error" && (
          <>
            <p className="em-field-warning" role="alert">
              {state.error}
            </p>
            <div className="em-modal-actions">
              <button
                type="button"
                className="em-btn em-btn-secondary"
                onClick={close}
              >
                Sluit
              </button>
              <button
                type="button"
                className="em-btn em-btn-primary"
                onClick={() => setState({ phase: "prompt" })}
              >
                Opnieuw proberen
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
