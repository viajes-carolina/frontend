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
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Trampa de foco: guarda quién abrió el menú, mueve el foco al drawer,
  // cicla Tab/Shift+Tab dentro de sus límites y devuelve el foco al cerrar.
  useEffect(() => {
    if (!isOpen) return;

    triggerRef.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !drawerRef.current) return;

      const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])"
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
      triggerRef.current?.focus();
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-end bg-brand-navy/40 backdrop-blur-sm transition-opacity duration-[320ms] ${
        isOpen ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      inert={!isOpen}
    >
      <div
        ref={drawerRef}
        className={`w-full max-w-xs bg-surface-ivory h-full p-6 flex flex-col justify-between shadow-floating border-l border-neutral-border transition-transform duration-[320ms] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar with close button */}
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-neutral-border">
            <span className="font-sora font-bold text-lg text-brand-navy">Menú</span>
            <button
              ref={closeButtonRef}
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
