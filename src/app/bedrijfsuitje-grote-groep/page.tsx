import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { BlogLayout } from "@/components/BlogLayout";
import { JsonLdGroup } from "@/components/JsonLd";
import { breadcrumbLd, articleLd, absUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Bedrijfsuitje Grote Groep Amsterdam | 100-500+ Personen",
  description:
    "Bedrijfsuitje voor een grote groep in Amsterdam? Het Sloepenspel schaalt van 30 tot 500+ personen over 6 locaties.",
  alternates: { canonical: "/bedrijfsuitje-grote-groep" },
  openGraph: {
    type: "article",
    title: "Bedrijfsuitje voor 100+ Personen in Amsterdam",
    description: "Schaalbaar tot 500+ personen, persoonlijk per team.",
    url: absUrl("/bedrijfsuitje-grote-groep"),
    images: [{ url: absUrl("/images/groep-meerdere-sloepen.jpg") }],
  },
};

export default function BedrijfsuitjeGroteGroepPage() {
  const articleData = {
    slug: "bedrijfsuitje-grote-groep",
    title: "Bedrijfsuitje voor 100+ Personen? Zo Werkt Het.",
    excerpt: "Een groot bedrijfsuitje organiseren in Amsterdam zonder dat het anoniem voelt.",
    intro: "",
    body: "",
    category: "team" as const,
    tags: ["bedrijfsuitje grote groep", "bedrijfsuitje amsterdam", "groot bedrijfsuitje"],
    authorId: "daan" as const,
    datePublished: "2026-05-04",
    dateModified: "2026-05-04",
    readMinutes: 5,
    ogImage: "/images/groep-meerdere-sloepen.jpg",
    imageAlt: "Bedrijfsuitje grote groep Amsterdam, 60 sloepen op de gracht",
    isPillar: true,
  };

  return (
    <>
      <JsonLdGroup
        items={[
          articleLd(articleData, "/bedrijfsuitje-grote-groep"),
          breadcrumbLd([{ name: "Bedrijfsuitje grote groep", href: "/bedrijfsuitje-grote-groep" }]),
        ]}
      />
      <Nav />
      <main id="main-content">
        <BlogLayout
          title="Bedrijfsuitje voor 100+ Personen? Zo Werkt Het."
          category="Gids"
          readMinutes={5}
          intro="Een bedrijfsuitje organiseren voor een grote groep in Amsterdam, dat is een puzzel apart. Logistiek, kosten, maar vooral: hoe zorg je dat het persoonlijk blijft als je met 200 of 300 personen tegelijk op pad gaat? Hier lees je hoe wij dat doen, met groepen tot 500+ personen."
          related={[
            { title: "Bedrijfsuitje varen Amsterdam, complete gids", href: "/bedrijfsuitje-varen", readMinutes: 7 },
            { title: "Personeelsuitje Amsterdam", href: "/personeelsuitje-amsterdam", readMinutes: 6 },
            { title: "Hoe het Sloepenspel werkt", href: "/het-spel", readMinutes: 4 },
          ]}
        >
          <h2>Schaalbaarheid is de kern</h2>
          <p>
            Voor een bedrijfsuitje grote groep heb je een format nodig dat schaalt zonder anoniem te worden. De grootste fout die organisatoren maken: één megapodium voor 200 mensen, één presentator voor iedereen, één routekaart die alle teams volgen. Dat resultaat is voorspelbaar, vergetabel.
          </p>
          <p>
            Onze opzet werkt anders. Bij groepen van 100+ personen verdelen we over <strong>meerdere vertreklocaties</strong>, met gespreide starttijden van tien minuten per wave. Elk team van 8 personen krijgt een eigen sloep en een eigen iPad. De software stuurt elk team via een eigen route, langs verschillende hotspots, met variërende challenges. Geen twee teams hebben dezelfde middag.
          </p>

          <h2>De drie elementen voor grote groepen</h2>
          <h3>1. Meerdere vertreklocaties</h3>
          <p>
            Wij werken met 6 opstaplocaties verspreid over Amsterdam. Bij groepen boven 250 personen zetten we drie locaties tegelijk in: Location Center, Location Amstel en Location South. Elke locatie heeft een eigen ontvangstacteur, eigen briefing, eigen check-in tijd. Daarmee voelt het persoonlijk per locatie en niet als bulk-toerisme.
          </p>

          <h3>2. Gespreide starttijden</h3>
          <p>
            Geen 30 sloepen die tegelijk de gracht opkomen. We zetten waves van 6 tot 8 boten met 10 minuten interval. Daarmee voorkomen we drukte op de Amstel of Singelgracht, en houden we het tempo per team beheersbaar.
          </p>

          <h3>3. Live monitoring per sloep</h3>
          <p>
            Elke sloep heeft een marifoon op kanaal 19. Onze begeleiders monitoren continu, niet om te corrigeren maar om hulp te bieden bij verdwalen of een vraag. Bij grote groepen hebben we per locatie ook een 'zwerver-positie': een begeleider die niet vast aan een sloep zit en kan bijspringen.
          </p>

          <blockquote>
            Een vloot van zestig sloepen die tegelijk een bocht omslaat richting de finish. Daar zwijgt iedereen even. Zo eindig je een bedrijfsuitje voor 480 mensen zonder dat het ooit anoniem voelt.
          </blockquote>

          <h2>Het moment dat alles samenkomt</h2>
          <p>
            Bij grote groepen is het kritieke moment het einde. Drie uur lang zijn alle teams apart bezig geweest met verschillende routes en challenges. De laatste vijftien minuten plannen we zo dat alle teams via verschillende routes naar één bottleneck varen, vaak de Amstelsluizen of de Magere Brug. Plotseling zien zestig boten elkaar weer. Dat moment is het hart van de dag.
          </p>
          <p>
            Daarna gaan alle teams door naar de eindlocatie, meestal Amstelhaven of Strand Zuid. Daar komen alle teams binnen één uur samen voor de prijsuitreiking en het diner. De timing van die samenkomst is precies, te vroeg en mensen vervelen zich, te laat en de eerste teams zitten al uitgenodigd.
          </p>

          <h2>Praktisch: kosten voor grote groepen</h2>
          <p>
            De prijs blijft €59,50 per persoon, ook voor groepen van 200 of 500. Geen volume-toeslag, geen extra organisatiefee. Wat wel mee kan veranderen: het aantal locatie-acteurs op de route, het aantal vertreklocaties, en het restaurant achteraf. Dat staat altijd duidelijk in de offerte.
          </p>
          <p>
            Voor groepen vanaf 100 personen sturen we een aangepaste offerte met de logistieke aanpak, vertrekschema en de eindlocatie-opties. Reactie binnen 24 uur.
          </p>
        </BlogLayout>
      </main>
      <Footer />
    </>
  );
}
