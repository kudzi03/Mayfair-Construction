import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (size: number, props: SVGProps<SVGSVGElement>) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  "aria-hidden": true,
  focusable: false,
  ...props,
});

export const ArrowRight = ({ size = 18, className = "", ...p }: IconProps) => (
  <svg {...base(size, p)} className={`icon-arrow ${className}`}>
    <path d="M4 12h15M13 6l6 6-6 6" strokeLinecap="square" />
  </svg>
);

export const ArrowUpRight = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size, p)}>
    <path d="M7 17 17 7M8 7h9v9" strokeLinecap="square" />
  </svg>
);

export const PhoneIcon = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size, p)}>
    <path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z" strokeLinejoin="round" />
  </svg>
);

export const WhatsAppIcon = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size, p)}>
    <path
      d="M4 20l1.2-4.1A8.5 8.5 0 1 1 8.4 19L4 20Z"
      strokeLinejoin="round"
    />
    <path
      d="M9 8.5c0 3.3 3 6.5 6.5 6.5l1-1.6-2-1-1 .9c-1.2-.5-2.2-1.5-2.8-2.8l.9-1-1-2L9 8.5Z"
      fill="currentColor"
      stroke="none"
    />
  </svg>
);

export const MailIcon = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size, p)}>
    <rect x="3" y="5" width="18" height="14" rx="1" />
    <path d="m3.5 6 8.5 7 8.5-7" />
  </svg>
);

export const MenuIcon = ({ size = 22, ...p }: IconProps) => (
  <svg {...base(size, p)}>
    <path d="M3 8h18M3 16h18" />
  </svg>
);

export const CloseIcon = ({ size = 22, ...p }: IconProps) => (
  <svg {...base(size, p)}>
    <path d="m5 5 14 14M19 5 5 19" />
  </svg>
);

export const PinIcon = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size, p)}>
    <path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);

export const CheckIcon = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size, p)}>
    <path d="m4.5 12.5 5 5 10-11" strokeLinecap="square" />
  </svg>
);

export const AlertIcon = ({ size = 16, ...p }: IconProps) => (
  <svg {...base(size, p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v6M12 16.5v.5" strokeLinecap="round" />
  </svg>
);

export const ChevronIcon = ({ size = 20, ...p }: IconProps) => (
  <svg {...base(size, p)}>
    <path d="m9 5 7 7-7 7" />
  </svg>
);
