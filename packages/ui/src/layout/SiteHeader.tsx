"use client";

import React, { useState } from "react";
import { BRAND_CONFIG, DEFAULT_WHATSAPP_PHONE } from "@vc/config";
import { BrandLogo } from "../brand/BrandLogo";
import { MenuIcon } from "../icons/icons";
import { WhatsAppButton } from "../primitives/WhatsAppButton";
import { MobileMenu, NavItem } from "./MobileMenu";

export interface SiteHeaderProps {
  siteName?: string;
  brandTagline?: string;
  whatsappPhone?: string;
  whatsappMessage?: string;
  currentPath?: string;
  navItems?: NavItem[];
}

export function SiteHeader({
  siteName = BRAND_CONFIG.name,
  whatsappPhone = DEFAULT_WHATSAPP_PHONE,
  whatsappMessage = "Hola Viajes Carolina, deseo consultar sobre un viaje.",
  currentPath = "/",
  navItems = [
    { label: "Inicio", href: "/" },
    { label: "Promociones", href: "/promociones" },
    { label: "Nosotros", href: "/nosotros" },
    { label: "Blog", href: "/blog" },
    { label: "Contacto", href: "/contacto" },
  ],
}: SiteHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeNavItems = navItems.map((item) => ({
    ...item,
    active: currentPath === item.href,
  }));

  return (
    <header className="sticky top-0 z-40 w-full bg-surface-ivory border-b border-neutral-border">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo Oficial */}
        <a
          href="/"
          className="flex items-center group focus:outline-none focus:ring-2 focus:ring-brand-accent rounded-lg p-1"
          aria-label={`${siteName} - Inicio`}
        >
          <BrandLogo variant="dark" className="h-8 sm:h-9 w-auto group-hover:scale-[1.02] transition-transform duration-200" />
        </a>

        {/* Desktop Navigation — simple, sin cápsula */}
        <nav className="hidden md:flex items-center gap-9">
          {activeNavItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`font-sora text-sm pb-1.5 border-b-2 transition-colors duration-200 ${
                item.active
                  ? "text-brand-navy font-bold border-brand-accent"
                  : "text-neutral-muted font-medium border-transparent hover:text-brand-navy"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* WhatsApp — único CTA del header */}
        <div className="hidden md:flex items-center">
          <WhatsAppButton size="sm" phone={whatsappPhone} message={whatsappMessage}>
            Escríbenos
          </WhatsAppButton>
        </div>

        {/* Mobile: WhatsApp compacto + hamburguesa */}
        <div className="flex md:hidden items-center gap-2">
          <WhatsAppButton
            iconOnly
            phone={whatsappPhone}
            message={whatsappMessage}
          >
            Escríbenos por WhatsApp
          </WhatsAppButton>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2.5 rounded-lg text-brand-navy active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-brand-accent cursor-pointer"
            aria-label="Abrir menú de navegación"
          >
            <MenuIcon size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        items={activeNavItems}
        whatsappPhone={whatsappPhone}
        whatsappMessage={whatsappMessage}
      />
    </header>
  );
}
