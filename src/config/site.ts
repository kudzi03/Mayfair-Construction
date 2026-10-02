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

const resolveSiteUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
};

export const site = {
  name: "Mayfair Construction",
  shortName: "Mayfair",
  url: resolveSiteUrl(),
  /**
   * The demo must not be indexed: it carries representative imagery and
   * placeholder contact details. Set NEXT_PUBLIC_ALLOW_INDEXING=true at launch.
   */
  allowIndexing: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
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
    "Mayfair Construction is a Gaborone-based contractor for restoration, painting, electrical work, carpeting, office partitioning, ATM and EV charger installation, and equipment hire — working across Botswana.",

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

  /** Swap in a real logo file (SVG preferred) when supplied. Null = typographic wordmark. */
  logo: null as { src: string; width: number; height: number } | null,
} as const;
