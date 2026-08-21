import React from "react";

/**
 * Manchas cálidas de fondo para secciones editoriales — círculos grandes de
 * baja opacidad, nunca paneles rectangulares. Debe vivir dentro de un
 * ancestro `relative overflow-hidden`.
 */
export function BackgroundShapes() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-40 -top-56 size-[34rem] rounded-full bg-atmosphere-sky/65" />
      <div className="absolute -bottom-64 -left-24 h-[34rem] w-[66rem] rounded-[50%] bg-surface-sand/65" />
      <div className="absolute -right-32 bottom-0 size-[28rem] rounded-full bg-atmosphere-sky/35 blur-[1px]" />
    </div>
  );
}
