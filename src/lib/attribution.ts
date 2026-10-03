/**
 * Where a visitor came from, captured on the first page of their visit and
 * sent with any enquiry — so Google Business Profile, organic search, ads and
 * WhatsApp shares can be told apart in the CRM even without analytics.
 *
 * Tag the Google Business Profile website link as
 * ?utm_source=google&utm_medium=organic&utm_campaign=gbp so profile visits are
 * not lumped in with ordinary search.
 */
export type Attribution = {
  landingPage: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  /** Google Ads click id, if a paid click brought the visitor. */
  gclid?: string;
};

const KEY = "mayfair:attribution";

const params: [keyof Attribution, string][] = [
  ["utmSource", "utm_source"],
  ["utmMedium", "utm_medium"],
  ["utmCampaign", "utm_campaign"],
  ["utmTerm", "utm_term"],
  ["utmContent", "utm_content"],
  ["gclid", "gclid"],
];

/** Records the landing page once per browser session. Safe to call on every page. */
export function captureAttribution() {
  try {
    if (sessionStorage.getItem(KEY)) return;
    const url = new URL(window.location.href);
    const referrer = document.referrer && new URL(document.referrer).host !== url.host ? document.referrer : undefined;
    const data: Attribution = { landingPage: url.pathname + url.search, ...(referrer ? { referrer } : {}) };
    for (const [key, param] of params) {
      const value = url.searchParams.get(param);
      if (value) data[key] = value.slice(0, 200);
    }
    sessionStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* storage blocked: enquiries still send, just without a source */
  }
}

export function readAttribution(): Attribution | undefined {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Attribution) : undefined;
  } catch {
    return undefined;
  }
}

/** Flat snake_case fields for the enquiry payload — the keys supabase/crm-schema.sql submit_enquiry() reads. */
export function attributionFields(a: Attribution | undefined) {
  if (!a) return {};
  return {
    landing_page: a.landingPage,
    referrer: a.referrer,
    utm_source: a.utmSource,
    utm_medium: a.utmMedium,
    utm_campaign: a.utmCampaign,
    utm_term: a.utmTerm,
    utm_content: a.utmContent,
    gclid: a.gclid,
  };
}
