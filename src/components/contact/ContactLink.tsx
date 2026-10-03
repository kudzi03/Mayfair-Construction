"use client";

import type { ReactNode } from "react";
import { track, type ConversionEvent } from "@/lib/analytics";
import { channels, whatsappHref, type ChannelId } from "@/lib/contact";
import { emitToast } from "@/lib/events";

const clickEvent: Record<ChannelId, ConversionEvent> = {
  call: "phone_click",
  whatsapp: "whatsapp_click",
  email: "email_click",
};

const pendingMessage: Record<ChannelId, string> = {
  call: "Demo: Mayfair’s phone number will be connected here.",
  whatsapp: "Demo: Mayfair’s WhatsApp Business number will be connected here.",
  email: "Demo: Mayfair’s email address will be connected here.",
};

/**
 * Call / WhatsApp / Email link. If the channel is not configured yet, the
 * link explains that instead of failing silently.
 */
export function ContactLink({
  channel,
  message,
  className,
  children,
  ariaLabel,
  source,
}: {
  channel: ChannelId;
  /** Placement, sent with the click event (e.g. "header", "service_hero"). */
  source?: string;
  /** Pre-filled WhatsApp message. */
  message?: string;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  const href = channel === "whatsapp" && message ? whatsappHref(message) : channels()[channel].href;
  const external = channel === "whatsapp";

  if (!href) {
    return (
      <button
        type="button"
        className={className}
        aria-label={ariaLabel}
        onClick={() => emitToast(pendingMessage[channel])}
      >
        {children}
      </button>
    );
  }

  return (
    <a
      href={href}
      className={className}
      aria-label={ariaLabel}
      onClick={() => track(clickEvent[channel], { source })}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
