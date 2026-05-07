"use client";

import { useMemo } from "react";
import type { ContentPage, ContentSection } from "@/lib/admin-content-schema";
import { SectionCard } from "../components/SectionCard";
import { useContentSection } from "../hooks/useContentSection";

type Props = {
  page: ContentPage;
};

export function PageContentView({ page }: Props) {
  return (
    <>
      <PageHeader page={page} />
      {page.sections.length === 0 ? (
        <div className="em-empty">
          <div className="em-empty-icon" aria-hidden>
            ○
          </div>
          <div className="em-empty-title">Geen secties</div>
          <div className="em-empty-sub">
            {page.description ?? "Voor deze pagina is nog geen schema gedefinieerd."}
          </div>
        </div>
      ) : (
        <div className="em-section-list">
          {page.sections.map((section, index) => (
            <SectionMount
              key={section.id}
              section={section}
              defaultOpen={index === 0}
            />
          ))}
        </div>
      )}
    </>
  );
}

function PageHeader({ page }: { page: ContentPage }) {
  return (
    <header className="em-page-header">
      <div>
        <h1 className="em-page-title">{page.label}</h1>
        {page.description && (
          <div className="em-page-sub">{page.description}</div>
        )}
      </div>
      <a
        href={page.url}
        target="_blank"
        rel="noopener noreferrer"
        className="em-page-link"
      >
        Bekijk live <span aria-hidden>↗</span>
      </a>
    </header>
  );
}

function SectionMount({
  section,
  defaultOpen,
}: {
  section: ContentSection;
  defaultOpen: boolean;
}) {
  const { state, refetch } = useContentSection(section.source);

  if (state.status === "idle" || state.status === "loading") {
    return <div className="em-skeleton" aria-busy="true" />;
  }
  if (state.status === "error") {
    return (
      <div className="em-error-card">
        <div>
          <strong>{section.label}</strong>: {state.error}
        </div>
        <button
          type="button"
          className="em-btn em-btn-secondary"
          onClick={refetch}
        >
          Opnieuw laden
        </button>
      </div>
    );
  }

  if (section.isArray) {
    return (
      <ArraySection
        section={section}
        value={state.value}
        defaultOpen={defaultOpen}
        onSaved={refetch}
      />
    );
  }

  return (
    <SectionCard
      section={section}
      value={state.value}
      defaultOpen={defaultOpen}
      onSaved={refetch}
    />
  );
}

function ArraySection({
  section,
  value,
  defaultOpen,
  onSaved,
}: {
  section: ContentSection;
  value: unknown;
  defaultOpen: boolean;
  onSaved: () => void;
}) {
  const items = useMemo(() => (Array.isArray(value) ? value : []), [value]);

  if (items.length === 0) {
    return (
      <div className="em-empty">
        <div className="em-empty-icon" aria-hidden>
          ○
        </div>
        <div className="em-empty-title">{section.label}</div>
        <div className="em-empty-sub">
          Nog geen items. Toevoegen volgt in stap 6.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="em-content-toolbar">
        <span>
          <strong>{section.label}</strong>
          <span style={{ marginLeft: 8, color: "var(--color-text-light)" }}>
            {items.length} {section.arrayItemLabel ?? "items"}
          </span>
        </span>
        <span style={{ color: "var(--color-text-light)" }}>
          + Toevoegen volgt in stap 6
        </span>
      </div>
      {items.map((item: unknown, index: number) => {
        const titleField = section.arrayItemTitleField;
        const itemTitle = titleField
          ? toShortTitle(getFromItem(item, titleField))
          : null;
        const heading = itemTitle
          ? `${section.arrayItemLabel ?? "Item"} ${index + 1} — ${itemTitle}`
          : `${section.arrayItemLabel ?? "Item"} ${index + 1}`;
        return (
          <SectionCard
            key={index}
            section={section}
            value={items}
            itemIndex={index}
            defaultOpen={defaultOpen && index === 0}
            titleOverride={heading}
            onSaved={onSaved}
          />
        );
      })}
    </>
  );
}

function getFromItem(item: unknown, key: string): unknown {
  if (!item || typeof item !== "object") return null;
  return (item as Record<string, unknown>)[key];
}

function toShortTitle(v: unknown): string {
  if (typeof v !== "string") return "";
  return v.length > 60 ? `${v.slice(0, 57)}…` : v;
}
