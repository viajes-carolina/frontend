"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Footer } from "@vc/ui";
import { SiteSettingsDTO, OfficeLocationDTO } from "@vc/api-client";

export interface FooterWrapperProps {
  settings: SiteSettingsDTO;
  office: OfficeLocationDTO;
}

export function FooterWrapper({ settings: initialSettings, office: initialOffice }: FooterWrapperProps) {
  const pathname = usePathname();
  const [settings, setSettings] = useState<SiteSettingsDTO>(initialSettings);
  const [office, setOffice] = useState<OfficeLocationDTO>(initialOffice);

  useEffect(() => {
    // Check localStorage on mount
    const storedSettings = localStorage.getItem("vc_site_settings");
    if (storedSettings) {
      try {
        setSettings(JSON.parse(storedSettings));
      } catch {
        // ignore
      }
    }

    const storedOffice = localStorage.getItem("vc_office_location");
    if (storedOffice) {
      try {
        setOffice(JSON.parse(storedOffice));
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
      if (e.key === "vc_office_location" && e.newValue) {
        try {
          setOffice(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Mismo layout minimalista que HeaderWrapper para el asistente del Libro de
  // Reclamaciones — ver ClaimWizardShell.
  if ((pathname || "/").startsWith("/reclamaciones/registrar")) {
    return null;
  }

  return (
    <Footer
      siteName={settings.siteName}
      contactEmail={settings.contactEmail}
      address={office.addressLine}
      district={office.district}
      city={office.city}
      scheduleWeekdays={office.scheduleWeekdays}
      scheduleSaturdays={office.scheduleSaturdays}
      facebookUrl={settings.facebookUrl}
      instagramUrl={settings.instagramUrl}
      tiktokUrl={settings.tiktokUrl}
      legalCompanyName={settings.legalCompanyName}
      taxId={settings.taxId}
      whatsappDisplayNumber={settings.whatsappDisplayNumber}
      minceturCertificateUrl={settings.minceturCertificateUrl}
    />
  );
}
