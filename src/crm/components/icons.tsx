import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

const svg = (size: number, props: SVGProps<SVGSVGElement>) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
  ...props,
});

export const SearchIcon = ({ size = 20, ...p }: P) => (
  <svg {...svg(size, p)}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.2-4.2" />
  </svg>
);
export const PlusIcon = ({ size = 20, ...p }: P) => (
  <svg {...svg(size, p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const TodayIcon = ({ size = 20, ...p }: P) => (
  <svg {...svg(size, p)}>
    <path d="M4 11.5 12 5l8 6.5V20H4z" />
    <path d="M10 20v-5h4v5" />
  </svg>
);
export const BellIcon = ({ size = 20, ...p }: P) => (
  <svg {...svg(size, p)}>
    <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" />
    <path d="M10 20.5a2 2 0 0 0 4 0" />
  </svg>
);
export const BoardIcon = ({ size = 20, ...p }: P) => (
  <svg {...svg(size, p)}>
    <rect x="3.5" y="4.5" width="5" height="15" />
    <rect x="9.5" y="4.5" width="5" height="10" />
    <rect x="15.5" y="4.5" width="5" height="7" />
  </svg>
);
export const ListIcon = ({ size = 20, ...p }: P) => (
  <svg {...svg(size, p)}>
    <path d="M9 6h11M9 12h11M9 18h11" />
    <path d="M4.5 6h.01M4.5 12h.01M4.5 18h.01" strokeWidth={2.6} />
  </svg>
);
export const PeopleIcon = ({ size = 20, ...p }: P) => (
  <svg {...svg(size, p)}>
    <circle cx="9" cy="8.5" r="3.5" />
    <path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5" />
    <path d="M16 5.2a3.5 3.5 0 0 1 0 6.6M18 14.8c1.8.6 3 2.4 3.5 5.2" />
  </svg>
);
export const CalendarIcon = ({ size = 18, ...p }: P) => (
  <svg {...svg(size, p)}>
    <rect x="4" y="5.5" width="16" height="14.5" />
    <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" />
  </svg>
);
export const ClockIcon = ({ size = 16, ...p }: P) => (
  <svg {...svg(size, p)}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);
export const AlertCircle = ({ size = 16, ...p }: P) => (
  <svg {...svg(size, p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5v5.5M12 16.2v.3" />
  </svg>
);
export const PauseIcon = ({ size = 16, ...p }: P) => (
  <svg {...svg(size, p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M10 9v6M14 9v6" />
  </svg>
);
export const CheckCircle = ({ size = 16, ...p }: P) => (
  <svg {...svg(size, p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="m8.5 12.2 2.4 2.4 4.6-4.9" />
  </svg>
);
export const ChevronLeft = ({ size = 18, ...p }: P) => (
  <svg {...svg(size, p)}>
    <path d="m14.5 6-6 6 6 6" />
  </svg>
);
export const ChevronRight = ({ size = 18, ...p }: P) => (
  <svg {...svg(size, p)}>
    <path d="m9.5 6 6 6-6 6" />
  </svg>
);
export const DotsIcon = ({ size = 18, ...p }: P) => (
  <svg {...svg(size, p)}>
    <path d="M6 12h.01M12 12h.01M18 12h.01" strokeWidth={3} />
  </svg>
);
export const GlobeIcon = ({ size = 16, ...p }: P) => (
  <svg {...svg(size, p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5c2.4 2.6 3.5 5.4 3.5 8.5s-1.1 5.9-3.5 8.5c-2.4-2.6-3.5-5.4-3.5-8.5s1.1-5.9 3.5-8.5z" />
  </svg>
);
export const NoteIcon = ({ size = 16, ...p }: P) => (
  <svg {...svg(size, p)}>
    <path d="M5 4.5h10l4 4V19.5H5z" />
    <path d="M8.5 11h7M8.5 14.5h7M8.5 8h3" />
  </svg>
);
