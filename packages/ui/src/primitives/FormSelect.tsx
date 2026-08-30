"use client";

import React from "react";
import { FORM_CONTROL_CLASSES, FORM_LABEL_CLASSES } from "../forms/FormField";

export interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  /** Texto de ayuda bajo el campo. */
  hint?: string;
  /** Clases del contenedor (ej. `md:col-span-2` dentro de una grilla). */
  wrapperClassName?: string;
}

/**
 * Campo de formulario (label + select) con el estilo oficial del panel,
 * hermano de `FormField` y con el mismo par label/control que él: contenedor
 * propio (antes era un Fragment, que en una grilla partía label y select en
 * celdas distintas) y `htmlFor`/`id` asociados.
 */
export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  className,
  children,
  hint,
  wrapperClassName = "",
  id,
  ...rest
}) => {
  const generatedId = React.useId();
  const fieldId = id ?? generatedId;
  const hintId = `${fieldId}-hint`;

  const selectClassName = className ? `${FORM_CONTROL_CLASSES} ${className}` : FORM_CONTROL_CLASSES;

  return (
    <div className={`space-y-2 ${wrapperClassName}`}>
      <label htmlFor={fieldId} className={FORM_LABEL_CLASSES}>
        {label}
        {rest.required && (
          <span aria-hidden="true" className="ml-1 text-brand-accent">
            *
          </span>
        )}
      </label>

      <select
        id={fieldId}
        aria-describedby={hint ? hintId : undefined}
        className={selectClassName}
        {...rest}
      >
        {children}
      </select>

      {hint && (
        <p id={hintId} className="font-inter text-[12px] leading-[1.45] text-admin-footnote">
          {hint}
        </p>
      )}
    </div>
  );
};
