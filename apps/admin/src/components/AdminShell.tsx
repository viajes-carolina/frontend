"use client";

import { usePathname } from "next/navigation";
import { BrandLogo } from "@vc/ui";
import { AdminNav } from "./AdminNav";
import { useAdminSessionGuard } from "../hooks/useAdminSessionGuard";

// El login no debe verse dentro del "shell" del panel — sin sidebar, sin
// nav — es la única ruta pública de apps/admin, antes de que exista sesión.
const ROUTES_WITHOUT_SHELL = ["/login"];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  useAdminSessionGuard();

  if (ROUTES_WITHOUT_SHELL.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    return <>{children}</>;
  }

  return (
    <div className="antialiased font-sans bg-neutral-soft text-neutral-ink flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-navy text-white flex flex-col justify-between shrink-0 p-6 border-r border-white/10">
        <div>
          {/* Brand Logo Oficial */}
          <div className="flex flex-col gap-2 pb-6 border-b border-white/10">
            <BrandLogo variant="light" className="h-7 w-auto" />
            <span className="font-inter text-[10px] text-atmosphere-pale-sky uppercase tracking-wider font-semibold">
              Panel Administrativo
            </span>
          </div>

          {/* Menu */}
          <AdminNav />
        </div>

        <div className="text-xs text-white/50 border-t border-white/10 pt-4">
          <span>Versión 1.0.0 · Quarkus & Next.js</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
