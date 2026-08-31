"use client";

import React from "react";
import { Badge, FormCard, FormField, type BadgeTone } from "@vc/ui";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import { useChangeOwnPassword } from "../../hooks/useChangeOwnPassword";

/**
 * Mismo criterio de tono que la tabla de usuarios: `accent` para el control
 * total, `info` para el rol operativo y `neutral` para el de alcance acotado.
 * La píldora naranja sólida de antes daba a cualquier rol el peso visual de la
 * acción principal de la pantalla.
 */
const ROLE_BADGES: Record<string, { label: string; tone: BadgeTone }> = {
  SUPER_ADMIN: { label: "Super Administrador", tone: "accent" },
  CONTENT_EDITOR: { label: "Editor de Contenido", tone: "info" },
  ADVISOR: { label: "Asesora", tone: "neutral" },
};

export function PerfilClientView() {
  const { currentUser } = useAdminAuth();
  const form = useChangeOwnPassword();

  return (
    <div className="mx-auto max-w-2xl p-8 font-inter">
      <div className="mb-8">
        <h1 className="font-inter text-3xl font-extrabold text-brand-navy">Mi Cuenta</h1>
        <p className="mt-1 font-inter text-sm text-neutral-muted">
          Cambia la contraseña que usas para entrar al panel administrativo.
        </p>
      </div>

      {currentUser && (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-[12px] border border-neutral-border bg-white p-6 shadow-[0_8px_24px_rgba(17,34,48,0.06)]">
          <div>
            <p className="font-inter font-bold text-neutral-ink">{currentUser.fullName}</p>
            <p className="mt-0.5 font-inter text-xs text-neutral-muted">
              @{currentUser.username} · {currentUser.email}
            </p>
          </div>
          <Badge tone={ROLE_BADGES[currentUser.role]?.tone ?? "neutral"}>
            {ROLE_BADGES[currentUser.role]?.label ?? currentUser.role}
          </Badge>
        </div>
      )}

      <FormCard
        title="Cambiar Contraseña"
        description="Se cerrará la sesión en los demás dispositivos la próxima vez que se use el panel."
        feedback={form.feedback}
        onSubmit={form.handleSubmit}
        saving={form.submitting}
        submitLabel="Actualizar Contraseña"
      >
        <FormField
          label="Contraseña Actual"
          type="password"
          value={form.currentPassword}
          onChange={(e) => form.setCurrentPassword(e.target.value)}
          autoComplete="current-password"
          placeholder="••••••••••••"
          required
        />

        <FormField
          label="Nueva Contraseña"
          type="password"
          value={form.newPassword}
          onChange={(e) => form.setNewPassword(e.target.value)}
          autoComplete="new-password"
          placeholder="Mínimo 6 caracteres"
          required
        />

        <FormField
          label="Confirmar Nueva Contraseña"
          type="password"
          value={form.confirmPassword}
          onChange={(e) => form.setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          placeholder="Repite la nueva contraseña"
          required
        />
      </FormCard>
    </div>
  );
}
