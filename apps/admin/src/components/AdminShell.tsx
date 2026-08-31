"use client";

import { usePathname } from "next/navigation";
import { BrandLogo, CloseIcon, MenuIcon } from "@vc/ui";
import { AdminNav } from "./AdminNav";
import { AdminSidebarProfile } from "./AdminSidebarProfile";
import { useAdminSessionGuard } from "../hooks/useAdminSessionGuard";
import { useAdminSidebar } from "../hooks/useAdminSidebar";

// El login no debe verse dentro del "shell" del panel — sin sidebar, sin
// nav — es la única ruta pública de apps/admin, antes de que exista sesión.
const ROUTES_WITHOUT_SHELL = ["/login"];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  useAdminSessionGuard();
  const { open, openSidebar, closeSidebar } = useAdminSidebar();

  if (ROUTES_WITHOUT_SHELL.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-neutral-soft font-inter text-neutral-ink antialiased">
      {/* Overlay del drawer en mobile/tablet */}
      {open && (
        <button
          type="button"
          aria-label="Cerrar menú de navegación"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-brand-navy/50 lg:hidden"
        />
      )}

      {/* Sidebar — 248px según el diseño (Figma 930:3), con 8px de respiro
          lateral: sobre ese origen el punto de estado de cada fila cae en
          x=16px y su etiqueta en x=32px, que es la retícula del diseño.

          En escritorio el `aside` era `static` y crecía hasta la altura de su
          contenido (1238px con una sección desplegada), así que su
          `overflow-y-auto` no llegaba a activarse nunca y el pie quedaba fuera
          de pantalla: al bloque de perfil y a "Cerrar sesión" solo se llegaba
          desplazando el documento entero. Con `sticky` + `max-h-screen` la
          columna se limita al alto de la ventana y desplaza su propio
          contenido, que es lo que el `overflow-y-auto` ya suponía. */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[248px] shrink-0 flex-col justify-between overflow-y-auto border-r border-white/[0.08] bg-brand-navy px-2 py-6 text-white transition-transform duration-200 ease-out lg:sticky lg:top-0 lg:max-h-screen lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Marca — mismo bloque de identidad que el panel navy del login */}
          <div className="flex items-start justify-between gap-2 border-b border-white/[0.08] px-2 pb-6">
            <div className="flex flex-col gap-2.5">
              <BrandLogo variant="light" className="h-7 w-auto" />
              <div className="h-[3px] w-[36px] rounded-[2px] bg-brand-accent" />
              <span className="font-inter text-[10px] font-semibold uppercase tracking-[1.2px] text-admin-on-navy">
                Panel Administrativo
              </span>
            </div>
            <button
              type="button"
              aria-label="Cerrar menú de navegación"
              onClick={closeSidebar}
              className="-mr-1 -mt-1 rounded-[8px] p-1 text-admin-on-navy transition-colors hover:bg-white/[0.07] hover:text-white lg:hidden"
            >
              <CloseIcon size={20} />
            </button>
          </div>

          <AdminNav onNavigate={closeSidebar} />
        </div>

        <div className="mt-8 border-t border-white/[0.08] pt-4">
          <AdminSidebarProfile />
          <p className="mt-3 px-2 font-inter text-[10px] leading-[1.4] text-admin-on-navy/60">
            Viajes Carolina · Panel administrativo v1.0.0
          </p>
        </div>
      </aside>

      {/* Área de contenido */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header mobile con botón hamburguesa — el sidebar es fijo desde lg: */}
        <header className="flex shrink-0 items-center gap-3 border-b border-neutral-border bg-white px-4 py-3 lg:hidden">
          <button
            type="button"
            aria-label="Abrir menú de navegación"
            aria-expanded={open}
            onClick={openSidebar}
            className="-ml-2 rounded-[8px] p-2 text-brand-navy transition-colors hover:bg-neutral-surface"
          >
            <MenuIcon size={22} />
          </button>
          <BrandLogo variant="dark" className="h-6 w-auto" />
        </header>

        {/* Sin `overflow-y-auto`: el `main` no tiene altura acotada (el shell
            es `min-h-screen`, no `h-screen`), así que crecía con su contenido y
            ese scroll propio no llegaba a activarse nunca — lo que desplaza es
            el documento, como demuestra el `lg:sticky` del sidebar. Pero un
            `overflow` distinto de `visible` SÍ convierte al elemento en
            contenedor de scroll, y `position: sticky` se resuelve contra el
            contenedor de scroll más cercano: cualquier barra pegajosa de una
            pantalla se anclaba al borde inferior del `main` (o sea, al final
            del documento) en vez de al de la ventana. Quitarlo devuelve la
            ventana como contenedor de scroll y no cambia nada más, porque aquí
            no había scroll que quitar. */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
