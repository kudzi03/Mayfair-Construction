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
      <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true" className="flex-none">
        <rect x="0.5" y="0.5" width="29" height="29" fill="none" stroke="currentColor" strokeOpacity="0.5" />
        <path d="M6 23V8l9 9 9-9v15" fill="none" stroke="var(--color-ochre)" strokeWidth="2.4" strokeLinejoin="miter" />
      </svg>
      <span className="flex flex-col">
        <span className="display text-[1.45rem] tracking-[0.02em]">Mayfair</span>{" "}
        <span className="font-mono text-[0.55rem] tracking-[0.32em] uppercase opacity-80">Construction</span>
      </span>
    </span>
  );
}
