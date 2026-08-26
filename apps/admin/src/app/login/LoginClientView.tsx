"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LoginCard } from "@vc/ui";
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

  const handleLogin = async (req: { usernameOrEmail: string; password: string }) => {
    try {
      await login(req);
      router.push(safeRedirectTarget());
    } catch {
      // Error manejado en el hook
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-blue/40 via-brand-navy to-atmosphere-twilight">
      <div className="w-full max-w-md">
        <LoginCard
          onSubmit={handleLogin}
          loading={submitting}
          errorMessage={error}
          onClearError={clearError}
          brandName="Viajes Carolina"
          brandTagline="Control de Acceso & Gobernanza"
        />
      </div>
    </div>
  );
}
