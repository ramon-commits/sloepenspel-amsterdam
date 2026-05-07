"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { ADMIN_PAGES, getPageById } from "@/lib/admin-content-schema";
import { useToast } from "./components/Toast";
import { useConfirm } from "./components/ConfirmDialog";
import { DashboardView } from "./views/DashboardView";
import { PageContentView } from "./views/PageContentView";
import { DataListView } from "./views/DataListView";
import { SiteConfigView } from "./views/SiteConfigView";
import { HistoryView } from "./views/HistoryView";

export type SidebarCounts = {
  reviews: number;
  faq: number;
  restaurants: number;
  locations: number;
  blog: number;
  team: number;
};

const COUNT_BY_PAGE_ID: Record<string, keyof SidebarCounts> = {
  reviews: "reviews",
  faq: "faq",
  restaurants: "restaurants",
  locations: "locations",
  blog: "blog",
  team: "team",
};

const SECTION_LABEL: Record<"content" | "data" | "site", string> = {
  content: "Content",
  data: "Data",
  site: "Site",
};

const DASHBOARD_ID = "dashboard";
const HISTORY_ID = "history";

export function AdminShell({ counts }: { counts: SidebarCounts }) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();

  const [active, setActive] = useState<string>(DASHBOARD_ID);
  const [search, setSearch] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  const grouped = useMemo(() => {
    const byCategory: Record<"content" | "data" | "site", typeof ADMIN_PAGES> =
      { content: [], data: [], site: [] };
    for (const page of ADMIN_PAGES) {
      byCategory[page.category].push(page);
    }
    return byCategory;
  }, []);

  const matchesSearch = useCallback(
    (label: string) => {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return label.toLowerCase().includes(q);
    },
    [search],
  );

  const filtered = useMemo(() => {
    return {
      content: grouped.content.filter((p) => matchesSearch(p.label)),
      data: grouped.data.filter((p) => matchesSearch(p.label)),
      site: grouped.site.filter((p) => matchesSearch(p.label)),
    };
  }, [grouped, matchesSearch]);

  const totalMatches =
    filtered.content.length + filtered.data.length + filtered.site.length;
  const dashboardMatches = matchesSearch("Dashboard");
  const historyMatches = matchesSearch("Wijzigingen");

  const handlePublish = useCallback(async () => {
    const ok = await confirm({
      title: "Publicatie via GitHub",
      description:
        "Wijzigingen worden bij elke 'Opslaan' al direct via GitHub gecommit en Netlify zet ze automatisch live binnen ~60 seconden. Een aparte publish-flow (batch + preview) volgt in stap 4.",
      confirmLabel: "Begrepen",
      cancelLabel: "Sluit",
    });
    if (!ok) return;
    toast.info("Per-veld wijzigingen worden direct doorgevoerd.");
  }, [confirm, toast]);

  const handleLogout = useCallback(async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.replace("/admin/login");
      router.refresh();
    } catch {
      toast.error("Uitloggen mislukt, probeer opnieuw");
      setLoggingOut(false);
    }
  }, [loggingOut, router, toast]);

  // Keyboard: Cmd/Ctrl+K focuses the search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (isCmdK) {
        const input = document.getElementById("em-sidebar-search");
        if (input) {
          e.preventDefault();
          (input as HTMLInputElement).focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="em-shell">
      <aside className="em-sidebar" aria-label="Admin navigatie">
        <div className="em-brand">
          <div className="em-brand-badge" aria-hidden>
            EM
          </div>
          <div className="em-brand-text">
            <span className="em-brand-title">Site Admin</span>
            <span className="em-brand-sub">Sloepenspel</span>
          </div>
        </div>

        <div className="em-search">
          <input
            id="em-sidebar-search"
            type="search"
            placeholder="Zoek pagina (Cmd+K)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <nav className="em-nav">
          {dashboardMatches && (
            <NavItem
              id={DASHBOARD_ID}
              label="Dashboard"
              active={active === DASHBOARD_ID}
              onClick={() => setActive(DASHBOARD_ID)}
            />
          )}
          {historyMatches && (
            <NavItem
              id={HISTORY_ID}
              label="Wijzigingen"
              active={active === HISTORY_ID}
              onClick={() => setActive(HISTORY_ID)}
            />
          )}
          {(["content", "data", "site"] as const).map((cat) => {
            const items = filtered[cat];
            if (items.length === 0) return null;
            return (
              <div key={cat}>
                <div className="em-nav-section">{SECTION_LABEL[cat]}</div>
                {items.map((page) => {
                  const countKey = COUNT_BY_PAGE_ID[page.id];
                  const count = countKey ? counts[countKey] : undefined;
                  return (
                    <NavItem
                      key={page.id}
                      id={page.id}
                      label={page.label}
                      active={active === page.id}
                      onClick={() => setActive(page.id)}
                      count={count}
                    />
                  );
                })}
              </div>
            );
          })}
          {totalMatches === 0 && !dashboardMatches && !historyMatches && (
            <div className="em-nav-empty">Geen resultaten voor &quot;{search}&quot;.</div>
          )}
        </nav>

        <div className="em-sidebar-footer">
          <button
            type="button"
            onClick={handlePublish}
            className="em-publish-btn"
          >
            <span aria-hidden>↑</span> Publiceer
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="em-view-link"
          >
            Bekijk site <span aria-hidden>↗</span>
          </a>
          <div className="em-user-block">
            <div className="em-user-avatar" aria-hidden>
              A
            </div>
            <div className="em-user-info">
              <span className="em-user-name">Admin</span>
              <span className="em-user-status">Ingelogd</span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="em-logout-btn"
              aria-label="Uitloggen"
              disabled={loggingOut}
              title="Uitloggen"
            >
              →
            </button>
          </div>
        </div>
      </aside>

      <main className="em-main">
        <div className="em-content">
          <ActiveView
            key={active}
            active={active}
            onNavigate={setActive}
            counts={counts}
          />
        </div>
      </main>
    </div>
  );
}

