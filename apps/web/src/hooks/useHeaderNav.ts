"use client";

import { usePathname } from "next/navigation";

export function useHeaderNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Inicio", href: "/" },
    { label: "Promociones", href: "/promociones" },
    { label: "Nosotros", href: "/nosotros" },
    { label: "Blog", href: "/blog" },
    { label: "Contacto", href: "/contacto" },
  ];

  return {
    currentPath: pathname || "/",
    navItems,
  };
}
