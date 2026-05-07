"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import type { ContentField, ContentSection } from "@/lib/admin-content-schema";
import { fullFieldPath } from "@/lib/admin-content-schema";
import { getAtPath } from "@/lib/admin-path";
import { TextFieldEditor } from "./TextFieldEditor";
import { ImageFieldEditor } from "./ImageFieldEditor";

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

  // Image preview at the top is now handled by ImageFieldEditor inline
  // in the field list, so we no longer pre-render it here.
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
          <FontAwesomeIcon icon={faChevronDown} />
        </span>
      </button>
      {open && (
        <div className="em-section-body">
          {itemValue === null || itemValue === undefined ? (
            <p className="em-section-empty">Geen data voor deze sectie.</p>
          ) : (
            <FieldList
              fields={section.fields}
              data={itemValue}
              buildPath={buildFieldPath}
              source={section.source}
              contextPath={title}
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
  contextPath,
  onSaved,
}: {
  fields: ContentField[];
  data: unknown;
  buildPath: (key: string) => string;
  source: ContentSection["source"];
  contextPath?: string;
  onSaved?: () => void;
}) {
  return (
    <div className="em-field-list">
      {fields.map((field) => {
        const raw = getAtPath(data, field.key);
        const valueStr = valueToString(raw);
        if (field.type === "image") {
          return (
            <ImageFieldEditor
              key={field.key}
              field={field}
              source={source}
              fullPath={buildPath(field.key)}
              initialValue={valueStr}
              onSaved={onSaved}
            />
          );
        }
        return (
          <TextFieldEditor
            key={field.key}
            field={field}
            source={source}
            fullPath={buildPath(field.key)}
            initialValue={valueStr}
            contextPath={contextPath}
            onSaved={onSaved}
          />
        );
      })}
    </div>
  );
}
