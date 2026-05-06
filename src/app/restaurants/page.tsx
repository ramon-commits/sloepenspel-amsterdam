import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { JsonLdGroup } from "@/components/JsonLd";
import { restaurants } from "@/content/restaurants";
import { breadcrumbLd, absUrl, SITE_URL } from "@/lib/seo";
import services from "@/content/services.json";
import { RestaurantsBrowser } from "@/components/RestaurantsBrowser";

export const metadata: Metadata = {
  title: { absolute: "Restaurants na het Sloepenspel | Amsterdam | Sloepenspel" },
  description:
    "Bekijk onze 17 restaurantpartners in Amsterdam. Filter op vaarlocatie en vind een diner-plek bij elke Sloepenspel-route.",
  alternates: { canonical: "/restaurants" },
  openGraph: {
    type: "website",
    title: "Restaurants na het Sloepenspel | Amsterdam",
    description:
      "Onze 17 restaurantpartners in Amsterdam, te filteren op vaarlocatie.",
    url: absUrl("/restaurants"),
  },
};

export default function RestaurantsIndexPage() {
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}/restaurants#list`,
    name: "Restaurantpartners van Sloepenspel Amsterdam",
    numberOfItems: restaurants.length,
    itemListElement: restaurants.map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absUrl(`/restaurants/${r.slug}`),
      name: r.name,
    })),
  };

  // Pass minimal serializable shape to client component
  const items = restaurants.map((r) => ({
    slug: r.slug,
    name: r.name,
    keuken: r.keuken,
    sfeer: r.sfeer,
    bijzonderDetail: r.bijzonderDetail,
    capacity: r.capacity,
    maxGroup: r.maxGroup,
    prijsklasse: r.prijsklasse,
    groepsruimte: r.groepsruimte,
    locationId: r.locationId,
    locationName: r.locationName,
    hero: r.hero,
  }));

  const locations = services.locations.map((l) => ({
    id: l.id,
    name: l.name,
  }));

  return (
    <>
      <JsonLdGroup
        items={[
          itemListLd,
          breadcrumbLd([{ name: "Restaurants", href: "/restaurants" }]),
        ]}
      />
      <Nav />
      <main id="main-content">
        <RestaurantsBrowser items={items} locations={locations} />
      </main>
      <Footer />
    </>
  );
}
