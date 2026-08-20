"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LoginCard } from "@vc/ui";
import { useAdminAuth } from "../../hooks/useAdminAuth";

export function LoginClientView() {
  const router = useRouter();
  const { login, submitting, error, clearError } = useAdminAuth();

  const handleLogin = async (req: { usernameOrEmail: string; password: string }) => {
    try {
      await login(req);
      router.push("/");
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
