import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { BlogLayout } from "@/components/BlogLayout";
import { JsonLdGroup } from "@/components/JsonLd";
import { breadcrumbLd, articleLd, faqLd, absUrl } from "@/lib/seo";

const FAQ = [
  {
    q: "Wat is een origineel bedrijfsuitje in Amsterdam?",
    a: "Een origineel bedrijfsuitje in Amsterdam is een uitje waar collega's nog maanden later anekdotes uit halen. Het kenmerkt zich door drie dingen: actieve deelname (geen passief toekijken), een verhaal of onverwacht element, en de mogelijkheid om in eigen tempo mee te doen. Het Sloepenspel combineert die drie in één middag op het water.",
  },
  {
    q: "Hoeveel kost een origineel bedrijfsuitje in Amsterdam?",
    a: "Bij het Sloepenspel betaal je €59,50 per persoon, all-in. Voor 50 personen is dat €2.975, inclusief sloepen, iPad-spel, locatie-acteurs, hapjes en drankjes aan boord. Geen extra organisatiefee. Lunch of diner achteraf boek je los bij één van onze 17 restaurantpartners.",
  },
  {
    q: "Voor wie is het Sloepenspel geschikt?",
    a: "Voor groepen van 30 tot 500+ personen, van afdelingsuitjes tot hele bedrijfsdagen. Het werkt voor jonge teams, gemengde leeftijden, internationaal samengestelde groepen, fanatieke en relaxte teams. Iedereen bepaalt zelf het tempo.",
  },
];

const articleData = {
  slug: "origineel-bedrijfsuitje",
  title: "Op Zoek naar een Origineel Bedrijfsuitje in Amsterdam?",
  excerpt:
    "Het Sloepenspel combineert varen, verhalen en teambuilding in één unieke middag.",
  intro: "",
  body: "",
  category: "inspiratie" as const,
  tags: [
    "origineel bedrijfsuitje amsterdam",
    "leuke teamuitjes amsterdam",
    "teambuilding amsterdam",
  ],
  authorId: "lotte" as const,
  datePublished: "2026-04-02",
  dateModified: "2026-05-04",
  readMinutes: 6,
  ogImage: "/images/groep-meerdere-sloepen.jpg",
  imageAlt: "Origineel bedrijfsuitje Amsterdam, groep in meerdere sloepen op de gracht",
  isPillar: true,
};

export const metadata: Metadata = {
  title: "Origineel Bedrijfsuitje Amsterdam | Op het Water",
  description:
    "Op zoek naar een origineel bedrijfsuitje in Amsterdam? Het Sloepenspel combineert varen, verhalen en teambuilding in één unieke middag.",
  alternates: { canonical: "/origineel-bedrijfsuitje" },
  openGraph: {
    type: "article",
    title: "Origineel Bedrijfsuitje Amsterdam | Op het Water",
    description:
      "Een interactief spel op eigen sloepen door de grachten, voor 30 tot 500+ personen.",
    url: absUrl("/origineel-bedrijfsuitje"),
    images: [{ url: absUrl("/images/groep-meerdere-sloepen.jpg") }],
  },
};

