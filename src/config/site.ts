/**
 * Central business configuration.
 *
 * Everything Mayfair still has to confirm lives here. Fill a value in and the
 * whole site (buttons, footer, structured data, enquiry routing) picks it up.
 * Leave a value as `null` and the UI falls back to a clearly-labelled demo state.
 */

export type ContactConfig = {
  /** E.164 format, e.g. "+26771234567". */
  phone: string | null;
  /** E.164 format of the WhatsApp Business number. Often the same as phone. */
  whatsapp: string | null;
  email: string | null;
  /** Street address. Only the city is confirmed for the demo. */
  streetAddress: string | null;
  /** e.g. "Mon–Fri 07:30–17:00". Unconfirmed, so null. */
  hours: string | null;
};

export type SocialLink = { label: string; href: string };

const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

const resolveSiteUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  // An indexable build must never guess its canonical domain (preview, vercel.app or localhost).
  if (allowIndexing) {
    throw new Error("NEXT_PUBLIC_ALLOW_INDEXING=true needs NEXT_PUBLIC_SITE_URL set to the production domain.");
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  // Local development; production builds default to the demo deployment.
  return process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://mayfair-construction.vercel.app";
};

const env = (value: string | undefined) => (value && value.trim() ? value.trim() : null);

export const site = {
  name: "Mayfair Construction",
  shortName: "Mayfair",
  url: resolveSiteUrl(),
  /**
   * The demo must not be indexed: it carries representative imagery and
   * placeholder contact details. Set NEXT_PUBLIC_ALLOW_INDEXING=true at launch.
   */
  allowIndexing,
  /** Shows the small demo notices (representative imagery, unsent enquiries). */
  isDemo: process.env.NEXT_PUBLIC_DEMO_MODE !== "false",

  base: {
    city: "Gaborone",
    country: "Botswana",
    countryCode: "BW",
    // Gaborone city coordinates (public geographic data, not a business address).
    lat: -24.6282,
    lon: 25.9231,
  },

  description:
    "Mayfair Construction is a Gaborone-based contractor for building restoration and renovation, roof waterproofing, painting, electrical work, air conditioning, carpeting, office partitioning, paving, joinery, glass doors, ATM and EV charger installation, and equipment hire — working across Botswana.",

  /**
   * Google Business Profile alignment. The profile and the website must say
   * the same thing: same name, phone, website and service area. Fill these in
   * from the verified profile; nothing here is shown until it is set.
   */
  business: {
    /** Registered company name (CIPA), if it differs from the trading name. Unconfirmed. */
    legalName: null as string | null,
    /** Public Google Business Profile / Maps URL once verified. Also added to `sameAs`. */
    googleBusinessProfileUrl: null as string | null,
    /** Mayfair is a service-area business: towns and regions served, as listed on the profile. */
    serviceArea: ["Gaborone", "Botswana"],
    /**
     * Profile description (Google allows 750 characters). Kept factual: what,
     * where, who for, how to ask. Paste into the profile as-is or edit both together.
     */
    profileDescription:
      "Mayfair Construction is a contractor based in Gaborone, working across Botswana. We take on building restoration and renovation, flat-roof waterproofing, interior and exterior painting, electrical work, carpet fitting, office partitioning, paving repairs, lockers and joinery, and glass entrance doors with floor springs. We install ATMs for banks and financial institutions, EV chargers for homes, businesses and developments, and air conditioning for offices, shops and homes. We also hire out forklifts, pallet jacks, concrete mixers and plate compactors. We work for homeowners, property managers, developers, businesses and banks. Send photos and a few details for a quote.",
  },

  contact: {
    phone: null,
    whatsapp: null,
    email: null,
    streetAddress: null,
    hours: null,
  } satisfies ContactConfig as ContactConfig,

  /** Add verified business pages only (e.g. a Facebook Page, Google Business Profile). */
  social: [] as SocialLink[],

  /**
   * Where enquiry form submissions go.
   * - "demo": nothing is sent; the visitor sees an explicit demo confirmation.
   * - "endpoint": POST JSON to `endpoint` (Formspree, a Next route handler, a CRM webhook...).
   */
  enquiry: {
    mode: (process.env.NEXT_PUBLIC_ENQUIRY_ENDPOINT ? "endpoint" : "demo") as "demo" | "endpoint",
    endpoint: process.env.NEXT_PUBLIC_ENQUIRY_ENDPOINT ?? null,
  },

  /**
   * Measurement. Set ONE of these in the environment (GTM if a container manages
   * several tags, GA4 otherwise). Unset = no third-party script loads at all.
   */
  analytics: {
    gtmId: env(process.env.NEXT_PUBLIC_GTM_ID),
    ga4Id: env(process.env.NEXT_PUBLIC_GA4_ID),
  },

  /** Search Console / Bing Webmaster Tools HTML-tag verification tokens (content value only). */
  verification: {
    google: env(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION),
    bing: env(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION),
  },

  /** Swap in a real logo file (SVG preferred) when supplied. Null = typographic wordmark. */
  logo: null as { src: string; width: number; height: number } | null,
} as const;
