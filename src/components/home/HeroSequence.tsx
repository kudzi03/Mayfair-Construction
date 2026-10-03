"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ContactLink } from "@/components/contact/ContactLink";
import { ArrowRight, WhatsAppIcon } from "@/components/ui/Icon";
import { site } from "@/config/site";
import { sequence, stages } from "@/content/sequence";
import { serviceBySlug, servicePath } from "@/content/services";
import { clamp01, prefersReducedMotion, subscribeScroll } from "@/lib/scroll-loop";

/* ---------------------------------------------------------------------------
   Timeline: a short hold on each stage, then a move to the next.
   Units are relative; the section's scroll length is derived from TOTAL.
--------------------------------------------------------------------------- */
const HOLD = 0.4;
const FIRST_HOLD = 0.3;
const LAST_HOLD = 0.8;
type Segment = {
  len: number;
  from: number;
  to: number;
  stage: number;
  next: number;
};

const segments: Segment[] = stages.flatMap((s, i): Segment[] => {
  const hold = i === 0 ? FIRST_HOLD : i === stages.length - 1 ? LAST_HOLD : HOLD;
  const out: Segment[] = [{ len: hold, from: s.frame, to: s.frame, stage: i, next: i }];
  if (i < stages.length - 1)
    out.push({
      len: 1,
      from: s.frame,
      to: stages[i + 1].frame,
      stage: i,
      next: i + 1,
    });
  return out;
});
const TOTAL = segments.reduce((n, s) => n + s.len, 0);

/** Scroll progress (0–1) → fractional frame and the stage to caption. */
function locate(p: number) {
  let u = clamp01(p) * TOTAL;
  for (const seg of segments) {
    if (u <= seg.len) {
      const t = seg.len ? u / seg.len : 0;
      const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
      return {
        frame: seg.from + (seg.to - seg.from) * eased,
        stage: t > 0.5 ? seg.next : seg.stage,
      };
    }
    u -= seg.len;
  }
  return { frame: sequence.frameCount - 1, stage: stages.length - 1 };
}

/** Progress at which a stage's hold begins (for the stage rail). */
function progressOfStage(index: number) {
  let u = 0;
  for (const seg of segments) {
    if (seg.from === seg.to && seg.stage === index) return (u + seg.len * 0.5) / TOTAL;
    u += seg.len;
  }
  return 1;
}

/** Keyframes first, then progressively finer passes. */
function loadOrder(count: number, keyframesOnly: boolean) {
  const keys = stages.map((s) => s.frame);
  if (keyframesOnly) return keys;
  const order = [...keys];
  for (const stride of [8, 4, 2, 1]) {
    for (let i = 0; i < count; i += stride) if (!order.includes(i)) order.push(i);
  }
  return order;
}

