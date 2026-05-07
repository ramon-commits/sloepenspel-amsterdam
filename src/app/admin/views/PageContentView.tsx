"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faFileLines,
} from "@fortawesome/free-solid-svg-icons";
import type { ContentPage, ContentSection } from "@/lib/admin-content-schema";
import { ArrayEditor } from "../components/ArrayEditor";
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
            <FontAwesomeIcon icon={faFileLines} />
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
        Bekijk live <FontAwesomeIcon icon={faArrowUpRightFromSquare} aria-hidden />
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
      <ArrayEditor
        section={section}
        value={state.value}
        defaultOpenFirst={defaultOpen}
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
