"use client";

import { SiteHeader } from "@vc/ui";
import { useHeaderNav } from "../hooks/useHeaderNav";
import { SiteSettingsDTO } from "@vc/api-client";

export interface HeaderWrapperProps {
  settings: SiteSettingsDTO;
}

export function HeaderWrapper({ settings }: HeaderWrapperProps) {
  const { currentPath, navItems } = useHeaderNav();

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
