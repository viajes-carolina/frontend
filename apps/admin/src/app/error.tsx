"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Los Server Components del admin ahora lanzan un error real (ApiError) cuando el
// backend responde 401/403 en vez de fingir éxito con datos simulados (ver Fase 1 del
// plan de reestructuración). Esta pantalla evita que una sesión expirada se vea como
// un 500 crudo: si el error es de autenticación, redirige a /login; para cualquier
// otro error real, muestra un mensaje y un botón de reintentar.
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const isAuthError = /HTTP 401|HTTP 403/.test(error.message);

  useEffect(() => {
    if (isAuthError) {
      router.replace("/login");
    }
  }, [isAuthError, router]);

  if (isAuthError) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-surface p-6">
      <div className="max-w-md w-full bg-white rounded-2xl border border-neutral-border shadow-sm p-8 text-center space-y-4">
        <h1 className="font-sora font-bold text-lg text-brand-navy">
          Ocurrió un error al cargar esta página
        </h1>
        <p className="font-inter text-sm text-neutral-muted">
          {error.message || "Error inesperado al comunicarse con el servidor."}
        </p>
        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-brand-navy text-white font-sora font-bold text-sm hover:bg-brand-navy/90 transition-colors"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
