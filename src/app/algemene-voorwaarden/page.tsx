import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { siteConfig } from "@/content/site.config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

export const metadata = {
  title: "Algemene Voorwaarden",
  description:
    "Algemene voorwaarden van Sloepenspel Amsterdam: offertes, betaling, annulering, aansprakelijkheid en overmacht.",
};

export default function AlgemeneVoorwaardenPage() {
  return (
    <>
      <Nav />
      <main id="main-content">
        <section className="pt-36 md:pt-44 pb-12 md:pb-16 bg-[color:var(--color-bg-warm)] grain relative">
          <Container>
            <nav
              aria-label="Breadcrumb"
              className="text-xs tracking-[0.15em] uppercase text-[color:var(--color-muted)] mb-8 flex items-center gap-2"
            >
              <Link
                href="/"
                className="hover:text-[color:var(--color-primary)] transition-colors"
              >
                Home
              </Link>
              <FontAwesomeIcon
                icon={faChevronRight}
                className="text-[8px] opacity-50"
              />
              <span className="text-[color:var(--color-primary)]">
                Algemene Voorwaarden
              </span>
            </nav>
            <div className="max-w-[720px]">
              <h1 className="h1 mb-6">Algemene Voorwaarden</h1>
              <p className="text-lg text-[color:var(--color-primary)]/80 leading-relaxed max-w-prose">
                De spelregels voor onze samenwerking. Kort, helder en zonder
                onnodige juridische ballast.
              </p>
            </div>
          </Container>
        </section>

        <article className="bg-white">
          <Container className="!max-w-[820px]">
            <div className="py-12 md:py-16 blog-prose">
              <p className="blog-intro">
                Deze algemene voorwaarden zijn van toepassing op alle offertes,
                opdrachten en overeenkomsten tussen Sloepenspel Amsterdam
                (hierna: &ldquo;wij&rdquo;) en de opdrachtgever. Door een
                offerte te accepteren of een boeking te plaatsen ga je akkoord
                met deze voorwaarden.
              </p>

              <h2>1. Toepasselijkheid</h2>
              <p>
                Deze voorwaarden zijn van toepassing op iedere aanbieding,
                offerte en overeenkomst tussen Sloepenspel Amsterdam en de
                opdrachtgever, voor zover van deze voorwaarden niet schriftelijk
                door beide partijen is afgeweken. Eventuele inkoop- of andere
                voorwaarden van de opdrachtgever zijn niet van toepassing,
                tenzij wij die uitdrukkelijk schriftelijk hebben aanvaard.
              </p>

              <h2>2. Offertes en overeenkomsten</h2>
              <p>
                Onze offertes zijn vrijblijvend en geldig gedurende veertien
                dagen, tenzij anders vermeld. Een overeenkomst komt tot stand op
                het moment dat de opdrachtgever de offerte schriftelijk of per
                e-mail bevestigt. Wijzigingen in de overeenkomst zijn pas geldig
                nadat beide partijen die schriftelijk hebben bevestigd.
              </p>

              <h2>3. Prijzen en betaling</h2>
              <p>
                De prijs voor het Sloepenspel bedraagt &euro;59,50 per persoon,
                exclusief BTW. Dit bedrag is all-in: spel, sloep, bemanning en
                ondersteuning. Eventuele aanvullende diensten (catering,
                vervoer, custom branding) worden apart vermeld in de offerte.
              </p>
              <p>
                Betaling vindt plaats op factuur, met een betalingstermijn van
                veertien dagen na factuurdatum. De factuur wordt na afloop van
                het evenement verstuurd, tenzij anders overeengekomen. Bij niet
                tijdige betaling is de opdrachtgever wettelijke rente
                verschuldigd en kunnen incassokosten in rekening worden
                gebracht.
              </p>

              <h2>4. Annuleringsbeleid</h2>
              <p>
                Annulering door de opdrachtgever:
              </p>
              <ul>
                <li>
                  <strong>Tot veertien dagen voor de geplande datum</strong>:
                  kosteloos.
                </li>
                <li>
                  <strong>Binnen veertien dagen voor de geplande datum</strong>:
                  in overleg, in beginsel 50% van de overeengekomen prijs.
                </li>
                <li>
                  <strong>Binnen 48 uur voor de geplande datum</strong>: 100%
                  van de overeengekomen prijs verschuldigd.
                </li>
              </ul>
              <p>
                Bij code rood of vergelijkbare onveilige weersomstandigheden
                wordt de boeking kosteloos verzet naar een nieuwe datum in
                onderling overleg.
              </p>

              <h2>5. Aansprakelijkheid</h2>
              <p>
                Onze aansprakelijkheid is beperkt tot het bedrag dat in het
                voorkomende geval door onze aansprakelijkheidsverzekering wordt
                uitgekeerd, vermeerderd met het eigen risico. Indien de
                verzekering niet uitkeert, is onze aansprakelijkheid beperkt tot
                ten hoogste het factuurbedrag van de betreffende opdracht.
              </p>
              <p>
                Wij zijn niet aansprakelijk voor indirecte schade, gevolgschade,
                gederfde winst of immateri&euml;le schade. Deelname aan het
                Sloepenspel geschiedt op eigen risico van de deelnemers; de
                opdrachtgever is verantwoordelijk voor het informeren van de
                deelnemers hierover.
              </p>

              <h2>6. Overmacht</h2>
              <p>
                Wij zijn niet gehouden tot het nakomen van enige verplichting
                indien er sprake is van overmacht. Onder overmacht wordt
                verstaan: extreem weer (waaronder code oranje of code rood,
                onweer, storm, ijsgang), maatregelen van overheidswege, brand,
                staking, pandemie, of andere omstandigheden buiten onze
                redelijke controle.
              </p>
              <p>
                Bij overmacht streven wij in eerste instantie naar verzetting
                van de boeking. Als verzetting niet mogelijk is, wordt de
                overeenkomst zonder schadeplicht ontbonden.
              </p>

              <h2>7. Intellectueel eigendom</h2>
              <p>
                Alle intellectuele eigendomsrechten op het spelconcept, de
                software, de spelkaart, de verhalen, de challenges en het
                bijbehorende beeld- en geluidsmateriaal berusten bij Sloepenspel
                Amsterdam. Het is de opdrachtgever en deelnemers niet toegestaan
                deze materialen te kopi&euml;ren, te verspreiden of commercieel
                te gebruiken zonder onze voorafgaande schriftelijke
                toestemming.
              </p>

              <h2>8. Privacy</h2>
              <p>
                Wij gaan zorgvuldig om met persoonsgegevens van opdrachtgevers,
                contactpersonen en deelnemers. Lees onze{" "}
                <Link href="/privacy">privacyverklaring</Link> voor meer
                informatie over welke gegevens we verwerken, waarvoor en hoe
                lang.
              </p>

              <h2>9. Klachten</h2>
              <p>
                Eventuele klachten over de uitvoering van de overeenkomst dienen
                binnen veertien dagen na het evenement schriftelijk bij ons te
                worden ingediend. Wij streven ernaar binnen vijf werkdagen
                inhoudelijk te reageren. Stuur klachten naar{" "}
                <a href={siteConfig.contact.emailHref}>
                  {siteConfig.contact.email}
                </a>
                .
              </p>

              <h2>10. Toepasselijk recht en geschillen</h2>
              <p>
                Op alle overeenkomsten tussen Sloepenspel Amsterdam en de
                opdrachtgever is Nederlands recht van toepassing. Geschillen die
                niet in onderling overleg kunnen worden opgelost, worden
                voorgelegd aan de bevoegde rechter in het arrondissement
                Amsterdam.
              </p>

              <blockquote>
                Dit zijn basis-voorwaarden. Raadpleeg een jurist voor
                wettelijke volledigheid.
              </blockquote>
            </div>
          </Container>
        </article>
      </main>
      <Footer />
    </>
  );
}
