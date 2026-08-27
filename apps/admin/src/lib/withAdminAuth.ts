import { redirect } from "next/navigation";
import { ApiError } from "@vc/api-client";

// Envuelve una llamada SSR a un endpoint admin protegido: si el backend
// responde 401/403 (sesión vencida o inválida), redirige a /login con
// redirect() de Next.js en vez de dejar que el error llegue al overlay de
// desarrollo o al boundary de error.tsx — mismo destino final, pero sin el
// paso intermedio que se ve "pegado" en next dev.
export async function withAdminAuth<T>(promise: Promise<T>, fromPath: string): Promise<T> {
  try {
    return await promise;
  } catch (err) {
    if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
      redirect(`/login?from=${encodeURIComponent(fromPath)}`);
    }
    throw err;
  }
}
