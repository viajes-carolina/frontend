"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

/**
 * Máquina de teclado y foco de los dos menús del kit: el de un filtro
 * ("Estado: Todos ⌄") y el de acciones de fila ("•••").
 *
 * ── Por qué un menú y no un `<select>` ───────────────────────────────────
 * El principio 02 de la guía pide que el filtro "muestre su estado activo" en
 * su propia etiqueta ("Estado: Publicadas"). Un `<select>` nativo pinta SOLO la
 * opción elegida: para que se leyera "Estado: Publicadas" habría que meter el
 * prefijo dentro de cada `<option>`, y entonces la lista desplegada repetiría
 * "Estado:" en todas las líneas. Así que es un botón que abre un menú — y por
 * eso el teclado y el foco los tiene que poner este hook, que es lo que el
 * `<select>` traía de regalo.
 *
 * ── Contrato de teclado (patrón `menu` de WAI-ARIA) ──────────────────────
 *   En el disparador   ↓ abre y enfoca el primer ítem
 *                      ↑ abre y enfoca el último
 *                      Esc cierra
 *   Dentro del menú    ↓ / ↑ recorren con vuelta al extremo
 *                      Inicio / Fin van al primero / al último
 *                      Esc cierra y DEVUELVE el foco al disparador
 *                      Tab cierra y deja seguir al navegador
 *   Enter / Espacio    los resuelve el `<button>` nativo de cada ítem
 *
 * El foco se mueve de verdad (`element.focus()`), no con `aria-activedescendant`:
 * los ítems son `<button>` reales, así el anillo de foco azul que la guía exige
 * se ve sin tener que replicarlo con clases.
 */
export interface PopoverMenu {
  open: boolean;
  /** Envuelve al disparador; sirve para detectar el clic fuera. */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /**
   * El panel del menú. Se comprueba aparte de `containerRef` porque el menú de
   * acciones de fila se renderiza en un portal (ver `useAnchoredMenu`) y por
   * tanto NO es descendiente del contenedor: sin esta segunda comprobación, el
   * `pointerdown` sobre un ítem se leería como clic fuera y cerraría el menú
   * antes de que el `click` llegara a activarlo.
   */
  panelRef: React.RefObject<HTMLDivElement | null>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  /** `id` del panel, para `aria-controls` / `aria-labelledby`. */
  menuId: string;
  triggerId: string;
  toggle: () => void;
  close: (returnFocus?: boolean) => void;
  handleTriggerKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  handleMenuKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  setItemRef: (index: number) => (element: HTMLButtonElement | null) => void;
}

export function usePopoverMenu(itemCount: number): PopoverMenu {
  const reactId = useId();
  const menuId = `${reactId}-menu`;
  const triggerId = `${reactId}-trigger`;

  const [open, setOpen] = useState(false);
  /** -1 = abierto con el ratón, sin ítem enfocado todavía. */
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    setActiveIndex(-1);
    if (returnFocus) {
      triggerRef.current?.focus();
    }
  }, []);

  const toggle = useCallback(() => {
    setOpen((current) => !current);
    setActiveIndex(-1);
  }, []);

  /* Mover el foco es un efecto secundario sobre el DOM, así que va en un
     efecto — es el único de este hook. */
  useEffect(() => {
    if (!open || activeIndex < 0) {
      return;
    }
    itemRefs.current[activeIndex]?.focus();
  }, [open, activeIndex]);

  /* Clic fuera. `pointerdown` y no `click`: si el clic cae sobre otro botón, el
     menú debe estar ya cerrado cuando ese botón reciba su evento. */
  useEffect(() => {
    if (!open) {
      return;
    }
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (
        target instanceof Node &&
        (containerRef.current?.contains(target) || panelRef.current?.contains(target))
      ) {
        return;
      }
      setOpen(false);
      setActiveIndex(-1);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  const handleTriggerKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setOpen(true);
        setActiveIndex(0);
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setOpen(true);
        setActiveIndex(Math.max(0, itemCount - 1));
        return;
      }
      if (event.key === "Escape" && open) {
        event.preventDefault();
        setOpen(false);
        setActiveIndex(-1);
      }
    },
    [itemCount, open]
  );

  const handleMenuKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (itemCount === 0) {
        return;
      }
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setActiveIndex((current) => (current + 1) % itemCount);
          break;
        case "ArrowUp":
          event.preventDefault();
          setActiveIndex((current) => (current <= 0 ? itemCount - 1 : current - 1));
          break;
        case "Home":
          event.preventDefault();
          setActiveIndex(0);
          break;
        case "End":
          event.preventDefault();
          setActiveIndex(itemCount - 1);
          break;
        case "Escape":
          event.preventDefault();
          close(true);
          break;
        case "Tab":
          /* Sin `preventDefault`: cerrar y dejar que el navegador lleve el foco
             al siguiente control de la página es el comportamiento esperado. */
          close(false);
          break;
        default:
          break;
      }
    },
    [itemCount, close]
  );

  const setItemRef = useCallback(
    (index: number) => (element: HTMLButtonElement | null) => {
      itemRefs.current[index] = element;
    },
    []
  );

  return {
    open,
    containerRef,
    panelRef,
    triggerRef,
    menuId,
    triggerId,
    toggle,
    close,
    handleTriggerKeyDown,
    handleMenuKeyDown,
    setItemRef,
  };
}
