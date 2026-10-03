/** Dates are local calendar days (YYYY-MM-DD); timestamps are ISO strings. */

const pad = (n: number) => String(n).padStart(2, "0");

export const toDay = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const today = () => toDay(new Date());

export const parseDay = (day: string) => {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const addDays = (day: string, n: number) => {
  const d = parseDay(day);
  d.setDate(d.getDate() + n);
  return toDay(d);
};

/** Whole days from a to b (positive when b is later). */
export const daysBetween = (a: string, b: string) =>
  Math.round((parseDay(b).getTime() - parseDay(a).getTime()) / 86_400_000);

/** Calendar day of an ISO timestamp, in local time. */
export const dayOf = (iso: string) => toDay(new Date(iso));

const short = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" });
const withYear = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });
const long = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" });

export const formatDay = (day: string, ref = today()) => {
  const d = parseDay(day);
  return d.getFullYear() === parseDay(ref).getFullYear() ? short.format(d) : withYear.format(d);
};
export const formatLong = (day: string) => long.format(parseDay(day));

/** "Today", "Tomorrow", "In 5 days", "3 days overdue". */
export const relativeDue = (day: string, ref = today()) => {
  const n = daysBetween(ref, day);
  if (n === 0) return "Today";
  if (n === 1) return "Tomorrow";
  if (n === -1) return "1 day overdue";
  if (n < 0) return `${-n} days overdue`;
  if (n < 14) return `In ${n} days`;
  return formatDay(day, ref);
};

/** "today", "yesterday", "4 days ago", "3 weeks ago". */
export const ago = (iso: string, ref = today()) => {
  const n = daysBetween(dayOf(iso), ref);
  if (n <= 0) return "today";
  if (n === 1) return "yesterday";
  if (n < 14) return `${n} days ago`;
  if (n < 60) return `${Math.round(n / 7)} weeks ago`;
  return `${Math.round(n / 30)} months ago`;
};

export const timeOf = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
