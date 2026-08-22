"use client";

import React, { useEffect, useRef, useState } from "react";

export interface RevealProps {
  children: React.ReactNode;
  /** Retraso en ms antes de animar — para escalonar hermanos dentro de una misma sección (80ms). */
  delayMs?: number;
  className?: string;
}

type RevealState = "idle" | "pending" | "revealed";

/**
 * Revela su contenido al entrar en viewport (threshold 0.25), una sola vez.
 * Si el contenido ya está visible al montar, o si `IntersectionObserver` no
 * existe, se queda en su estado visible normal sin animar — nunca depende
 * de JS para mostrarse, solo para el efecto de entrada. Usa la propiedad
 * `translate` (no `transform`) para no crear un containing block nuevo y
 * no romper a los descendientes con `position: absolute` propios de estas
 * composiciones (ver PromotionsSection/TestimonialsSection).
 */
export function Reveal({ children, delayMs = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<RevealState>("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState((prev) => (prev === "pending" ? "revealed" : "idle"));
          observer.disconnect();
        } else {
          setState("pending");
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const style = delayMs
    ? ({ animationDelay: `${delayMs}ms`, transitionDelay: `${delayMs}ms` } as React.CSSProperties)
    : undefined;

  const stateClass = state === "pending" ? "reveal-pending" : state === "revealed" ? "reveal-revealed" : "";

  return (
    <div ref={ref} style={style} className={`${stateClass} ${className}`.trim()}>
      {children}
    </div>
  );
}
