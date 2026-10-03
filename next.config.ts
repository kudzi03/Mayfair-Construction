import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75],
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        // Hero sequence frames: not content-hashed, so cache for a day and revalidate.
        source: "/sequence/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
      {
        // Internal CRM: never indexed, whatever robots.txt says or whoever links to it.
        source: "/crm/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
      },
      {
        source: "/crm",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
      },
    ];
  },
};

export default nextConfig;
