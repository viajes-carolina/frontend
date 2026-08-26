"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

function requestUrl(input: RequestInfo | URL): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.toString();
  return input.url;
}

// Si el JWT de sesión (vc_admin_jwt) expira o deja de ser válido, cualquier
// llamada a /api/proxy/admin/* responde 401 — sin este guard, la página se
// queda en un estado roto y silencioso (listas vacías, error solo en la
// consola) en vez de llevar al admin de regreso al login.
export function useAdminSessionGuard() {
  const router = useRouter();
  const installedRef = useRef(false);
  const redirectingRef = useRef(false);

  useEffect(() => {
    if (installedRef.current || typeof window === "undefined") return;
    installedRef.current = true;

    const originalFetch = window.fetch.bind(window);
    window.fetch = async (...args: Parameters<typeof fetch>) => {
      const response = await originalFetch(...args);
      const url = requestUrl(args[0]);
      const isAdminApiCall = url.includes("/api/proxy/admin/");
      const isLoginAttempt = url.includes("/auth/login");

      if (
        response.status === 401 &&
        isAdminApiCall &&
        !isLoginAttempt &&
        !redirectingRef.current &&
        !window.location.pathname.startsWith("/login")
      ) {
        redirectingRef.current = true;
        const from = window.location.pathname + window.location.search;
        router.push(`/login?from=${encodeURIComponent(from)}`);
      }

      return response;
    };
  }, [router]);
}
