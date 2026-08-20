"use client";

import React, { useState } from "react";
import type { LoginRequest } from "@vc/api-client";
import { BRAND_CONFIG } from "@vc/config";
import { BrandLogo } from "../brand/BrandLogo";

export interface LoginCardProps {
  onSubmit: (req: LoginRequest) => Promise<void>;
  loading?: boolean;
  errorMessage?: string | null;
  onClearError?: () => void;
  brandName?: string;
  brandTagline?: string;
}

export const LoginCard: React.FC<LoginCardProps> = ({
  onSubmit,
  loading = false,
  errorMessage = null,
  onClearError,
  brandName = BRAND_CONFIG.name,
  brandTagline = "Panel Administrativo & Gobernanza",
}) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrEmail.trim() || !password) return;
    await onSubmit({
      usernameOrEmail: usernameOrEmail.trim(),
      password,
    });
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-neutral-border overflow-hidden">
      {/* Header Corporativo */}
      <div className="bg-brand-navy p-8 text-center text-white relative" role="img" aria-label={brandName}>
        <BrandLogo variant="light" className="h-8 w-auto mx-auto mb-4" />
        <p className="font-inter text-xs font-medium text-atmosphere-sky mt-1 uppercase tracking-widest">{brandTagline}</p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="font-bold">⚠️</span>
              <span>{errorMessage}</span>
            </div>
            {onClearError && (
              <button
                type="button"
                onClick={onClearError}
                className="text-rose-500 hover:text-rose-700 font-bold text-xs"
              >
                ✕
              </button>
            )}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block font-inter text-xs font-semibold text-neutral-muted uppercase tracking-wider">
            Usuario o Correo Electrónico
          </label>
          <input
            type="text"
            required
            autoComplete="username"
            value={usernameOrEmail}
            onChange={(e) => {
              setUsernameOrEmail(e.target.value);
              if (errorMessage && onClearError) onClearError();
            }}
            placeholder="admin@viajescarolina.com"
            className="w-full px-4 py-3 rounded-xl border border-neutral-border bg-neutral-soft/50 text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent transition-all placeholder:text-neutral-subtle"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block font-inter text-xs font-semibold text-neutral-muted uppercase tracking-wider">
              Contraseña
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs text-brand-blue hover:text-brand-navy font-medium"
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMessage && onClearError) onClearError();
              }}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 rounded-xl border border-neutral-border bg-neutral-soft/50 text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent transition-all placeholder:text-neutral-subtle"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !usernameOrEmail.trim() || !password}
          className="w-full py-3.5 px-6 rounded-xl bg-brand-accent hover:bg-brand-sunset text-brand-navy font-inter font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-brand-navy" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>Verificando credenciales...</span>
            </>
          ) : (
            <span>Ingresar al Panel de Control</span>
          )}
        </button>

        {/* Indicadores de Seguridad */}
        <div className="pt-4 border-t border-neutral-border flex items-center justify-center gap-4 text-[11px] font-inter text-neutral-muted">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Argon2id Hashing
          </span>
          <span className="text-neutral-border">•</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-blue"></span>
            Cookie HttpOnly Secure
          </span>
        </div>
      </form>
    </div>
  );
};
