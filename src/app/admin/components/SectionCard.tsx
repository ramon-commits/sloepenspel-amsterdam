"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import type { ContentField, ContentSection } from "@/lib/admin-content-schema";
import { fullFieldPath } from "@/lib/admin-content-schema";
import { getAtPath } from "@/lib/admin-path";
import { TextFieldEditor } from "./TextFieldEditor";

type Props = {
  section: ContentSection;
  /** Parsed value for the section's anchor, as returned by useContentSection. */
  value: unknown;
  /** Whether this card starts open. Default: only the first card. */
  defaultOpen?: boolean;
  /** Override the displayed title (used by array items). */
  titleOverride?: string;
  /** Inject extra metadata under the title (used by array items). */
  metaOverride?: ReactNode;
  /** When set, the section is treated as ONE item (not as the parent array). */
  itemIndex?: number;
  /** Notify parent so it can refetch data after a save lands. */
  onSaved?: () => void;
};

function valueToString(v: unknown): string {
  if (v === undefined || v === null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return "";
}

function readImagePath(value: unknown, imageField: string | undefined): string | null {
  if (!imageField) return null;
  const raw = getAtPath(value, imageField);
  if (typeof raw !== "string" || !raw) return null;
  return raw;
}

/**
 * Renders one section. Supports two modes:
 *   1) Flat: `value` is an object whose properties match `section.fields`.
 *   2) Array item: caller passes itemIndex; value is the *parent array* and
 *      we render fields for that one item.
 */
export function SectionCard({
  section,
  value,
  defaultOpen = false,
  titleOverride,
  metaOverride,
  itemIndex,
  onSaved,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const isArrayItem = typeof itemIndex === "number";

  // The data-object that owns the fields (item if array, value otherwise).
  const itemValue = useMemo(() => {
    if (isArrayItem) {
      if (!Array.isArray(value)) return null;
      return value[itemIndex as number] ?? null;
    }
    return value;
  }, [value, itemIndex, isArrayItem]);

  const buildFieldPath = useCallback(
    (fieldKey: string): string => {
      if (isArrayItem) {
        const baseAnchor = section.source.anchor;
        const indexPart = `[${itemIndex as number}]`;
        const arrayPath = baseAnchor ? `${baseAnchor}${indexPart}` : indexPart;
        return fullFieldPath(arrayPath, fieldKey);
      }
      return fullFieldPath(section.source.anchor, fieldKey);
    },
    [isArrayItem, itemIndex, section.source.anchor],
  );

  const imagePath = readImagePath(itemValue, section.imageField);
  const title = titleOverride ?? section.label;

  return (
    <article className="em-section-card">
      <button
        type="button"
        className="em-section-header"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <div>
          <span className="em-section-title">{title}</span>
          {metaOverride ? (
            <div className="em-section-meta">{metaOverride}</div>
          ) : section.description ? (
            <div className="em-section-meta">{section.description}</div>
          ) : null}
        </div>
        <span className="em-section-toggle" aria-hidden>
          ▾
        </span>
      </button>
      {open && (
        <div className="em-section-body">
          {imagePath && (
            <div className="em-section-image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagePath} alt={`Foto van ${title}`} />
              <div className="em-section-image-meta">
                <span>{imagePath}</span>
                <span>foto-editor in stap 5</span>
              </div>
            </div>
          )}
          {itemValue === null || itemValue === undefined ? (
            <p className="em-section-empty">Geen data voor deze sectie.</p>
          ) : (
            <FieldList
              fields={section.fields.filter(
                (f) => !section.imageField || f.key !== section.imageField,
              )}
              data={itemValue}
              buildPath={buildFieldPath}
              source={section.source}
              onSaved={onSaved}
            />
          )}
        </div>
      )}
    </article>
  );
}

function FieldList({
  fields,
  data,
  buildPath,
  source,
  onSaved,
}: {
  fields: ContentField[];
  data: unknown;
  buildPath: (key: string) => string;
  source: ContentSection["source"];
  onSaved?: () => void;
}) {
  return (
    <div className="em-field-list">
      {fields.map((field) => {
        const raw = getAtPath(data, field.key);
        return (
          <TextFieldEditor
            key={field.key}
            field={field}
            source={source}
            fullPath={buildPath(field.key)}
            initialValue={valueToString(raw)}
            onSaved={onSaved}
          />
        );
      })}
    </div>
  );
}
