"use client";

import React from "react";

const LABEL_CLASSES = "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2";
const FIELD_CLASSES =
  "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent";

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
 * (fondo slate-50, borde slate-200, label uppercase slate-700). Reproduce
 * exactamente el bloque duplicado en los formularios de `apps/admin`.
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
