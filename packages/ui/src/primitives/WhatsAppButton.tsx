"use client";

import React from "react";
import { DEFAULT_WHATSAPP_PHONE } from "@vc/config";
import { Button, ButtonSize } from "./Button";
import { WhatsAppIcon } from "../icons/icons";

export interface WhatsAppButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  children?: React.ReactNode;
  phone?: string;
  message?: string;
  className?: string;
  /**
   * "solid" (default) — el CTA verde lleno, reservado para header/hero/cierre.
   * "link" — mismo comportamiento de clic (wa.me, mensaje predefinido, apertura segura),
   * pero se presenta como enlace de texto navy — para acciones secundarias repetidas
   * (tarjetas de promoción, testimonio, asesora) que no deben competir visualmente con
   * el CTA principal de la página.
   */
  variant?: "solid" | "link";
  /**
   * Burbuja circular de 44x44 con solo el ícono — para el WhatsApp compacto
   * de la barra móvil del header. `children` se usa como aria-label.
   */
  iconOnly?: boolean;
}

export function WhatsAppButton({
  size = "md",
  children = "Escríbenos por WhatsApp",
  phone = DEFAULT_WHATSAPP_PHONE,
  message = "Hola Viajes Carolina, deseo solicitar información sobre un viaje.",
  className = "",
  variant = "solid",
  iconOnly = false,
  onClick,
  ...props
}: WhatsAppButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
    }
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (iconOnly) {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={typeof children === "string" ? children : "Escríbenos por WhatsApp"}
        className={`inline-flex items-center justify-center w-11 h-11 rounded-full bg-brand-whatsapp text-brand-navy hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-whatsapp focus:ring-offset-2 ${className}`}
        {...props}
      >
        <WhatsAppIcon size={20} />
      </button>
    );
  }

  if (variant === "link") {
    const linkTextSize = size === "lg" ? "text-base" : size === "sm" ? "text-xs" : "text-sm";
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center gap-1.5 font-sora font-semibold text-brand-navy hover:text-brand-accent transition-colors cursor-pointer ${linkTextSize} ${className}`}
        {...props}
      >
        <WhatsAppIcon size={size === "lg" ? 18 : 15} />
        <span className="underline decoration-brand-navy/30 underline-offset-2 hover:decoration-brand-accent">{children}</span>
      </button>
    );
  }

  return (
    <Button
      variant="whatsapp"
      size={size}
      icon={<WhatsAppIcon size={size === "lg" ? 22 : 18} />}
      iconPosition="left"
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </Button>
  );
}
