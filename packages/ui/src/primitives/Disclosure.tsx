"use client";

import React from "react";
import { ChevronDownIcon } from "../icons/icons";

export interface DisclosureProps {
  summary: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

/**
 * Formaliza el patrón `<details>/<summary>` ya usado para "campos
 * heredados" en los formularios de admin (ver HeroForm.tsx), reusable
 * desde `@vc/ui`.
 */
export function Disclosure({ summary, children, defaultOpen = false, className = "" }: DisclosureProps) {
  return (
    <details open={defaultOpen} className={`group pt-4 border-t border-neutral-border ${className}`}>
      <summary className="flex items-center gap-2 cursor-pointer select-none list-none font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted">
        <ChevronDownIcon size={14} className="shrink-0 transition-transform group-open:rotate-180" />
        {summary}
      </summary>

      <div className="mt-3">{children}</div>
    </details>
  );
}
