"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { BrandLogo, CloseIcon, MenuIcon } from "@vc/ui";
import { AdminNav } from "./AdminNav";
import { useAdminSessionGuard } from "../hooks/useAdminSessionGuard";

// El login no debe verse dentro del "shell" del panel — sin sidebar, sin
// nav — es la única ruta pública de apps/admin, antes de que exista sesión.
const ROUTES_WITHOUT_SHELL = ["/login"];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  useAdminSessionGuard();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (ROUTES_WITHOUT_SHELL.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    return <>{children}</>;
  }

  return (
    <div className="antialiased font-sans bg-neutral-soft text-neutral-ink flex min-h-screen">
      {/* Overlay del drawer en mobile/tablet */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Cerrar menú de navegación"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-brand-navy text-white flex flex-col justify-between shrink-0 p-6 border-r border-white/10 overflow-y-auto transition-transform duration-200 ease-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Brand Logo Oficial */}
          <div className="flex items-start justify-between gap-2 pb-6 border-b border-white/10">
            <div className="flex flex-col gap-2">
              <BrandLogo variant="light" className="h-7 w-auto" />
              <span className="font-inter text-[10px] text-atmosphere-pale-sky uppercase tracking-wider font-semibold">
                Panel Administrativo
              </span>
            </div>
            <button
              type="button"
              aria-label="Cerrar menú de navegación"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/70 hover:text-white p-1 -mt-1 -mr-1"
            >
              <CloseIcon size={20} />
            </button>
          </div>

          {/* Menu */}
          <AdminNav />
        </div>

        <div className="text-xs text-white/50 border-t border-white/10 pt-4">
          <span>Versión 1.0.0 · Quarkus & Next.js</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header mobile con botón hamburguesa — el sidebar es fijo desde lg: */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-neutral-border shrink-0">
          <button
            type="button"
            aria-label="Abrir menú de navegación"
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 rounded-lg text-brand-navy hover:bg-neutral-soft"
          >
            <MenuIcon size={22} />
          </button>
          <BrandLogo variant="dark" className="h-6 w-auto" />
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
