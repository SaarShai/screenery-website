import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 90 is used by the festive page's large photos
  images: { qualities: [75, 90] },
};

export default nextConfig;
