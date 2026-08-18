"use client";

import React, { useState } from "react";
import { PlaneIcon, MenuIcon } from "../icons/icons";
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
  siteName = "Viajes Carolina",
  whatsappPhone = "+51987654321",
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
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-atmosphere-twilight/85 border-b border-white/10 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="/"
          className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-brand-accent rounded-lg p-1"
          aria-label={`${siteName} - Inicio`}
        >
          <div className="w-10 h-10 rounded-xl bg-brand-accent flex items-center justify-center text-brand-navy shadow-sm group-hover:scale-105 transition-transform duration-200">
            <PlaneIcon size={22} />
          </div>
          <div className="flex flex-col">
            <span className="font-sora font-extrabold text-xl tracking-tight text-white group-hover:text-brand-accent transition-colors">
              {siteName}
            </span>
            <span className="font-inter text-[11px] text-atmosphere-sky tracking-wider uppercase font-medium">
              Agencia de Viajes
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full shadow-inner">
          {activeNavItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-full font-sora text-sm transition-all duration-200 ${
                item.active
                  ? "bg-brand-accent text-brand-navy font-bold shadow-sm"
                  : "text-white/80 hover:text-white hover:bg-white/10 font-medium"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop WhatsApp Action */}
        <div className="hidden lg:flex items-center">
          <WhatsAppButton
            size="md"
            phone={whatsappPhone}
            message={whatsappMessage}
          >
            WhatsApp
          </WhatsAppButton>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2.5 rounded-xl bg-white/10 text-white hover:bg-white/15 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-brand-accent cursor-pointer"
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
