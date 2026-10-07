import { useSyncExternalStore } from "react";
import { MOTION_KEY } from "./motion-boot";

/**
 * One site-wide motion switch. `html[data-motion="off"]` stops CSS motion
 * (see the end of globals.css) and tells scripted effects to hold still.
 * It starts "off" for anyone whose system asks for reduced motion (set
 * before first paint by the inline script in lib/motion-boot.ts); the
 * header switch overrides it either way and the choice is remembered.
 */
const EVENT = "mayfair:motion";

export const motionOn = () => typeof document !== "undefined" && document.documentElement.getAttribute("data-motion") !== "off";

export function setMotion(on: boolean) {
  document.documentElement.setAttribute("data-motion", on ? "on" : "off");
  try {
    localStorage.setItem(MOTION_KEY, on ? "on" : "off");
  } catch {
    /* storage blocked: the choice lasts for this page only */
  }
  window.dispatchEvent(new Event(EVENT));
}

export function onMotionChange(fn: () => void) {
  window.addEventListener(EVENT, fn);
  return () => window.removeEventListener(EVENT, fn);
}

/** Current motion state, kept in sync with the header switch. The server always renders "on". */
export function useMotion() {
  return useSyncExternalStore(onMotionChange, motionOn, () => true);
}
