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
    <div className="flex min-h-screen items-center justify-center bg-neutral-soft p-6">
      <div className="w-full max-w-md rounded-[12px] border border-neutral-border bg-white p-8 text-center font-inter shadow-[0_8px_24px_rgba(17,34,48,0.08)]">
        <p className="font-inter text-[11px] font-bold uppercase tracking-[0.88px] text-brand-accent">
          Algo salió mal
        </p>
        <h1 className="mt-3 font-inter text-[20px] font-bold leading-tight text-neutral-ink">
          No pudimos cargar esta página
        </h1>
        <p className="mt-2 font-inter text-[13px] leading-[1.55] text-neutral-muted">
          {error.message || "Error inesperado al comunicarse con el servidor."}
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 inline-flex h-[46px] items-center justify-center rounded-[7px] bg-brand-accent px-6 font-inter text-[14px] font-bold text-on-accent transition-opacity hover:opacity-90"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
