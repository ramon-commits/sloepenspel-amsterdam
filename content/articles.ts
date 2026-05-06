import { authors, type Author } from "./authors";
import { categories, type Category } from "./categories";

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  intro: string;
  body: string; // Markdown-ish HTML; renderer treats as raw HTML.
  category: Category["id"];
  tags: string[];
  authorId: keyof typeof authors;
  datePublished: string; // ISO 8601
  dateModified: string;
  readMinutes: number;
  ogImage: string;
  imageAlt: string;
  /** Pillar pages live at root URLs and have own SEO targeting; cluster pages live at /blog/[slug]. */
  isPillar: boolean;
  /** When set, listing card links here instead of /blog/[slug] (e.g. for pillar pages). */
  externalHref?: string;
  /** FAQ data, also rendered as FAQPage JSON-LD. */
  faq?: Array<{ q: string; a: string }>;
  /** Related article slugs. */
  related?: string[];
};

export const articles: Article[] = [
  {
    slug: "bedrijfsuitje-varen-amsterdam",
    title: "Bedrijfsuitje Varen in Amsterdam: Alles Wat Je Moet Weten",
    excerpt:
      "Een complete gids voor wie een bedrijfsuitje op het water in Amsterdam overweegt, van logistiek tot beleving.",
    intro:
      "Een bedrijfsuitje op het water voelt anders dan een avond in een escape room of een dag karten. Het tempo is anders, de gesprekken zijn anders, en wat collega's onthouden is anders. Deze gids vertelt wat een goed boot-uitje uniek maakt, waar je op moet letten bij de planning, en welke valkuilen je beter vermijdt.",
    body: "",
    category: "gids",
    tags: ["bedrijfsuitje", "varen", "amsterdam", "planning"],
    authorId: "daan",
    datePublished: "2026-03-12",
    dateModified: "2026-05-01",
    readMinutes: 7,
    ogImage: "/images/sloep-met-eten.jpg",
    imageAlt: "Sloep met diner aan boord op de Amsterdamse gracht",
    isPillar: true,
    externalHref: "/bedrijfsuitje-varen",
    related: ["origineel-bedrijfsuitje", "60-sloepen-logistiek", "weer-op-het-water"],
  },
  {
    slug: "origineel-bedrijfsuitje",
    title: "Op Zoek naar een Origineel Bedrijfsuitje in Amsterdam?",
    excerpt:
      "Wat maakt een bedrijfsuitje écht origineel, en waarom de meeste opties gewoon hetzelfde gerecht in een ander jasje zijn.",
    intro:
      "Het woord 'origineel' staat in elke offerte van elke aanbieder van bedrijfsuitjes, het zegt op zich dus niets meer. Wat maakt iets écht origineel? En hoe scheid je de uitjes die collega's nog maandenlang aanhalen van de uitjes die binnen een week vergeten zijn?",
    body: "",
    category: "inspiratie",
    tags: ["origineel", "bedrijfsuitje", "amsterdam", "teambuilding"],
    authorId: "lotte",
    datePublished: "2026-04-02",
    dateModified: "2026-04-28",
    readMinutes: 6,
    ogImage: "/images/groep-meerdere-sloepen.jpg",
    imageAlt: "Groep deelnemers in meerdere sloepen op de gracht",
    isPillar: true,
    externalHref: "/origineel-bedrijfsuitje",
    related: ["bedrijfsuitje-varen-amsterdam", "stille-grachten-route", "team-na-uitje"],
  },
  {
    slug: "60-sloepen-logistiek",
    title: "Hoe je 60 Sloepen Tegelijk Op Het Water Krijgt Zonder Chaos",
    excerpt:
      "Achter de schermen bij een bedrijfsdag voor 500 mensen, gespreide vertrektijden, marifoon-protocol en het moment dat alle boten samenkomen.",
    intro:
      "De grootste bedrijfsdag die we organiseerden was voor een tech-bedrijf met 480 medewerkers, verspreid over 60 sloepen, met drie vertreklocaties en één gezamenlijke eindlocatie. Hier is hoe we dat draaiende houden zonder dat het anoniem voelt.",
    body: `
<p>Logistiek voor zestig sloepen is geen kwestie van &lsquo;gewoon alles tegelijk uitzetten&rsquo;. We werken met <strong>gespreide vertrektijden</strong> per locatie, om de tien minuten een wave van zes tot acht boten, zodat de Amstel en de Singelgracht niet tegelijk dichtslibben.</p>

<h2>Drie vertreklocaties, één eindlocatie</h2>
<p>Bij groepen boven 250 personen verdelen we over Location Center, Location Amstel en Location South. Elke locatie heeft een eigen briefing-acteur en een eigen check-in-tijd. De acteurs volgen hetzelfde script-skelet maar passen het aan op het tempo van de groep voor hen.</p>
<p>De eindlocatie is altijd één, meestal Amstelhaven of Strand Zuid. Daar komen alle teams binnen één uur samen, voor de prijsuitreiking en het diner. De timing van die samenkomst is het kritieke punt: te vroeg en mensen verveelden zich, te laat en de eerste teams zijn al uitgenodigd.</p>

<h3>Marifoon-protocol</h3>
<p>Iedere sloep heeft een marifoon op kanaal 19. Onze begeleiders monitoren continu, niet om te corrigeren, maar om hulp aan te bieden bij verdwalen of een technische vraag. We onderbreken pas als het echt moet.</p>

<h2>Het moment dat alle boten samenkomen</h2>
<blockquote>Een vloot van zestig sloepen die tegelijk een bocht omslaat richting de finish, daar zwijgt iedereen even.</blockquote>
<p>Voor de samenkomst plannen we de laatste vijftien minuten van het spel zo dat alle teams via verschillende routes naar één bottleneck varen, meestal de Amstelsluizen of de Magere Brug. Het effect: zestig boten die elkaar plotseling weer zien na drie uur apart te hebben gevaren.</p>

<h2>Wat we hebben geleerd</h2>
<ul>
  <li>Plan minstens 20 minuten extra in voor weer-impact (regenpauzes, tegenwind).</li>
  <li>Ieder vertrekpunt heeft een &lsquo;zwerver-positie&rsquo;, een begeleider die niet vast aan een sloep zit en kan bijspringen.</li>
  <li>De cast moet voor het uitje een dossier krijgen van het bedrijf, interne grappen, projectnamen, teamcultuur, anders voelt het generiek.</li>
</ul>
`,
    category: "achter-de-schermen",
    tags: ["logistiek", "grote groepen", "operations"],
    authorId: "daan",
    datePublished: "2026-04-15",
    dateModified: "2026-04-15",
    readMinutes: 5,
    ogImage: "/images/groep-meerdere-sloepen.jpg",
    imageAlt: "Groep sloepen op de Amsterdamse gracht",
    isPillar: false,
    related: ["bedrijfsuitje-varen-amsterdam", "team-na-uitje"],
    faq: [
      { q: "Tot hoeveel sloepen kunnen jullie organiseren?", a: "We hebben dagen gedraaid met 60+ sloepen. Boven 100 sloepen werken we met meerdere bedrijven samen." },
      { q: "Wat als een sloep onderweg uitvalt?", a: "Onze begeleiders zijn bereikbaar via marifoon en hebben een reserve-sloep stand-by. Vervangtijd: gemiddeld 12 minuten." },
    ],
  },
  {
    slug: "stille-grachten-route",
    title: "De Stille Grachten van Amsterdam: 5 Routes die Niemand Kent",
    excerpt:
      "Geen Wallen, geen rondvaartboten, vijf routes door rustige grachten waar Amsterdam zich op z'n kalmst toont.",
    intro:
      "De meeste Amsterdammers kennen drie grachten goed: Herengracht, Keizersgracht, Prinsengracht. Maar het echte ademruimte-Amsterdam ligt aan de randen, Schinkel, Lijnbaansgracht, Boerenwetering. Vijf routes voor wie de stad wil zien zonder de menigte.",
    body: `
<h2>1. De Schinkelroute</h2>
<p>Vanaf het Vondelpark via de Schinkel naar het Amsterdamse Bos. Industrieel, rustig, en de zon staat hier vaak nog op het water als de centrum-grachten al in de schaduw liggen.</p>

<h2>2. Lijnbaansgracht</h2>
<p>Loopt parallel aan de Prinsengracht maar wordt zelden bevaren door rondvaartboten. Hier zie je de achterkant van de oude pakhuizen, minder Disney, meer echte stad.</p>

<h2>3. Boerenwetering door De Pijp</h2>
<p>De gracht die door De Pijp slingert. Drukke buurt, stille gracht. Perfect voor teams die De Pijp-cultuur willen voelen zonder in de mensenmenigte te lopen.</p>

<h2>4. Marineterrein-loop</h2>
<p>Sinds 2017 toegankelijk voor sloepen. Industriële geschiedenis, brutalistische gebouwen, Marineterrein zelf als landschapstype. Je voelt dat je in een ander Amsterdam bent.</p>

<h2>5. De Diemerzeedijk-route</h2>
<p>Voor wie écht weg wil. Vanaf Location Weesper richting het IJmeer, een uur weg van de drukte, met uitzicht op windmolens en de Diemerzeedijk.</p>
`,
    category: "amsterdam",
    tags: ["grachten", "routes", "amsterdam", "verborgen"],
    authorId: "lotte",
    datePublished: "2026-04-22",
    dateModified: "2026-04-22",
    readMinutes: 4,
    ogImage: "/images/sloep-gracht-zonnig.png",
    imageAlt: "Sloep op een rustige Amsterdamse gracht in de zon",
    isPillar: false,
    related: ["origineel-bedrijfsuitje", "60-sloepen-logistiek"],
  },
  {
    slug: "team-na-uitje",
    title: "Wat Een Team Échte Maakt: Wat We Zien Twee Weken Na Een Uitje",
    excerpt:
      "Welke teams blijven praten over het uitje, welke vergeten het, en wat het verschil verklaart.",
    intro:
      "We hebben sinds 2018 ongeveer 1.200 teams op het water gehad. Twee weken na elke boeking sturen we een korte enquête. Dit is wat we zien terugkomen bij teams die zichzelf veranderd zien, en bij teams waar het uitje een leuk los moment bleef.",
    body: `
<h2>Het verschil zit in vóór, niet in tijdens</h2>
<p>De grootste voorspeller van impact is niet hoe goed het uitje was, het is wat het team in de weken vóór het uitje samen heeft meegemaakt. Teams die net een rotperiode hadden, halen het meeste uit een goed uitje. Teams die al goed draaien, krijgen er een leuke avond bij maar geen reset.</p>

<h2>Drie patronen die we steeds zien</h2>
<h3>1. De &lsquo;ineens-bekend&rsquo;-collega</h3>
<p>Bijna elk team heeft een persoon die op het uitje opeens iets liet zien, humor, overzicht, kwetsbaarheid, wat collega&apos;s op kantoor nooit hadden gezien. In ongeveer 60% van de feedback-mails komt zo iemand terug.</p>

<h3>2. De interne shorthand</h3>
<p>Goede uitjes maken interne shorthand: één woord, één situatie, één moment dat alleen het team begrijpt. Maanden later refereren ze er nog naar tijdens vergaderingen. Slechte uitjes leveren géén shorthand op.</p>

<h3>3. Het risico van de overlevering</h3>
<p>Hoe vaker het uitje aan nieuwe collega&apos;s wordt verteld, hoe sterker het ankert. Teams waar het verhaal stopt na week één, daar verdween het effect.</p>

<blockquote>Een uitje raakt niet aan de productiviteit van het team. Het raakt aan hoe het team over zichzelf praat. Dat is het écht waardevolle.</blockquote>
`,
    category: "team",
    tags: ["teambuilding", "impact", "psychologie"],
    authorId: "aisha",
    datePublished: "2026-04-28",
    dateModified: "2026-04-28",
    readMinutes: 5,
    ogImage: "/images/team-met-ipad.jpeg",
    imageAlt: "Team aan boord van een sloep met de iPad",
    isPillar: false,
    related: ["origineel-bedrijfsuitje", "scripts-die-werken"],
  },
  {
    slug: "weer-op-het-water",
    title: "Bedrijfsuitje en het Nederlandse Weer: Waar Je Op Moet Letten",
    excerpt:
      "Regen is geen probleem, code rood wel. Een eerlijke gids over wat het weer betekent voor je boot-uitje.",
    intro:
      "Klanten vragen het bijna altijd: &lsquo;wat als het regent?&rsquo;. Het korte antwoord: dan varen we gewoon. Het langere antwoord: er is een verschil tussen regen, harde wind, en code rood, en die verschillen bepalen wat we doen.",
    body: `
<h2>Regen: geen issue</h2>
<p>Onze sloepen kunnen overdekt worden met een tent. Bij regen blijven jullie droog en de ervaring blijft hetzelfde. Sterker: regen geeft de stad vaak een ander karakter, minder mensen op straat, andere lichtinval, meer intieme sfeer.</p>

<h2>Wind: vanaf 6 Beaufort attentie</h2>
<p>Tot 5 Beaufort varen we gewoon. Bij windkracht 6 worden onze begeleiders attent, niet alarmerend, maar er gaat een waarschuwing uit naar de teams. Bij 7+ stellen we de start uit of verzetten we de datum.</p>

<h2>Code geel/oranje/rood</h2>
<p>Bij code geel: we beoordelen per dagdeel. Bij code oranje: we verzetten kosteloos. Bij code rood: we verzetten zonder dat je het hoeft te vragen.</p>

<h3>Wat we niet doen</h3>
<ul>
  <li>We laten geen vluchten varen waar we onzeker over zijn, onze acteurs en begeleiders krijgen voorrang in de inschatting.</li>
  <li>We compenseren slecht weer niet met &lsquo;leuker&rsquo; programmeren, dat voelt forced.</li>
  <li>We rekenen geen toeslag voor zomerdagen of evenementdagen.</li>
</ul>

<blockquote>Het Nederlandse weer is geen vijand van een goed uitje, het is een ingrediënt. Een grachten-tour bij motregen voelt anders dan bij zon, maar zelden minder.</blockquote>
`,
    category: "gids",
    tags: ["weer", "planning", "logistiek"],
    authorId: "daan",
    datePublished: "2026-05-03",
    dateModified: "2026-05-03",
    readMinutes: 4,
    ogImage: "/images/sloep-dichtbij.jpg",
    imageAlt: "Sloep van dichtbij",
    isPillar: false,
    related: ["bedrijfsuitje-varen-amsterdam", "60-sloepen-logistiek"],
    faq: [
      { q: "Bij welk weer varen jullie niet?", a: "Bij code rood varen we niet. Bij code oranje verzetten we kosteloos. Bij regen of normale wind varen we gewoon, de sloepen kunnen overdekt." },
      { q: "Krijg ik geld terug bij weersannulering?", a: "Bij annulering van onze kant (code rood/oranje) verzetten we kosteloos naar een nieuwe datum. Bij annulering van jouw kant gelden de standaard annuleringsvoorwaarden." },
    ],
  },
  {
    slug: "scripts-die-werken",
    title: "Hoe Wij Scripts Schrijven Die Niet Cringe Zijn",
    excerpt:
      "Acht jaar leren waarom 80% van interactieve uitjes ongemakkelijk voelt, en wat de 20% wel goed doet.",
    intro:
      "Cringe is de stille killer van bedrijfsuitjes. Een acteur die te hard zijn best doet, een opdracht die te schoolfeest-achtig is, een verhaal dat over de hoofden van mensen heen vliegt. Hier is hoe wij scripts schrijven die collega&apos;s zelf willen voortzetten.",
    body: `
<h2>De drie zonden</h2>
<h3>1. Geforceerd plezier</h3>
<p>Acteurs die schreeuwen &lsquo;Wat een fantastische groep heb ik vandaag!&rsquo; en daarbij wachten op gejuich. Niemand weet waar ze moeten kijken. Plezier moet ontstaan, niet aangekondigd worden.</p>

<h3>2. Nostalgische clichés</h3>
<p>De &lsquo;ouderwetse Amsterdammer met snor en pet die over &ldquo;vroeger&rdquo; vertelt&rsquo;, een rol die zo cliché is dat collega&apos;s het binnen 10 seconden doorhebben. Wij gebruiken alleen historische karakters die specifieke, niet-voorspelbare verhalen hebben.</p>

<h3>3. Iedereen-doet-mee-druk</h3>
<p>Niets killt een uitje zoals &lsquo;jij daar! kom eens hier!&rsquo;. Onze acteurs werken alleen met mensen die zich vrijwillig melden. Wie liever achteraan blijft, blijft achteraan.</p>

<h2>Wat de 20% wél doet</h2>
<blockquote>Een goede acteur reageert op het team. Een matige acteur reageert op zijn script.</blockquote>
<p>Onze cast krijgt het script als skelet, niet als voorschrift. Wat in week 1 op locatie A goed werkt, kan in week 4 op dezelfde locatie totaal anders verlopen. Het script is een ruimte, geen route.</p>

<h2>Test: zou je het zelf willen meemaken?</h2>
<p>Onze schrijvers krijgen één regel mee: zou je dit zelf willen meemaken op een vrijdagmiddag, met je eigen collega&apos;s? Als het antwoord onzeker is, schrappen.</p>
`,
    category: "achter-de-schermen",
    tags: ["scripts", "acteurs", "writing"],
    authorId: "aisha",
    datePublished: "2026-05-04",
    dateModified: "2026-05-04",
    readMinutes: 5,
    ogImage: "/images/acteurs-petjes.png",
    imageAlt: "Acteurs met petjes tijdens een sloepenspel-middag",
    isPillar: false,
    related: ["team-na-uitje", "origineel-bedrijfsuitje"],
  },
];

// Helpers
export const articleBySlug = (slug: string) =>
  articles.find((a) => a.slug === slug);

export const articlesByCategory = (categoryId: string) =>
  articles.filter((a) => a.category === categoryId);

/** Newest first, optionally limited. Pillar articles are included. */
export const latestArticles = (limit?: number) => {
  const sorted = [...articles].sort(
    (a, b) => new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime()
  );
  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
};

/** Listing href: pillar articles point to their root URL; cluster articles to /blog/[slug]. */
export const articleHref = (a: Article) =>
  a.externalHref ?? `/blog/${a.slug}`;

export const authorOf = (a: Article): Author => authors[a.authorId];
export const categoryOf = (a: Article): Category | undefined =>
  categories.find((c) => c.id === a.category);
