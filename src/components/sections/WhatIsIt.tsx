import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShip, faCompass, faLandmark } from "@fortawesome/free-solid-svg-icons";
import { Container } from "../Container";
import { Section } from "../Section";
import { Reveal } from "../Reveal";

const ITEMS = [
  {
    icon: faShip,
    title: "Jullie eigen sloep",
    body: "Per team, zelf varen, geen vaarbewijs nodig.",
  },
  {
    icon: faCompass,
    title: "Een interactief spel",
    body: "Opdrachten, verhalen en challenges via de app.",
  },
  {
    icon: faLandmark,
    title: "Door de grachten van Amsterdam",
    body: "3 uur, 600 verhalen, live verrassingen onderweg.",
  },
];

export function WhatIsIt() {
  return (
    <Section variant="white" id="wat-is-het" className="!py-16 md:!py-20 lg:!py-24">
      <Container>
        <div className="grid md:grid-cols-3 gap-x-8 gap-y-12 max-w-5xl mx-auto">
          {ITEMS.map((item, i) => (
            <Reveal key={item.title} delay={i * 100}>
              <article className="flex flex-col gap-3">
                <FontAwesomeIcon
                  icon={item.icon}
                  className="text-3xl md:text-4xl text-[color:var(--color-accent)]"
                />
                <h3 className="font-display text-xl md:text-2xl font-semibold leading-tight tracking-tight mt-2">
                  {item.title}
                </h3>
                <p className="text-[color:var(--color-primary)]/72 leading-relaxed text-base">
                  {item.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
