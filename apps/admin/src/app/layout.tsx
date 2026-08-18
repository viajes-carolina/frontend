import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import Link from "next/link";
import { PlaneIcon, BrandLogo } from "@vc/ui";
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
      <body
        className="antialiased font-sans bg-neutral-soft text-neutral-ink flex min-h-screen"
        suppressHydrationWarning
      >
        {/* Sidebar */}
        <aside className="w-64 bg-brand-navy text-white flex flex-col justify-between shrink-0 p-6 border-r border-white/10">
          <div>
            {/* Brand Logo Oficial */}
            <div className="flex flex-col gap-2 pb-6 border-b border-white/10">
              <BrandLogo variant="light" className="h-7 w-auto" />
              <span className="font-inter text-[10px] text-atmosphere-sky uppercase tracking-wider font-semibold">
                Panel Administrativo
              </span>
            </div>

            {/* Menu */}
            <nav className="mt-6 flex flex-col gap-1">
              <Link
                href="/"
                className="px-3.5 py-2.5 rounded-xl font-sora text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/inicio"
                className="px-3.5 py-2.5 rounded-xl font-sora text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                Inicio & Hero
              </Link>
              <Link
                href="/promociones"
                className="px-3.5 py-2.5 rounded-xl font-sora text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                Promociones & Paquetes
              </Link>
              <Link
                href="/intenciones"
                className="px-3.5 py-2.5 rounded-xl font-sora text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                Intenciones de Viaje
              </Link>
              <Link
                href="/confianza"
                className="px-3.5 py-2.5 rounded-xl font-sora text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                Confianza, Testimonios & FAQ
              </Link>
              <Link
                href="/nosotros"
                className="px-3.5 py-2.5 rounded-xl font-sora text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                Nosotros & Asesoras
              </Link>
              <Link
                href="/contacto"
                className="px-3.5 py-2.5 rounded-xl font-sora text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-between"
              >
                <span>Contacto & Leads</span>
              </Link>
              <Link
                href="/blog"
                className="px-3.5 py-2.5 rounded-xl font-sora text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-between"
              >
                <span>Blog & Contenidos</span>
                <span className="text-[10px] bg-brand-accent text-brand-navy font-bold px-1.5 py-0.5 rounded">CMS</span>
              </Link>
              <Link
                href="/reclamaciones"
                className="px-3.5 py-2.5 rounded-xl font-sora text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-between"
              >
                <span>Reclamaciones</span>
                <span className="text-[10px] bg-amber-400 text-slate-900 font-bold px-1.5 py-0.5 rounded">Libro</span>
              </Link>
              <Link
                href="/usuarios"
                className="px-3.5 py-2.5 rounded-xl font-sora text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-between"
              >
                <span>Usuarios & Roles</span>
                <span className="text-[10px] bg-purple-400 text-slate-950 font-bold px-1.5 py-0.5 rounded">RBAC</span>
              </Link>
              <Link
                href="/auditoria"
                className="px-3.5 py-2.5 rounded-xl font-sora text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                Bitácora de Auditoría
              </Link>
              <Link
                href="/publicacion"
                className="px-3.5 py-2.5 rounded-xl font-sora text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-between"
              >
                <span>Publicación ISR</span>
                <span className="text-[10px] bg-emerald-400 text-slate-950 font-bold px-1.5 py-0.5 rounded">Caché</span>
              </Link>
              <Link
                href="/medios"
                className="px-3.5 py-2.5 rounded-xl font-sora text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                Biblioteca de Medios
              </Link>
              <Link
                href="/identidad"
                className="px-3.5 py-2.5 rounded-xl font-sora text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                Identidad & WhatsApp
              </Link>
              <Link
                href="/oficina"
                className="px-3.5 py-2.5 rounded-xl font-sora text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                Oficina & Horarios
              </Link>
            </nav>
          </div>

          <div className="text-xs text-white/50 border-t border-white/10 pt-4">
            <span>Versión 1.0.0 · Quarkus & Next.js</span>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
