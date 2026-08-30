"use client";

import { useAdminSidebarProfile } from "../hooks/useAdminSidebarProfile";

/*
 * Bloque de perfil al pie del sidebar (diseño Figma 930:3).
 *
 * Contenedor #1a3040 a radio 6px, 8px de padding vertical y 10px de separación
 * entre el avatar de 32px y el par nombre/rol (12px semibold + 10px regular,
 * ambos en #ebf5fa). Los tres literales de color son del diseño y no existen
 * como token del panel; se dejan como valores arbitrarios porque `globals.css`
 * queda fuera de este cambio.
 *
 * El avatar son iniciales, no una foto: `AdminUserDTO` (id, username, email,
 * fullName, role, active, lastLoginAt…) no tiene ningún campo de imagen de
 * perfil, así que no hay nada real que mostrar y un retrato de stock sería una
 * persona que no es quien ha iniciado sesión.
 */

function ProfileSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex items-center gap-2.5 rounded-[6px] bg-[#1a3040] px-2.5 py-2"
    >
      <span className="h-8 w-8 shrink-0 rounded-full bg-white/10" />
      <span className="min-w-0 flex-1 space-y-1.5">
        <span className="block h-2.5 w-24 rounded-[2px] bg-white/10" />
        <span className="block h-2 w-16 rounded-[2px] bg-white/[0.07]" />
      </span>
    </div>
  );
}

export function AdminSidebarProfile() {
  const { loading, profile, signOut } = useAdminSidebarProfile();

  if (loading) return <ProfileSkeleton />;
  if (!profile) return null;

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2.5 rounded-[6px] bg-[#1a3040] px-2.5 py-2">
        <span
          aria-hidden="true"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-accent font-inter text-[11px] font-bold tracking-[0.3px] text-on-accent"
        >
          {profile.initials}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-inter text-[12px] font-semibold leading-[1.35] text-[#ebf5fa]">
            {profile.fullName}
          </span>
          <span className="block truncate font-inter text-[10px] font-normal leading-[1.4] text-[#ebf5fa]">
            {profile.roleLabel}
          </span>
        </span>
      </div>

      {/* El panel no tenía salida de sesión en ninguna pantalla: se entraba por
          /login y solo se salía esperando a que caducara el JWT. El punto hueco
          alinea el botón con la columna de puntos del menú y a la vez lo
          distingue de una sección navegable. */}
      <button
        type="button"
        onClick={signOut}
        className="group flex h-9 w-full items-center gap-2 rounded-[6px] pl-2 pr-2.5 font-inter text-[12px] text-admin-on-navy transition-colors hover:bg-white/[0.07] hover:text-white"
      >
        <span
          aria-hidden="true"
          className="h-2 w-2 shrink-0 rounded-full border border-admin-on-navy/50 transition-colors group-hover:border-admin-on-navy"
        />
        <span className="flex-1 text-left">Cerrar sesión</span>
      </button>
    </div>
  );
}
