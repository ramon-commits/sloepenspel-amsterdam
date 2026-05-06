"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import faqData from "@/content/faq.json";
import { Container } from "../Container";
import { Section, SectionEyebrow, SectionHeadline } from "../Section";
import { homePage } from "@/content/pages";
import { JsonLd } from "../JsonLd";
import { faqLd } from "@/lib/seo";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section variant="white" id="faq">
      <JsonLd data={faqLd(faqData.faqs.map((f) => ({ q: f.q, a: f.a })))} />
      <Container>
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <SectionEyebrow>{homePage.faq.eyebrow}</SectionEyebrow>
            <SectionHeadline italic="Vijf">
              {homePage.faq.headline.replace("Vijf ", "")}
            </SectionHeadline>
            <p className="mt-6 text-[color:var(--color-muted)]">
              Staat jouw vraag er niet tussen? Bel of mail ons direct.
            </p>
          </div>

          <div className="lg:col-span-8">
            <div className="divide-y divide-black/10">
              {faqData.faqs.map((faq, i) => {
                const isOpen = open === i;
                return (
                  <div key={i} className="py-5">
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="w-full flex items-center justify-between gap-6 text-left group"
                      aria-expanded={isOpen}
                    >
                      <h3 className="font-display text-xl md:text-2xl font-medium leading-snug pr-2 group-hover:text-[color:var(--color-accent)] transition-colors min-h-[44px] flex items-center">
                        {faq.q}
                      </h3>
                      <span className="shrink-0 w-11 h-11 rounded-full bg-[color:var(--color-bg-warm)] flex items-center justify-center group-hover:bg-[color:var(--color-accent)] group-hover:text-white transition-all group-hover:scale-110">
                        <FontAwesomeIcon icon={isOpen ? faMinus : faPlus} className="text-sm" />
                      </span>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isOpen ? "max-h-96 mt-4" : "max-h-0"
                      }`}
                    >
                      <p className="text-[color:var(--color-primary)]/75 leading-relaxed pr-12">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
