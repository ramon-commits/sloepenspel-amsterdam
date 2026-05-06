import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { BlogLayout } from "@/components/BlogLayout";
import { JsonLdGroup } from "@/components/JsonLd";
import { breadcrumbLd, articleLd, absUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Personeelsuitje Amsterdam | €59,50 p.p. All-in",
  description:
    "Op zoek naar een personeelsuitje in Amsterdam? Het Sloepenspel is geschikt voor 30-500+ personen. Inclusief alles, geen verborgen kosten.",
  alternates: { canonical: "/personeelsuitje-amsterdam" },
  openGraph: {
    type: "article",
    title: "Personeelsuitje Amsterdam | €59,50 p.p. All-in",
    description: "Personeelsuitje voor 30-500+ personen, all-in vanaf €59,50.",
    url: absUrl("/personeelsuitje-amsterdam"),
    images: [{ url: absUrl("/images/sloep-met-eten.jpg") }],
  },
};

export default function PersoneelsuitjePage() {
  const articleData = {
    slug: "personeelsuitje-amsterdam",
    title: "Het Personeelsuitje in Amsterdam Dat Iedereen Leuk Vindt",
    excerpt: "Een personeelsuitje voor iedereen in jullie team, in één middag op het water.",
    intro: "",
    body: "",
    category: "team" as const,
    tags: ["personeelsuitje amsterdam", "bedrijfsuitje amsterdam", "teamuitje amsterdam"],
    authorId: "daan" as const,
    datePublished: "2026-05-04",
    dateModified: "2026-05-04",
    readMinutes: 6,
    ogImage: "/images/sloep-met-eten.jpg",
    imageAlt: "Personeelsuitje Amsterdam, team dineert op de sloep na het Sloepenspel",
    isPillar: true,
  };

  return (
    <>
      <JsonLdGroup
        items={[
          articleLd(articleData, "/personeelsuitje-amsterdam"),
          breadcrumbLd([{ name: "Personeelsuitje Amsterdam", href: "/personeelsuitje-amsterdam" }]),
        ]}
      />
      <Nav />
      <main id="main-content">
        <BlogLayout
          title="Het Personeelsuitje in Amsterdam Dat Iedereen Leuk Vindt"
          category="Gids"
          readMinutes={6}
          intro="Een personeelsuitje organiseren in Amsterdam waar iedereen blij van wordt: het lijkt simpel, maar elke HR-manager weet dat het dat niet is. De fanatieke collega wil sport en competitie, de rustige collega wil niet voor lul staan, en jij wil dat iedereen het naar zijn zin heeft, binnen budget. Hier lees je hoe je een personeelsuitje plant dat voor elk type team werkt."
          related={[
            { title: "Bedrijfsuitje varen in Amsterdam", href: "/bedrijfsuitje-varen", readMinutes: 7 },
            { title: "Origineel bedrijfsuitje in Amsterdam", href: "/origineel-bedrijfsuitje", readMinutes: 6 },
            { title: "Bedrijfsuitje voor 100+ personen", href: "/bedrijfsuitje-grote-groep", readMinutes: 5 },
          ]}
        >
          <h2>De uitdaging van een goed personeelsuitje</h2>
          <p>
            Bij elk personeelsuitje in Amsterdam loop je tegen dezelfde drie uitdagingen aan. <strong>Eén:</strong> verschillende voorkeuren in één team. De ene helft wil fanatiek racen, de andere helft wil relaxen met een rosé. <strong>Twee:</strong> het budget. Iedereen wil iets bijzonders, maar liefst zonder verrassingen achteraf. <strong>Drie:</strong> de logistiek. 80 mensen op tijd op één plek krijgen, met dieetwensen, transport en eindlocatie.
          </p>
          <p>
            De meeste opties lossen één van die drie problemen op. Wij zijn gemaakt om alle drie tegelijk te doen.
          </p>

          <h2>Waarom het water werkt voor groepen</h2>
          <p>
            Een personeelsuitje varen Amsterdam doet iets opvallends: het maakt de groep automatisch kleiner zonder dat je iets hoeft te plannen. Een sloep heeft 8 plekken. Bij een groep van 60 mensen heb je dus 8 sloepen, 8 micro-teams. Iedereen zit dichtbij elkaar, niemand verdwijnt in de menigte, niemand staat aan de zijlijn.
          </p>
          <p>
            En het mooie: iedereen kan zelf zijn tempo bepalen. Wil je team fanatiek alle challenges volledig uitspelen om het hoogste op het scorebord te eindigen? Ga ervoor. Liever rustig varen, foto's maken en alleen de leuke opdrachten doen? Ook prima. Het systeem dwingt niemand tot iets, maar laat iedereen meedoen op zijn eigen niveau.
          </p>

          <h2>Wat het kost en wat erin zit</h2>
          <p>
            Voor een personeelsuitje Amsterdam rekenen we €59,50 per persoon. Daar zit alles in: de sloep met vaarbegeleiding, het iPad-spel, de locatie-acteurs onderweg, hapjes en drankjes aan boord, en de prijsuitreiking aan het eind. Voor 60 personen is dat €3.570 voor het hele uitje. Geen extra organisatiefee, geen verrassingen.
          </p>
          <p>
            Wat er <em>niet</em> in zit: lunch of diner. Dat boek je bij één van onze 17 restaurantpartners die geschikt zijn voor jullie groepsgrootte. Wij regelen de afstemming, jullie kiezen de keuken.
          </p>

          <blockquote>
            Een personeelsuitje is geen plek om compromissen te sluiten. Wat collega's binnen een week vergeten, hadden we niet hoeven boeken. Wat ze nog maanden later aanhalen, was de moeite waard.
          </blockquote>

          <h2>Voor wie is het geschikt?</h2>
          <p>
            Ons personeelsuitje werkt voor verschillende type teams:
          </p>
          <ul>
            <li><strong>Tech bedrijven:</strong> de sabotage-gadgets en digital-first opzet vinden ze typisch leuk. Mollie, WeTransfer en Channable zijn vaste klanten.</li>
            <li><strong>Agencies en creatives:</strong> de storytelling en de mooie locaties spreken aan. Studio Brouwer en Bynder boeken regelmatig.</li>
            <li><strong>Financiële instellingen:</strong> de schaalbaarheid voor grote groepen werkt voor afdelingen. Adyen en Mollie zijn klant.</li>
            <li><strong>Family-bedrijven:</strong> de mix van competitief en relaxt past bij gemengde leeftijden.</li>
          </ul>

          <h2>Praktisch: van offerte tot uitje</h2>
          <p>
            Het proces is simpel. Vraag een offerte aan met jullie groepsgrootte, gewenste datum en voorkeurslocatie. Binnen 24 uur ontvang je een offerte op maat met alle details. Bij akkoord regelen we de boeking, het restaurant, en sturen we vooraf alle praktische info naar de deelnemers.
          </p>
          <p>
            Op de dag zelf hoef je niets te doen. Onze cast ontvangt jullie op de kade, het spel start automatisch op de iPad, en wij houden alles in de gaten. Aan het einde komen alle teams samen voor de prijsuitreiking, en je gaat naar het restaurant.
          </p>

          <h2>Klaar om te boeken?</h2>
          <p>
            Een personeelsuitje in Amsterdam dat iedereen leuk vindt: het kan, en het hoeft niet duur of ingewikkeld te zijn. Vraag vrijblijvend een offerte aan en wij helpen je verder.
          </p>
        </BlogLayout>
      </main>
      <Footer />
    </>
  );
}
