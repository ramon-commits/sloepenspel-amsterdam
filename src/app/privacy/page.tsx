import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { siteConfig } from "@/content/site.config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

export const metadata = {
  title: "Privacyverklaring",
  description:
    "Hoe Sloepenspel Amsterdam omgaat met persoonsgegevens van klanten en deelnemers.",
};

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main id="main-content">
        <section className="pt-36 md:pt-44 pb-12 md:pb-16 bg-[color:var(--color-bg-warm)] grain relative">
          <Container>
            <nav aria-label="Breadcrumb" className="text-xs tracking-[0.15em] uppercase text-[color:var(--color-muted)] mb-8 flex items-center gap-2">
              <Link href="/" className="hover:text-[color:var(--color-primary)] transition-colors">Home</Link>
              <FontAwesomeIcon icon={faChevronRight} className="text-[8px] opacity-50" />
              <span className="text-[color:var(--color-primary)]">Privacy</span>
            </nav>
            <div className="max-w-[720px]">
              <h1 className="h1 mb-6">
                <span className="headline-italic">Privacy</span>verklaring
              </h1>
              <p className="text-lg text-[color:var(--color-primary)]/80 leading-relaxed max-w-prose">
                Kort en zonder jurken-jargon. We bewaren alleen wat we nodig hebben om je
                boeking en de middag goed te organiseren, niets meer.
              </p>
            </div>
          </Container>
        </section>

        <article className="bg-white">
          <Container className="!max-w-[820px]">
            <div className="py-12 md:py-16 blog-prose">
              <p className="blog-intro">
                Sloepenspel Amsterdam (hierna: &ldquo;wij&rdquo;) verwerkt persoonsgegevens van klanten,
                contactpersonen en deelnemers in het kader van het organiseren van bedrijfsuitjes
                en gerelateerde dienstverlening. In deze verklaring beschrijven we welke gegevens
                we verzamelen, waarvoor, hoe lang we ze bewaren en welke rechten je hebt.
              </p>

              <h2>1. Welke gegevens we verzamelen</h2>
              <ul>
                <li><strong>Contactgegevens van de boeker</strong>: naam, bedrijf, e-mailadres, telefoonnummer.</li>
                <li><strong>Boekingsgegevens</strong>: datum, groepsgrootte, voorkeurslocatie, bijzonderheden.</li>
                <li><strong>Optioneel</strong>: dieetwensen of toegankelijkheidswensen voor catering.</li>
                <li><strong>Foto&apos;s</strong> gemaakt tijdens de middag, alleen wanneer expliciet toestemming is verleend.</li>
                <li><strong>Analytische gegevens</strong> via privacy-vriendelijke analytics op deze website (geen persoonsidentificerende data).</li>
              </ul>

              <h2>2. Waarvoor we ze gebruiken</h2>
              <ul>
                <li>Het opstellen van offertes en het afhandelen van boekingen.</li>
                <li>Communicatie rond de geplande middag (bevestiging, planning, weersupdates).</li>
                <li>Facturatie en administratieve verplichtingen.</li>
                <li>Verbetering van onze website en dienstverlening, alleen geaggregeerd.</li>
              </ul>
              <p>
                We gebruiken jouw gegevens uitsluitend voor de bovenstaande doeleinden. We verkopen
                geen gegevens en delen ze niet met derden tenzij dat strikt noodzakelijk is voor de
                uitvoering van de boeking (bijvoorbeeld een partner-restaurant voor het diner).
              </p>

              <h2>3. Bewaartermijn</h2>
              <p>
                Boekingsgegevens en facturatiegegevens bewaren we zeven jaar conform de fiscale
                bewaarplicht. Foto&apos;s die met toestemming gemaakt zijn, kunnen op ieder moment
                worden verwijderd op verzoek. Algemene contactaanvragen worden na maximaal twee
                jaar verwijderd indien er geen boeking uit voortkomt.
              </p>

              <h2>4. Jouw rechten</h2>
              <p>Je hebt te allen tijde het recht om:</p>
              <ul>
                <li>Inzage te vragen in welke gegevens we van je hebben.</li>
                <li>Correctie of aanvulling te vragen.</li>
                <li>Verwijdering te vragen (recht op vergetelheid).</li>
                <li>Bezwaar te maken tegen verwerking.</li>
                <li>Een klacht in te dienen bij de Autoriteit Persoonsgegevens.</li>
              </ul>
              <p>
                Stuur een verzoek naar <a href={siteConfig.contact.emailHref}>{siteConfig.contact.email}</a>
                {" "}, we reageren binnen vijf werkdagen.
              </p>

              <h2>5. Beveiliging</h2>
              <p>
                We nemen passende technische en organisatorische maatregelen om je gegevens te
                beschermen tegen verlies of onrechtmatige verwerking. Wij gebruiken versleutelde
                verbindingen (HTTPS) en beperken toegang tot jouw gegevens tot medewerkers die
                deze nodig hebben voor de uitvoering van hun werk.
              </p>

              <h2>6. Cookies</h2>
              <p>
                Deze website gebruikt minimale, functionele cookies en privacy-vriendelijke
                analytics. We plaatsen geen tracking-cookies van derden zonder expliciete
                toestemming.
              </p>

              <h2>7. Contact</h2>
              <p>
                Vragen over deze privacyverklaring? Bel <a href={siteConfig.contact.phoneHref}>{siteConfig.contact.phone}</a> of
                mail naar <a href={siteConfig.contact.emailHref}>{siteConfig.contact.email}</a>.
              </p>

              <blockquote>
                Dit is een basis-privacyverklaring. Raadpleeg een jurist voor wettelijke
                volledigheid.
              </blockquote>
            </div>
          </Container>
        </article>
      </main>
      <Footer />
    </>
  );
}
