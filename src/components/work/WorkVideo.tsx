"use client";

import { useEffect, useRef, useState } from "react";
import { useMotion } from "@/lib/motion";

/**
 * Short muted site clip. Plays only while on screen, and never while motion
 * is off (system setting or the header switch). The toggle satisfies "pause moving content".
 */
export function WorkVideo({ mp4, webm, poster, label }: { mp4: string; webm: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const motion = useMotion();
  // The poster attribute downloads eagerly, so attach it only as the clip nears the screen.
  const [near, setNear] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setNear(true);
        io.disconnect();
      },
      { rootMargin: "800px 0px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (!motion) {
      v.pause();
      return;
    }
    v.muted = true;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !userPaused) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [userPaused, motion]);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      v.muted = true;
      v.play().catch(() => {});
      setUserPaused(false);
    } else {
      v.pause();
      setUserPaused(true);
    }
  };

  return (
    <>
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        poster={near ? poster : undefined}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src={mp4} type='video/mp4; codecs="avc1.4D401E"' />
        <source src={webm} type="video/webm" />
      </video>
      <button
        type="button"
        onClick={toggle}
        className="mono absolute right-3 bottom-3 inline-flex min-h-11 items-center gap-2 bg-ink/80 px-3 text-bone backdrop-blur-sm hover:bg-ink"
        aria-label={playing ? "Pause video" : "Play video"}
      >
        <span aria-hidden="true" className="inline-flex size-3 items-center justify-center">
          {playing ? (
            <svg viewBox="0 0 12 12" className="size-3 fill-current">
              <rect x="1.5" y="1" width="3" height="10" />
              <rect x="7.5" y="1" width="3" height="10" />
            </svg>
          ) : (
            <svg viewBox="0 0 12 12" className="size-3 fill-current">
              <path d="M2 1l9 5-9 5z" />
            </svg>
          )}
        </span>
        {playing ? "Pause" : "Play"}
      </button>
    </>
  );
}
