export type Category = {
  id: string;
  label: string;
  slug: string;
  description: string;
};

export const categories: Category[] = [
  {
    id: "gids",
    label: "Gids",
    slug: "gids",
    description: "Praktische gidsen voor het organiseren van een bedrijfsuitje in Amsterdam.",
  },
  {
    id: "inspiratie",
    label: "Inspiratie",
    slug: "inspiratie",
    description: "Ideeën en achtergrondverhalen voor wie iets origineels zoekt.",
  },
  {
    id: "achter-de-schermen",
    label: "Achter de schermen",
    slug: "achter-de-schermen",
    description: "Hoe wij werken, van scriptschrijven tot logistiek voor 60 sloepen.",
  },
  {
    id: "amsterdam",
    label: "Amsterdam",
    slug: "amsterdam",
    description: "Verhalen over de stad, geschiedenis, grachten, verborgen plekken.",
  },
  {
    id: "team",
    label: "Team",
    slug: "team",
    description: "Tips voor teambuilding, groepsdynamiek en blijvende impact.",
  },
];

export const categoryBySlug = (slug: string) =>
  categories.find((c) => c.slug === slug);
