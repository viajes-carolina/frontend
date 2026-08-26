"use client";

import React from "react";

const LABEL_CLASSES = "block text-xs font-bold text-neutral-muted uppercase tracking-wider mb-2";
const FIELD_CLASSES =
  "w-full px-4 py-2.5 bg-neutral-soft border border-neutral-border rounded-xl text-sm text-neutral-ink focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent";

interface FormFieldSingleLineProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  multiline?: false;
}

interface FormFieldMultilineProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  multiline: true;
}

export type FormFieldProps = FormFieldSingleLineProps | FormFieldMultilineProps;

/**
 * Campo de formulario (label + input/textarea) con el estilo oficial de admin
 * (fondo neutral-soft, borde neutral-border, label uppercase neutral-muted).
 * Reproduce exactamente el bloque duplicado en los formularios de `apps/admin`.
 *
 * Usa `multiline` para renderizar un `<textarea>` en vez de un `<input>`.
 */
export const FormField: React.FC<FormFieldProps> = (props) => {
  const { label, multiline, className, ...rest } = props;
  const fieldClassName = className ? `${FIELD_CLASSES} ${className}` : FIELD_CLASSES;

  return (
    <>
      <label className={LABEL_CLASSES}>{label}</label>
      {multiline ? (
        <textarea
          className={fieldClassName}
          {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input className={fieldClassName} {...(rest as React.InputHTMLAttributes<HTMLInputElement>)} />
      )}
    </>
  );
};
