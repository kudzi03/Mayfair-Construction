/** Storage key for the visitor's motion choice (shared with lib/motion). */
export const MOTION_KEY = "mayfair:motion";

/** Inline script for <head>: runs before first paint, so a motion-off visitor never sees anything move. */
export const motionBootScript = `try{var m=localStorage.getItem("${MOTION_KEY}");if(m==="off"||(!m&&matchMedia("(prefers-reduced-motion: reduce)").matches))document.documentElement.setAttribute("data-motion","off")}catch(e){}`;
