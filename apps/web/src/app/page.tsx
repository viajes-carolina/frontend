import { Button, WhatsAppButton, JourneyConnector, ArrowUpRightIcon, PlaneIcon, CheckIcon } from "@vc/ui";
import { apiClient } from "@vc/api-client";

export default async function HomePage() {
  const siteSettings = await apiClient.getSiteSettings();

  return (
    <main className="min-h-screen bg-atmosphere-twilight text-white flex flex-col items-center">
      {/* =========================================================================
          02 · Hero Section (Figma: 07 — Inicio · Desktop & 11 — Mobile)
          ========================================================================= */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 md:pt-20 pb-16 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        
        {/* Left Column: Copy & Actions */}
        <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
          
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-navy border border-brand-sunset/30 mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
            <span className="font-sora text-xs font-bold uppercase tracking-[0.08em] text-brand-sunset">
              Empieza con una conversación
            </span>
          </div>

          {/* H1 Display: Sora ExtraBold 52px */}
          <h1 className="font-sora font-extrabold text-4xl sm:text-5xl lg:text-[52px] leading-[1.12] tracking-[-0.025em] text-white mb-6">
            Tu viaje comienza{" "}
            <span className="text-brand-accent">antes de despegar</span>
          </h1>

          {/* Body: Inter Regular 18px */}
          <p className="font-inter text-atmosphere-sky text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
            Desde la primera idea hasta tu regreso, una asesora te acompaña con opciones claras, atención humana y respaldo en cada etapa.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
            <WhatsAppButton
              size="lg"
              phone={siteSettings.whatsappPhone}
              message="Hola Viajes Carolina, quiero empezar a planear mi próximo viaje."
              className="w-full sm:w-auto"
            >
              Cuéntame tu viaje
            </WhatsAppButton>

            <a href="#promociones" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="lg"
                icon={<ArrowUpRightIcon size={18} />}
                className="w-full sm:w-auto"
              >
                Explorar promociones
              </Button>
            </a>
          </div>

          {/* Trust Line */}
          <div className="pt-6 border-t border-white/10 w-full">
            <p className="font-sora text-[11px] sm:text-xs font-bold tracking-[0.1em] text-neutral-subtle uppercase flex flex-wrap items-center gap-2 sm:gap-3">
              <span>Asesoría sin costo</span>
              <span className="text-brand-accent">·</span>
              <span>Respuesta rápida</span>
              <span className="text-brand-accent">·</span>
              <span>Acompañamiento real</span>
            </p>
          </div>
        </div>

        {/* Right Column: Destination Postcard & Visual Window */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative">
          
          {/* Decorative Glow & Golden Sun */}
          <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-brand-sunset/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full bg-brand-accent/10 blur-3xl pointer-events-none" />

          {/* Postcard Container */}
          <div className="relative w-full max-w-md bg-brand-navy border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden group hover:border-brand-accent/40 transition-all duration-300">
            
            {/* Visual Image Header / Window */}
            <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden bg-gradient-to-br from-brand-blue/30 to-brand-navy mb-5 flex flex-col justify-between p-5 border border-white/10">
              
              {/* Badge */}
              <div className="self-start px-3 py-1 rounded-full bg-brand-navy/80 backdrop-blur-md border border-white/20 text-white font-sora text-xs font-bold tracking-wider uppercase">
                Próxima Parada · Cusco
              </div>

              {/* Central Graphic Simulation */}
              <div className="flex flex-col items-center justify-center my-auto">
                <div className="w-16 h-16 rounded-2xl bg-brand-accent/20 border border-brand-accent/40 flex items-center justify-center text-brand-accent mb-3 group-hover:scale-110 transition-transform duration-300">
                  <PlaneIcon size={32} />
                </div>
                <span className="font-sora font-bold text-xl text-white tracking-tight">
                  Machu Picchu & Valle Sagrado
                </span>
                <span className="font-inter text-xs text-atmosphere-sky mt-1">
                  Experiencia personalizada de 5 días / 4 noches
                </span>
              </div>

              {/* Bottom pill */}
              <div className="flex items-center justify-between text-xs font-inter text-white/90 bg-brand-navy/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10">
                <span>Desde Lima</span>
                <span className="text-brand-sunset font-sora font-bold text-sm">Desde S/ 1,922</span>
              </div>
            </div>

            {/* Postcard Caption */}
            <div className="flex flex-col text-left">
              <h3 className="font-sora font-bold text-xl text-white mb-1.5">
                Tu historia puede empezar aquí
              </h3>
              <p className="font-inter text-neutral-subtle text-sm leading-relaxed mb-4">
                Vuelos confirmados + hoteles seleccionados + asesoría permanente antes, durante y después del viaje.
              </p>

              <div className="flex items-center gap-2 text-xs font-inter text-emerald-400 font-medium">
                <CheckIcon size={16} />
                <span>Salidas disponibles para esta temporada 2026</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          03 · Journey Connector (Figma: 06 — Journey Connector)
          ========================================================================= */}
      <div className="w-full max-w-5xl px-4 my-6">
        <JourneyConnector />
      </div>

      {/* Continue journey cue */}
      <div className="flex flex-col items-center gap-2 pb-16 opacity-70 hover:opacity-100 transition-opacity">
        <div className="w-0.5 h-8 bg-gradient-to-b from-transparent to-brand-sunset" />
        <span className="font-sora text-[10px] font-bold tracking-[0.15em] text-brand-sunset uppercase">
          Sigue bajando · El viaje recién comienza
        </span>
      </div>
    </main>
  );
}
