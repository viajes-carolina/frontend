"use client";

import React from "react";

/**
 * Panel navy de la pantalla de acceso al panel administrativo.
 *
 * En desktop es la columna fija de 520px; en mobile colapsa a una franja
 * superior de 190px que solo conserva marca, barra de acento y titular. La
 * descripción y el bloque de confianza se ocultan ahí por falta de altura, no
 * por ser opcionales.
 */
export const LoginBrandPanel: React.FC = () => {
  return (
    <aside className="relative h-[190px] shrink-0 overflow-hidden bg-brand-navy px-6 py-7 font-inter lg:h-auto lg:w-[520px] lg:px-14 lg:py-14">
      {/* Ornamento geométrico: círculos en CSS (no imágenes) recortados por el
          borde del panel. Puramente decorativo. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -bottom-14 -right-12 hidden h-[190px] w-[190px] rounded-full bg-white/[0.05] lg:block" />
        <div className="absolute bottom-3 -right-8 hidden h-[130px] w-[130px] rounded-full border border-brand-accent/40 lg:block" />
        <div className="absolute bottom-[118px] right-[68px] hidden h-4 w-4 rounded-full bg-brand-accent lg:block" />
        <div className="absolute right-6 top-6 h-3 w-3 rounded-full bg-brand-accent lg:hidden" />
        <div className="absolute -right-4 top-[54px] h-[62px] w-[62px] rounded-full border border-brand-accent/35 lg:hidden" />
      </div>

      <div className="relative z-10 flex h-full flex-col lg:justify-between">
        <div>
          <p className="font-inter text-[20px] lg:text-[22px] font-bold leading-none text-white">Viajes Carolina</p>
          <p className="mt-2 font-inter text-[10px] tracking-[1.2px] text-admin-on-navy">PANEL ADMINISTRATIVO</p>
        </div>

        <div className="mt-6 lg:mt-0">
          <div className="h-[3px] w-[44px] rounded-[2px] bg-brand-accent lg:w-[72px]" />

          <p className="mt-3 font-inter text-[16px] font-semibold leading-snug text-white lg:hidden">
            Gestión clara para una atención mejor.
          </p>
          <p className="mt-6 hidden font-inter text-[34px] font-bold leading-[1.22] text-white lg:block">
            <span className="block">Gestión clara para</span>
            <span className="block">una atención mejor.</span>
          </p>

          <p className="mt-5 hidden max-w-[360px] font-inter text-[14px] leading-[1.6] text-admin-on-navy lg:block">
            Administra el contenido, la publicación y la atención de Viajes Carolina desde un solo lugar.
          </p>
        </div>

        <div className="hidden lg:block">
          <p className="font-inter text-[12px] font-semibold text-white">
            Acceso exclusivo para el equipo autorizado.
          </p>
          <p className="mt-1.5 font-inter text-[11px] text-admin-on-navy">
            Cada ingreso y modificación queda registrado.
          </p>
        </div>
      </div>
    </aside>
  );
};
