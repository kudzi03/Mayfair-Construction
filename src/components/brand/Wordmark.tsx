import Image from "next/image";
import { site } from "@/config/site";

/**
 * Typographic wordmark used until Mayfair supplies a logo file.
 * Set `site.logo` and this renders the supplied artwork instead.
 */
export function Wordmark({ className = "" }: { className?: string }) {
  if (site.logo) {
    return (
      <Image
        src={site.logo.src}
        width={site.logo.width}
        height={site.logo.height}
        alt={site.name}
        className={className}
        preload
      />
    );
  }

  return (
    <span className={`inline-flex items-center gap-2.5 leading-none ${className}`}>
      <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true" className="flex-none">
        <rect width="32" height="32" rx="8" fill="var(--color-ochre)" />
        <path d="M8.5 22.5v-13l7.5 7.5 7.5-7.5v13" fill="none" stroke="var(--color-ink)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="flex flex-col gap-0.5">
        <span className="display text-[1.5rem] leading-[0.85]">Mayfair</span>{" "}
        <span className="text-[0.55rem] font-semibold tracking-[0.3em] uppercase opacity-70">Construction</span>
      </span>
    </span>
  );
}
