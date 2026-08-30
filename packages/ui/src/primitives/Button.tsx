"use client";

import React from "react";

export type ButtonVariant = "primary" | "secondary" | "whatsapp" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  icon,
  iconPosition = "right",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-sora font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const sizeStyles = {
    sm: "text-xs px-3.5 py-2 rounded-lg gap-1.5",
    md: "text-sm px-5 py-2.5 rounded-xl gap-2",
    lg: "text-base px-7 py-3.5 rounded-xl gap-2.5",
  }[size];

  const variantStyles = {
    primary:
      "bg-brand-accent text-on-accent hover:bg-brand-sunset active:scale-[0.98] shadow-sm focus:ring-brand-accent",
    secondary:
      "bg-white text-brand-navy hover:bg-neutral-soft active:scale-[0.98] shadow-sm focus:ring-brand-blue",
    whatsapp:
      "bg-brand-whatsapp text-brand-navy hover:brightness-105 active:scale-[0.98] shadow-sm focus:ring-brand-whatsapp",
    outline:
      "border-2 border-brand-navy/20 text-brand-navy hover:border-brand-navy hover:bg-brand-navy/5 active:scale-[0.98] focus:ring-brand-navy",
    ghost:
      "text-brand-navy hover:bg-brand-navy/5 active:scale-[0.98] focus:ring-brand-navy",
    danger:
      "bg-danger-surface text-danger-ink border border-danger-border hover:brightness-[0.97] active:scale-[0.98] focus:ring-danger-ink",
  }[variant];

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === "left" && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === "right" && <span className="inline-flex shrink-0">{icon}</span>}
    </button>
  );
}
