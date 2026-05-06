import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { Section, SectionEyebrow } from "@/components/Section";
import { ContactForm } from "@/components/ContactForm";
import { JsonLdGroup } from "@/components/JsonLd";
import { contactPage } from "@/content/pages";
import { siteConfig } from "@/content/site.config";
import { breadcrumbLd, localBusinessLd, absUrl, SITE_URL } from "@/lib/seo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope, faLocationDot, faClock } from "@fortawesome/free-solid-svg-icons";

export const metadata: Metadata = {
  title: "Contact en Offerte | Sloepenspel Amsterdam",
  description:
    "Vraag een offerte aan voor het Sloepenspel. Vertel ons jullie groepsgrootte en datum, reactie binnen 24 uur.",
  alternates: { canonical: "/contact" },
};

const contactPageLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": `${SITE_URL}/contact#contactpage`,
  url: absUrl("/contact"),
  name: "Contact Sloepenspel Amsterdam",
  description: "Vraag een offerte aan voor het Sloepenspel.",
};

export default function ContactPage() {
  return (
    <>
      <JsonLdGroup
        items={[
          contactPageLd,
          localBusinessLd(),
          breadcrumbLd([{ name: "Contact", href: "/contact" }]),
        ]}
      />
      <Nav />
      <main id="main-content">
        <section className="pt-40 pb-16 md:pt-48 md:pb-20 bg-[color:var(--color-bg-warm)] grain relative">
          <Container>
            <div className="max-w-4xl">
              <p className="eyebrow text-[color:var(--color-muted)] mb-5">Offerte aanvragen</p>
              <h1 className="h1">
                <span className="headline-italic">Plan</span> jullie Sloepenspel.
              </h1>
              <p className="mt-7 text-lg md:text-xl text-[color:var(--color-primary)]/80 max-w-2xl leading-relaxed">
                {contactPage.hero.subheadline}
              </p>
            </div>
          </Container>
        </section>

        <Section variant="white">
          <Container>
            <div className="grid lg:grid-cols-12 gap-12">
              <div className="lg:col-span-7">
                <SectionEyebrow>{contactPage.form.eyebrow}</SectionEyebrow>
                <h2 className="h2">
                  <span className="headline-italic">Vertel</span> ons wat je in gedachten hebt.
                </h2>

                <div className="mt-10">
                  <ContactForm />
                </div>
              </div>

              <aside className="lg:col-span-5 lg:pl-8">
                <div className="bg-[color:var(--color-bg-warm)] rounded-[var(--radius-card)] p-8 lg:p-10 sticky top-28">
                  <SectionEyebrow>{contactPage.details.eyebrow}</SectionEyebrow>
                  <h3 className="h3 mb-6">
                    We zitten in <span className="headline-italic">Oost</span>.
                  </h3>
                  <ul className="mt-2 space-y-5">
                    <li className="flex items-start gap-4">
                      <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[color:var(--color-accent)]">
                        <FontAwesomeIcon icon={faPhone} />
                      </span>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-[color:var(--color-muted)] mb-1">Telefoon</p>
                        <a href={siteConfig.contact.phoneHref} className="font-medium hover:text-[color:var(--color-accent)]">
                          {siteConfig.contact.phone}
                        </a>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[color:var(--color-accent)]">
                        <FontAwesomeIcon icon={faEnvelope} />
                      </span>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-[color:var(--color-muted)] mb-1">E-mail</p>
                        <a href={siteConfig.contact.emailHref} className="font-medium hover:text-[color:var(--color-accent)]">
                          {siteConfig.contact.email}
                        </a>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[color:var(--color-accent)]">
                        <FontAwesomeIcon icon={faLocationDot} />
                      </span>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-[color:var(--color-muted)] mb-1">Adres</p>
                        <p className="font-medium">
                          {siteConfig.contact.address.street}<br />
                          {siteConfig.contact.address.zip} {siteConfig.contact.address.city}
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[color:var(--color-accent)]">
                        <FontAwesomeIcon icon={faClock} />
                      </span>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-[color:var(--color-muted)] mb-1">Reactietijd</p>
                        <p className="font-medium">Binnen 24 uur</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </aside>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
