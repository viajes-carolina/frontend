"use client";

import React from "react";
import { TravelAdvisorDTO } from "@vc/api-client";
import { Button } from "@vc/ui";

export interface AdvisorListProps {
  advisors: TravelAdvisorDTO[];
  onEdit: (advisor: TravelAdvisorDTO) => void;
  onDelete: (id: number) => void;
  onCreate: () => void;
}

export function AdvisorList({ advisors, onEdit, onDelete, onCreate }: AdvisorListProps) {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div>
          <h3 className="font-sora font-bold text-lg text-white">
            Equipo de Asesoras ({advisors.length})
          </h3>
          <p className="text-xs text-slate-400">
            Gestiona los perfiles del equipo y sus canales de WhatsApp directo.
          </p>
        </div>
        <Button type="button" variant="primary" onClick={onCreate} className="text-xs">
          + Nueva Asesora
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {advisors.map((advisor) => (
          <div
            key={advisor.id}
            className={`bg-slate-900 border rounded-2xl p-5 flex flex-col justify-between space-y-4 ${
              advisor.active ? "border-slate-800" : "border-red-900/40 opacity-70"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
                  <img
                    src={advisor.photoMediaUrl || "/media/demo-cartagena-caribe.webp"}
                    alt={advisor.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-sora font-bold text-sm text-white flex items-center gap-2">
                    {advisor.fullName}
                    {!advisor.active && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-900/60 text-red-300 font-normal">
                        Inactiva
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-brand-accent font-semibold">{advisor.roleTitle}</p>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <p className="text-slate-300">
                  <strong className="text-slate-400 font-medium">Especialidad:</strong> {advisor.specialty}
                </p>
                <p className="text-slate-300 line-clamp-2">
                  <strong className="text-slate-400 font-medium">Bio:</strong> {advisor.bio}
                </p>
                <p className="text-slate-400">
                  <strong className="text-slate-400 font-medium">WhatsApp:</strong> {advisor.whatsappPhone || "No asignado"}
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => onEdit(advisor)}
                className="flex-1 justify-center !py-1.5 text-xs text-brand-accent border-brand-accent/40"
              >
                Editar
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={() => onDelete(advisor.id)}
                className="!py-1.5 text-xs px-3"
              >
                Eliminar
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
