import data from "./restaurants.json";
import services from "./services.json";

/** Raw shape, matches restaurants.json exactly */
type RawRestaurant = {
  naam: string;
  slug: string;
  website: string;
  keuken: string;
  sfeer: string;
  max_groep: number;
  adres: string;
  prijsklasse: string;
  groepsruimte: boolean;
  bijzonder_detail: string;
  dichtstbijzijnde_sloepenspel_locatie: string;
  hero?: string;
  gallery?: string[];
  story?: string[];
};

/** Normalized shape used by the rest of the app. */
export type Restaurant = {
  /** Stable url slug (kebab-case). */
  slug: string;
  /** Display name without "Amsterdam" suffix where natural. */
  name: string;
  /** Tagline in English-ish for compatibility with the older listing component. */
  type: string;
  /** Sentence describing atmosphere/style, Dutch, 4-7 woorden. */
  sfeer: string;
  /** "tot X" string used in capacity badges. */
  capacity: string;
  /** Numeric maximum group size. */
  maxGroup: number;
  /** Short description (used in cards / location finder panel). */
  description: string;
  /** Long-form description used on the detail page. */
  longDescription: string;
  /** Striking detail in 1 sentence (~12 words). */
  bijzonderDetail: string;
  /** Cuisine tag in Dutch. */
  keuken: string;
  /** Price tier: €, €€, €€€, €€€€. */
  prijsklasse: string;
  /** Has a separate event/group room. */
  groepsruimte: boolean;
  /** Full street address. */
  address: string;
  /** Closest Sloepenspel boat location id. */
  locationId: string;
  /** Closest Sloepenspel boat location display name. */
  locationName: string;
  /** Official restaurant website. */
  websiteUrl: string;
  /** Hero image (large 16:10) for the detail page. */
  hero: string;
  /** 2–4 ambiance images. */
  gallery: string[];
  /** Multi-paragraph story for the detail page (2–4 paragraphs). */
  story: string[];
};

const locationNameById = new Map(
  services.locations.map((l) => [l.id, l.name] as const)
);

const FALLBACK_GALLERY = [
  "/images/sloep-met-eten.jpg",
  "/images/sloep-gracht-zonnig.png",
  "/images/hero-grachten-golden-hour.png",
];

function normalize(r: RawRestaurant): Restaurant {
  const cleanName = r.naam.replace(/ Amsterdam$/, "");
  const description = `${r.sfeer}.`;
  const longDescription =
    r.story && r.story.length > 0
      ? r.story[0]
      : `${r.sfeer}. ${r.bijzonder_detail}`;
  return {
    slug: r.slug,
    name: cleanName,
    type: r.keuken,
    sfeer: r.sfeer,
    capacity: `tot ${r.max_groep}`,
    maxGroup: r.max_groep,
    description,
    longDescription,
    bijzonderDetail: r.bijzonder_detail,
    keuken: r.keuken,
    prijsklasse: r.prijsklasse,
    groepsruimte: r.groepsruimte,
    address: r.adres,
    locationId: r.dichtstbijzijnde_sloepenspel_locatie,
    locationName:
      locationNameById.get(r.dichtstbijzijnde_sloepenspel_locatie) ?? "Amsterdam",
    websiteUrl: r.website,
    hero: r.hero ?? "/images/sloep-met-eten.jpg",
    gallery: r.gallery && r.gallery.length > 0 ? r.gallery : FALLBACK_GALLERY,
    story: r.story ?? [`${r.sfeer}. ${r.bijzonder_detail}`],
  };
}

export const restaurants: Restaurant[] = (data as RawRestaurant[]).map(normalize);

export const restaurantBySlug = (slug: string) =>
  restaurants.find((r) => r.slug === slug);

export const restaurantsByLocation = (locationId: string) =>
  restaurants.filter((r) => r.locationId === locationId);
