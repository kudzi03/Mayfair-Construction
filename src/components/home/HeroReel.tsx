"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, PauseIcon, PlayIcon } from "@/components/ui/Icon";
import { useMotion } from "@/lib/motion";

/** One reel photo pair, prepared on the server (plain strings only, so no image registry ships to the browser). */
export type ReelFrame = {
  key: string;
  img: { src: string; srcSet?: string; sizes?: string; width?: number | string; height?: number | string };
  tallSrcSet?: string;
  tallQuery: string;
  focus?: string;
  focusTall?: string;
  wide: { label: string; href?: string };
  tall: { label: string; href?: string };
};

/** How long each photo holds, and the crossfade (matches .reel-slide in globals.css). */
const HOLD = 5500;
const FADE = 1400;

/** Where each slow push-in drifts, so consecutive photos don't move the same way. */
const drift = [
  { origin: "50% 45%", kx: "-1.5%", ky: "-1%" },
  { origin: "30% 60%", kx: "1.5%", ky: "-1.5%" },
  { origin: "70% 40%", kx: "-2%", ky: "1%" },
  { origin: "45% 30%", kx: "1%", ky: "1.5%" },
  { origin: "60% 70%", kx: "-1%", ky: "-2%" },
  { origin: "40% 50%", kx: "2%", ky: "0%" },
];

function Caption({ shot, className }: { shot: ReelFrame["wide"]; className: string }) {
  const body = (
    <>
      <span className="chip-dot" aria-hidden="true" />
      {shot.label}
      <span className="opacity-60">· Site photo</span>
    </>
  );
  return shot.href ? (
    <Link href={shot.href} className={`glass-chip ${className}`}>
      {body}
      <ArrowRight size={14} />
    </Link>
  ) : (
    <span className={`glass-chip ${className}`}>{body}</span>
  );
}

/**
 * The photo reel behind the home-page hero. The first photo is server-rendered
 * (it paints with the page); each later photo mounts just before its turn, so
 * a visitor who scrolls straight past downloads only what they saw.
 */
export function HeroReel({ frames, children }: { frames: ReelFrame[]; children: ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const imgs = useRef<(HTMLImageElement | null)[]>([]);
  const indexRef = useRef(0);
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  // How many photos (from the start) are in the DOM. Grows one ahead of the current photo.
  const [mounted, setMounted] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [paused, setPaused] = useState(false);
  const [hold, setHold] = useState(false);
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const motion = useMotion();

  const motionRef = useRef(motion);
  useEffect(() => {
    motionRef.current = motion;
  }, [motion]);

  // Showing a photo also mounts the one after it, so it downloads during this photo's turn.
  const show = useCallback(
    (next: number) => {
      const current = indexRef.current;
      if (next === current) return;
      indexRef.current = next;
      setMounted((m) => Math.min(frames.length, Math.max(m, next + 2)));
      setPrev(current);
      setIndex(next);
    },
    [frames.length],
  );

  // Nothing else loads until the page has; then the second photo, if the reel will play.
  useEffect(() => {
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    const go = () => {
      setLoaded(true);
      if (motionRef.current) setMounted((m) => Math.max(m, Math.min(2, frames.length)));
    };
    const ready = () => (idle ? idle(go) : window.setTimeout(go, 300));
    if (document.readyState === "complete") ready();
    else window.addEventListener("load", ready, { once: true });
    return () => window.removeEventListener("load", ready);
  }, [frames.length]);

  const moving = motion && !paused && !hold && inView && tabVisible;

  // Hold still off screen and in background tabs.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    const onVisibility = () => setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // Clear the outgoing photo once the crossfade has finished.
  useEffect(() => {
    if (prev === null) return;
    const t = window.setTimeout(() => setPrev(null), FADE + 60);
    return () => window.clearTimeout(t);
  }, [prev, index]);

  // Advance, waiting for the next photo if it hasn't arrived yet.
  useEffect(() => {
    if (!moving || !loaded) return;
    let t = 0;
    const tick = () => {
      const next = (indexRef.current + 1) % frames.length;
      const img = imgs.current[next];
      if (!img) setMounted((m) => Math.max(m, next + 1));
      if (!img || !img.complete) {
        t = window.setTimeout(tick, 500);
        return;
      }
      show(next);
    };
    t = window.setTimeout(tick, HOLD);
    return () => window.clearTimeout(t);
  }, [moving, loaded, index, frames.length, show]);

  const current = frames[index];

  return (
    <section
      ref={sectionRef}
      className="reel"
      aria-labelledby="hero-title"
      data-hero
      data-tone="dark"
      data-kb={moving ? "running" : "paused"}
    >
      <div className="reel-media" aria-hidden="true">
        {frames.slice(0, mounted).map((f, i) => (
          <figure
            key={f.key}
            className="reel-slide"
            data-state={i === index ? "on" : i === prev ? "prev" : undefined}
            style={
              {
                "--origin": drift[i % drift.length].origin,
                "--kx": drift[i % drift.length].kx,
                "--ky": drift[i % drift.length].ky,
                "--kb": `${(HOLD + FADE * 2) / 1000}s`,
              } as React.CSSProperties
            }
          >
            <picture>
              {f.tallSrcSet && <source media={f.tallQuery} srcSet={f.tallSrcSet} sizes="100vw" />}
              <img
                {...f.img}
                ref={(el) => {
                  imgs.current[i] = el;
                }}
                alt=""
                decoding="async"
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "auto"}
                style={{ "--focus": f.focus, "--focus-p": f.focusTall } as React.CSSProperties}
              />
            </picture>
          </figure>
        ))}
      </div>
      <div className="reel-shade" aria-hidden="true" />

      {children}

      <div
        className="reel-meta"
        onMouseEnter={() => setHold(true)}
        onMouseLeave={() => setHold(false)}
        onFocus={() => setHold(true)}
        onBlur={() => setHold(false)}
      >
        <Caption shot={current.wide} className="only-wide" />
        <Caption shot={current.tall} className="only-tall" />
        <div className="reel-dots" role="group" aria-label="Choose a photo">
          {frames.map((f, i) => (
            <button
              key={f.key}
              type="button"
              className="reel-dot"
              aria-label={`Photo ${i + 1}: ${f.wide.label}`}
              aria-current={i === index}
              onClick={() => show(i)}
            />
          ))}
        </div>
        {motion && (
          <button
            type="button"
            className="glass-btn"
            aria-label={paused ? "Play the photo reel" : "Pause the photo reel"}
            onClick={() => setPaused((p) => !p)}
          >
            {paused ? <PlayIcon /> : <PauseIcon />}
          </button>
        )}
      </div>
    </section>
  );
}
