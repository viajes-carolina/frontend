"use client";

import React, { useState } from "react";
import { FormField } from "@vc/ui";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import { useChangeOwnPassword } from "../../hooks/useChangeOwnPassword";

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Administrador",
  CONTENT_EDITOR: "Editor de Contenido",
  ADVISOR: "Asesora",
};

export function PerfilClientView() {
  const { currentUser } = useAdminAuth();
  const { submitting, error, success, changePassword, clearFeedback } = useChangeOwnPassword();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();
    setLocalError(null);

    if (newPassword.length < 6) {
      setLocalError("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setLocalError("Las contraseñas no coinciden.");
      return;
    }

    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      // el error ya queda expuesto vía el hook
    }
  };

  const displayedError = localError || error;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-sora font-extrabold text-3xl text-brand-navy">Mi Cuenta</h1>
        <p className="font-inter text-neutral-muted text-sm mt-1">
          Cambia la contraseña que usas para entrar al panel administrativo.
        </p>
      </div>

      {currentUser && (
        <div className="bg-white rounded-2xl p-6 border border-neutral-border shadow-sm mb-6 flex items-center justify-between">
          <div>
            <p className="font-sora font-bold text-brand-navy">{currentUser.fullName}</p>
            <p className="font-inter text-xs text-neutral-muted mt-0.5">
              @{currentUser.username} · {currentUser.email}
            </p>
          </div>
          <span className="text-[10px] bg-brand-accent text-brand-navy font-bold px-2 py-1 rounded uppercase tracking-wider">
            {ROLE_LABELS[currentUser.role] || currentUser.role}
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-neutral-border shadow-sm space-y-6">
        <div className="border-b border-neutral-border pb-4">
          <h2 className="text-xl font-bold text-brand-navy">Cambiar Contraseña</h2>
        </div>

        {displayedError && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {displayedError}
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
            Contraseña actualizada exitosamente.
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          <div>
            <FormField
              label="Contraseña Actual"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="••••••••••••"
              required
            />
          </div>

          <div>
            <FormField
              label="Nueva Contraseña"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>

          <div>
            <FormField
              label="Confirmar Nueva Contraseña"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="Repite la nueva contraseña"
              required
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-neutral-border">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-brand-accent hover:bg-brand-sunset text-white font-bold text-sm rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {submitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Guardando...</span>
              </>
            ) : (
              <span>Actualizar Contraseña</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
