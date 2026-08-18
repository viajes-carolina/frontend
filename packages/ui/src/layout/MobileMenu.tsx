"use client";

import React, { useEffect, useRef } from "react";
import { CloseIcon } from "../icons/icons";
import { WhatsAppButton } from "../primitives/WhatsAppButton";

export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: NavItem[];
  whatsappPhone?: string;
  whatsappMessage?: string;
}

export function MobileMenu({
  isOpen,
  onClose,
  items,
  whatsappPhone,
  whatsappMessage,
}: MobileMenuProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Focus trap and Escape key listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-brand-navy/60 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={drawerRef}
        className="w-full max-w-xs bg-brand-navy h-full p-6 flex flex-col justify-between shadow-2xl border-l border-white/10 transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar with close button */}
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <span className="font-sora font-bold text-lg text-white">Menú</span>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent cursor-pointer"
              aria-label="Cerrar menú"
            >
              <CloseIcon size={22} />
            </button>
          </div>

          {/* Navigation links */}
          <nav className="mt-6 flex flex-col gap-2">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`px-4 py-3 rounded-xl font-sora font-medium text-base transition-colors ${
                  item.active
                    ? "bg-brand-accent/15 text-brand-accent font-semibold"
                    : "text-white/90 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {/* WhatsApp CTA in mobile drawer */}
        <div className="pt-6 border-t border-white/10">
          <WhatsAppButton
            size="md"
            phone={whatsappPhone}
            message={whatsappMessage}
            className="w-full"
          >
            WhatsApp Directo
          </WhatsAppButton>
        </div>
      </div>
    </div>
  );
}
