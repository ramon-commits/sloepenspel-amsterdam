"use client";

import { useEffect, useState } from "react";

/**
 * Compact "recent changes" timeline backed by GitHub's commits API.
 * Used both in the dashboard widget and as the basis for the full
 * HistoryView. Only shows commits prefixed with "admin:" — i.e. the ones
 * the admin tool itself made.
 */

export type AdminCommit = {
  sha: string;
  shortSha: string;
  message: string;
  date: string;
  author: string;
  url: string;
  isAdmin: boolean;
};

type FetchState =
  | { status: "loading" }
  | { status: "ready"; commits: AdminCommit[] }
  | { status: "error"; error: string };

function relativeTime(iso: string): string {
  const ts = new Date(iso).getTime();
  const diffMs = Date.now() - ts;
  const sec = Math.round(diffMs / 1000);
  if (sec < 60) return "zojuist";
  const min = Math.round(sec / 60);
  if (min < 60) return `${min} min geleden`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr} uur geleden`;
  const day = Math.round(hr / 24);
  if (day < 7) return `${day} dag${day === 1 ? "" : "en"} geleden`;
  return new Date(iso).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "short",
  });
}

function trimAdminPrefix(message: string): string {
  return message.replace(/^admin:\s*/u, "");
}

type Props = {
  limit?: number;
  title?: string;
  onSeeAll?: () => void;
  /** When false, includes non-admin commits too. Default true. */
  adminOnly?: boolean;
};

export function RecentChanges({
  limit = 6,
  title,
  onSeeAll,
  adminOnly = true,
}: Props) {
  const [state, setState] = useState<FetchState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/admin/history?limit=${limit}&adminOnly=${adminOnly ? "1" : "0"}`,
          {
            cache: "no-store",
          },
        );
        const data = (await res.json()) as
          | { ok: true; commits: AdminCommit[] }
          | { ok: false; error: string };
        if (cancelled) return;
        if (!data.ok) {
          setState({ status: "error", error: data.error });
          return;
        }
        setState({ status: "ready", commits: data.commits });
      } catch (e) {
        if (cancelled) return;
        setState({
          status: "error",
          error: e instanceof Error ? e.message : "Network error",
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [limit, adminOnly]);

  return (
    <div>
      {title && (
        <div className="em-content-toolbar" style={{ marginBottom: 12 }}>
          <strong style={{ color: "var(--color-text)" }}>{title}</strong>
          {onSeeAll && (
            <button
              type="button"
              className="em-link-button"
              onClick={onSeeAll}
            >
              Bekijk alles →
            </button>
          )}
        </div>
      )}

      {state.status === "loading" && <div className="em-skeleton" />}

      {state.status === "error" && (
        <div className="em-error-card">
          <div>Geschiedenis laden mislukte: {state.error}</div>
        </div>
      )}

      {state.status === "ready" && state.commits.length === 0 && (
        <div className="em-empty">
          <div className="em-empty-icon" aria-hidden>
            ○
          </div>
          <div className="em-empty-title">Nog geen admin-wijzigingen</div>
          <div className="em-empty-sub">
            Zodra je iets opslaat verschijnt het hier met tijdstempel.
          </div>
        </div>
      )}

      {state.status === "ready" && state.commits.length > 0 && (
        <ol className="em-timeline" aria-label="Recente wijzigingen">
          {state.commits.map((c) => (
            <li className="em-timeline-item" key={c.sha}>
              <span className="em-timeline-dot" aria-hidden />
              <div className="em-timeline-body">
                <div className="em-timeline-message">{trimAdminPrefix(c.message)}</div>
                <div className="em-timeline-meta">
                  <span>{relativeTime(c.date)}</span>
                  <span className="em-timeline-sep">·</span>
                  <span>{c.author}</span>
                  <span className="em-timeline-sep">·</span>
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="em-timeline-sha"
                  >
                    {c.shortSha}
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
