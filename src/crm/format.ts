import { CURRENCY_PREFIX } from "./config";

const grouped = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });

/** "P 126,000" — estimates are whole pula. */
export const money = (v?: number | null) => (v == null ? "—" : `${CURRENCY_PREFIX} ${grouped.format(v)}`);

/** Shorter form for tight spaces: "P 1.25M", "P 340k". */
export const moneyShort = (v: number) => {
  if (v >= 1_000_000) return `${CURRENCY_PREFIX} ${(v / 1_000_000).toFixed(v >= 10_000_000 ? 0 : 2).replace(/\.?0+$/, "")}M`;
  if (v >= 100_000) return `${CURRENCY_PREFIX} ${Math.round(v / 1000)}k`;
  return money(v);
};

/** Botswana numbers: 8-digit mobiles / 7-digit landlines get +267. */
export const toE164 = (raw?: string) => {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("267") && digits.length >= 10) return `+${digits}`;
  if (digits.length === 7 || digits.length === 8) return `+267${digits}`;
  return `+${digits}`;
};

export const formatPhone = (raw?: string) => {
  const e = toE164(raw);
  if (!e) return raw ?? "";
  const m = e.match(/^\+267(\d{2})(\d{3})(\d{3})$/);
  return m ? `+267 ${m[1]} ${m[2]} ${m[3]}` : e;
};

export const phoneDigits = (raw?: string) => toE164(raw)?.replace(/\D/g, "") ?? "";

export const telHref = (raw?: string) => {
  const e = toE164(raw);
  return e ? `tel:${e}` : null;
};

/** Opens WhatsApp with nothing pre-filled: a person decides what to send. */
export const whatsappHref = (raw?: string) => {
  const d = phoneDigits(raw);
  return d ? `https://wa.me/${d}` : null;
};

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
