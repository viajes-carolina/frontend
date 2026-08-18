import Link from "next/link";
import {
  Button,
  MapPinIcon,
  WhatsAppIcon,
  ArrowUpRightIcon,
  ImageIcon,
  PlaneIcon,
  CompassIcon,
  SunIcon,
  StarIcon,
  MailIcon,
} from "@vc/ui";
import { apiClient } from "@vc/api-client";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    siteSettings,
    office,
    mediaData,
    homeHero,
    intentions,
    promotions,
    testimonials,
    faqs,
    inquiries,
  ] = await Promise.all([
    apiClient.getSiteSettings(),
    apiClient.getOfficeLocation(),
    apiClient.getMediaList(0, 10),
    apiClient.getHomeHero(),
    apiClient.getAdminTravelIntentions(),
    apiClient.getAdminPromotions(),
    apiClient.getTestimonials(),
    apiClient.getFaqs(),
    apiClient.getAdminInquiries(),
  ]);

  const newInquiriesCount = inquiries.filter((i) => i.status === "NEW").length;

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-border">
        <div>
          <h1 className="font-sora font-bold text-2xl text-brand-navy">
            Panel de Control · {siteSettings.siteName}
          </h1>
          <p className="font-inter text-neutral-muted text-sm mt-1">
            Gestión centralizada de contenidos, testimonios, FAQ, promociones, medios, leads e identidad.
          </p>
        </div>
        <div className="flex gap-3">
          <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" icon={<ArrowUpRightIcon size={16} />}>
              Ver Web Pública
            </Button>
          </a>
        </div>
      </header>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card: Contacto & Leads (Corte 9) */}
        <Link
          href="/contacto"
          className="group bg-white p-6 rounded-2xl border border-neutral-border hover:border-brand-accent/50 shadow-sm transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-brand-accent">
                Corte 9 · Leads & Consultas
              </span>
              <div className="p-2 rounded-xl bg-brand-accent/10 text-brand-accent relative">
                <MailIcon size={20} />
                {newInquiriesCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                )}
              </div>
            </div>
            <h3 className="font-sora font-bold text-base text-brand-navy group-hover:text-brand-accent transition-colors">
              Bandeja de Consultas
            </h3>
            <p className="font-inter text-neutral-muted text-xs mt-2 leading-relaxed">
              {inquiries.length} solicitudes recibidas ({newInquiriesCount} nuevas por atender).
            </p>
          </div>
          <span className="text-xs font-semibold text-brand-accent mt-4 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Ver Bandeja de Leads &rarr;
          </span>
        </Link>

        {/* Card: Inicio & Hero (Corte 4) */}
        <Link
          href="/inicio"
          className="group bg-white p-6 rounded-2xl border border-neutral-border hover:border-brand-accent/50 shadow-sm transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-brand-accent">
                Corte 4 · Inicio
              </span>
              <div className="p-2 rounded-xl bg-brand-accent/10 text-brand-accent">
                <PlaneIcon size={20} />
              </div>
            </div>
            <h3 className="font-sora font-bold text-base text-brand-navy group-hover:text-brand-accent transition-colors">
              Hero Principal
            </h3>
            <p className="font-inter text-neutral-muted text-xs mt-2 leading-relaxed">
              "{homeHero.titleHighlight} {homeHero.titleAccent}"
            </p>
          </div>
          <span className="text-xs font-semibold text-brand-accent mt-4 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Editar Hero &rarr;
          </span>
        </Link>

        {/* Card: Promociones & Paquetes (Corte 6) */}
        <Link
          href="/promociones"
          className="group bg-white p-6 rounded-2xl border border-neutral-border hover:border-brand-sunset/50 shadow-sm transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-brand-sunset">
                Corte 6 · Catálogo
              </span>
              <div className="p-2 rounded-xl bg-brand-sunset/10 text-brand-sunset">
                <SunIcon size={20} />
              </div>
            </div>
            <h3 className="font-sora font-bold text-base text-brand-navy group-hover:text-brand-sunset transition-colors">
              Promociones & Paquetes
            </h3>
            <p className="font-inter text-neutral-muted text-xs mt-2 leading-relaxed">
              {promotions.length} paquetes y ofertas activas en catálogo.
            </p>
          </div>
          <span className="text-xs font-semibold text-brand-sunset mt-4 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Gestionar Promociones &rarr;
          </span>
        </Link>

        {/* Card: Intenciones de Viaje (Corte 5) */}
        <Link
          href="/intenciones"
          className="group bg-white p-6 rounded-2xl border border-neutral-border hover:border-brand-accent/50 shadow-sm transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-brand-accent">
                Corte 5 · Intenciones
              </span>
              <div className="p-2 rounded-xl bg-brand-accent/10 text-brand-accent">
                <CompassIcon size={20} />
              </div>
            </div>
            <h3 className="font-sora font-bold text-base text-brand-navy group-hover:text-brand-accent transition-colors">
              Intenciones de Viaje
            </h3>
            <p className="font-inter text-neutral-muted text-xs mt-2 leading-relaxed">
              {intentions.length} experiencias activas en portada.
            </p>
          </div>
          <span className="text-xs font-semibold text-brand-accent mt-4 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Gestionar Intenciones &rarr;
          </span>
        </Link>

        {/* Card: Confianza, Testimonios & FAQ (Corte 7) */}
        <Link
          href="/confianza"
          className="group bg-white p-6 rounded-2xl border border-neutral-border hover:border-amber-500/50 shadow-sm transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-600">
                Corte 7 · Confianza
              </span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <StarIcon size={20} />
              </div>
            </div>
            <h3 className="font-sora font-bold text-base text-brand-navy group-hover:text-amber-600 transition-colors">
              Testimonios & FAQ
            </h3>
            <p className="font-inter text-neutral-muted text-xs mt-2 leading-relaxed">
              {testimonials.length} testimonios verificados y {faqs.length} preguntas frecuentes.
            </p>
          </div>
          <span className="text-xs font-semibold text-amber-600 mt-4 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Gestionar Confianza &rarr;
          </span>
        </Link>

        {/* Card: Nosotros & Asesoras (Corte 8) */}
        <Link
          href="/nosotros"
          className="group bg-white p-6 rounded-2xl border border-neutral-border hover:border-brand-accent/50 shadow-sm transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-brand-accent">
                Corte 8 · Nosotros
              </span>
              <div className="p-2 rounded-xl bg-brand-accent/10 text-brand-accent">
                <CompassIcon size={20} />
              </div>
            </div>
            <h3 className="font-sora font-bold text-base text-brand-navy group-hover:text-brand-accent transition-colors">
              Nosotros & Asesoras
            </h3>
            <p className="font-inter text-neutral-muted text-xs mt-2 leading-relaxed">
              Historia institucional, misión, visión y equipo de asesoras.
            </p>
          </div>
          <span className="text-xs font-semibold text-brand-accent mt-4 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Gestionar Nosotros &rarr;
          </span>
        </Link>

        {/* Card: Biblioteca de Medios (Corte 3) */}
        <Link
          href="/medios"
          className="group bg-white p-6 rounded-2xl border border-neutral-border hover:border-brand-primary/60 shadow-sm transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-brand-primary">
                Corte 3 · Medios
              </span>
              <div className="p-2 rounded-xl bg-brand-primary/10 text-brand-primary">
                <ImageIcon size={20} />
              </div>
            </div>
            <h3 className="font-sora font-bold text-base text-brand-navy group-hover:text-brand-primary transition-colors">
              Biblioteca de Medios
            </h3>
            <p className="font-inter text-neutral-muted text-xs mt-2 leading-relaxed">
              {mediaData.total || 0} activos optimizados en WebP.
            </p>
          </div>
          <span className="text-xs font-semibold text-brand-primary mt-4 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Abrir Galería &rarr;
          </span>
        </Link>

        {/* Card: Identidad & WhatsApp (Corte 1) */}
        <Link
          href="/identidad"
          className="group bg-white p-6 rounded-2xl border border-neutral-border hover:border-brand-accent/50 shadow-sm transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-brand-accent">
                Corte 1 · Identidad
              </span>
              <div className="p-2 rounded-xl bg-brand-whatsapp/10 text-brand-whatsapp">
                <WhatsAppIcon size={20} />
              </div>
            </div>
            <h3 className="font-sora font-bold text-base text-brand-navy group-hover:text-brand-accent transition-colors">
              Canal WhatsApp & Marca
            </h3>
            <p className="font-inter text-neutral-muted text-xs mt-2 leading-relaxed">
              {siteSettings.whatsappPhone}
            </p>
          </div>
          <span className="text-xs font-semibold text-brand-accent mt-4 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Editar Identidad &rarr;
          </span>
        </Link>

        {/* Card: Oficina & Horarios (Corte 2) */}
        <Link
          href="/oficina"
          className="group bg-white p-6 rounded-2xl border border-neutral-border hover:border-brand-accent/50 shadow-sm transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-brand-accent">
                Corte 2 · Oficina
              </span>
              <div className="p-2 rounded-xl bg-brand-navy/10 text-brand-navy">
                <MapPinIcon size={20} />
              </div>
            </div>
            <h3 className="font-sora font-bold text-base text-brand-navy group-hover:text-brand-accent transition-colors">
              Oficina & Horarios
            </h3>
            <p className="font-inter text-neutral-muted text-xs mt-2 leading-relaxed">
              {office.district}, {office.city}
            </p>
          </div>
          <span className="text-xs font-semibold text-brand-accent mt-4 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Editar Ubicación &rarr;
          </span>
        </Link>
      </div>
    </div>
  );
}
