import type { ServiceSlug } from "./services";

/**
 * Trust signals. EVERY LIST IS EMPTY ON PURPOSE: nothing here may be invented.
 * Add an entry only when it is real and Mayfair has permission to publish it;
 * the matching section then appears on its own (TrustSection), and stays
 * hidden while a list is empty.
 *
 * Do not add review stars to structured data: Google ignores self-published
 * reviews for local businesses, and ratings belong on the Google Business Profile.
 */

/** Registrations and licences, e.g. CIPA company number, PPADB contractor code and grade, electrical licence. */
export type Credential = { label: string; value: string; issuer?: string; url?: string };

/** A client's words, used with their written permission. */
export type Testimonial = {
  quote: string;
  name: string;
  /** e.g. "Property manager, Gaborone". */
  role?: string;
  service?: ServiceSlug;
  /** Must be true: confirms the client agreed to be quoted. */
  permission: true;
};

/** A public review, linked to where it was posted so anyone can check it. */
export type Review = {
  source: "Google" | "Facebook";
  url: string;
  author: string;
  quote: string;
  /** ISO date the review was posted. */
  date: string;
  service?: ServiceSlug;
};

/** Organisations Mayfair has worked for, named only with permission. */
export type ClientName = { name: string; permission: true };

export type TeamMember = { name: string; role: string };

export const credentials: Credential[] = [];
export const testimonials: Testimonial[] = [];
export const reviews: Review[] = [];
export const clientNames: ClientName[] = [];
export const team: TeamMember[] = [];
