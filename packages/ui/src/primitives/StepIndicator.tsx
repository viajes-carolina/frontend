"use client";

import React from "react";

export interface StepIndicatorStep {
  number: number;
  label: string;
}

export interface StepIndicatorProps {
  steps: StepIndicatorStep[];
  currentStep: number;
  className?: string;
}

/**
 * Stepper genérico reutilizable: círculos numerados conectados por una línea de
 * progreso, con 3 estados visuales (completado / activo / pendiente). No conoce
 * nada del dominio que lo usa — recibe únicamente `steps` y `currentStep`.
 */
export function StepIndicator({ steps, currentStep, className = "" }: StepIndicatorProps) {
  return (
    <ol className={`grid grid-flow-col auto-cols-fr ${className}`}>
      {steps.map((step, index) => {
        const isCompleted = step.number < currentStep;
        const isActive = step.number === currentStep;
        const isTraversed = step.number <= currentStep;

        return (
          <li key={step.number} className="relative flex flex-col items-center px-1">
            {index > 0 && (
              <span
                aria-hidden="true"
                className={`absolute top-4 right-1/2 w-full h-0.5 transition-colors ${
                  isTraversed ? "bg-brand-accent" : "bg-neutral-border"
                }`}
              />
            )}
            <span
              aria-current={isActive ? "step" : undefined}
              className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 text-xs font-bold transition-colors ${
                isCompleted
                  ? "bg-brand-accent border-brand-accent text-white"
                  : isActive
                    ? "bg-white border-brand-accent text-brand-accent"
                    : "bg-white border-neutral-border text-neutral-subtle"
              }`}
            >
              {isCompleted ? "✓" : step.number}
            </span>
            <span
              className={`mt-2 text-center text-[10px] sm:text-[11px] font-bold uppercase tracking-wide leading-tight ${
                isActive ? "text-brand-navy" : isCompleted ? "text-brand-navy/70" : "text-neutral-subtle"
              }`}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
