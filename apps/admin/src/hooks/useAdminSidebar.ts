"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const DESKTOP_QUERY = "(min-width: 1024px)";

export interface AdminSidebarState {
  /** `true` solo cuando el drawer mobile está desplegado sobre el contenido. */
  open: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
}

/**
 * Estado del drawer de navegación del panel.
 *
 * Concentra aquí las cuatro reglas de cierre para que `AdminShell` quede como
 * plantilla: el drawer se cierra al navegar (antes quedaba tapando la pantalla
 * tras elegir una opción del menú), con `Escape`, al pasar a desktop, y bloquea
 * el scroll del fondo mientras cubre la pantalla.
 */
export function useAdminSidebar(): AdminSidebarState {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const openSidebar = useCallback(() => setOpen(true), []);
  const closeSidebar = useCallback(() => setOpen(false), []);

  // Red de seguridad para las navegaciones que no nacen de un click en el menú
  // (redirección del guard de sesión, botón atrás del navegador, etc.). Los
  // enlaces del menú además cierran de forma explícita, porque volver a la
  // misma ruta no cambia `pathname` y no dispararía este efecto.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Desde `lg:` el sidebar es una columna fija y el overlay desaparece: si la
  // ventana crece con el drawer abierto hay que soltar el estado, o quedaría
  // el scroll bloqueado sin nada visible que lo explique.
  useEffect(() => {
    if (!open || typeof window.matchMedia !== "function") return;

    const media = window.matchMedia(DESKTOP_QUERY);
    if (media.matches) {
      setOpen(false);
      return;
    }

    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return { open, openSidebar, closeSidebar };
}
