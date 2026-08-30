"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "./useAdminAuth";
import { summarizeAdminProfile, type AdminProfileSummary } from "../lib/adminProfileSummary";

export interface AdminSidebarProfileState {
  /** `true` mientras `GET /auth/me` está en vuelo: el pie pinta un esqueleto. */
  loading: boolean;
  /** `null` cuando no hay sesión resoluble; el pie no dibuja nada. */
  profile: AdminProfileSummary | null;
  signOut: () => void;
}

/**
 * Datos del usuario autenticado para el pie del sidebar, más el cierre de
 * sesión.
 *
 * Se apoya en `useAdminAuth` (que ya llama a `apiClient.getCurrentAdminUser()`)
 * y deja el `.tsx` como plantilla: el componente recibe nombre, rol e
 * iniciales ya resueltos y un `signOut` que disparar.
 */
export function useAdminSidebarProfile(): AdminSidebarProfileState {
  const router = useRouter();
  const { currentUser, loading, logout } = useAdminAuth();

  // Sin el `replace` posterior la pantalla se quedaría en el panel hasta que
  // algo disparase un 401.
  //
  // Solo se navega a /login si el servidor confirmó el cierre. Antes esto
  // redirigía siempre, y con `logoutAdmin` tragándose un 415 el usuario
  // acababa en la pantalla de acceso creyendo que había salido mientras
  // `vc_admin_jwt` seguía viva y bastaba escribir la URL para volver a entrar.
  const signOut = useCallback(() => {
    void logout()
      .then(() => router.replace("/login"))
      .catch((err) => {
        console.error("No se pudo cerrar la sesión:", err);
        window.alert(
          "No se pudo cerrar la sesión. Tu sesión sigue abierta: vuelve a intentarlo o cierra el navegador."
        );
      });
    // `logout` se recrea en cada render de `useAdminAuth` y no guarda estado
    // propio, así que no entra en las dependencias.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return {
    loading,
    profile: currentUser ? summarizeAdminProfile(currentUser) : null,
    signOut,
  };
}
