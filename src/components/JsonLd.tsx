import { jsonLdScript } from "@/lib/seo";

/** Renders a single JSON-LD <script type="application/ld+json"> block. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Server-rendered string; safe, content is deterministic JSON
      dangerouslySetInnerHTML={{ __html: jsonLdScript(data) }}
    />
  );
}

/** Renders multiple JSON-LD blocks. */
export function JsonLdGroup({ items }: { items: object[] }) {
  return (
    <>
      {items.map((item, i) => (
        <JsonLd key={i} data={item} />
      ))}
    </>
  );
}
