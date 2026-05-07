"use client";

import type { ContentPage } from "@/lib/admin-content-schema";
import { PageContentView } from "./PageContentView";

/**
 * Site-wide config view (Config / Navigatie). Shares the page-content
 * renderer — the schema decides which sections are exposed.
 */
export function SiteConfigView({ page }: { page: ContentPage }) {
  return <PageContentView page={page} />;
}
