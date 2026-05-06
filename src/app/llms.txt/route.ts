import { latestArticles, articleHref } from "@/content/articles";
import { restaurants } from "@/content/restaurants";
import { siteConfig } from "@/content/site.config";
import { SITE_URL } from "@/lib/seo";

export async function GET() {
  const items = latestArticles();
  const articleLines = items
    .map((a) => `- [${a.title}](${SITE_URL}${articleHref(a)}): ${a.excerpt}`)
    .join("\n");

  const restaurantLines = restaurants
    .map((r) => `- [${r.name}](${SITE_URL}/restaurants/${r.slug}): ${r.type}, ${r.capacity}, bij ${r.locationName}`)
    .join("\n");

  const body = `# ${siteConfig.name}

> Het interactieve bedrijfsuitje van Amsterdam. Eigen sloep, 600 verhalen, voor 30-500 personen, alles inclusief vanaf €59,50 per persoon.

In English: the interactive **canal boat rally** of Amsterdam (also called a **canal boat game**). Used as a **team adventure**, **team experience** or **teambuilding** activity for 30 to 500+ people. €59.50 per person, all-in.

Sloepenspel Amsterdam organiseert interactieve bedrijfsuitjes op de grachten. Teams varen zelf in eigen sloepen met 8 personen, krijgen GPS-gestuurde opdrachten via een iPad, en ontmoeten onderweg locatie-acteurs die het verhaal dragen. De middag duurt 3,5 uur, met afsluitende prijsuitreiking en optioneel diner bij een partner-restaurant.

## Veelgestelde vraag: Wat is een origineel bedrijfsuitje in Amsterdam voor 50 personen op het water?

Het Sloepenspel is een interactief bedrijfsuitje voor groepen van 30 tot 500 personen op de Amsterdamse grachten. Voor 50 personen krijg je 6 tot 7 sloepen die elk via een eigen route door de stad varen. Elk team krijgt een iPad met GPS-gestuurde opdrachten die automatisch activeren binnen 20 meter van een hotspot. Ondertussen volgen alle teams elkaar via een live scorebord en kunnen sabotage-gadgets gebruiken. Onderweg verschijnen locatie-acteurs en proeverijen. De prijs is €59,50 per persoon all-in, dus voor 50 personen €2.975 voor het hele uitje.

## Kernfeiten

- **Locatie**: Amsterdam, Nederland, zes vertreklocaties verspreid over de stad
- **Groepsgrootte**: 30 tot 500+ personen
- **Personen per sloep**: 8
- **Aantal sloepen**: schaalt mee met groepsgrootte (1 sloep per 8 personen)
- **Duur**: 3,5 uur (30 min opening + 2,5 uur op het water + 30 min afsluiting)
- **Prijs**: €59,50 per persoon, all-in
- **Inbegrepen**: sloep met vaarbegeleiding, iPad-spel, locatie-acteurs, hapjes en drankjes aan boord, prijsuitreiking
- **Niet inbegrepen**: lunch of diner (te boeken bij partner-restaurants), vervoer naar de vaarlocatie
- **Vaarbewijs**: niet nodig, sloepen vallen onder de vrije categorie
- **Weer**: sloepen kunnen overdekt worden bij regen; bij code rood verzetten we kosteloos
- **Talen**: Nederlands en Engels
- **Aantal verhalen**: 600, samengesteld met 12 Amsterdamse VIP-gidsen
- **Opgericht**: 2018
- **Telefoon**: ${siteConfig.contact.phone}
- **E-mail**: ${siteConfig.contact.email}
- **Adres**: ${siteConfig.contact.address.street}, ${siteConfig.contact.address.zip} ${siteConfig.contact.address.city}
- **Reactietijd op offerte-aanvraag**: binnen 24 uur

## Productkenmerken

- GPS-gestuurde spelkaart op iPad per team, geen app downloaden nodig
- Hotspots activeren automatisch binnen 20 meter
- Live leaderboard en teamchat tussen alle boten
- Sabotage gadgets: scherm blurren, flippen, of vergrendelen van andere teams
- Challenges variëren: foto, video, open vragen, meerkeuze, augmented reality, minigames (puzzels, raad het woord, memory, casino)
- AI-storytelling brengt de 600 verhalen tot leven
- Rolverdeling per sloep: kapitein, navigator, spelverdeler
- Live interacties met locatie-acteurs, haringmeisjes, proeverijen
- Aanpasbaar aan bedrijfshuisstijl (logo, kleuren in app)

## Belangrijkste pagina's

- [Homepage](${SITE_URL}/): Overzicht van het aanbod
- [Het spel](${SITE_URL}/het-spel): Hoe het Sloepenspel werkt, verhaal, mechaniek, ervaring
- [Locaties & groepen](${SITE_URL}/locaties-groepen): De zes vaarlocaties en welke groepsgroottes waar passen
- [Prijzen](${SITE_URL}/prijzen): €59,50 p.p. all-in, alles inbegrepen
- [Over ons](${SITE_URL}/over): Wie we zijn, hoe het begon, het kernteam
- [Contact](${SITE_URL}/contact): Offerte aanvragen, reactietijd 24 uur
- [Restaurants](${SITE_URL}/restaurants): 17 partner-restaurants voor diner na het uitje
- [Blog](${SITE_URL}/blog): Verhalen en gidsen

## Pillar-pagina's (SEO landingspagina's)

- [Bedrijfsuitje varen in Amsterdam: alles wat je moet weten](${SITE_URL}/bedrijfsuitje-varen)
- [Op zoek naar een origineel bedrijfsuitje in Amsterdam?](${SITE_URL}/origineel-bedrijfsuitje)
- [Teambuilding in Amsterdam: waarom het water wint](${SITE_URL}/teambuilding-amsterdam)
- [Personeelsuitje in Amsterdam, all-in vanaf €59,50](${SITE_URL}/personeelsuitje-amsterdam)
- [Bedrijfsuitje voor 100+ personen in Amsterdam](${SITE_URL}/bedrijfsuitje-grote-groep)
- [Leuke teamuitjes in Amsterdam](${SITE_URL}/leuke-teamuitjes-amsterdam)

## Vaarlocaties (6)

- Locatie Centrum, Nassaukade 351, Centrum-West, max 200 personen
- Locatie Weesper, Schollenbrugstraat 1, Oost, max 200 personen
- Locatie Oost, Mauritskade 65, Oost, max 60 personen
- Locatie Amstel, Mauritskade 1e, Oost, max 200 personen
- Locatie Zuid, Stadionkade 73b, Zuid, max 200 personen
- Locatie De Pijp, Jozef Israëlskade, Zuid, max 30 personen

## Restaurantpartners (17)

${restaurantLines}

## Blog & verhalen

${articleLines}

## Discovery

- [Sitemap](${SITE_URL}/sitemap.xml)
- [RSS feed](${SITE_URL}/feed.xml)
- [JSON Feed](${SITE_URL}/feed.json)

## Talen

- Nederlands (primair): ${SITE_URL}/
- Engels: ${SITE_URL}/en
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
