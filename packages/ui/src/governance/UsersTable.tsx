"use client";

import React, { useState } from "react";
import type { AdminUserDTO, CreateAdminUserRequest, UpdateAdminUserRequest } from "@vc/api-client";
import { CloseIcon } from "../icons/icons";
import { TableSkeletonRows } from "../primitives/Skeleton";

export interface UsersTableProps {
  users: AdminUserDTO[];
  loading?: boolean;
  onCreateUser: (req: CreateAdminUserRequest) => Promise<AdminUserDTO>;
  onUpdateUser: (id: number, req: UpdateAdminUserRequest) => Promise<AdminUserDTO>;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  loading = false,
  onCreateUser,
  onUpdateUser,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUserDTO | null>(null);

  // Form State
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CONTENT_EDITOR");
  const [active, setActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingUser(null);
    setFullName("");
    setUsername("");
    setEmail("");
    setPassword("");
    setRole("CONTENT_EDITOR");
    setActive(true);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (u: AdminUserDTO) => {
    setEditingUser(u);
    setFullName(u.fullName);
    setUsername(u.username);
    setEmail(u.email);
    setPassword("");
    setRole(u.role);
    setActive(u.active);
    setFormError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      if (editingUser) {
        await onUpdateUser(editingUser.id, {
          fullName,
          username,
          email,
          role,
          active,
          ...(password ? { password } : {}),
        });
      } else {
        if (!password) {
          throw new Error("La contraseña es obligatoria para nuevos usuarios.");
        }
        await onCreateUser({
          fullName,
          username,
          email,
          password,
          role,
          active,
        });
      }
      setModalOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Error al guardar usuario.");
    } finally {
      setSubmitting(false);
    }
  };

  const getRoleBadge = (roleStr: string) => {
    switch (roleStr) {
      case "SUPER_ADMIN":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
            Super Admin
          </span>
        );
      case "CONTENT_EDITOR":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            Editor de Contenidos
          </span>
        );
      case "ADVISOR":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 border border-teal-200">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
            Asesora de Viajes
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-700">
            {roleStr}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra de Acciones */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Usuarios y Control de Acceso (RBAC)</h2>
          <p className="text-sm text-stone-500 mt-1">
            Administra los operadores con acceso al panel, asigna permisos por rol y audita estados de sesión.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm shadow-sm hover:shadow transition-all"
        >
          <span className="text-base leading-none">+</span>
          <span>Nuevo Usuario</span>
        </button>
      </div>

      {/* Tabla de Usuarios */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-600 text-xs font-semibold uppercase tracking-wider">
                <th className="py-4 px-6">Usuario / Nombre</th>
                <th className="py-4 px-6">Correo Electrónico</th>
                <th className="py-4 px-6">Rol de Acceso</th>
                <th className="py-4 px-6">Estado</th>
                <th className="py-4 px-6">Último Acceso</th>
                <th className="py-4 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading && users.length === 0 ? (
                <TableSkeletonRows columns={6} />
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-500">
                    No se encontraron usuarios registrados.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-stone-900 text-amber-300 flex items-center justify-center font-bold text-xs">
                          {u.fullName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-stone-900">{u.fullName}</div>
                          <div className="text-xs text-stone-500 font-mono">@{u.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-stone-700">{u.email}</td>
                    <td className="py-4 px-6">{getRoleBadge(u.role)}</td>
                    <td className="py-4 px-6">
                      {u.active ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          ● Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded-full">
                          ○ Inactivo
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-xs text-stone-500">
                      {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString("es-PE") : "Sin ingresos aún"}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => openEditModal(u)}
                        className="px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Creación / Edición */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <h3 className="text-lg font-bold text-stone-900">
                {editingUser ? `Editar Usuario: @${editingUser.username}` : "Crear Nuevo Usuario"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                aria-label="Cerrar formulario de usuario"
                className="text-stone-400 hover:text-stone-600 font-bold"
              >
                <CloseIcon size={20} />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  autoComplete="off"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ej. Carolina Zúñiga"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Nombre de Usuario</label>
                  <input
                    type="text"
                    required
                    autoComplete="off"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="usuario"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    autoComplete="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@viajescarolina.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Contraseña {editingUser && <span className="text-stone-400 font-normal">(dejar en blanco para no cambiar)</span>}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Rol RBAC</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  >
                    <option value="SUPER_ADMIN">Super Admin (Control Total)</option>
                    <option value="CONTENT_EDITOR">Editor de Contenido</option>
                    <option value="ADVISOR">Asesora de Viajes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Estado de la Cuenta</label>
                  <select
                    value={active ? "true" : "false"}
                    onChange={(e) => setActive(e.target.value === "true")}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  >
                    <option value="true">Activa (Permite Acceso)</option>
                    <option value="false">Inactiva (Bloqueada)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm text-stone-600 hover:text-stone-800 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm shadow-sm transition-all disabled:opacity-50"
                >
                  {submitting ? "Guardando..." : editingUser ? "Actualizar Usuario" : "Crear Usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
