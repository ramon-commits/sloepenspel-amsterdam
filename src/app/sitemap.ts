import type { MetadataRoute } from "next";
import { articles, articleHref } from "@/content/articles";
import { categories } from "@/content/categories";
import { restaurants } from "@/content/restaurants";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const staticRoutes = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/het-spel", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/locaties-groepen", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/prijzen", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/over", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/blog", priority: 0.85, changeFrequency: "weekly" as const },
    { path: "/restaurants", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/en", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/algemene-voorwaarden", priority: 0.3, changeFrequency: "yearly" as const },
    // SEO landings
    { path: "/teambuilding-amsterdam", priority: 0.85, changeFrequency: "monthly" as const },
    { path: "/personeelsuitje-amsterdam", priority: 0.85, changeFrequency: "monthly" as const },
    { path: "/bedrijfsuitje-grote-groep", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/leuke-teamuitjes-amsterdam", priority: 0.7, changeFrequency: "monthly" as const },
  ];

  const articleEntries = articles.map((a) => ({
    url: `${SITE_URL}${articleHref(a)}`,
    lastModified: a.dateModified,
    changeFrequency: "monthly" as const,
    priority: a.isPillar ? 0.85 : 0.7,
  }));

  const categoryEntries = categories.map((c) => ({
    url: `${SITE_URL}/blog/category/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const restaurantEntries = restaurants.map((r) => ({
    url: `${SITE_URL}/restaurants/${r.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [
    ...staticRoutes.map((r) => ({
      url: `${SITE_URL}${r.path}`,
      lastModified: now,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })),
    ...articleEntries,
    ...categoryEntries,
    ...restaurantEntries,
  ];
}
