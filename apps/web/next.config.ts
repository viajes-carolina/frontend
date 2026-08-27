import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@vc/ui", "@vc/config", "@vc/api-client", "@vc/next-proxy"],
  images: {
    formats: ["image/avif", "image/webp"],
    // Algunos MediaAsset (datos semilla/demo) no tienen un archivo real y el
    // route de medios cae a un SVG placeholder generado en runtime, servido
    // bajo una URL que termina en .webp — next/image lo rechaza (400) salvo
    // que se habilite SVG explícitamente. Patrón oficial recomendado por
    // Next.js para permitir SVG sin exponerse a XSS: CSP que bloquea scripts
    // y sandbox del documento SVG.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
    ],
  },
};

export default nextConfig;
