import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@vc/ui", "@vc/config", "@vc/api-client"],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
