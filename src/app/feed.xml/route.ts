import { latestArticles, articleHref, authorOf, categoryOf } from "@/content/articles";
import { siteConfig } from "@/content/site.config";
import { SITE_URL, absUrl } from "@/lib/seo";

const escapeXml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export async function GET() {
  const items = latestArticles(50);
  const buildDate = new Date().toUTCString();

  const itemsXml = items
    .map((a) => {
      const url = absUrl(articleHref(a));
      const cat = categoryOf(a);
      const author = authorOf(a);
      const pubDate = new Date(a.datePublished).toUTCString();
      return `
    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(a.excerpt)}</description>
      <author>${escapeXml(author.name)}</author>
      ${cat ? `<category>${escapeXml(cat.label)}</category>` : ""}
      <enclosure url="${absUrl(a.ogImage)}" type="image/jpeg" />
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)}, Blog</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Gidsen, achtergronden en verhalen over bedrijfsuitjes op het water in Amsterdam.</description>
    <language>nl-NL</language>
    <lastBuildDate>${buildDate}</lastBuildDate>${itemsXml}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
