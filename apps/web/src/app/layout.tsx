import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import { apiClient } from "@vc/api-client";
import { HeaderWrapper } from "../components/HeaderWrapper";
import { FooterWrapper } from "../components/FooterWrapper";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Viajes Carolina — El viaje comienza aquí",
  description:
    "Agencia de viajes en Perú. Diseñamos experiencias y paquetes turísticos personalizados con atención experta y directa por WhatsApp.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [siteSettings, office] = await Promise.all([
    apiClient.getSiteSettings(),
    apiClient.getOfficeLocation(),
  ]);

  return (
    <html lang="es" className={`${sora.variable} ${inter.variable}`} suppressHydrationWarning>
      <body
        className="antialiased font-sans bg-neutral-soft text-neutral-ink selection:bg-brand-accent selection:text-brand-navy flex flex-col min-h-screen"
        suppressHydrationWarning
      >
        <HeaderWrapper settings={siteSettings} />
        <div className="flex-1">
          {children}
        </div>
        <FooterWrapper settings={siteSettings} office={office} />
      </body>
    </html>
  );
}
