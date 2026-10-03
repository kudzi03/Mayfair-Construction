import { projects } from "./projects";

export const primaryNav = [
  { label: "Build", href: "/#build" },
  { label: "Install", href: "/#install" },
  { label: "Equip", href: "/#equip" },
  { label: "Coverage", href: "/#coverage" },
  ...(projects.length > 0 ? [{ label: "Work", href: "/#work" }] : []),
  { label: "FAQ", href: "/#faq" },
] as const;
