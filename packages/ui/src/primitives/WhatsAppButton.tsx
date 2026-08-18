"use client";

import React from "react";
import { Button, ButtonSize } from "./Button";
import { WhatsAppIcon } from "../icons/icons";

export interface WhatsAppButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  children?: React.ReactNode;
  phone?: string;
  message?: string;
  className?: string;
}

export function WhatsAppButton({
  size = "md",
  children = "Escríbenos por WhatsApp",
  phone = "+51987654321",
  message = "Hola Viajes Carolina, deseo solicitar información sobre un viaje.",
  className = "",
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
