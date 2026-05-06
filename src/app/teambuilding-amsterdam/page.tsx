import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { BlogLayout } from "@/components/BlogLayout";
import { JsonLdGroup } from "@/components/JsonLd";
import { breadcrumbLd, articleLd, absUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Teambuilding Amsterdam | De Leukste Opties op het Water",
  description:
    "Teambuilding in Amsterdam organiseren? Ontdek waarom steeds meer bedrijven kiezen voor een interactief programma op de grachten.",
  alternates: { canonical: "/teambuilding-amsterdam" },
  openGraph: {
    type: "article",
    title: "Teambuilding Amsterdam | De Leukste Opties op het Water",
    description:
      "Teambuilding in Amsterdam: waarom het water werkt, opties vergeleken, praktische tips.",
    url: absUrl("/teambuilding-amsterdam"),
    images: [{ url: absUrl("/images/groep-meerdere-sloepen.jpg") }],
  },
};

export default function TeambuildingAmsterdamPage() {
  const articleData = {
    slug: "teambuilding-amsterdam",
    title: "Teambuilding in Amsterdam: Waarom het Water Wint",
    excerpt:
      "Teambuilding in Amsterdam organiseren? Waarom het water steeds vaker wint van escape rooms en pubquizzen.",
    intro: "",
    body: "",
    category: "team" as const,
    tags: ["teambuilding amsterdam", "teamuitje amsterdam", "bedrijfsuitje amsterdam"],
    authorId: "lotte" as const,
    datePublished: "2026-05-04",
    dateModified: "2026-05-04",
    readMinutes: 8,
    ogImage: "/images/groep-meerdere-sloepen.jpg",
    imageAlt: "Teambuilding Amsterdam, team in sloepen op de gracht",
    isPillar: true,
  };

  return (
    <>
      <JsonLdGroup
        items={[
          articleLd(articleData, "/teambuilding-amsterdam"),
          breadcrumbLd([
            { name: "Gids", href: "/teambuilding-amsterdam" },
          ]),
        ]}
      />
      <Nav />
      <main id="main-content">
        <BlogLayout
          title="Teambuilding in Amsterdam: Waarom het Water Wint"
          category="Gids"
          readMinutes={8}
          intro="Teambuilding in Amsterdam organiseren is een uitdaging waar elke HR-manager of office manager mee worstelt. De keuzes zijn eindeloos: escape rooms, kookworkshops, GPS-tochten, pubquizzen, beach clubs. Maar één optie wordt steeds populairder: teambuilding op het water. Hier lees je waarom dat is, welke opties je hebt, en waarop je let bij de keuze."
          related={[
            { title: "Origineel bedrijfsuitje in Amsterdam", href: "/origineel-bedrijfsuitje", readMinutes: 6 },
            { title: "Bedrijfsuitje varen in Amsterdam, complete gids", href: "/bedrijfsuitje-varen", readMinutes: 7 },
            { title: "Hoe werkt het Sloepenspel?", href: "/het-spel", readMinutes: 4 },
          ]}
        >
          <h2>Waarom Amsterdam perfect is voor teambuilding</h2>
          <p>
            Amsterdam draait al eeuwen om water. De grachten zijn niet alleen een toeristische trekpleister, ze zijn een natuurlijke setting voor teambuilding. Een team in een sloep is automatisch dichter bij elkaar dan een team aan een vergadertafel. Geen telefoonbereik dat afleidt, geen formele hiërarchie van een lange tafel, geen vluchtroute naar de buffet.
          </p>
          <p>
            De stad zelf werkt ook mee. Of je nu kiest voor een rustige route door de Lijnbaansgracht of de drukte van de Prinsengracht, Amsterdam biedt voldoende variatie om een uitje voor elke groep persoonlijk te maken. En na afloop is er overal binnen tien minuten een goed restaurant.
          </p>

          <h2>De populairste teambuilding-opties vergeleken</h2>
          <p>
            We zien al jaren welke opties teams kiezen. Hier de meest gevraagde, eerlijk vergeleken:
          </p>

          <h3>Escape rooms</h3>
          <p>
            Goed voor kleine teams van 4 tot 8 personen, één uur intens samenwerken. Zwakke kant: niet schaalbaar voor groepen groter dan 30 (je moet meerdere rooms naast elkaar boeken) en iedereen krijgt min of meer dezelfde ervaring. Voor afdelingen die elkaar al kennen vaak te voorspelbaar.
          </p>

          <h3>Kookworkshops</h3>
          <p>
            Werkt goed voor middelgrote groepen die houden van fysieke samenwerking. Limiet ligt rond de 40 personen op één locatie. Het probleem: iedereen doet hetzelfde, dus geen verrassende interacties tussen teams.
          </p>

          <h3>Pubquiz</h3>
          <p>
            Grote groepen zijn geen probleem, alle leeftijden doen mee. Maar de format is vaak passief: aan tafels zitten, vragen beantwoorden. Geen beweging, weinig herinnering achteraf.
          </p>

          <h3>Bedrijfsuitje op het water</h3>
          <p>
            Onze categorie. Schaalbaar van 30 tot 500 personen. Iedereen actief: zelf varen, zelf opdrachten oplossen, zelf de stad ontdekken. Door de combinatie van beweging, verhaal en challenges blijft er meer hangen dan bij een statisch programma.
          </p>

          <h2>Teambuilding op het water, hoe werkt dat?</h2>
          <p>
            Een goed bedrijfsuitje varen Amsterdam combineert drie elementen: een eigen sloep per team, een interactief spel met opdrachten via een iPad, en live acteurs op de route die het verhaal tot leven brengen. Onze opzet duurt 3,5 uur, met 8 personen per sloep.
          </p>
          <p>
            De software stuurt elk team automatisch naar hotspots door de stad. Bij elke locatie krijgt het team het verhaal van die plek, samengesteld met 12 Amsterdamse VIP-gidsen, en activeert een challenge. Foto-opdrachten, augmented reality, minigames, samenwerkingsopdrachten. Tussendoor verschijnen onze acteurs op specifieke punten, niet als saaie gids maar als onverwachte ontmoeting.
          </p>
          <p>
            Het effect: teams die elkaar in een nieuwe context zien. Mensen nemen rollen die ze normaal niet pakken. De spelverdeler op de iPad blijkt een natuurlijke leider, de stille collega is plotseling de beste navigator. Dit zijn de momenten waar teams van veranderen.
          </p>

          <blockquote>
            Teambuilding werkt pas als mensen elkaar in een nieuwe rol zien. Niet bij de koffie, niet in de meeting, maar onder druk samen iets oplossen. Het water dwingt dat af.
          </blockquote>

          <h2>Praktisch: groepsgroottes en locaties</h2>
          <p>
            Voor teambuilding in Amsterdam op het water heb je verschillende opstaplocaties nodig, afhankelijk van de groepsgrootte. Wij werken met 6 locaties verspreid over de stad:
          </p>
          <ul>
            <li><strong>12 tot 30 personen:</strong> Location Pijp of Location East, intieme afsluiting in De Pijp of Oost</li>
            <li><strong>30 tot 60 personen:</strong> alle locaties beschikbaar, ruime keus aan eindrestaurants</li>
            <li><strong>60 tot 100 personen:</strong> Location Center, Amstel of Weesper, voldoende ruimte voor 8 tot 12 sloepen</li>
            <li><strong>100+ personen:</strong> meerdere vertreklocaties met gespreide starttijden</li>
          </ul>

          <h2>Wat het kost en wat erin zit</h2>
          <p>
            Het Sloepenspel kost €59,50 per persoon, all-in. Daarbij zit alles inbegrepen: de sloep met vaarbegeleiding, het iPad-spel, de locatie-acteurs, hapjes en drankjes aan boord, en de prijsuitreiking. De enige extra: het diner achteraf, dat boek je bij één van onze 17 restaurantpartners. <strong>Geen verborgen kosten, geen extra organisatiefee.</strong>
          </p>

          <h2>Klaar om te plannen?</h2>
          <p>
            Teambuilding in Amsterdam organiseren hoeft geen hoofdpijn te zijn. Eén telefoontje of formulier en wij regelen de hele dag, inclusief restaurant en transport tussen locaties. Reactie binnen 24 uur, en dan kun je het uit handen geven.
          </p>
        </BlogLayout>
      </main>
      <Footer />
    </>
  );
}
