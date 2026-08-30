"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import type { AdminUserDTO, CreateAdminUserRequest, UpdateAdminUserRequest } from "@vc/api-client";
import type { FormFeedbackState } from "../forms/FormFeedback";

export interface UseUsersTableFormOptions {
  onCreateUser: (req: CreateAdminUserRequest) => Promise<AdminUserDTO>;
  onUpdateUser: (id: number, req: UpdateAdminUserRequest) => Promise<AdminUserDTO>;
}

/**
 * Estado del alta/edición de operadores del panel. Vive fuera de
 * `UsersTable.tsx` para que ese archivo quede como plantilla JSX pura.
 */
export function useUsersTableForm({ onCreateUser, onUpdateUser }: UseUsersTableFormOptions) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUserDTO | null>(null);

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CONTENT_EDITOR");
  const [active, setActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<FormFeedbackState | null>(null);

  const openCreateModal = () => {
    setEditingUser(null);
    setFullName("");
    setUsername("");
    setEmail("");
    setPassword("");
    setRole("CONTENT_EDITOR");
    setActive(true);
    setFeedback(null);
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
    setFeedback(null);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
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
        await onCreateUser({ fullName, username, email, password, role, active });
      }
      setModalOpen(false);
    } catch (err) {
      setFeedback({
        tone: "error",
        message: err instanceof Error ? err.message : "Error al guardar usuario.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    modalOpen,
    editingUser,
    fullName,
    setFullName,
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    role,
    setRole,
    active,
    setActive,
    submitting,
    feedback,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmit,
  };
}
