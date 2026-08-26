"use client";

import React, { useRef } from "react";

export interface SectionRailItem {
  id: string;
  label: string;
  modified?: boolean;
}

export interface SectionRailProps {
  items: SectionRailItem[];
  activeId: string;
  onSelect: (id: string) => void;
  className?: string;
}

/**
 * Rail de navegación local (tabs verticales) para editores de "una sección
 * a la vez". Implementa el patrón ARIA APG de tabs con activación
 * automática: mover el foco con flechas ya selecciona el panel, sin
 * necesidad de Enter/Espacio.
 */
export function SectionRail({ items, activeId, onSelect, className = "" }: SectionRailProps) {
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const focusAndSelect = (id: string) => {
    onSelect(id);
    buttonRefs.current[id]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = items.findIndex((item) => item.id === activeId);
    if (currentIndex === -1) return;

    let nextIndex: number | null = null;
    if (e.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % items.length;
    } else if (e.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + items.length) % items.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = items.length - 1;
    }

    if (nextIndex !== null) {
      e.preventDefault();
      focusAndSelect(items[nextIndex].id);
    }
  };

  return (
    <div
      role="tablist"
      aria-orientation="vertical"
      onKeyDown={handleKeyDown}
      className={`flex flex-col gap-1 ${className}`}
    >
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <button
            key={item.id}
            ref={(el) => {
              buttonRefs.current[item.id] = el;
            }}
            type="button"
            role="tab"
            id={`tab-${item.id}`}
            aria-selected={active}
            aria-controls={`panel-${item.id}`}
            tabIndex={active ? 0 : -1}
            onClick={() => onSelect(item.id)}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl font-sora text-sm transition-colors flex items-center gap-2 ${
              active ? "bg-brand-navy text-white" : "text-brand-navy/70 hover:bg-neutral-soft"
            }`}
          >
            <span className="flex-1">{item.label}</span>
            {item.modified && <span className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0" />}
          </button>
        );
      })}
    </div>
  );
}
