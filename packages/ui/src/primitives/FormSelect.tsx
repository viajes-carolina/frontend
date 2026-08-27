"use client";

import React from "react";

const LABEL_CLASSES = "block text-xs font-bold text-neutral-muted uppercase tracking-wider mb-2";
const SELECT_CLASSES =
  "w-full px-4 py-2.5 bg-white border border-neutral-border rounded-xl text-sm text-neutral-ink focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent";

export interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

/**
 * Campo de formulario (label + select) con el estilo oficial de admin,
 * hermano de `FormField` pero para `<select>`. Reproduce exactamente el
 * bloque duplicado en los formularios de `apps/admin`.
 */
export const FormSelect: React.FC<FormSelectProps> = ({ label, className, children, ...rest }) => {
  const selectClassName = className ? `${SELECT_CLASSES} ${className}` : SELECT_CLASSES;

  return (
    <>
      <label className={LABEL_CLASSES}>{label}</label>
      <select className={selectClassName} {...rest}>
        {children}
      </select>
    </>
  );
};
