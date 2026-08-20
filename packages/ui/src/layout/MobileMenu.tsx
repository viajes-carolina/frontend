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
      className="fixed inset-0 z-50 flex justify-end bg-brand-navy/40 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={drawerRef}
        className="w-full max-w-xs bg-surface-ivory h-full p-6 flex flex-col justify-between shadow-floating border-l border-neutral-border transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar with close button */}
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-neutral-border">
            <span className="font-sora font-bold text-lg text-brand-navy">Menú</span>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-brand-navy hover:bg-brand-navy/5 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent cursor-pointer"
              aria-label="Cerrar menú"
            >
              <CloseIcon size={22} />
            </button>
          </div>

          {/* Navigation links — enlaces grandes, activo navy + subrayado naranja */}
          <nav className="mt-6 flex flex-col gap-1">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`px-1 py-4 font-sora text-lg w-fit border-b-2 transition-colors ${
                  item.active
                    ? "text-brand-navy font-bold border-brand-accent"
                    : "text-neutral-muted font-medium border-transparent hover:text-brand-navy"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {/* WhatsApp CTA — único CTA del drawer */}
        <div className="pt-6 border-t border-neutral-border">
          <WhatsAppButton
            size="md"
            phone={whatsappPhone}
            message={whatsappMessage}
            className="w-full"
          >
            Escríbenos por WhatsApp
          </WhatsAppButton>
        </div>
      </div>
    </div>
  );
}
