import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@vc/ui", "@vc/config", "@vc/api-client", "@vc/next-proxy"],
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "storage.googleapis.com" },
    ],
  },
};

export default nextConfig;
