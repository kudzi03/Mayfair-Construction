import { site } from "@/config/site";

/**
 * Conversion events. One place defines the names, so GA4 / GTM reports, the
 * enquiry payload and this code all agree.
 *
 * - quote_form_start   first interaction with an enquiry form on a page
 * - quote_form_submit  enquiry accepted by the endpoint (never fired in demo mode)
 * - phone_click / whatsapp_click / email_click  tap on a configured contact link
 *
 * Mark quote_form_submit, phone_click and whatsapp_click as key events in GA4.
 */
export type ConversionEvent = "quote_form_start" | "quote_form_submit" | "phone_click" | "whatsapp_click" | "email_click";

export type EventParams = {
  /** Where on the page the action happened, e.g. "header", "service_hero", "action_bar". */
  source?: string;
  /** Service slug or "not-sure". */
  service?: string;
  equipment?: string;
};

type Gtag = (command: "event", name: string, params: Record<string, unknown>) => void;
type AnalyticsWindow = Window & { dataLayer?: Record<string, unknown>[]; gtag?: Gtag };

export function track(event: ConversionEvent, params: EventParams = {}) {
  if (typeof window === "undefined") return;
  const w = window as AnalyticsWindow;
  const payload = { ...params, page_path: window.location.pathname };

  // GTM reads the dataLayer; direct GA4 uses gtag(). Never both, or events count twice.
  if (site.analytics.gtmId) {
    (w.dataLayer ??= []).push({ event, ...payload });
  } else if (site.analytics.ga4Id && w.gtag) {
    w.gtag("event", event, payload);
  } else if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", event, payload);
  }
}
