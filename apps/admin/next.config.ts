import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@vc/ui", "@vc/config", "@vc/api-client"],
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: "http://localhost:8080/api/:path*",
      },
    ];
  },
};

export default nextConfig;
