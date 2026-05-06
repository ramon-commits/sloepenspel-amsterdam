/**
 * English (en-US) parallel content.
 * Brand wording in English:
 *   - Sloepenspel → "canal boat rally" (preferred) or "canal boat game"
 *   - bedrijfsuitje / teamuitje → "team adventure", "team experience" or "teambuilding"
 */

export const enHomePage = {
  hero: {
    headline: "The canal boat rally of Amsterdam.",
    subheadline:
      "An interactive team adventure on your own boats through the canals. Your team sails, plays and discovers the real Amsterdam, in one afternoon.",
    primaryCta: "Request a quote",
    primaryHref: "/contact#formulier",
    secondaryCta: "How it works",
    secondaryHref: "/het-spel",
    image: "/images/hero-bedrijfsuitje-v5.jpg",
    imageAlt:
      "Canal boat rally Amsterdam, teams on boats at the dock for the start of the Sloepenspel",
  },
  marquee: {
    eyebrow: "Trusted by companies across Amsterdam",
  },
  positiveReasons: {
    eyebrow: "Why teams choose",
    headline: "Why teams choose the Sloepenspel.",
  },
  howItWorks: {
    eyebrow: "Your afternoon in 4 phases",
    headline: "Here is how your afternoon looks.",
  },
  differentiator: {
    eyebrow: "The Sloepenspel",
    headline: "What makes this canal boat rally special.",
  },
  reviews: {
    eyebrow: "What teams say",
    headline: "What teams say afterwards.",
  },
  locationFinder: {
    eyebrow: "Plan your afternoon",
    headline: "Find your spot on the water.",
    body:
      "Choose your group size, see which boat locations are available and instantly find restaurants nearby.",
  },
  pricing: {
    eyebrow: "Pricing",
    headline: "One price. Everything included.",
  },
  faq: {
    eyebrow: "Q&A",
    headline: "Five things you probably want to know.",
  },
  closingCta: {
    headline: "Ready for the water? So are we.",
    body: "Call us or request a quote online. Reply within one business day.",
  },
};

export const enPositiveReasons = [
  {
    id: "01",
    title: "One choice that works",
    body:
      "No endless scrolling through hundreds of options. The Sloepenspel is one canal boat game, fully thought through, and it works for every team.",
  },
  {
    id: "02",
    title: "Fun for everyone",
    body:
      "Not too corporate, not too wild. Your team sets its own pace. Race competitively or sail relaxed with a rosé, both work.",
  },
  {
    id: "03",
    title: "One price, everything sorted",
    body:
      "€59.50 per person, including the boat, the game, the guides, snacks and drinks on board. No hidden costs, no fuss afterwards.",
  },
];

export const enHowItWorks = [
  {
    step: "01",
    time: "00:00 – 00:15",
    title: "Welcome at the dock",
    body:
      "Our cast welcomes you with a short performance that brings the energy. No boring briefing, immediate atmosphere.",
  },
  {
    step: "02",
    time: "00:15 – 00:30",
    title: "On board",
    body:
      "Each team boards its own boat with an iPad full of game tasks. Everyone gets a role: captain, navigator, game master.",
  },
  {
    step: "03",
    time: "00:30 – 03:00",
    title: "On the water",
    body:
      "Two and a half hours sailing through the canals, discovering stories, completing challenges and meeting unexpected guests along the way. 600 stories hidden in the city.",
  },
  {
    step: "04",
    time: "03:00 – 03:30",
    title: "Closing together",
    body:
      "Everyone meets at the final location. Ranking, prizes, snacks and drinks. And those who want can move on to dinner.",
  },
];

export const enDifferentiators = [
  {
    icon: "boat" as const,
    title: "You sail yourselves",
    body:
      "Each team gets its own boat with iPad. GPS guides you to hotspots through the city, challenges activate automatically. You decide the route.",
  },
  {
    icon: "masks-theater" as const,
    title: "600 stories, live actors",
    body:
      "At every hotspot a story from Amsterdam VIP guides. Along the way our location actors appear to bring it to life.",
  },
  {
    icon: "people-group" as const,
    title: "Competitive and playful",
    body:
      "Live leaderboard, team chat, sabotage gadgets and minigames. From photo challenges to augmented reality. It is a game, not a tour.",
  },
];

export const enReviews = [
  {
    id: "1",
    name: "Sanne de Wit",
    role: "HR Manager",
    company: "Bynder",
    initials: "SW",
    rating: 5,
    quote:
      "Our entire department, 140 people, was sold within ten minutes. Nobody was on their phone, nobody wanted to go home.",
  },
  {
    id: "2",
    name: "Mark Janssen",
    role: "Office Manager",
    company: "Mollie",
    initials: "MJ",
    rating: 5,
    quote:
      "We do a team adventure every year and it never really becomes conversation material. This time it did. Colleagues still bring up anecdotes.",
  },
  {
    id: "3",
    name: "Lara Brouwer",
    role: "Founder",
    company: "Studio Brouwer",
    initials: "LB",
    rating: 5,
    quote:
      "What I really appreciated: one point of contact, clear pricing, and the experience itself was simply well made.",
  },
  {
    id: "4",
    name: "Tom Weenink",
    role: "People Lead",
    company: "WeTransfer",
    initials: "TW",
    rating: 5,
    quote:
      "We thought 250 people on the water would become unmanageable. It did not. Tight organisation, zero hassle.",
  },
];

export const enFaq = [
  {
    q: "Do we need a boating licence?",
    a:
      "No. Our boats fall under the free category, anyone aged 18 and older can sail. You receive a short briefing on the dock beforehand and our guides remain reachable on marine radio while you are on the water.",
  },
  {
    q: "What if it rains?",
    a:
      "We sail anyway. The boats can be covered and the canal boat game continues. In extreme conditions we reschedule together at no extra cost.",
  },
  {
    q: "How many people can take part?",
    a:
      "From 30 to 500+ people. Each boat carries 8 people. We scale with your group size at every location.",
  },
  {
    q: "What is included in the price?",
    a:
      "Everything except lunch or dinner: the boats, the game, guidance from actors, snacks on board. For restaurants we help you further through our partners.",
  },
  {
    q: "Can we have dinner afterwards?",
    a:
      "Yes. Each location has fixed restaurant partners that can host your group. We send the options along with the quote.",
  },
];

export const enPricing = {
  price: "€59.50",
  unit: "per person",
  subline: "One price. Everything included.",
  includes: [
    "Own boat with sailing guidance",
    "iPad with game assignments per boat",
    "Location actors on the route",
    "Welcome by our cast",
    "Photos of the afternoon",
    "Awards ceremony and closing",
  ],
  excludes: [
    "Lunch or dinner (book through our restaurant partners)",
    "Transport to the boat location",
  ],
};
