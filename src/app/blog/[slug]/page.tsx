import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { BlogLayout, type RelatedArticle } from "@/components/BlogLayout";
import { JsonLdGroup } from "@/components/JsonLd";
import { articles, articleBySlug, articleHref, authorOf, categoryOf } from "@/content/articles";
import { articleLd, breadcrumbLd, faqLd, absUrl } from "@/lib/seo";

export async function generateStaticParams() {
  return articles
    .filter((a) => !a.isPillar)
    .map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = articleBySlug(slug);
  if (!article) return { title: "Niet gevonden" };

  const url = `/blog/${article.slug}`;
  const author = authorOf(article);

  return {
    title: article.title,
    description: article.excerpt,
    authors: [{ name: author.name }],
    keywords: article.tags,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url: absUrl(url),
      title: article.title,
      description: article.excerpt,
      images: [{ url: absUrl(article.ogImage), alt: article.imageAlt }],
      locale: "nl_NL",
      publishedTime: article.datePublished,
      modifiedTime: article.dateModified,
      authors: [author.name],
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [absUrl(article.ogImage)],
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articleBySlug(slug);
  if (!article || article.isPillar) notFound();

  const cat = categoryOf(article);
  const url = `/blog/${article.slug}`;

  const related: RelatedArticle[] = (article.related ?? [])
    .map((relSlug) => articleBySlug(relSlug))
    .filter((a): a is NonNullable<typeof a> => Boolean(a))
    .map((a) => ({
      title: a.title,
      href: articleHref(a),
      readMinutes: a.readMinutes,
    }));

  const ld: object[] = [
    articleLd(article, url),
    breadcrumbLd([
      { name: "Blog", href: "/blog" },
      ...(cat ? [{ name: cat.label, href: `/blog/category/${cat.slug}` }] : []),
      { name: article.title, href: url },
    ]),
  ];
  if (article.faq?.length) ld.push(faqLd(article.faq));

  return (
    <>
      <JsonLdGroup items={ld} />
      <Nav />
      <main id="main-content">
        <BlogLayout
          title={article.title}
          category={cat?.label ?? "Blog"}
          readMinutes={article.readMinutes}
          intro={article.intro}
          related={related}
        >
          <div dangerouslySetInnerHTML={{ __html: article.body }} />
          {article.faq && article.faq.length > 0 && (
            <>
              <h2>Veelgestelde vragen</h2>
              {article.faq.map((f, i) => (
                <div key={i}>
                  <h3>{f.q}</h3>
                  <p>{f.a}</p>
                </div>
              ))}
            </>
          )}
        </BlogLayout>
      </main>
      <Footer />
    </>
  );
}
