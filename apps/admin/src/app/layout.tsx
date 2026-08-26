import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import { AdminShell } from "../components/AdminShell";
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
  title: "Panel de Administración — Viajes Carolina",
  description: "Gestión centralizada de contenidos y publicaciones.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${sora.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="antialiased min-h-screen" suppressHydrationWarning>
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
