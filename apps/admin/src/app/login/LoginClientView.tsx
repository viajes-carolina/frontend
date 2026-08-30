"use client";

import React from "react";
import { useRouter } from "next/navigation";
import type { LoginRequest } from "@vc/api-client";
import { LoginBrandPanel, LoginCard } from "@vc/ui";
import { useAdminAuth } from "../../hooks/useAdminAuth";

// Solo se acepta una ruta relativa propia del panel (nunca "//host" ni una
// URL absoluta) — evita que un "from" manipulado en la URL redirija fuera
// del panel tras iniciar sesión. Se lee de window.location en vez de
// useSearchParams para no forzar un Suspense boundary en esta página.
function safeRedirectTarget(): string {
  if (typeof window === "undefined") return "/";
  const from = new URLSearchParams(window.location.search).get("from");
  if (!from || !from.startsWith("/") || from.startsWith("//")) return "/";
  return from;
}

export function LoginClientView() {
  const router = useRouter();
  const { login, submitting, error, clearError } = useAdminAuth();

  const handleLogin = async (req: LoginRequest) => {
    try {
      await login(req);
      router.push(safeRedirectTarget());
    } catch {
      // Error manejado en el hook
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-neutral-soft font-inter lg:flex-row">
      <LoginBrandPanel />

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-8 lg:px-10 lg:py-12">
        <div className="w-full lg:w-[472px]">
          <LoginCard
            onSubmit={handleLogin}
            loading={submitting}
            errorMessage={error}
            onClearError={clearError}
          />

          <p className="mt-5 text-center font-inter text-[10px] lg:text-[11px] text-admin-footnote">
            <span className="lg:hidden">Acceso protegido · Ingresos registrados.</span>
            <span className="hidden lg:inline">Viajes Carolina · Panel administrativo v1.0.0</span>
          </p>
        </div>
      </main>
    </div>
  );
}
