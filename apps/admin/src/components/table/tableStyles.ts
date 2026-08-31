/* ==========================================================================
   Geometría compartida del kit de tabla — guía de estilo, "Tablas y filtros".

   Vive en un `.ts` y no repartida por los `.tsx` porque las mismas medidas se
   repiten en tres piezas distintas y porque así la plantilla queda leyéndose
   como plantilla.

   ── Por qué estos botones no son `Button` de `@vc/ui` ────────────────────
   `Button` implementa la caja que la guía describe en su sección 01: alto
   44px, padding 16/12, texto de 12px. Es la caja de "Guardar y publicar".
   La sección "Tablas y filtros" describe OTRAS tres cajas, más pequeñas, para
   controles que acompañan a los datos:

     filtro            padding 12/11, texto 11px medium
     acción masiva     padding 11/8,  texto 10px semibold, radio 6
     página            padding 11/8,  texto 10px semibold, radio 6

   Ninguna coincide con `sm` (`px-3.5 py-2`, texto 12px, radio 7) ni con `md`.
   Forzarlas dentro de `Button` con `className` sería pelearse con el orden en
   que Tailwind emite utilidades de la misma propiedad — el mismo problema que
   ya documenta `FormField` con los bordes. Así que son botones del kit, y solo
   del kit: fuera de estos archivos no se usan.

   El botón "crear" de la barra de herramientas SÍ es `Button variant="primary"`,
   porque su caja es la de la sección 01.
   ========================================================================== */

/** "Todos los controles interactivos deben mostrar un borde azul claramente
 *  visible al recibir foco." */
export const FOCUS_RING_CLASSES =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-info";

/** Caja de la acción masiva y del botón de página: radio 6, padding 11/8, 10px semibold. */
export const SMALL_ACTION_CLASSES = [
  "inline-flex items-center justify-center gap-1.5 shrink-0",
  "rounded-[6px] px-[11px] py-2",
  "font-inter text-[10px] font-semibold leading-none",
  "whitespace-nowrap transition-colors",
  "disabled:cursor-not-allowed disabled:bg-control-disabled-surface",
  "disabled:text-control-disabled-ink disabled:border-transparent",
  FOCUS_RING_CLASSES,
].join(" ");

/** Disparador de un filtro: blanco, borde neutro, radio 7, padding 12/11, 11px medium. */
export const FILTER_TRIGGER_CLASSES = [
  "inline-flex items-center gap-2 shrink-0",
  "rounded-[7px] border border-neutral-border bg-white",
  "px-3 py-[11px]",
  "font-inter text-[11px] font-medium leading-none text-brand-navy",
  "whitespace-nowrap transition-colors hover:bg-neutral-soft",
  FOCUS_RING_CLASSES,
].join(" ");

/** Panel flotante de cualquiera de los dos menús del kit. */
export const MENU_PANEL_CLASSES = [
  "z-50 min-w-[180px] max-w-[280px]",
  "rounded-[8px] border border-neutral-border bg-white py-2",
  "shadow-[0_12px_32px_rgba(17,34,48,0.14)]",
].join(" ");

/** Un ítem dentro de ese panel. */
export const MENU_ITEM_CLASSES = [
  "flex w-full items-center gap-2 px-3 py-1.5 text-left",
  "font-inter text-[11px] leading-[1.5]",
  "transition-colors hover:bg-neutral-soft",
  "disabled:cursor-not-allowed disabled:text-control-disabled-ink disabled:hover:bg-transparent",
  "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-info",
].join(" ");

/** Relleno horizontal común a encabezado, celdas, barra de herramientas y pie. */
export const CELL_PADDING_X = "px-4";

/** Encabezado: fondo #f9f9fa, padding 16/14, 9px bold, tracking .36, mayúsculas. */
export const HEADER_CELL_CLASSES = [
  CELL_PADDING_X,
  "py-3.5 align-middle",
  "font-inter text-[9px] font-bold uppercase tracking-[0.36px] text-neutral-quiet-ink",
  "whitespace-nowrap",
].join(" ");

/** Celda de cuerpo: padding 16/10. */
export const BODY_CELL_CLASSES = `${CELL_PADDING_X} py-2.5 align-middle`;

export const ALIGN_CLASSES = {
  start: "text-left",
  center: "text-center",
  end: "text-right",
} as const;
