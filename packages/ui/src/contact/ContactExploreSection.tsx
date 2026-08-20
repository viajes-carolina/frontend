"use client";

import React from "react";
import type { ContactExploreLinkDTO } from "@vc/api-client";

export interface ContactExploreSectionProps {
  links: ContactExploreLinkDTO[];
}

export const ContactExploreSection: React.FC<ContactExploreSectionProps> = ({ links }) => {
  if (!links || links.length === 0) return null;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "BookOpenIcon":
        return "📖";
      case "QuestionMarkCircleIcon":
        return "❓";
      case "MapPinIcon":
        return "📍";
      default:
        return "✨";
    }
  };

  return (
    <section className="py-16 bg-slate-50/80 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-accent/10 text-brand-accent uppercase tracking-wider mb-3">
            Explora & Atención
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Canales de Soporte y Transparencia
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Estamos comprometidos con brindarte la máxima seguridad y respaldo en cada etapa de tu experiencia de viaje.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {links.map((link) => (
            <div
              key={link.id}
              className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-brand-accent/10 text-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-accent/20 transition-all">
                  {getIcon(link.iconName)}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-brand-accent transition-colors">
                  {link.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {link.description}
                </p>
              </div>

              <div>
                <a
                  href={link.targetUrl}
                  target={link.targetUrl.startsWith("http") ? "_blank" : "_self"}
                  rel={link.targetUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-2 text-xs font-bold text-brand-accent hover:text-brand-navy bg-brand-accent/10 hover:bg-brand-accent/20 px-4 py-2.5 rounded-xl transition-all w-full justify-center"
                >
                  <span>{link.buttonText}</span>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
