"use client";

import { useCallback } from "react";
import { useConfirm } from "./ConfirmDialog";

/**
 * useConfirmDiff — open a confirm dialog whose body shows the OUD →
 * NIEUW diff for a single field. Returns true when the user clicks
 * "Bevestig & opslaan".
 *
 * Usage:
 *   const confirmDiff = useConfirmDiff();
 *   const ok = await confirmDiff({
 *     fieldLabel: "Headline",
 *     contextPath: "Homepage › Hero",
 *     oldValue: "Hét bedrijfsuitje van Amsterdam.",
 *     newValue: "Het leukste bedrijfsuitje van Amsterdam.",
 *   });
 *   if (!ok) return;
 *   // … perform the actual save
 */

export type ConfirmDiffOptions = {
  fieldLabel: string;
  /** Optional breadcrumb-ish path, e.g. "Homepage › Hero". */
  contextPath?: string;
  oldValue: string;
  newValue: string;
};

export function useConfirmDiff(): (opts: ConfirmDiffOptions) => Promise<boolean> {
  const confirm = useConfirm();
  return useCallback(
    (opts) =>
      confirm({
        title: "Wijziging bevestigen",
        wide: true,
        success: true,
        confirmLabel: "Bevestig & opslaan",
        cancelLabel: "Annuleer",
        body: (
          <DiffPreview
            fieldLabel={opts.fieldLabel}
            contextPath={opts.contextPath}
            oldValue={opts.oldValue}
            newValue={opts.newValue}
          />
        ),
      }),
    [confirm],
  );
}

export function DiffPreview({
  fieldLabel,
  contextPath,
  oldValue,
  newValue,
}: ConfirmDiffOptions) {
  const isNew = !oldValue.trim();
  return (
    <div className="em-diff-body">
      <div className="em-diff-field">
        <span className="em-diff-field-label">{fieldLabel}</span>
        {contextPath && (
          <span className="em-diff-field-path">{contextPath}</span>
        )}
      </div>
      <div className="em-diff-rows">
        {!isNew && (
          <div className="em-ai-diff-row em-ai-diff-old">
            <span className="em-ai-diff-tag">Oud</span>
            <span className="em-ai-diff-text">{oldValue}</span>
          </div>
        )}
        <div className="em-ai-diff-row em-ai-diff-new">
          <span className="em-ai-diff-tag">Nieuw</span>
          <span className="em-ai-diff-text">{newValue}</span>
        </div>
      </div>
    </div>
  );
}
