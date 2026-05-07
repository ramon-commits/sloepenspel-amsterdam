"use client";

import { useCallback, useState } from "react";
import type { ContentSource } from "@/lib/admin-content-schema";
import { useToast } from "../components/Toast";

type Direction = "up" | "down";

type SaveResponse =
  | { ok: true; sha: string; commitUrl?: string; unchanged?: boolean }
  | { ok: false; error: string; code?: string };

type Args = {
  source: ContentSource;
  items: unknown[];
  /** Used in commit message and toasts: "Review", "FAQ", "Restaurant", … */
  itemLabel: string;
  /** Field key whose value is the human title for an item, used in messages. */
  titleField?: string;
  /** Called after a successful mutation so the caller can refetch. */
  onSaved?: () => void;
};

/**
 * Build a blank template based on the first item's shape. Strings become
 * empty strings, numbers become 0, booleans false, arrays empty, anything
 * else null. The user fills in real values after adding.
 */
function blankFromShape(items: unknown[]): unknown {
  if (items.length === 0) return {};
  const first = items[0];
  if (first === null || typeof first !== "object" || Array.isArray(first)) {
    return null;
  }
  const blank: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(first as Record<string, unknown>)) {
    if (typeof v === "string") blank[k] = "";
    else if (typeof v === "number") blank[k] = 0;
    else if (typeof v === "boolean") blank[k] = false;
    else if (Array.isArray(v)) blank[k] = [];
    else if (v && typeof v === "object") blank[k] = blankFromShape([v]);
    else blank[k] = null;
  }
  return blank;
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function pickTitle(item: unknown, key?: string): string {
  if (!key || !item || typeof item !== "object") return "";
  const v = (item as Record<string, unknown>)[key];
  return typeof v === "string" ? v : "";
}

function shortTitle(s: string): string {
  if (!s) return "";
  return s.length > 40 ? `${s.slice(0, 37)}…` : s;
}

export function useArrayMutate({
  source,
  items,
  itemLabel,
  titleField,
  onSaved,
}: Args) {
  const toast = useToast();
  const [busy, setBusy] = useState<null | "add" | "remove" | "move" | "duplicate">(
    null,
  );

  const writeArray = useCallback(
    async (
      nextItems: unknown[],
      action: "add" | "remove" | "move" | "duplicate",
      message: string,
    ): Promise<boolean> => {
      setBusy(action);
      try {
        const res = await fetch("/api/admin/field", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            file: source.file,
            fileType: source.fileType,
            exportName: source.exportName,
            path: source.anchor,
            value: nextItems,
            message,
          }),
        });
        const data = (await res.json()) as SaveResponse;
        if (!data.ok) {
          if (data.code === "parse" && source.fileType === "ts-object") {
            toast.error(
              "TS-arrays toevoegen/verwijderen werkt nog niet — gebruik een JSON-bron of bewerk inline.",
            );
          } else {
            toast.error(`Opslaan mislukt: ${data.error}`);
          }
          return false;
        }
        onSaved?.();
        return true;
      } catch (e) {
        toast.error(
          `Netwerkfout: ${e instanceof Error ? e.message : "onbekend"}`,
        );
        return false;
      } finally {
        setBusy(null);
      }
    },
    [source.file, source.fileType, source.exportName, source.anchor, onSaved, toast],
  );

  const add = useCallback(async (): Promise<boolean> => {
    const tmpl = blankFromShape(items);
    const next = [...items, tmpl];
    const ok = await writeArray(
      next,
      "add",
      `admin: ${itemLabel.toLowerCase()} toegevoegd`,
    );
    if (ok) toast.success(`${itemLabel} toegevoegd. Vul de velden in en sla op.`);
    return ok;
  }, [items, itemLabel, writeArray, toast]);

  const duplicate = useCallback(
    async (index: number): Promise<boolean> => {
      if (index < 0 || index >= items.length) return false;
      const cloned = deepClone(items[index]);
      const next = [...items.slice(0, index + 1), cloned, ...items.slice(index + 1)];
      const title = shortTitle(pickTitle(items[index], titleField));
      const ok = await writeArray(
        next,
        "duplicate",
        `admin: ${itemLabel.toLowerCase()}${title ? ` "${title}"` : ""} gedupliceerd`,
      );
      if (ok) toast.success(`${itemLabel} gedupliceerd.`);
      return ok;
    },
    [items, itemLabel, titleField, writeArray, toast],
  );

  const remove = useCallback(
    async (index: number): Promise<boolean> => {
      if (index < 0 || index >= items.length) return false;
      const next = [...items.slice(0, index), ...items.slice(index + 1)];
      const title = shortTitle(pickTitle(items[index], titleField));
      const ok = await writeArray(
        next,
        "remove",
        `admin: ${itemLabel.toLowerCase()}${title ? ` "${title}"` : ""} verwijderd`,
      );
      if (ok) toast.success(`${itemLabel} verwijderd.`);
      return ok;
    },
    [items, itemLabel, titleField, writeArray, toast],
  );

  const move = useCallback(
    async (index: number, direction: Direction): Promise<boolean> => {
      const target = direction === "up" ? index - 1 : index + 1;
      if (index < 0 || index >= items.length) return false;
      if (target < 0 || target >= items.length) return false;
      const next = [...items];
      const tmp = next[index];
      next[index] = next[target];
      next[target] = tmp;
      const ok = await writeArray(
        next,
        "move",
        `admin: ${itemLabel.toLowerCase()} verplaatst naar positie ${target + 1}`,
      );
      return ok;
    },
    [items, itemLabel, writeArray],
  );

  return { add, duplicate, remove, move, busy };
}
