"use client";

import { useCallback, useState } from "react";
import type { ContentSource } from "@/lib/admin-content-schema";

export type SaveStatus =
  | { status: "idle" }
  | { status: "saving" }
  | { status: "saved"; sha: string; commitUrl?: string }
  | { status: "error"; error: string; code?: string };

type FieldSaveResponse =
  | { ok: true; sha: string; commitUrl?: string; unchanged?: boolean }
  | { ok: false; error: string; code?: string };

export type FieldSavePayload = {
  source: ContentSource;
  /** Full path inside the file: e.g. anchor + "." + fieldKey */
  path: string;
  value: unknown;
  message?: string;
};

/**
 * Submit a single-field write to /api/admin/field. Returns granular state
 * so the editor can show a transient "Opgeslagen ✓" badge and surface
 * server errors next to the field.
 */
export function useFieldSave() {
  const [status, setStatus] = useState<SaveStatus>({ status: "idle" });

  const save = useCallback(
    async (payload: FieldSavePayload): Promise<FieldSaveResponse> => {
      setStatus({ status: "saving" });
      try {
        const res = await fetch("/api/admin/field", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            file: payload.source.file,
            fileType: payload.source.fileType,
            exportName: payload.source.exportName,
            path: payload.path,
            value: payload.value,
            message: payload.message,
          }),
          cache: "no-store",
        });
        const data = (await res.json()) as FieldSaveResponse;
        if (!data.ok) {
          setStatus({
            status: "error",
            error: data.error,
            code: data.code,
          });
          return data;
        }
        setStatus({
          status: "saved",
          sha: data.sha,
          commitUrl: data.commitUrl,
        });
        return data;
      } catch (e) {
        const error = e instanceof Error ? e.message : "Network error";
        setStatus({ status: "error", error });
        return { ok: false, error };
      }
    },
    [],
  );

  const reset = useCallback(() => setStatus({ status: "idle" }), []);

  return { status, save, reset };
}
