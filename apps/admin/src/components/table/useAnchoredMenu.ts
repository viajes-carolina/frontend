"use client";

import { useCallback, useEffect, useState } from "react";
import { usePopoverMenu, type PopoverMenu } from "./usePopoverMenu";

/**
 * El menú "•••" de una fila, colocado con coordenadas de viewport y sacado a un
 * portal.
 *
 * ── Por qué no basta con `absolute` ──────────────────────────────────────
 * La tabla vive dentro de un contenedor con `overflow-x-auto` (requisito de la
 * guía: la tabla desborda dentro de su caja, no empuja el ancho de la página).
 * CSS no permite recortar en un eje y no en el otro: al pedir `overflow-x`,
 * `overflow-y` pasa también a `auto`. Un menú `absolute` abierto en la última
 * fila quedaría recortado por abajo.
 *
 * `position: fixed` escapa del recorte, pero solo mientras ningún ancestro cree
 * un bloque contenedor con `transform` / `filter` / `will-change` — cosa que
 * ninguna hoja de estilos garantiza a futuro. El portal a `document.body` lo
 * hace incondicional.
 *
 * ── La medida se toma en el manejador, no en un efecto ───────────────────
 * `measure()` corre DENTRO del clic (o de la flecha), antes de `toggle()`. Como
 * React agrupa las dos actualizaciones de estado del mismo evento, el primer
 * render con el menú abierto ya trae sus coordenadas y no existe un cuadro
 * intermedio mal colocado. Medir en un `useEffect` obligaría a pintar primero y
 * corregir después; medir en `useLayoutEffect` evitaría el parpadeo pero
 * advierte en el render del servidor.
 *
 * ── Al desplazar, se cierra ──────────────────────────────────────────────
 * Seguir la fila durante el scroll obligaría a recalcular en cada cuadro.
 * Cerrar es lo que hacen los menús nativos del sistema y evita el panel
 * flotando junto a una fila que ya no es la suya.
 */
export interface AnchoredMenu extends PopoverMenu {
  /** Coordenadas fijas del panel. `null` mientras no hay medida. */
  style: React.CSSProperties | null;
  /** `document.body` una vez montado en el cliente; `null` en SSR. */
  portalTarget: HTMLElement | null;
  /** Sustituye a un `onClick` que llamara a `toggle` directamente. */
  handleTriggerClick: () => void;
}

/** Alto estimado por ítem (32px) más el relleno del panel (8px arriba y abajo). */
const ITEM_HEIGHT = 32;
const PANEL_PADDING = 16;
/** Separación entre el disparador y el panel. */
const OFFSET = 6;
/** Margen mínimo con el borde derecho de la ventana. */
const VIEWPORT_MARGIN = 8;

export function useAnchoredMenu(itemCount: number): AnchoredMenu {
  const menu = usePopoverMenu(itemCount);
  const [style, setStyle] = useState<React.CSSProperties | null>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  const { triggerRef, toggle, close, handleTriggerKeyDown: baseKeyDown } = menu;

  useEffect(() => setPortalTarget(document.body), []);

  const measure = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) {
      return;
    }
    const rect = trigger.getBoundingClientRect();
    const estimatedHeight = itemCount * ITEM_HEIGHT + PANEL_PADDING;

    /* `documentElement.clientWidth/Height` y NO `window.innerWidth/Height`: las
       de `window` incluyen la barra de desplazamiento, y un elemento `fixed` se
       posiciona contra el bloque contenedor inicial, que la excluye. Con
       `innerWidth` el panel quedaba ~15px a la derecha de su disparador en toda
       página con scroll vertical — que son todas. */
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;
    const roomBelow = viewportHeight - rect.bottom;

    /* El panel se alinea por su borde DERECHO con el del disparador: la columna
       de acciones es la última de la tabla, así que abrirlo hacia la izquierda
       es lo único que garantiza que no se salga por el lado derecho. */
    const right = Math.max(VIEWPORT_MARGIN, viewportWidth - rect.right);

    /* Se abre hacia abajo salvo que no quepa Y arriba haya más sitio. */
    setStyle(
      roomBelow >= estimatedHeight || roomBelow >= rect.top
        ? { position: "fixed", top: rect.bottom + OFFSET, right }
        : { position: "fixed", bottom: viewportHeight - rect.top + OFFSET, right }
    );
  }, [itemCount, triggerRef]);

  const handleTriggerClick = useCallback(() => {
    measure();
    toggle();
  }, [measure, toggle]);

  const handleTriggerKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        measure();
      }
      baseKeyDown(event);
    },
    [measure, baseKeyDown]
  );

  useEffect(() => {
    if (!menu.open) {
      return;
    }
    const handleViewportChange = () => close(false);
    window.addEventListener("resize", handleViewportChange);
    /* `capture` para enterarse también del scroll de la propia tabla, que no
       burbujea hasta `window`. */
    window.addEventListener("scroll", handleViewportChange, true);
    return () => {
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [menu.open, close]);

  return { ...menu, style, portalTarget, handleTriggerClick, handleTriggerKeyDown };
}
