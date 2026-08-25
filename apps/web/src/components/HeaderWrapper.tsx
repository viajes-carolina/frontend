"use client";

import { useState, useEffect } from "react";
import { SiteHeader } from "@vc/ui";
import { useHeaderNav } from "../hooks/useHeaderNav";
import { SiteSettingsDTO } from "@vc/api-client";

export interface HeaderWrapperProps {
  settings: SiteSettingsDTO;
}

export function HeaderWrapper({ settings: initialSettings }: HeaderWrapperProps) {
  const [settings, setSettings] = useState<SiteSettingsDTO>(initialSettings);
  const { currentPath, navItems } = useHeaderNav();

  useEffect(() => {
    // Check localStorage on mount
    const stored = localStorage.getItem("vc_site_settings");
    if (stored) {
      try {
        setSettings(JSON.parse(stored));
      } catch {
        // ignore
      }
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "vc_site_settings" && e.newValue) {
        try {
          setSettings(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // El asistente del Libro de Reclamaciones usa su propio header minimalista
  // (ver ClaimWizardShell) — el Figma muestra un layout distinto al resto del
  // sitio público, sin la nav completa.
  if (currentPath.startsWith("/reclamaciones/registrar")) {
    return null;
  }

  return (
    <SiteHeader
      siteName={settings.siteName}
      brandTagline={settings.brandTagline}
      whatsappPhone={settings.whatsappPhone}
      whatsappMessage={settings.whatsappDefaultMessage}
      currentPath={currentPath}
      navItems={navItems}
    />
  );
}

