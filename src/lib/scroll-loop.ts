/**
 * One passive scroll/resize listener, batched into requestAnimationFrame,
 * shared by every scroll-linked effect on the page.
 */
type Subscriber = () => void;

const subscribers = new Set<Subscriber>();
let frame = 0;
let listening = false;

const tick = () => {
  frame = 0;
  subscribers.forEach((fn) => fn());
};

const schedule = () => {
  if (!frame) frame = requestAnimationFrame(tick);
};

export function subscribeScroll(fn: Subscriber) {
  subscribers.add(fn);
  if (!listening) {
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    listening = true;
  }
  fn();
  return () => {
    subscribers.delete(fn);
    if (subscribers.size === 0 && listening) {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
      frame = 0;
      listening = false;
    }
  };
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