export default function OrigineelBedrijfsuitjePage() {
  return (
    <>
      <JsonLdGroup
        items={[
          articleLd(articleData, "/origineel-bedrijfsuitje"),
          faqLd(FAQ),
          breadcrumbLd([{ name: "Origineel bedrijfsuitje", href: "/origineel-bedrijfsuitje" }]),
        ]}
      />
      <Nav />
      <main id="main-content">
        <BlogLayout
          title="Op Zoek naar een Origineel Bedrijfsuitje in Amsterdam?"
          category="Inspiratie"
          readMinutes={6}
          intro="Het woord 'origineel' staat in elke offerte van elke aanbieder van bedrijfsuitjes. Het zegt op zich dus niet zoveel meer. Wat maakt iets écht origineel? Hoe scheid je de uitjes die collega's nog maandenlang aanhalen van de uitjes die binnen een week vergeten zijn? Hier een eerlijke kijk vanuit acht jaar ervaring met meer dan 1.200 georganiseerde uitjes."
          related={[
            { title: "Bedrijfsuitje varen Amsterdam, complete gids", href: "/bedrijfsuitje-varen", readMinutes: 9 },
            { title: "Leuke teamuitjes in Amsterdam", href: "/leuke-teamuitjes-amsterdam", readMinutes: 5 },
            { title: "Teambuilding in Amsterdam", href: "/teambuilding-amsterdam", readMinutes: 8 },
          ]}
        >
          <h2>Waarom teams iets nieuws willen</h2>
          <p>
            Bijna elk bedrijf doet één of twee teamuitjes per jaar. Dat betekent dat collega's
            in hun loopbaan al snel zo&apos;n twintig uitjes hebben meegemaakt. Escape rooms,
            kookworkshops, GPS-tochten, pubquizzen, beach clubs, karten. De meeste van die
            opties zijn op zich prima, maar geen ervan is in 2026 nog onderscheidend.
          </p>
          <p>
            Daarom zoeken HR-managers en office managers naar een <strong>origineel bedrijfsuitje
            Amsterdam</strong>. Niet omdat de bestaande opties slecht zijn, maar omdat ze voorspelbaar
            zijn geworden. En voorspelbaarheid is de vijand van een goede teamervaring.
          </p>
          <p>
            Het probleem is dat &lsquo;origineel&rsquo; in offertes vaak niet meer betekent dan
            &lsquo;wij hebben er vrolijke kleurtjes overheen gegooid&rsquo;. De tekst belooft
            iets bijzonders, het programma is hetzelfde gerecht in een ander jasje. Hier kijken
            we naar wat een uitje écht origineel maakt.
          </p>

          <h2>Wat een uitje écht origineel maakt</h2>
          <p>
            We hebben sinds 2018 ongeveer 1.200 teams begeleid. De drie patronen die telkens
            terugkomen bij de uitjes die mensen niet vergeten:
          </p>
          <ol>
            <li>
              <strong>Iedereen heeft een eigen ervaring</strong>. Originele uitjes splitsen op
              natuurlijke wijze. Andere route, andere acteurs, andere keuzes per groep. Achteraf
              vragen collega&apos;s elkaar &ldquo;hoe was het bij jullie?&rdquo;, en de antwoorden
              verschillen. Als iedereen exact hetzelfde heeft gedaan, is het uitje vergeten.
            </li>
            <li>
              <strong>Mensen doen iets net buiten hun normaal</strong>. Niet eng of ongemakkelijk, maar
              net iets buiten hun comfortzone. Iemand die nooit voor een groep praat die plotseling
              een verhaal moet vertellen. Een collega die ineens leiding moet nemen over een
              navigatie. Dat zijn de momenten die maandenlang nog ankerbeelden vormen.
            </li>
            <li>
              <strong>Er gebeurt iets onverwachts</strong>. Een acteur die plotseling verschijnt, een
              locatie die je niet had voorzien, een opdracht die halverwege kantelt. Voorspelbaarheid
              is de vijand van geheugen. Originele uitjes hebben minimaal één moment dat niemand
              zag aankomen.
            </li>
          </ol>

          <blockquote>
            De beste leuke teamuitjes in Amsterdam blijven jaren later nog terugkomen op de
            werkvloer als interne shorthand. &lsquo;Weet je nog die ene gracht?&rsquo; is meer waard
            dan &lsquo;we hadden een leuk avondje gehad&rsquo;.
          </blockquote>

          <h2>Fanatiek maar relaxt, allebei kan</h2>
          <p>
            Bij elk team is dezelfde dynamiek aanwezig: een paar fanatieke collega&apos;s willen
            winnen, een paar relaxte collega&apos;s willen genieten, en de rest zit ertussenin.
            Een goed origineel bedrijfsuitje laat ruimte voor allebei in dezelfde middag.
          </p>
          <p>
            Bij het Sloepenspel werkt dat zo: je team van 8 personen kiest zelf hoe fanatiek
            jullie het scorebord najagen. Wil je de hoogste eindigen? Speel alle challenges,
            gebruik sabotage-gadgets bij andere teams, vaar zo snel mogelijk. Liever ontspannen?
            Vaar rustig, doe alleen de leuke opdrachten, schenk een rosé in. Beide opties zijn
            onderdeel van het spel, niet uitzonderingen.
          </p>
          <p>
            Het mooie: deze opzet maakt teambuilding in Amsterdam toegankelijk voor groepen die je
            normaal niet samen ziet. Tech-bedrijven met alle leeftijden door elkaar. Internationale
            teams met verschillende achtergronden. Afdelingen die elkaar nog niet goed kennen.
            Iedereen vindt zijn plek.
          </p>

          <h2>Wat kost een origineel bedrijfsuitje?</h2>
          <p>
            Het Sloepenspel kost €59,50 per persoon, all-in. Voor een groep van 50 mensen
            betaal je dus €2.975 voor het hele uitje van 3,5 uur. Daar zit alles in:
          </p>
          <ul>
            <li>De sloep met vaarbegeleiding (8 personen per sloep, dus 7 sloepen voor 50 mensen)</li>
            <li>De iPad met spelopdrachten per boot</li>
            <li>Locatie-acteurs op de route</li>
            <li>Hapjes en drankjes aan boord</li>
            <li>Welkom op de kade en prijsuitreiking aan het einde</li>
            <li>Foto&apos;s van de middag</li>
          </ul>
          <p>
            <strong>Niet inbegrepen</strong>: lunch onderweg of diner achteraf. Daar werken we samen
            met 17 partner-restaurants in Amsterdam. <a href="/restaurants">Bekijk de restaurants</a>.
          </p>
          <p>
            Vergelijk dat met de gemiddelde prijs voor een teamuitje in Amsterdam: een escape
            room ligt rond €25 per persoon (één uur), kookworkshop op €75 (drie uur), beach
            club met catering al snel €85+. Het Sloepenspel zit daar tussenin met aanzienlijk
            meer programma en herinnering per uur.
          </p>

          <h2>Voor wie is het wel of niet geschikt?</h2>
          <p>
            Een eerlijke check. Het Sloepenspel werkt het best voor:
          </p>
          <ul>
            <li>Teams van 30 tot 500+ personen die actief willen samen zijn</li>
            <li>Bedrijven die een mix van competitie en ontspanning zoeken</li>
            <li>Groepen waar leeftijden en voorkeuren door elkaar lopen</li>
            <li>Internationale teams (Engelstalige optie beschikbaar)</li>
          </ul>
          <p>
            Het is minder geschikt voor groepen onder 30 personen, voor wie alleen wil eten en
            drinken zonder programma, of voor mensen met ernstige mobiliteitsbeperkingen die
            zelf niet in een sloep kunnen stappen.
          </p>

          <h2>Klaar om iets origineels te boeken?</h2>
          <p>
            Een <strong>origineel bedrijfsuitje in Amsterdam</strong> hoeft geen hoofdpijn te zijn,
            en geen extra budget te kosten. Vraag een offerte aan en we sturen een voorstel op
            maat binnen 24 uur. <a href="/contact#formulier">Vraag offerte aan</a>, of lees eerst{" "}
            <a href="/het-spel">hoe het Sloepenspel werkt</a>.
          </p>
        </BlogLayout>
      </main>
      <Footer />
    </>
  );
}
