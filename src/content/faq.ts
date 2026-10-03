/**
 * Frequently asked questions. Every answer is built from confirmed facts
 * (base, coverage, services, client types) or from guidance on how to use
 * this site. Do not add prices, timings, guarantees or process promises
 * until Mayfair confirms them.
 */
export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  {
    q: "Where does Mayfair work?",
    a: "Mayfair Construction is based in Gaborone and works across Botswana. Tell Mayfair the town or site when you get in touch.",
  },
  {
    q: "Who does Mayfair work for?",
    a: "Homeowners and individuals, property managers, developers, businesses, and banks and financial institutions.",
  },
  {
    q: "Can one contractor handle a whole refit?",
    a: "Mayfair’s building services cover restoration, painting, electrical work, carpeting and office partitioning, so a refit that needs several of these can go to one contractor instead of five.",
  },
  {
    q: "Does Mayfair install ATMs and EV chargers?",
    a: "Yes. ATM installation for banks and financial institutions, and EV charger installation for homes, businesses and developments, are both Mayfair services — alongside the electrical, painting and partitioning work around them.",
  },
  {
    q: "Can I hire equipment without booking other work?",
    a: "Yes. Equipment hire is a service in its own right. Forklifts, pallet jacks, concrete mixers and plate compactors are listed; ask about availability for your dates and site.",
  },
  {
    q: "What should I send for a quote?",
    a: "A few lines about the job, the town or site, and a phone number are enough to start. Photos and rough measurements help — each service page lists what is most useful for that kind of work.",
  },
];
