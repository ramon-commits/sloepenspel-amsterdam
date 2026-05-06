export type Author = {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar?: string;
  sameAs?: string[];
};

export const authors: Record<string, Author> = {
  lotte: {
    id: "lotte",
    name: "Lotte van Rijn",
    role: "Founder & lead game design",
    bio: "Schrijft de verhaallijnen, kent elke gracht. Acht jaar ervaring met live storytelling in Amsterdam.",
    sameAs: ["https://linkedin.com/in/lottevanrijn"],
  },
  daan: {
    id: "daan",
    name: "Daan Hofstra",
    role: "Operations",
    bio: "Houdt 60 sloepen tegelijk in de gaten zonder te zweten. Schrijft over logistiek, planning en groepsdynamiek.",
    sameAs: ["https://linkedin.com/in/daanhofstra"],
  },
  aisha: {
    id: "aisha",
    name: "Aïsha Mendel",
    role: "Cast & acteurs",
    bio: "Werkt met onze pool van 24 acteurs. Schrijft over rolspel, immersieve ervaringen en publieksinteractie.",
    sameAs: ["https://linkedin.com/in/aishamendel"],
  },
};

export const defaultAuthor = authors.lotte;
