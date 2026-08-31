"use client";

import React from "react";
import type { AdminUserDTO, CreateAdminUserRequest, UpdateAdminUserRequest } from "@vc/api-client";
import { FormFeedback } from "../forms/FormFeedback";
import { FormField } from "../forms/FormField";
import { FormSelect } from "../primitives/FormSelect";
import { Badge, type BadgeTone } from "../primitives/Badge";
import { Button } from "../primitives/Button";
import { Modal } from "../primitives/Modal";
import { PlusIcon, UsersIcon } from "../icons/icons";
import { TableSkeletonRows } from "../primitives/Skeleton";
import { EmptyState } from "../states/EmptyState";
import { useUsersTableForm } from "./useUsersTableForm";

export interface UsersTableProps {
  users: AdminUserDTO[];
  loading?: boolean;
  onCreateUser: (req: CreateAdminUserRequest) => Promise<AdminUserDTO>;
  onUpdateUser: (id: number, req: UpdateAdminUserRequest) => Promise<AdminUserDTO>;
}

/**
 * Rol de acceso en los tonos SEMÁNTICOS del kit, no en un color propio.
 *
 *   SUPER_ADMIN     accent   control total: es el rol que debe saltar a la vista.
 *   CONTENT_EDITOR  info     rol operativo ordinario.
 *   ADVISOR         neutral  alcance más acotado; nada que destacar.
 *
 * Los puntos de color que acompañaban a cada píldora desaparecen: no añadían
 * información — el nombre del rol ya está escrito — y eran justo la señal
 * "solo color" que la guía desaconseja.
 */
const ROLE_BADGES: Record<string, { label: string; tone: BadgeTone }> = {
  SUPER_ADMIN: { label: "Super Admin", tone: "accent" },
  CONTENT_EDITOR: { label: "Editor de Contenidos", tone: "info" },
  ADVISOR: { label: "Asesora de Viajes", tone: "neutral" },
};

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  loading = false,
  onCreateUser,
  onUpdateUser,
}) => {
  const form = useUsersTableForm({ onCreateUser, onUpdateUser });

  return (
    <div className="space-y-6 font-inter">
      {/* Barra de Acciones */}
      <div className="flex flex-col justify-between gap-4 rounded-[12px] border border-neutral-border bg-white p-6 shadow-[0_8px_24px_rgba(17,34,48,0.06)] sm:flex-row sm:items-center">
        <div>
          <h2 className="font-inter text-[18px] font-bold leading-tight text-neutral-ink">
            Usuarios y Control de Acceso (RBAC)
          </h2>
          <p className="mt-1.5 max-w-3xl font-inter text-[13px] leading-[1.55] text-neutral-muted">
            Administra los operadores con acceso al panel, asigna permisos por rol y audita estados de sesión.
          </p>
        </div>
        <Button
          type="button"
          variant="primary"
          size="sm"
          icon={<PlusIcon size={16} aria-hidden="true" />}
          iconPosition="left"
          onClick={form.openCreateModal}
          className="self-start sm:self-auto"
        >
          Nuevo usuario
        </Button>
      </div>

      {/* Tabla de Usuarios */}
      <div className="overflow-hidden rounded-[12px] border border-neutral-border bg-white shadow-[0_8px_24px_rgba(17,34,48,0.06)]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-admin-divider bg-neutral-soft text-[11px] font-bold uppercase tracking-[0.55px] text-admin-label">
                <th className="px-6 py-4">Usuario / Nombre</th>
                <th className="px-6 py-4">Correo electrónico</th>
                <th className="px-6 py-4">Rol de acceso</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Último acceso</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-divider">
              {loading && users.length === 0 ? (
                <TableSkeletonRows columns={6} />
              ) : users.length === 0 ? (
                <tr>
                  {/* "Explica qué falta y ofrece una acción útil": el texto
                      suelto de antes no hacía ninguna de las dos cosas. */}
                  <td colSpan={6} className="p-0">
                    <EmptyState
                      title="Aún no hay usuarios"
                      message="Crea la primera cuenta de operador para que alguien más pueda entrar al panel con su propio rol."
                      icon={<UsersIcon size={28} aria-hidden="true" />}
                      action={{ label: "Nuevo usuario", onClick: form.openCreateModal }}
                    />
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const badge = ROLE_BADGES[u.role];
                  return (
                    <tr key={u.id} className="transition-colors hover:bg-neutral-soft">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-navy text-xs font-bold text-white">
                            {u.fullName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-admin-value">{u.fullName}</div>
                            <div className="font-mono text-xs text-neutral-muted">@{u.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-admin-label">{u.email}</td>
                      <td className="px-6 py-4">
                        <Badge tone={badge ? badge.tone : "neutral"}>
                          {badge ? badge.label : u.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        {/* Cuenta habilitada = éxito; bloqueada = neutro. */}
                        <Badge tone={u.active ? "success" : "neutral"}>
                          {u.active ? "Activo" : "Inactivo"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-xs text-neutral-muted">
                        {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString("es-PE") : "Sin ingresos aún"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => form.openEditModal(u)}
                        >
                          Editar
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Creación / Edición — usa el `Modal` compartido en vez del
          overlay propio que este archivo duplicaba. */}
      {form.modalOpen && (
        <Modal
          title={form.editingUser ? `Editar usuario: @${form.editingUser.username}` : "Crear nuevo usuario"}
          description="Los cambios de rol y estado quedan registrados en la bitácora de auditoría."
          onClose={form.closeModal}
          closeLabel="Cerrar formulario de usuario"
        >
          <form onSubmit={form.handleSubmit}>
            <FormFeedback feedback={form.feedback} />

            <div className="space-y-5">
              <FormField
                label="Nombre completo"
                type="text"
                required
                autoComplete="off"
                value={form.fullName}
                onChange={(e) => form.setFullName(e.target.value)}
                placeholder="Ej. Carolina Zúñiga"
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  label="Nombre de usuario"
                  type="text"
                  required
                  autoComplete="off"
                  value={form.username}
                  onChange={(e) => form.setUsername(e.target.value)}
                  placeholder="usuario"
                />
                <FormField
                  label="Correo electrónico"
                  type="email"
                  required
                  autoComplete="off"
                  value={form.email}
                  onChange={(e) => form.setEmail(e.target.value)}
                  placeholder="correo@viajescarolina.com"
                />
              </div>

              <FormField
                label="Contraseña"
                type="password"
                required={!form.editingUser}
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => form.setPassword(e.target.value)}
                placeholder="••••••••••••"
                hint={form.editingUser ? "Déjala en blanco para no cambiarla." : undefined}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormSelect
                  label="Rol RBAC"
                  value={form.role}
                  onChange={(e) => form.setRole(e.target.value)}
                >
                  <option value="SUPER_ADMIN">Super Admin (control total)</option>
                  <option value="CONTENT_EDITOR">Editor de contenido</option>
                  <option value="ADVISOR">Asesora de viajes</option>
                </FormSelect>
                <FormSelect
                  label="Estado de la cuenta"
                  value={form.active ? "true" : "false"}
                  onChange={(e) => form.setActive(e.target.value === "true")}
                >
                  <option value="true">Activa (permite acceso)</option>
                  <option value="false">Inactiva (bloqueada)</option>
                </FormSelect>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-end gap-3 border-t border-admin-divider pt-6">
              <Button type="button" variant="ghost" onClick={form.closeModal}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary" disabled={form.submitting}>
                {form.submitting
                  ? "Guardando..."
                  : form.editingUser
                    ? "Actualizar usuario"
                    : "Crear usuario"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
