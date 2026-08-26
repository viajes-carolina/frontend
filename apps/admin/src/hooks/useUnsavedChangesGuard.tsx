"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface UnsavedChangesContextValue {
  dirty: boolean;
  setDirty: (d: boolean) => void;
}

const UnsavedChangesContext = createContext<UnsavedChangesContextValue>({
  dirty: false,
  setDirty: () => {},
});

// Se monta una sola vez en AdminShell, envolviendo el sidebar (AdminNav) y el
// contenido de la página — así ambos comparten el mismo estado "dirty" sin
// pasar props a través de todo el árbol.
export function UnsavedChangesProvider({ children }: { children: React.ReactNode }) {
  const [dirty, setDirty] = useState(false);
  return (
    <UnsavedChangesContext.Provider value={{ dirty, setDirty }}>{children}</UnsavedChangesContext.Provider>
  );
}

// Para que una página reporte su estado dirty al contexto compartido y
// registre un guard de `beforeunload` mientras haya cambios sin guardar.
export function useUnsavedChangesGuard(isDirty: boolean) {
  const { setDirty } = useContext(UnsavedChangesContext);

  useEffect(() => {
    setDirty(isDirty);
    return () => setDirty(false);
  }, [isDirty, setDirty]);

  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);
}

// Para que AdminNav (u otro consumidor de navegación) consulte el estado
// compartido antes de dejar navegar a otra ruta.
export function useUnsavedChangesContext() {
  return useContext(UnsavedChangesContext);
}
