import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { BlogLayout } from "@/components/BlogLayout";
import { JsonLdGroup } from "@/components/JsonLd";
import { breadcrumbLd, articleLd, faqLd, absUrl } from "@/lib/seo";

const FAQ = [
  {
    q: "Hoeveel kost een bedrijfsuitje varen in Amsterdam?",
    a: "Bij het Sloepenspel kost het €59,50 per persoon, all-in. Daarbij zit alles inbegrepen: de sloep met vaarbegeleiding, het iPad-spel, de locatie-acteurs, hapjes en drankjes aan boord, en de prijsuitreiking. Voor 60 personen is dat €3.570 voor het hele uitje. Lunch of diner achteraf boek je los.",
  },
  {
    q: "Heb je een vaarbewijs nodig voor een bedrijfsuitje op het water?",
    a: "Bij ons niet. Onze sloepen vallen onder de vrije categorie, iedereen vanaf 18 mag varen. Jullie krijgen vooraf een korte uitleg op de kade en op het water blijven onze begeleiders bereikbaar via marifoon.",
  },
  {
    q: "Hoeveel personen passen er in een sloep?",
    a: "8 personen per sloep. Voor een groep van 60 mensen heb je dus 8 sloepen, voor 200 mensen 25 sloepen. Wij regelen alle boten en de begeleiding.",
  },
  {
    q: "Wat als het regent op de dag van het bedrijfsuitje?",
    a: "We varen gewoon. De sloepen kunnen worden overdekt en het spel gaat door. Bij extreme omstandigheden, zoals code rood, plannen we samen om zonder extra kosten.",
  },
  {
    q: "Hoe lang duurt een bedrijfsuitje varen in Amsterdam?",
    a: "Onze opzet duurt 3,5 uur: 30 minuten welkom op de kade, 2,5 uur op het water met opdrachten, en 30 minuten afsluiting met prijsuitreiking. Daarna kun je doorschuiven naar het diner.",
  },
];

const articleData = {
  slug: "bedrijfsuitje-varen-amsterdam",
  title: "Bedrijfsuitje Varen in Amsterdam: De Complete Gids",
  excerpt:
    "Op zoek naar een bedrijfsuitje varen in Amsterdam? Ontdek de opties, vergelijk prijzen en vind het perfecte teamuitje op de grachten.",
  intro: "",
  body: "",
  category: "gids" as const,
  tags: [
    "bedrijfsuitje varen amsterdam",
    "teamuitje amsterdam",
    "sloep huren amsterdam",
    "personeelsuitje amsterdam",
  ],
  authorId: "daan" as const,
  datePublished: "2026-03-12",
  dateModified: "2026-05-04",
  readMinutes: 9,
  ogImage: "/images/sloep-met-eten.jpg",
  imageAlt: "Bedrijfsuitje varen Amsterdam, sloep met team aan boord op de gracht",
  isPillar: true,
};

export const metadata: Metadata = {
  title: "Bedrijfsuitje Varen Amsterdam | De Complete Gids",
  description:
    "Op zoek naar een bedrijfsuitje varen in Amsterdam? Ontdek de opties, vergelijk prijzen en vind het perfecte teamuitje op de grachten.",
  alternates: { canonical: "/bedrijfsuitje-varen" },
  openGraph: {
    type: "article",
    title: "Bedrijfsuitje Varen Amsterdam | De Complete Gids",
    description:
      "Een complete gids voor wie een bedrijfsuitje op het water in Amsterdam overweegt.",
    url: absUrl("/bedrijfsuitje-varen"),
    images: [{ url: absUrl("/images/sloep-met-eten.jpg") }],
    publishedTime: "2026-03-12",
    modifiedTime: "2026-05-04",
  },
};

