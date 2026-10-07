import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75],
    // Mayfair's photos top out around 1,150px, so widths past 1920 only lengthen every srcset.
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920],
    imageSizes: [128, 256, 384],
  },
  poweredByHeader: false,
  async headers() {
    return [
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
