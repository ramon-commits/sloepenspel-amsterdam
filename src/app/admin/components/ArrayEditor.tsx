"use client";

import { useMemo } from "react";
import type { ContentSection } from "@/lib/admin-content-schema";
import { useArrayMutate } from "../hooks/useArrayMutate";
import { useConfirm } from "./ConfirmDialog";
import { SectionCard } from "./SectionCard";

type Props = {
  section: ContentSection;
  /** Current array (may be undefined while reloading). */
  value: unknown;
  defaultOpenFirst?: boolean;
  onSaved: () => void;
};

function pickItemTitle(item: unknown, key?: string): string {
  if (!key || !item || typeof item !== "object") return "";
  const v = (item as Record<string, unknown>)[key];
  return typeof v === "string" ? v : "";
}

function shortTitle(s: string): string {
  if (!s) return "";
  return s.length > 60 ? `${s.slice(0, 57)}…` : s;
}

export function ArrayEditor({
  section,
  value,
  defaultOpenFirst = true,
  onSaved,
}: Props) {
  const items = useMemo(() => (Array.isArray(value) ? value : []), [value]);
  const confirm = useConfirm();
  const { add, duplicate, remove, move, busy } = useArrayMutate({
    source: section.source,
    items,
    itemLabel: section.arrayItemLabel ?? "Item",
    titleField: section.arrayItemTitleField,
    onSaved,
  });

  const isTsArray = section.source.fileType === "ts-object";

  return (
    <div className="em-array-editor">
      <div className="em-content-toolbar em-array-toolbar">
        <div>
          <strong>{section.label}</strong>
          <span className="em-array-count">
            {items.length} {section.arrayItemLabel ?? "items"}
          </span>
          {section.description && (
            <div className="em-array-description">{section.description}</div>
          )}
        </div>
        <button
          type="button"
          className="em-btn em-btn-primary"
          onClick={() => void add()}
          disabled={busy !== null || isTsArray}
          title={
            isTsArray
              ? "Items toevoegen voor TypeScript-bronnen volgt later — bewerk bestaande items inline."
              : `Voeg een nieuwe ${section.arrayItemLabel ?? "item"} toe`
          }
        >
          + {section.arrayItemLabel ?? "Item"} toevoegen
        </button>
      </div>

      {items.length === 0 ? (
        <div className="em-empty">
          <div className="em-empty-icon" aria-hidden>
            ○
          </div>
          <div className="em-empty-title">Nog geen {section.arrayItemLabel ?? "items"}</div>
          <div className="em-empty-sub">
            {isTsArray
              ? "TypeScript-bronnen ondersteunen toevoegen nog niet."
              : "Klik op de knop hierboven om er één aan te maken."}
          </div>
        </div>
      ) : (
        items.map((item, index) => (
          <ArrayItemCard
            key={`${index}-${pickItemTitle(item, section.arrayItemTitleField)}`}
            section={section}
            items={items}
            index={index}
            isTsArray={isTsArray}
            defaultOpen={defaultOpenFirst && index === 0}
            busy={busy !== null}
            onSaved={onSaved}
            onMoveUp={() => void move(index, "up")}
            onMoveDown={() => void move(index, "down")}
            onDuplicate={() => void duplicate(index)}
            onDelete={async () => {
              const title = shortTitle(
                pickItemTitle(item, section.arrayItemTitleField),
              );
              const ok = await confirm({
                title: `${section.arrayItemLabel ?? "Item"} verwijderen?`,
                description: title
                  ? `Weet je zeker dat je "${title}" wilt verwijderen? Dit gaat direct via een commit naar GitHub en is binnen ~60 sec live.`
                  : `Weet je zeker dat je dit item wilt verwijderen?`,
                confirmLabel: "Ja, verwijder",
                cancelLabel: "Annuleer",
                destructive: true,
              });
              if (ok) await remove(index);
            }}
          />
        ))
      )}
    </div>
  );
}

type ItemProps = {
  section: ContentSection;
  items: unknown[];
  index: number;
  isTsArray: boolean;
  defaultOpen: boolean;
  busy: boolean;
  onSaved: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
};

function ArrayItemCard({
  section,
  items,
  index,
  isTsArray,
  defaultOpen,
  busy,
  onSaved,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
}: ItemProps) {
  const item = items[index];
  const title = pickItemTitle(item, section.arrayItemTitleField);
  const heading = title
    ? `${section.arrayItemLabel ?? "Item"} ${index + 1} — ${shortTitle(title)}`
    : `${section.arrayItemLabel ?? "Item"} ${index + 1}`;

  // Build the meta line ABOVE the section card so the card itself stays
  // visually identical to flat sections; we wrap with extra controls.
  return (
    <div className="em-array-item">
      <div className="em-array-item-controls" aria-label="Item-acties">
        <button
          type="button"
          className="em-icon-btn"
          aria-label="Omhoog verplaatsen"
          title="Omhoog"
          onClick={onMoveUp}
          disabled={busy || index === 0}
        >
          ↑
        </button>
        <button
          type="button"
          className="em-icon-btn"
          aria-label="Omlaag verplaatsen"
          title="Omlaag"
          onClick={onMoveDown}
          disabled={busy || index === items.length - 1}
        >
          ↓
        </button>
        <button
          type="button"
          className="em-icon-btn"
          aria-label="Dupliceren"
          title="Dupliceren"
          onClick={onDuplicate}
          disabled={busy || isTsArray}
        >
          ⊕
        </button>
        <button
          type="button"
          className="em-icon-btn em-icon-btn-danger"
          aria-label="Verwijderen"
          title="Verwijderen"
          onClick={onDelete}
          disabled={busy || isTsArray}
        >
          ✕
        </button>
      </div>
      <SectionCard
        section={section}
        value={items}
        itemIndex={index}
        defaultOpen={defaultOpen}
        titleOverride={heading}
        onSaved={onSaved}
      />
    </div>
  );
}
