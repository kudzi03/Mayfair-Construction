import { projects } from "./projects";

export const primaryNav = [
  { label: "Build", href: "/#build" },
  { label: "Install", href: "/#install" },
  { label: "Equip", href: "/#equip" },
  ...(projects.length > 0 ? [{ label: "Work", href: "/#work" }] : []),
  { label: "Coverage", href: "/#coverage" },
  { label: "FAQ", href: "/#faq" },
] as const;
