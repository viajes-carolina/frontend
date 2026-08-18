"use client";

import { useState, useEffect } from "react";
import { SiteHeader, GlobalSearchModal } from "@vc/ui";
import { useHeaderNav } from "../hooks/useHeaderNav";
import { useGlobalSearch } from "../hooks/useGlobalSearch";
import { SiteSettingsDTO } from "@vc/api-client";

export interface HeaderWrapperProps {
  settings: SiteSettingsDTO;
}

export function HeaderWrapper({ settings: initialSettings }: HeaderWrapperProps) {
  const [settings, setSettings] = useState<SiteSettingsDTO>(initialSettings);
  const { currentPath, navItems } = useHeaderNav();
  const {
    query,
    setQuery,
    activeType,
    setActiveType,
    results,
    suggestedQueries,
    isLoading,
    isModalOpen,
    openModal,
    closeModal,
  } = useGlobalSearch();

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

  return (
    <>
      <SiteHeader
        siteName={settings.siteName}
        brandTagline={settings.brandTagline}
        whatsappPhone={settings.whatsappPhone}
        whatsappMessage={settings.whatsappDefaultMessage}
        currentPath={currentPath}
        navItems={navItems}
        onOpenSearch={openModal}
      />
      <GlobalSearchModal
        isOpen={isModalOpen}
        onClose={closeModal}
        query={query}
        onQueryChange={setQuery}
        activeType={activeType}
        onTypeChange={setActiveType}
        results={results}
        suggestedQueries={suggestedQueries}
        isLoading={isLoading}
      />
    </>
  );
}

