import type { ReactNode } from "react";

export interface EditorSectionProps {
  title: string;
  /** Frase corta bajo el título que explica qué se edita aquí. */
  help: string;
  /** Separador superior. La primera sección de una tarjeta no lo lleva. */
  divider?: boolean;
  children: ReactNode;
}

/**
 * Bloque de un editor de contenidos (Figma 930:4): título de 14px, ayuda de
 * 10px y, debajo, los campos. Las secciones se separan entre sí con una línea
 * `neutral-border` que aporta la propia sección cuando `divider` está activo.
 */
export function EditorSection({ title, help, divider = false, children }: EditorSectionProps) {
  return (
    <section className={divider ? "mt-5 border-t border-neutral-border pt-5" : ""}>
      <h2 className="font-inter text-[14px] font-semibold leading-[1.3] text-neutral-ink">{title}</h2>
      <p className="mt-1 font-inter text-[10px] leading-[1.5] text-neutral-muted">{help}</p>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}
