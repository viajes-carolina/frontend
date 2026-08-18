import { UsersClientView } from "./UsersClientView";

export const metadata = {
  title: "Usuarios y Roles (RBAC) · Panel Administrativo",
  description: "Gestión de operadores y roles de gobernanza en Viajes Carolina.",
};

export default function UsersPage() {
  return <UsersClientView />;
}
