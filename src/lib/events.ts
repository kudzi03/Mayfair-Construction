import type { ServiceSlug } from "@/content/services";

/** Typed window events used to connect CTAs anywhere on a page to shared UI. */

export type PrefillDetail = { service?: ServiceSlug; equipment?: string };

const PREFILL = "mayfair:prefill";
const TOAST = "mayfair:toast";

export const emitPrefill = (detail: PrefillDetail) =>
  window.dispatchEvent(new CustomEvent<PrefillDetail>(PREFILL, { detail }));

export const onPrefill = (fn: (d: PrefillDetail) => void) => {
  const handler = (e: Event) => fn((e as CustomEvent<PrefillDetail>).detail);
  window.addEventListener(PREFILL, handler);
  return () => window.removeEventListener(PREFILL, handler);
};

export const emitToast = (message: string) =>
  window.dispatchEvent(new CustomEvent<string>(TOAST, { detail: message }));

export const onToast = (fn: (message: string) => void) => {
  const handler = (e: Event) => fn((e as CustomEvent<string>).detail);
  window.addEventListener(TOAST, handler);
  return () => window.removeEventListener(TOAST, handler);
};
