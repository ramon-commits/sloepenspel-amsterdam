import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { BlogLayout } from "@/components/BlogLayout";
import { JsonLdGroup } from "@/components/JsonLd";
import { breadcrumbLd, articleLd, absUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Leuke Teamuitjes Amsterdam | Top 2026",
  description:
    "Op zoek naar leuke teamuitjes in Amsterdam? Ontdek waarom teams kiezen voor een interactief spel op eigen sloepen door de grachten.",
  alternates: { canonical: "/leuke-teamuitjes-amsterdam" },
  openGraph: {
    type: "article",
    title: "Leuke Teamuitjes Amsterdam | Top 2026",
    description: "De leukste teamuitjes in Amsterdam, vergeleken en getest.",
    url: absUrl("/leuke-teamuitjes-amsterdam"),
    images: [{ url: absUrl("/images/team-met-ipad.jpeg") }],
  },
};

export default function LeukeTeamuitjesPage() {
  const articleData = {
    slug: "leuke-teamuitjes-amsterdam",
    title: "Leuke Teamuitjes in Amsterdam: Het Water Op",
    excerpt: "De populairste opties voor leuke teamuitjes in Amsterdam, voor elk type team.",
    intro: "",
    body: "",
    category: "team" as const,
    tags: ["leuke teamuitjes amsterdam", "origineel bedrijfsuitje amsterdam", "teamuitje amsterdam"],
    authorId: "lotte" as const,
    datePublished: "2026-05-04",
    dateModified: "2026-05-04",
    readMinutes: 5,
    ogImage: "/images/team-met-ipad.jpeg",
    imageAlt: "Leuke teamuitjes Amsterdam, team aan boord met de iPad",
    isPillar: true,
  };

  return (
    <>
      <JsonLdGroup
        items={[
          articleLd(articleData, "/leuke-teamuitjes-amsterdam"),
          breadcrumbLd([{ name: "Leuke teamuitjes", href: "/leuke-teamuitjes-amsterdam" }]),
        ]}
      />
      <Nav />
      <main id="main-content">
        <BlogLayout
          title="Leuke Teamuitjes in Amsterdam: Het Water Op"
          category="Inspiratie"
          readMinutes={5}
          intro="Op zoek naar leuke teamuitjes in Amsterdam? Het is een vraag die elke office manager elk kwartaal weer stelt. De stad staat vol met opties, en de meeste reviewsites geven dezelfde lijst terug. Hier vergelijken we wat écht leuk is, eerlijk en vanuit ervaring met meer dan 1.200 georganiseerde uitjes."
          related={[
            { title: "Origineel bedrijfsuitje in Amsterdam", href: "/origineel-bedrijfsuitje", readMinutes: 6 },
            { title: "Teambuilding in Amsterdam", href: "/teambuilding-amsterdam", readMinutes: 8 },
            { title: "Bedrijfsuitje varen Amsterdam", href: "/bedrijfsuitje-varen", readMinutes: 7 },
          ]}
        >
          <h2>Wat maakt een teamuitje 'leuk'?</h2>
          <p>
            Voor de één is leuk: hard rennen, hard lachen, fanatiek samen iets winnen. Voor de ander: rustig samen aan tafel, goed eten, goede gesprekken. De meeste teams hebben beide types in zich. Een goed teamuitje in Amsterdam laat ruimte voor allebei, in dezelfde middag.
          </p>
          <p>
            Daar slaan veel uitjes de plank mis. Een escape room dwingt iedereen tot één tempo. Een sportclinic dwingt iedereen tot fysiek presteren. Een wijnproeverij dwingt iedereen tot stilzitten. De échte leuke teamuitjes geven elke deelnemer de keuze om hun eigen ding te doen, in een gedeeld kader.
          </p>

          <h2>De top 5 leuke teamuitjes in Amsterdam, vergeleken</h2>

          <h3>1. Sloepenspel op de grachten</h3>
          <p>
            Onze categorie. Eigen sloep per team, iPad-spel, locatie-acteurs, live scorebord. Schaalbaar van 30 tot 500 personen. Voor iedereen die actief en speels wil samen zijn met de stad als achtergrond.
          </p>

          <h3>2. Beach club aan de Sloterplas</h3>
          <p>
            Voor zomerdagen, perfecte vibe. Beperking: vooral consumeren, weinig actieve interactie. Werkt goed na een evenement, minder goed als enige programma.
          </p>

          <h3>3. Gerookt bowlen of pool in Oost</h3>
          <p>
            Klein en sociaal, max 30 personen. Goed voor afdelingen die elkaar al kennen en gewoon willen ontspannen. Niet schaalbaar.
          </p>

          <h3>4. Kookworkshop in De Pijp</h3>
          <p>
            Iedereen actief, fysieke samenwerking, eindigt met een gedeelde maaltijd. Limiet rond 40 personen. Werkt goed voor middelgrote teams.
          </p>

          <h3>5. Stadsspel met locatie-acteurs</h3>
          <p>
            Vergelijkbaar met onze opzet maar te voet. Voor wie niet op het water wil. Beperking: meer afhankelijk van weer, en ouderen lopen minder graag drie uur.
          </p>

          <h2>Wat een uitje écht leuk maakt</h2>
          <p>
            Onze ervaring na 1.200+ uitjes: leuke teamuitjes Amsterdam delen drie kenmerken. Eén: <strong>er is competitie maar geen druk</strong>. Mensen kunnen meedoen of relaxen, en allebei voelt OK. Twee: <strong>er gebeurt iets onverwachts</strong>. Een acteur die plotseling verschijnt, een uitzicht dat iedereen even stil maakt, een opdracht die kantelt halverwege. Drie: <strong>er is een natuurlijke afsluiting</strong>. Een prijsuitreiking, een diner, een moment om de dag samen te nemen.
          </p>

          <blockquote>
            De beste leuke teamuitjes in Amsterdam blijven jaren later nog terugkomen op de werkvloer als interne shorthand. 'Weet je nog die ene gracht?' is meer waard dan 'we hadden een leuk avondje gehad'.
          </blockquote>

          <h2>Klaar om te kiezen?</h2>
          <p>
            Een leuk teamuitje in Amsterdam organiseren hoeft niet ingewikkeld te zijn. Vraag vrijblijvend een offerte aan voor het Sloepenspel, of bekijk eerst <a href="/het-spel">hoe het werkt</a>. Wij regelen de rest.
          </p>
        </BlogLayout>
      </main>
      <Footer />
    </>
  );
}
