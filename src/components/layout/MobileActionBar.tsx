"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ContactLink } from "@/components/contact/ContactLink";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/Icon";
import { subscribeScroll } from "@/lib/scroll-loop";
import { useQuoteHref } from "@/lib/use-quote-href";

/** Thumb-reach contact bar on small screens. Hides when the form is on screen. */
export function MobileActionBar() {
  const pathname = usePathname();
  const quoteHref = useQuoteHref();
  const [pastHero, setPastHero] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  // Appear once the hero's own buttons have scrolled away. Most heroes are about
  // one screen tall; the home page's scroll-built sequence is several, and nobody
  // should have to scroll through all of it before they can call or WhatsApp.
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("[data-hero]");
    return subscribeScroll(() => {
      const vh = window.innerHeight;
      const tall = hero && hero.offsetHeight > vh * 1.5;
      setPastHero(hero && !tall ? hero.getBoundingClientRect().bottom < vh * 0.5 : window.scrollY > vh * 0.6);
    });
  }, [pathname]);

  useEffect(() => {
    const form = document.getElementById("quote");
    if (!form) return;
    const io = new IntersectionObserver(([e]) => setFormVisible(e.isIntersecting), { threshold: 0.05 });
    io.observe(form);
    return () => io.disconnect();
  }, [pathname]);

  const show = pastHero && !formVisible;

  return (
    <nav aria-label="Quick contact" className="action-bar lg:hidden" data-show={show} aria-hidden={!show} inert={!show}>
      <ContactLink channel="call" source="action_bar" className="flex items-center justify-center gap-2 border-r border-white/10 font-semibold text-bone">
        <PhoneIcon size={18} /> Call
      </ContactLink>
      <ContactLink channel="whatsapp" source="action_bar" className="flex items-center justify-center gap-2 border-r border-white/10 font-semibold text-bone">
        <WhatsAppIcon size={18} /> WhatsApp
      </ContactLink>
      <a href={quoteHref} className="flex items-center justify-center bg-ochre font-semibold text-ink">
        Get a quote
      </a>
    </nav>
  );
}
