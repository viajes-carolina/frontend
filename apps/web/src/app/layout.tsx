import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${sora.variable} ${inter.variable}`}>
      <body className="antialiased font-sans bg-atmosphere-twilight text-white selection:bg-brand-accent selection:text-brand-navy">
        {children}
      </body>
    </html>
  );
}