export function HeroSequence() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stage, setStage] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const still = prefersReducedMotion();
    const conn = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    // Reduced motion only ever shows stage frames; Save-Data and 2G get just those too.
    const keyframesOnly = still || Boolean(conn?.saveData || /(^|-)2g$/.test(conn?.effectiveType ?? ""));
    const size: "sm" | "lg" = canvas.clientWidth < 820 ? "sm" : "lg";
    const frames: (HTMLImageElement | null)[] = new Array(sequence.frameCount).fill(null);
    let current = -1;
    let cancelled = false;
    // What is on the canvas now, so a newly loaded frame only redraws when it improves the picture.
    let drawnLo = -1;
    let drawnHi = -1;
    let lastTarget = 0;

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      current = -1;
    };

    const drawImage = (img: HTMLImageElement, alpha: number) => {
      const cw = canvas.width;
      const ch = canvas.height;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, (cw - dw) * 0.5, (ch - dh) * 0.42, dw, dh);
      ctx.globalAlpha = 1;
    };

    const nearest = (from: number, dir: 1 | -1) => {
      for (let i = from; i >= 0 && i < frames.length; i += dir) if (frames[i]) return i;
      return -1;
    };

    const render = (force = false) => {
      const rect = section.getBoundingClientRect();
      const p = clamp01(-rect.top / Math.max(1, rect.height - window.innerHeight));
      const at = locate(p);
      setStage(at.stage);

      const target = still ? stages[at.stage].frame : at.frame;
      const key = Math.round(target * 100);
      if (!force && key === current) return;

      const lo = nearest(Math.floor(target), -1);
      const hi = nearest(Math.ceil(target), 1);
      if (lo < 0 && hi < 0) return;
      current = key;
      lastTarget = target;
      drawnLo = lo < 0 ? hi : lo;
      drawnHi = hi < 0 ? lo : hi;
      if (lo < 0 || hi < 0 || lo === hi) {
        drawImage(frames[lo < 0 ? hi : lo]!, 1);
        return;
      }
      drawImage(frames[lo]!, 1);
      drawImage(frames[hi]!, (target - lo) / (hi - lo));
    };

    const improves = (index: number) =>
      drawnLo < 0 ||
      (index > drawnLo && index < drawnHi) ||
      Math.abs(index - lastTarget) < Math.min(Math.abs(drawnLo - lastTarget), Math.abs(drawnHi - lastTarget));

    // Stage keyframes load straight after the page; the in-between frames wait
    // until the visitor starts scrolling (or a few seconds pass), so they never
    // compete with the first paint.
    const order = loadOrder(sequence.frameCount, keyframesOnly);
    const keyCount = stages.length;
    const keyQueue = order.slice(0, keyCount);
    const fineQueue = order.slice(keyCount);
    let releaseFine: () => void = () => {};
    const fineReady = new Promise<void>((resolve) => (releaseFine = resolve));

    const load = async (index: number) => {
      const img = new Image();
      img.src = sequence.src(size, index);
      try {
        await img.decode();
        if (cancelled) return;
        frames[index] = img;
        if (index === 0) setReady(true);
        if (improves(index)) render(true);
      } catch {
        // A missing frame is skipped; neighbours cover it.
      }
    };
    const drain = async (queue: number[]): Promise<void> => {
      const index = queue.shift();
      if (index === undefined || cancelled) return;
      await load(index);
      return drain(queue);
    };

    const start = async () => {
      fit();
      await Promise.all([drain(keyQueue), drain(keyQueue), drain(keyQueue)]);
      await fineReady;
      if (!cancelled) await Promise.all([drain(fineQueue), drain(fineQueue), drain(fineQueue)]);
    };
    const fineTimer = window.setTimeout(() => releaseFine(), 4000);
    const onFirstScroll = () => releaseFine();
    window.addEventListener("scroll", onFirstScroll, { passive: true, once: true });
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    const kickoff = () => (idle ?? setTimeout)(() => void start());
    if (document.readyState === "complete") kickoff();
    else window.addEventListener("load", kickoff, { once: true });

    const ro = new ResizeObserver(() => {
      fit();
      render(true);
    });
    ro.observe(canvas);
    const unsubscribe = subscribeScroll(() => render());

    return () => {
      cancelled = true;
      releaseFine();
      window.clearTimeout(fineTimer);
      window.removeEventListener("scroll", onFirstScroll);
      ro.disconnect();
      unsubscribe();
    };
  }, []);

  const jumpTo = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const range = section.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: top + range * progressOfStage(index),
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  const active = stages[stage];

  return (
    <section
      ref={sectionRef}
      className="seq on-dark"
      style={{ "--seq-units": TOTAL } as React.CSSProperties}
      aria-labelledby="hero-title"
      data-sheet="00 — Gaborone, Botswana"
      data-tone="dark"
      data-stage={stage}
      data-hero
    >
      <div className="seq-sticky">
        <div className="seq-media">
          {/* The poster is the LCP image; the canvas takes over once frames decode. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="seq-poster"
            src={sequence.src("lg", 0)}
            srcSet={`${sequence.src("sm", 0)} ${sequence.sizes.sm.width}w, ${sequence.src("lg", 0)} ${sequence.sizes.lg.width}w`}
            sizes="100vw"
            width={sequence.sizes.lg.width}
            height={sequence.sizes.lg.height}
            alt="Illustration: a vacant single-storey commercial building, restored and fitted out stage by stage as you scroll"
            fetchPriority="high"
          />
          <canvas ref={canvasRef} className="seq-canvas" data-ready={ready} aria-hidden="true" />
          <div className="seq-shade" aria-hidden="true" />
          <p className="rep-note seq-note">Illustration — not a Mayfair project</p>
        </div>

        <div className="seq-content container-x">
          <div className="seq-intro">
            <div className="seq-intro-copy">
              <p className="mono text-bone/80">
                {site.name} <span className="mx-1.5 text-ochre">/</span> {site.base.city}, {site.base.country}
              </p>
              <h1 id="hero-title" className="seq-title display mt-4">
                From bare shell to open for business.
              </h1>
              <p className="lead mt-5 max-w-xl text-bone/90">
                Restoration, waterproofing, fit-out, electrical, paving, ATM and EV charger installation, and equipment
                hire — for homes, businesses and banks. Based in Gaborone, working across Botswana.
              </p>
            </div>
            <div className="seq-intro-actions mt-7 flex flex-wrap gap-3">
              <a href="#quote" className="btn btn-primary">
                Request a quote <ArrowRight />
              </a>
              <ContactLink
                channel="whatsapp"
                className="btn btn-light"
                message="Hello Mayfair, I found you online and I’d like to talk about a job."
              >
                <WhatsAppIcon /> WhatsApp
              </ContactLink>
            </div>
          </div>

          <div className="seq-caption" aria-hidden="true">
            <div key={stage} className="seq-caption-inner">
              <p className="mono text-ochre">
                {String(stage).padStart(2, "0")} — {active.label}
              </p>
              <p className="mt-3 text-[clamp(1.75rem,1.2rem+1.6vw,2.75rem)] leading-[1.02] font-semibold tracking-[-0.025em]">
                {active.title}
              </p>
              <p className="mt-3 max-w-md text-bone/85">{active.text}</p>
              {active.services.length > 0 && (
                <p className="mt-4 flex flex-wrap gap-2">
                  {active.services.map((slug) => (
                    <Link key={slug} href={servicePath(slug)} tabIndex={-1} className="seq-chip">
                      {serviceBySlug(slug)!.name}
                    </Link>
                  ))}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="seq-rail container-x" role="group" aria-label="Building stages">
          <ol className="flex">
            {stages.map((s, i) => (
              <li key={s.label} className="flex-1">
                <button
                  type="button"
                  onClick={() => jumpTo(i)}
                  className="seq-tick"
                  data-on={i <= stage}
                  aria-current={i === stage ? "step" : undefined}
                >
                  <span className="mono">{String(i).padStart(2, "0")}</span>
                  <span className="seq-tick-label">{s.label}</span>
                </button>
              </li>
            ))}
          </ol>
          <a href="#services" className="seq-skip mono">
            Skip <ArrowRight size={14} className="rotate-90" />
          </a>
        </div>
      </div>

      {/* The whole story as text, for screen readers and search. */}
      <ol className="sr-only">
        {stages.map((s) => (
          <li key={s.label}>
            {s.label}: {s.title} {s.text}
          </li>
        ))}
      </ol>
    </section>
  );
}