function NavItem({
  id,
  label,
  active,
  onClick,
  count,
}: {
  id: string;
  label: string;
  active: boolean;
  onClick: () => void;
  count?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`em-nav-item${active ? " is-active" : ""}`}
      aria-current={active ? "page" : undefined}
      data-nav-id={id}
    >
      <span>{label}</span>
      {typeof count === "number" && (
        <span className="em-nav-count">{count}</span>
      )}
    </button>
  );
}

function ActiveView({
  active,
  onNavigate,
  counts,
}: {
  active: string;
  onNavigate: (id: string) => void;
  counts: SidebarCounts;
}) {
  if (active === DASHBOARD_ID) {
    const totalSections = ADMIN_PAGES.reduce(
      (sum, p) => sum + p.sections.length,
      0,
    );
    return (
      <DashboardView
        onNavigate={onNavigate}
        counts={{
          pages: ADMIN_PAGES.length,
          sections: totalSections,
          files: 8, // pages/index.ts + 7 json/ts content files
        }}
      />
    );
  }
  if (active === HISTORY_ID) {
    return <HistoryView />;
  }
  const page = getPageById(active);
  if (!page) {
    return (
      <div className="em-empty">
        <div className="em-empty-icon" aria-hidden>
          ?
        </div>
        <div className="em-empty-title">Pagina niet gevonden</div>
        <div className="em-empty-sub">
          De geselecteerde pagina ({active}) staat niet in het schema.
        </div>
      </div>
    );
  }

  // Avoid the unused import warning when SidebarCounts is referenced through props.
  void counts;

  switch (page.view) {
    case "data-list":
      return <DataListView page={page} />;
    case "site-config":
      return <SiteConfigView page={page} />;
    case "page-content":
    default:
      return <PageContentView page={page} />;
  }
}
