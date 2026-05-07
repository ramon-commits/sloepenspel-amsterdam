"use client";

import type { ContentPage } from "@/lib/admin-content-schema";
import { PageContentView } from "./PageContentView";

/**
 * For now data-list views render the same as page-content views.
 * The schema's `isArray` flag does the heavy lifting, so reviews / FAQ /
 * restaurants / team / locations all render as a flat list of editable
 * cards. Adding/removing/reordering items will be wired up in stap 6.
 */
export function DataListView({ page }: { page: ContentPage }) {
  return <PageContentView page={page} />;
}
