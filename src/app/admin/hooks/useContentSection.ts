"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ContentSource } from "@/lib/admin-content-schema";

export type SectionState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; value: unknown; sha: string }
  | { status: "error"; error: string; code?: string };

type SectionResponse =
  | {
      ok: true;
      value: unknown;
      sha: string;
      path: string;
    }
  | {
      ok: false;
      error: string;
      code?: string;
    };

function buildSectionUrl(source: ContentSource): string {
  const params = new URLSearchParams({
    file: source.file,
    fileType: source.fileType,
  });
  if (source.exportName) params.set("exportName", source.exportName);
  if (source.anchor) params.set("anchor", source.anchor);
  return `/api/admin/section?${params.toString()}`;
}

/**
 * Load (and re-load on demand) the parsed value for a content section.
 *
 * Notes:
 *  - Aborts in-flight requests when source changes or component unmounts.
 *  - Returns a stable `refetch` callback so callers can refresh after a save
 *    without rebuilding their dependency arrays.
 */
export function useContentSection(source: ContentSource | null) {
  const [state, setState] = useState<SectionState>({ status: "idle" });
  const abortRef = useRef<AbortController | null>(null);

  const fetchOnce = useCallback(
    async (src: ContentSource) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setState({ status: "loading" });
      try {
        const res = await fetch(buildSectionUrl(src), {
          signal: controller.signal,
          cache: "no-store",
        });
        const data = (await res.json()) as SectionResponse;
        if (controller.signal.aborted) return;
        if (!data.ok) {
          setState({
            status: "error",
            error: data.error,
            code: data.code,
          });
          return;
        }
        setState({
          status: "ready",
          value: data.value,
          sha: data.sha,
        });
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        setState({
          status: "error",
          error: e instanceof Error ? e.message : "Network error",
        });
      }
    },
    [],
  );

  const refetch = useCallback(() => {
    if (source) void fetchOnce(source);
  }, [source, fetchOnce]);

  // Re-fetch whenever the source changes (file/fileType/exportName/anchor).
  useEffect(() => {
    if (!source) {
      setState({ status: "idle" });
      return;
    }
    void fetchOnce(source);
    return () => abortRef.current?.abort();
  }, [
    source?.file,
    source?.fileType,
    source?.exportName,
    source?.anchor,
    fetchOnce,
  ]);

  return { state, refetch };
}
