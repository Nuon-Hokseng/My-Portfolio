import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first (smallest), WebP as the fallback
    formats: ["image/avif", "image/webp"],
    // optimized copies stay cached for 30 days instead of the 4-hour default
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    return [
      {
        // static files in /public (photos, icons) are otherwise revalidated on every visit
        source: "/:path*.(jpg|jpeg|png|webp|avif|svg)",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }],
      },
    ];
  },
};

export default nextConfig;
