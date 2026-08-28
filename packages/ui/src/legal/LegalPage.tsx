import React from "react";

export interface LegalPageProps {
  eyebrow: string;
  title: string;
  intro: string;
  contactEmail?: string;
  legalCompanyName?: string;
  taxId?: string;
}

// Página legal mínima y honesta: mientras el equipo redacta el texto
// definitivo, no se inventa contenido vinculante — solo se explica el
// estado actual y se ofrece un canal de contacto real.
export const LegalPage: React.FC<LegalPageProps> = ({
  eyebrow,
  title,
  intro,
  contactEmail,
  legalCompanyName,
  taxId,
}) => {
  return (
    <main className="w-full text-neutral-ink min-h-screen">
      <section className="mx-auto max-w-[760px] px-6 pb-20 pt-28 sm:pt-32">
        <p className="font-inter text-xs font-semibold uppercase tracking-[0.07em] text-brand-accent mb-3">
          {eyebrow}
        </p>
        <h1
          className="font-display text-3xl sm:text-4xl font-semibold text-brand-navy mb-6"
          style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
        >
          {title}
        </h1>

        <p className="font-inter text-base sm:text-lg leading-[1.7] text-neutral-ink/80 mb-6">{intro}</p>

        <p className="font-inter text-base leading-[1.7] text-neutral-ink/80 mb-6">
          Estamos terminando de redactar el texto definitivo de esta página. Mientras tanto, aplicamos buenas
          prácticas de protección de datos e información en todos nuestros canales de atención, y respondemos
          cualquier consulta directamente.
        </p>

        {contactEmail && (
          <p className="font-inter text-base leading-[1.7] text-neutral-ink/80 mb-10">
            Si tienes alguna consulta sobre este tema, escríbenos a{" "}
            <a href={`mailto:${contactEmail}`} className="font-semibold text-brand-navy hover:text-brand-accent transition-colors">
              {contactEmail}
            </a>
            .
          </p>
        )}

        {legalCompanyName && taxId && (
          <p className="font-inter text-[13.5px] leading-[1.6] text-neutral-ink/60 border-t border-neutral-border pt-6">
            {legalCompanyName} · RUC {taxId}
          </p>
        )}
      </section>
    </main>
  );
};
