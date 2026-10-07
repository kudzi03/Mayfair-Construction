"use client";

import { setMotion, useMotion } from "@/lib/motion";

/** "Motion on / off" — pauses the photo reel, moving type and scroll effects site-wide. */
export function MotionToggle({ className = "" }: { className?: string }) {
  const on = useMotion();
  return (
    <button type="button" role="switch" aria-checked={on} className={`motion-toggle ${className}`} onClick={() => setMotion(!on)}>
      <span className="dot" aria-hidden="true" />
      {/* The on/off word follows html[data-motion] in CSS, so it is right before hydration too. */}
      <span>
        Motion
        <span aria-hidden="true" className="motion-on">
          {" "}
          on
        </span>
        <span aria-hidden="true" className="motion-off">
          {" "}
          off
        </span>
      </span>
    </button>
  );
}
