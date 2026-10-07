import { projects } from "./projects";

export const primaryNav = [
  { label: "Services", href: "/#services" },
  ...(projects.length > 0 ? [{ label: "Work", href: "/#work" }] : []),
  { label: "Coverage", href: "/#coverage" },
  { label: "FAQ", href: "/#faq" },
] as const;
