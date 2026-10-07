"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Wordmark } from "@/components/brand/Wordmark";
import { ContactLink } from "@/components/contact/ContactLink";
import { MotionToggle } from "@/components/motion/MotionToggle";
import { ArrowRight, CloseIcon, MenuIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/Icon";
import { primaryNav } from "@/content/navigation";
import { pillars, servicesInPillar, servicePath } from "@/content/services";
import { subscribeScroll } from "@/lib/scroll-loop";
import { useQuoteHref } from "@/lib/use-quote-href";

export function Header() {
  const pathname = usePathname();
  const quoteHref = useQuoteHref();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  // The menu belongs to the page it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (value: boolean) => setOpenOn(value ? pathname : null);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let lastY = window.scrollY;
    // Pages without a dark hero (e.g. /credits) start on a light background,
    // where a transparent header's light text would be unreadable.
    const lightTop = !document.querySelector("[data-hero]");
    return subscribeScroll(() => {
      const y = window.scrollY;
      setSolid(lightTop || y > 24);
      setHidden(y > 480 && y > lastY + 2 ? true : y < lastY - 2 ? false : (h) => h);
      lastY = y;
    });
  }, [pathname]);

  const close = useCallback(() => {
    setOpenOn(null);
    toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    const menu = menuRef.current;
    menu?.querySelector<HTMLElement>("[data-autofocus]")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key !== "Tab" || !menu) return;
      const focusable = menu.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <>
      <header className="site-header" data-solid={solid || open} data-hidden={hidden && !open}>
        <div className="container-x flex h-full items-center justify-between gap-3 sm:gap-6">
          <Link href="/" className="relative z-10 -my-2 py-2">
            <Wordmark />
            <span className="sr-only">, home</span>
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-7">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="nav-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <ContactLink channel="call" source="header" className="btn btn-sm btn-outline hidden xl:inline-flex">
              <PhoneIcon size={16} />
              Call
            </ContactLink>
            <Link href={quoteHref} className="btn btn-sm btn-primary">
              <span className="hidden sm:inline">Request a quote</span>
              <span className="sm:hidden">Quote</span>
            </Link>
            <MotionToggle className="hidden lg:inline-flex" />
            <button
              ref={toggleRef}
              type="button"
              className="-mr-2 inline-flex size-11 items-center justify-center lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div
          id="mobile-menu"
          ref={menuRef}
          className="mobile-menu on-dark"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="container-x flex h-(--header-h) flex-none items-center justify-between">
            <Wordmark />
            <button
              type="button"
              data-autofocus
              className="-mr-2 inline-flex size-11 items-center justify-center"
              aria-label="Close menu"
              onClick={close}
            >
              <CloseIcon />
            </button>
          </div>

          <nav aria-label="Mobile" className="container-x flex-1 pt-6 pb-10">
            <ul className="border-b border-white/10">
              {primaryNav.map((item, i) => (
                <li key={item.href} style={{ "--i": i } as React.CSSProperties} className="border-t border-white/10">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="display flex items-center justify-between py-3 text-[2.75rem]"
                  >
                    {item.label}
                    <ArrowRight size={22} className="text-ochre" />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-10 grid gap-8 sm:grid-cols-3">
              {pillars.map((p) => (
                <div key={p.id}>
                  <p className="mono mb-3 text-muted-dark">
                    {p.number} — {p.name}
                  </p>
                  <ul className="space-y-1">
                    {servicesInPillar(p.id).map((s) => (
                      <li key={s.slug}>
                        <Link href={servicePath(s.slug)} className="inline-flex min-h-11 items-center text-lg">
                          {s.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </nav>

          <div className="container-x sticky bottom-0 grid grid-cols-2 gap-2 border-t border-white/10 bg-ink py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <ContactLink channel="call" source="mobile_menu" className="btn btn-light">
              <PhoneIcon size={16} /> Call
            </ContactLink>
            <ContactLink channel="whatsapp" source="mobile_menu" className="btn btn-light">
              <WhatsAppIcon size={16} /> WhatsApp
            </ContactLink>
            <Link href={quoteHref} onClick={() => setOpen(false)} className="btn btn-primary col-span-2">
              Request a quote <ArrowRight />
            </Link>
            <MotionToggle className="col-span-2 justify-center" />
          </div>
        </div>
      )}
    </>
  );
}