export default function BedrijfsuitjeVarenPage() {
  return (
    <>
      <JsonLdGroup
        items={[
          articleLd(articleData, "/bedrijfsuitje-varen"),
          faqLd(FAQ),
          breadcrumbLd([{ name: "Bedrijfsuitje varen", href: "/bedrijfsuitje-varen" }]),
        ]}
      />
      <Nav />
      <main id="main-content">
        <BlogLayout
          title="Bedrijfsuitje Varen in Amsterdam: Alles Wat Je Moet Weten"
          category="Gids"
          readMinutes={9}
          intro="Een bedrijfsuitje varen in Amsterdam is in 2026 één van de populairste keuzes voor teams. En terecht: de stad leent zich er perfect voor, het schaalt van 30 tot 500+ personen, en het maakt iedereen actief. In deze complete gids leggen we uit waarom varen werkt als teamuitje, welke opties je hebt, waar je op moet letten, en hoe je het organiseert zonder verrassingen achteraf."
          related={[
            { title: "Origineel bedrijfsuitje in Amsterdam", href: "/origineel-bedrijfsuitje", readMinutes: 6 },
            { title: "Teambuilding in Amsterdam, waarom het water wint", href: "/teambuilding-amsterdam", readMinutes: 8 },
            { title: "Personeelsuitje Amsterdam, all-in vanaf €59,50", href: "/personeelsuitje-amsterdam", readMinutes: 6 },
            { title: "Hoe het Sloepenspel werkt", href: "/het-spel", readMinutes: 4 },
          ]}
        >
          <h2>Waarom varen werkt als teamuitje</h2>
          <p>
            Amsterdam heeft 165 grachten en 1.500 bruggen. Geen andere stad in Europa heeft een
            vergelijkbaar netwerk van bevaarbaar water midden in het centrum. Voor een
            <strong> bedrijfsuitje varen Amsterdam</strong> betekent dat: je hoeft de stad niet uit, je
            zit binnen tien minuten op iconische grachten, en je hebt overal aanlegplekken
            in de buurt van goede restaurants.
          </p>
          <p>
            Maar het echte voordeel zit in iets anders: <strong>varen maakt teams gelijkmatig actief</strong>.
            In een sloep van 8 personen kan niemand op zijn telefoon staren of in de menigte
            verdwijnen. Iedereen zit dichtbij, je beweegt samen, je beslist samen. De stille
            collega blijkt plotseling de beste navigator. De fanatieke collega leert dat
            niemand zin heeft in zijn powerpoint-stem.
          </p>
          <p>
            Dat is wat een goed teamuitje in Amsterdam doet wat een vergaderzaal nooit kan: mensen
            zien elkaar in een nieuwe context, met andere rollen. Onderzoek bij teams die we
            hebben begeleid laat zien dat de meeste herinneringen weken tot maanden later nog
            terugkomen op kantoor, als interne shorthand.
          </p>

          <h2>De opties vergeleken: rondvaart, sloep huren, sloepengame, Sloepenspel</h2>
          <p>
            Wie zoekt op &lsquo;<strong>bedrijfsuitje varen amsterdam</strong>&rsquo; krijgt een overload aan opties.
            Hier de vier belangrijkste, eerlijk vergeleken.
          </p>

          <h3>1. Klassieke rondvaart</h3>
          <p>
            De goedkoopste optie en logistiek het simpelst. Je stapt in een rondvaartboot met
            audiogids, vaart 75 minuten een vaste route en gaat weer naar huis. Voor groepen
            van 30 tot 100 personen prima werkbaar. <strong>Het minpunt</strong>: het is passief. Iedereen luistert,
            niemand handelt. Voor een teamuitje vaak te statisch om iets blijvends te creëren.
          </p>
          <p>
            <em>Geschikt voor:</em> kort sightseeing-moment voor internationale gasten of als
            opwarmer voor een ander programma.
          </p>

          <h3>2. Sloep huren in Amsterdam</h3>
          <p>
            <strong>Sloep huren in Amsterdam</strong> is populair voor kleinere teams die zelf willen varen
            zonder programma. Je huurt een boot voor 2 tot 4 uur, neemt zelf catering mee en
            vaart waar je wilt. Mokumboot en Sloepdelen zijn de bekendste verhuurders.
            Prijzen liggen tussen €100 en €350 per sloep per dagdeel, exclusief drank.
          </p>
          <p>
            <strong>Het minpunt</strong>: zonder programma blijft het bij &lsquo;leuk samen op de boot&rsquo;.
            Geen verhalen, geen actie, geen herinnering om over na te praten. Voor groepen vanaf
            30 personen wordt de logistiek (boten verdelen, route afspreken, eten regelen) ook
            snel een organisatorische klus.
          </p>
          <p>
            <em>Geschikt voor:</em> intieme team-borrels van 6 tot 12 personen die alleen willen varen.
          </p>

          <h3>3. Sloepengame Amsterdam</h3>
          <p>
            <strong>Sloepengame</strong> is een verzamelnaam voor varende quizzen en speurtochten op het water.
            Je krijgt een vragenformulier of een eenvoudige app, en je vaart langs vooraf bepaalde
            punten om vragen te beantwoorden. Prijzen liggen rond €40 tot €60 per persoon.
          </p>
          <p>
            <strong>Het verschil met het Sloepenspel</strong>: een gewone sloepengame leunt zwaar op feitenkennis
            en heeft beperkte interactie. Het Sloepenspel werkt met GPS-gestuurde challenges die
            automatisch activeren, een live scorebord, sabotage-gadgets en locatie-acteurs op de
            route. De technologie en het verhaal-niveau is een ander niveau.
          </p>
          <p>
            <em>Geschikt voor:</em> teams die competitie leuk vinden en een uitdaging zoeken bovenop het varen.
          </p>

          <h3>4. Het Sloepenspel</h3>
          <p>
            Onze categorie. Eigen sloep per team, iPad met GPS-gestuurde opdrachten, 600 verhalen
            van Amsterdamse VIP-gidsen, locatie-acteurs op de route, live scorebord. Schaalbaar
            van 30 tot 500+ personen. €59,50 per persoon all-in. <strong>Wat erbij zit</strong>:
            sloep, vaarbegeleiding, iPad-spel, acteurs, hapjes en drankjes aan boord,
            prijsuitreiking. <strong>Niet inbegrepen</strong>: lunch of diner.
          </p>
          <p>
            <em>Geschikt voor:</em> elk type team van 30 tot 500+ personen dat in één middag
            varen, spel en herinnering wil combineren.
          </p>

          <h2>Waar let je op bij een bedrijfsuitje varen?</h2>
          <p>
            Een paar zaken die het verschil maken tussen een goede en een matige boekingservaring,
            ongeacht welke aanbieder je kiest:
          </p>
          <ul>
            <li>
              <strong>Eén aanspreekpunt</strong>. Vraag of je vanaf offerte tot afsluiting met dezelfde
              persoon werkt. Doorverwijzingen op de dag zelf zijn een teken van slechte organisatie.
            </li>
            <li>
              <strong>All-in prijs</strong>. Een goede aanbieder geeft één bedrag per persoon. Verborgen
              kosten zoals &lsquo;organisatie-fee&rsquo;, &lsquo;servicekosten&rsquo; of &lsquo;BTW komt
              er nog bij&rsquo; zijn een waarschuwing.
            </li>
            <li>
              <strong>Schaalbaarheid</strong>. Vraag expliciet hoe ze omgaan met jouw groepsgrootte. Voor
              groepen boven 100 personen heb je meerdere vertreklocaties en gespreide starttijden
              nodig. Niet elke aanbieder kan dat.
            </li>
            <li>
              <strong>Weerbeleid</strong>. Vraag wat er gebeurt bij regen of code geel. Een goede partij
              heeft overdekte sloepen en verzet kosteloos bij code rood.
            </li>
            <li>
              <strong>Eindlocatie</strong>. Het beste uitje eindigt naadloos bij een restaurant. Vraag of
              de aanbieder partner-restaurants heeft binnen loopafstand van de eindlocatie.
            </li>
          </ul>

          <blockquote>
            Een bedrijfsuitje is geen plek om compromissen te sluiten op organisatie. De manier
            waarop een aanbieder reageert op je éérste mail of telefoontje zegt veel over hoe de
            dag zelf gaat lopen.
          </blockquote>

          <h2>Praktische tips voor het organiseren</h2>
          <p>
            Veel office managers komen pas in actie als de datum dichtbij komt. Beter is het om een
            paar weken eerder te starten. Hier de praktische zaken op rij:
          </p>

          <h3>Timing en seizoen</h3>
          <p>
            Mei tot oktober zijn de drukste maanden voor een <strong>bedrijfsuitje varen amsterdam</strong>.
            Boek minstens 4 tot 6 weken vooruit, voor groepen boven 100 personen liefst 8 weken.
            Donderdag en vrijdag zijn de populairste dagen, dus voor flexibiliteit en betere
            beschikbaarheid kies je dinsdag of woensdag.
          </p>

          <h3>Groepsgrootte en locatie</h3>
          <p>
            Wij werken met 6 vertreklocaties verspreid over Amsterdam. Voor 30 tot 60 personen is
            één locatie genoeg. Voor 100+ personen werken we met meerdere locaties tegelijk.
            <a href="/locaties-groepen">Bekijk welke locatie past bij jullie groep</a>.
          </p>

          <h3>Catering en drank</h3>
          <p>
            Aan boord zijn hapjes en drankjes inbegrepen. Voor lunch onderweg of diner achteraf
            werken we samen met 17 partner-restaurants. Bij elke locatie zijn 2 tot 4 opties,
            geschikt voor jouw groepsgrootte. <a href="/restaurants">Bekijk de restaurants</a>.
          </p>

          <h3>Toegankelijkheid</h3>
          <p>
            Onze sloepen zijn voor de meeste mensen goed toegankelijk. Vraag bij de offerte naar
            specifieke wensen voor mindervaliden, dieetwensen of allergieën. We regelen dat in
            de planning.
          </p>

          <h2>Voor wie werkt een bedrijfsuitje varen het best?</h2>
          <p>
            We hebben sinds 2018 ongeveer 1.200 teams op het water gehad. Drie type bedrijven
            komen telkens terug:
          </p>
          <ul>
            <li>
              <strong>Tech-bedrijven</strong>: Mollie, WeTransfer, Channable. De digital-first opzet en
              sabotage-gadgets passen bij hun cultuur.
            </li>
            <li>
              <strong>Agencies en creatieven</strong>: Studio Brouwer, Bynder. De storytelling en
              esthetiek spreken aan.
            </li>
            <li>
              <strong>Financiële en zakelijke dienstverlening</strong>: Adyen, Booking.com. De
              schaalbaarheid voor grote afdelingsuitjes werkt voor hen.
            </li>
          </ul>

          <h2>Veelgestelde vragen</h2>
          {FAQ.map((f, i) => (
            <div key={i}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}

          <h2>Klaar om te boeken?</h2>
          <p>
            Een <strong>bedrijfsuitje varen in Amsterdam</strong> hoeft geen hoofdpijn te zijn. Eén
            telefoontje of formulier en wij regelen de hele dag, inclusief restaurant. Reactie
            binnen 24 uur, en dan kun je het uit handen geven. <a href="/contact#formulier">Vraag een offerte aan</a>{" "}
            of <a href="/het-spel">lees eerst hoe het Sloepenspel werkt</a>.
          </p>
        </BlogLayout>
      </main>
      <Footer />
    </>
  );
}
