import { latestArticles, articleHref, authorOf, categoryOf } from "@/content/articles";
import { siteConfig } from "@/content/site.config";
import { SITE_URL, absUrl } from "@/lib/seo";

export async function GET() {
  const items = latestArticles(50);
  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: `${siteConfig.name}, Blog`,
    home_page_url: `${SITE_URL}/blog`,
    feed_url: `${SITE_URL}/feed.json`,
    description:
      "Gidsen, achtergronden en verhalen over bedrijfsuitjes op het water in Amsterdam.",
    language: "nl-NL",
    icon: absUrl("/images/logo-emblem.png"),
    favicon: absUrl("/favicon.ico"),
    authors: [{ name: "Sloepenspel Amsterdam team" }],
    items: items.map((a) => {
      const author = authorOf(a);
      const cat = categoryOf(a);
      return {
        id: absUrl(articleHref(a)),
        url: absUrl(articleHref(a)),
        title: a.title,
        summary: a.excerpt,
        content_text: stripHtml(`${a.intro} ${a.body}`),
        date_published: new Date(a.datePublished).toISOString(),
        date_modified: new Date(a.dateModified).toISOString(),
        image: absUrl(a.ogImage),
        tags: [...(cat ? [cat.label] : []), ...a.tags],
        authors: [{ name: author.name, url: author.sameAs?.[0] }],
        language: "nl-NL",
      };
    }),
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      "Content-Type": "application/feed+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

function stripHtml(s: string) {
  return s
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 600);
}
