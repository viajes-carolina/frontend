import { apiClient } from "@vc/api-client";

export const metadata = {
  title: "Compromiso contra la ESNNA | Viajes Carolina",
  description:
    "Compromiso de Viajes Carolina contra la Explotación Sexual de Niños, Niñas y Adolescentes (ESNNA) en el turismo.",
};

export default async function CompromisoEsnnaPage() {
  const settings = await apiClient.getSiteSettings({ revalidate: 3600 });

  return (
    <main className="w-full bg-surface-ivory text-neutral-ink min-h-screen">
      <section className="mx-auto max-w-[760px] px-6 pb-20 pt-28 sm:pt-32">
        <p className="font-inter text-xs font-semibold uppercase tracking-[0.07em] text-brand-accent mb-3">Legal</p>
        <h1
          className="font-display text-3xl sm:text-4xl font-semibold text-brand-navy mb-6"
          style={{ fontVariationSettings: '"SOFT" 0, "WONK" 1' }}
        >
          Compromiso contra la ESNNA
        </h1>

        <p className="font-inter text-base sm:text-lg leading-[1.7] text-neutral-ink/80 mb-6">
          En Viajes Carolina rechazamos y condenamos toda forma de Explotación Sexual de Niños, Niñas y Adolescentes
          (ESNNA) vinculada al turismo y los viajes, dentro y fuera del Perú.
        </p>

        <p className="font-inter text-base leading-[1.7] text-neutral-ink/80 mb-4">
          Como agencia de viajes y turismo, asumimos el compromiso de:
        </p>
        <ul className="space-y-2.5 mb-6">
          {[
            "No promover, facilitar ni tolerar servicios, contenidos o conductas que expongan a niños, niñas o adolescentes a explotación sexual.",
            "Informar y sensibilizar a nuestro equipo sobre esta problemática y las señales de alerta asociadas al turismo.",
            "Colaborar con las autoridades competentes ante cualquier indicio o denuncia relacionada con estos hechos.",
            "Orientar a nuestros clientes hacia un turismo responsable y respetuoso de los derechos de la niñez y adolescencia.",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5 font-inter text-base leading-[1.6] text-neutral-ink/80">
              <span className="text-brand-accent font-semibold mt-1">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <p className="font-inter text-base leading-[1.7] text-neutral-ink/80 mb-10">
          Si tienes conocimiento de una situación de este tipo, repórtala a las autoridades peruanas competentes
          (Policía Nacional del Perú, Ministerio Público) o escríbenos a{" "}
          {settings.contactEmail && (
            <a
              href={`mailto:${settings.contactEmail}`}
              className="font-semibold text-brand-navy hover:text-brand-accent transition-colors"
            >
              {settings.contactEmail}
            </a>
          )}
          .
        </p>

        {settings.legalCompanyName && settings.taxId && (
          <p className="font-inter text-[13.5px] leading-[1.6] text-neutral-ink/60 border-t border-neutral-border pt-6">
            {settings.legalCompanyName} · RUC {settings.taxId}
          </p>
        )}
      </section>
    </main>
  );
}
