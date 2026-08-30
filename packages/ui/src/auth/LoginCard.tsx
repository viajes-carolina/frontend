"use client";

import React from "react";
import type { LoginRequest } from "@vc/api-client";
import { CheckIcon, CloseIcon, LockIcon, ShieldCheckIcon } from "../icons/icons";
import { useLoginForm } from "./useLoginForm";

export interface LoginCardProps {
  onSubmit: (req: LoginRequest) => Promise<void>;
  loading?: boolean;
  errorMessage?: string | null;
  onClearError?: () => void;
}

const FIELD_CLASS =
  "h-[46px] lg:h-[48px] w-full rounded-[7px] border border-admin-field-border bg-admin-field px-3.5 font-inter text-[14px] text-admin-value transition-colors placeholder:text-admin-footnote/70 hover:border-admin-checkbox focus:border-brand-accent";

const LABEL_CLASS =
  "block font-inter text-[10px] lg:text-[11px] font-bold tracking-[0.4px] lg:tracking-[0.55px] text-admin-label";

export const LoginCard: React.FC<LoginCardProps> = ({
  onSubmit,
  loading = false,
  errorMessage = null,
  onClearError,
}) => {
  const form = useLoginForm({ onSubmit, onClearError, errorMessage, loading });

  return (
    <form
      onSubmit={form.handleSubmit}
      className="w-full rounded-[12px] border border-neutral-border bg-white p-6 font-inter shadow-[0_8px_24px_rgba(17,34,48,0.08)] lg:p-10 lg:shadow-[0_12px_32px_rgba(17,34,48,0.1)]"
    >
      <p className="flex items-center gap-2 font-inter text-[10px] lg:text-[11px] font-bold tracking-[0.7px] lg:tracking-[0.88px] text-brand-accent">
        <LockIcon aria-hidden="true" className="h-[14px] w-[14px] shrink-0 lg:h-4 lg:w-4" />
        ACCESO AL PANEL
      </p>

      <h1 className="mt-3 font-inter text-[26px] lg:text-[30px] font-bold leading-tight text-neutral-ink">
        Inicia sesión
      </h1>

      <p className="mt-2 font-inter text-[13px] lg:text-[14px] leading-[1.55] text-neutral-muted">
        <span className="lg:hidden">Ingresa con tu cuenta autorizada para administrar el sitio.</span>
        <span className="hidden lg:inline">
          Ingresa con tu cuenta autorizada para administrar el sitio y sus contenidos.
        </span>
      </p>

      <div aria-hidden="true" className="mt-7 mb-7 hidden h-px w-full bg-admin-divider lg:block" />

      {errorMessage && (
        <div
          role="alert"
          className="mt-6 mb-1 flex items-start justify-between gap-3 rounded-[7px] border border-brand-accent/35 bg-brand-accent/8 px-4 py-3 lg:mt-0 lg:mb-6"
        >
          <span className="font-inter text-[12px] leading-[1.5] text-neutral-ink">{errorMessage}</span>
          {onClearError && (
            <button
              type="button"
              onClick={onClearError}
              aria-label="Cerrar mensaje de error"
              className="-mr-1 shrink-0 rounded-[4px] text-neutral-muted transition-colors hover:text-neutral-ink"
            >
              <CloseIcon size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      )}

      <div className="mt-6 space-y-2 lg:mt-0">
        <label htmlFor="admin-login-email" className={LABEL_CLASS}>
          CORREO ELECTRÓNICO
        </label>
        {/* `type="text"` y no `email`: el backend acepta usuario **o** correo, y
            la validación nativa de `type="email"` rechazaría un usuario. */}
        <input
          id="admin-login-email"
          type="text"
          inputMode="email"
          required
          autoComplete="username"
          value={form.usernameOrEmail}
          onChange={(e) => form.setUsernameOrEmail(e.target.value)}
          placeholder="nombre@viajescarolina.pe"
          className={FIELD_CLASS}
        />
      </div>

      <div className="mt-5 space-y-2">
        <label htmlFor="admin-login-password" className={LABEL_CLASS}>
          CONTRASEÑA
        </label>
        <div className="relative">
          <input
            id="admin-login-password"
            type={form.showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => form.setPassword(e.target.value)}
            placeholder="••••••••••••"
            className={`${FIELD_CLASS} pr-[88px]`}
          />
          <button
            type="button"
            onClick={form.toggleShowPassword}
            aria-label={form.showPassword ? "Ocultar la contraseña" : "Mostrar la contraseña"}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-[4px] font-inter text-[12px] font-semibold text-brand-navy transition-opacity hover:opacity-70"
          >
            {form.showPassword ? "Ocultar" : "Mostrar"}
          </button>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2.5">
        <span className="relative inline-flex h-4 w-4 shrink-0">
          <input
            id="admin-login-remember"
            type="checkbox"
            checked={form.rememberMe}
            onChange={(e) => form.setRememberMe(e.target.checked)}
            className="peer h-4 w-4 cursor-pointer appearance-none rounded-[4px] border border-admin-checkbox bg-white transition-colors checked:border-brand-accent checked:bg-brand-accent"
          />
          <CheckIcon
            size={10}
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-on-accent opacity-0 peer-checked:opacity-100"
          />
        </span>
        <label
          htmlFor="admin-login-remember"
          className="cursor-pointer select-none font-inter text-[12px] text-admin-label"
        >
          <span className="lg:hidden">Mantener sesión</span>
          <span className="hidden lg:inline">Mantener mi sesión</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={!form.canSubmit}
        className="mt-6 flex h-[48px] lg:h-[50px] w-full items-center justify-center gap-2 rounded-[7px] bg-brand-accent font-inter text-[14px] font-bold text-on-accent transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
      >
        {loading ? (
          <>
            <svg className="h-4 w-4 animate-spin text-on-accent" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span>Verificando credenciales...</span>
          </>
        ) : (
          <span>Ingresar al panel</span>
        )}
      </button>

      <p className="mt-4 flex items-start justify-center gap-1.5 text-center font-inter text-[11px] leading-[1.45] text-admin-footnote">
        <ShieldCheckIcon aria-hidden="true" className="mt-px h-[13px] w-[13px] shrink-0" />
        <span className="lg:hidden">Acceso protegido. Los intentos de ingreso quedan registrados.</span>
        <span className="hidden lg:inline">Acceso protegido · Los intentos de ingreso quedan registrados.</span>
      </p>
    </form>
  );
};
