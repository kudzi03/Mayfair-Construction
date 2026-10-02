import { site } from "@/config/site";

export type ChannelId = "call" | "whatsapp" | "email";

export type Channel = {
  id: ChannelId;
  label: string;
  /** Visible value — the number/address, or a placeholder in the demo. */
  display: string;
  /** null when the value is not configured yet. */
  href: string | null;
};

const digits = (e164: string) => e164.replace(/[^\d]/g, "");

/** "+26771234567" → "+267 71 234 567" */
export const formatBwPhone = (e164: string) => {
  const d = digits(e164);
  if (d.startsWith("267") && d.length === 11) return `+267 ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8)}`;
  return e164;
};

export const whatsappHref = (message?: string) => {
  const number = site.contact.whatsapp;
  if (!number) return null;
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits(number)}${text}`;
};

export const channels = (): Record<ChannelId, Channel> => {
  const { phone, whatsapp, email } = site.contact;
  return {
    call: {
      id: "call",
      label: "Call",
      display: phone ? formatBwPhone(phone) : "+267 — number to follow",
      href: phone ? `tel:${phone}` : null,
    },
    whatsapp: {
      id: "whatsapp",
      label: "WhatsApp",
      display: whatsapp ? formatBwPhone(whatsapp) : "WhatsApp — number to follow",
      href: whatsappHref("Hello Mayfair, I’d like a quote."),
    },
    email: {
      id: "email",
      label: "Email",
      display: email ?? "Email — address to follow",
      href: email ? `mailto:${email}` : null,
    },
  };
};
