"use client";

import React from "react";
import { StepIndicator, StepIndicatorStep } from "../primitives/StepIndicator";
import { Button } from "../primitives/Button";

const WIZARD_STEPS: StepIndicatorStep[] = [
  { number: 1, label: "Tus datos" },
  { number: 2, label: "Servicio" },
  { number: 3, label: "Lo ocurrido" },
  { number: 4, label: "Revisar" },
];

export interface ClaimWizardShellProps {
  companyName: string;
  taxId?: string;
  legalAddress?: string;
  currentStep: number;
  stepTitle: string;
  stepDescription: string;
  /** Panel "Ayuda opcional" — el llamador decide en qué paso mostrarlo (solo paso 1). */
  helpPanel?: React.ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  nextLoading?: boolean;
  showBack?: boolean;
  children: React.ReactNode;
}

/**
 * Layout compartido de los 4 pasos del asistente del Libro de Reclamaciones.
 * Plantilla pura: no valida ni envía nada, solo dispara `onBack`/`onNext`.
 */
export function ClaimWizardShell({
  companyName,
  taxId,
  legalAddress,
  currentStep,
  stepTitle,
  stepDescription,
  helpPanel,
  onBack,
  onNext,
  nextLabel = "Continuar",
  nextDisabled = false,
  nextLoading = false,
  showBack = true,
  children,
}: ClaimWizardShellProps) {
  return (
    <main className="min-h-screen bg-neutral-soft">
      <header className="border-b border-neutral-border bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <span className="font-sora font-bold text-brand-navy text-sm sm:text-base">
            Viajes Carolina
          </span>
          <a
            href="/"
            className="font-sora text-xs sm:text-sm font-semibold text-neutral-muted hover:text-brand-navy transition-colors"
          >
            ← Volver al sitio
          </a>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Identidad legal */}
        <div className="bg-white border border-neutral-border rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-accent shrink-0">
              Proveedor
            </span>
            <span className="text-xs sm:text-sm text-neutral-muted">
              <strong className="text-brand-navy font-semibold">{companyName}</strong>
              {taxId && <> · RUC {taxId}</>}
              {legalAddress && <> · {legalAddress}</>}
            </span>
          </div>
          <span className="text-[11px] text-neutral-subtle shrink-0">
            La numeración y fecha se asignan al registrar
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Columna izquierda */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-accent">
                Libro de Reclamaciones
              </span>
              <h1 className="font-display text-2xl sm:text-3xl text-brand-navy leading-tight">
                {stepTitle}
              </h1>
              <p className="text-sm text-neutral-muted leading-relaxed">{stepDescription}</p>
            </div>

            <div className="bg-atmosphere-pale-sky rounded-2xl p-5 space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-brand-navy">
                Plazo
              </div>
              <div className="text-sm font-bold text-brand-navy">
                Respuesta en 15 días hábiles
              </div>
              <p className="text-xs text-neutral-muted">
                El plazo es máximo, improrrogable y no tiene costo para ti.
              </p>
            </div>

            {helpPanel}
          </div>

          {/* Columna derecha */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-neutral-border shadow-sm p-6 sm:p-8 space-y-8">
            <StepIndicator steps={WIZARD_STEPS} currentStep={currentStep} />

            <div>{children}</div>

            <div className="flex items-center justify-between gap-3 pt-4 border-t border-neutral-border">
              {showBack ? (
                <Button type="button" variant="outline" onClick={onBack}>
                  Atrás
                </Button>
              ) : (
                <span aria-hidden="true" />
              )}
              <Button
                type="button"
                variant="primary"
                onClick={onNext}
                disabled={nextDisabled || nextLoading}
              >
                {nextLoading ? "Procesando…" : nextLabel}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
