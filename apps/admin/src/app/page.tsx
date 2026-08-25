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
    promotions,
    testimonials,
    faqs,
    blogPosts,
    claims,
    users,
    auditLogs,
  ] = await Promise.all([
    apiClient.getSiteSettings(),
    apiClient.getOfficeLocation(),
    apiClient.getMediaList(0, 10),
    apiClient.getHomeHero(),
    apiClient.getAdminPromotions(),
    apiClient.getTestimonials(),
    apiClient.getFaqs(),
    apiClient.getAdminBlogPosts(),
    apiClient.getAdminClaims(),
    apiClient.getAdminUsers(),
    apiClient.getAuditLogs("ALL", 10),
  ]);

  const pendingClaimsCount = claims.filter((c) => c.status === "PENDING").length;

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-border">
        <div>
          <h1 className="font-sora font-bold text-2xl text-brand-navy">
            Panel de Control · {siteSettings.siteName}
          </h1>
          <p className="font-inter text-neutral-muted text-sm mt-1">
            Gestión centralizada de contenidos, testimonios, FAQ, promociones, medios e identidad.
          </p>
        </div>
        <div className="flex gap-3">
          <a href={process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" icon={<ArrowUpRightIcon size={16} />}>
              Ver Web Pública
            </Button>
          </a>
        </div>
      </header>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card: Blog & Contenidos (Corte 10) */}
        <Link
          href="/blog"
          className="group bg-white p-6 rounded-2xl border border-neutral-border hover:border-brand-accent/50 shadow-sm transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-brand-accent">
                Corte 10 · CMS Blog
              </span>
              <div className="p-2 rounded-xl bg-brand-accent/10 text-brand-accent">
                <span>✍️</span>
              </div>
            </div>
            <h3 className="font-sora font-bold text-base text-brand-navy group-hover:text-brand-accent transition-colors">
              Blog & Contenidos
            </h3>
            <p className="font-inter text-neutral-muted text-xs mt-2 leading-relaxed">
              {blogPosts.length} artículos publicados y en borrador con búsqueda trigram.
            </p>
          </div>
          <span className="text-xs font-semibold text-brand-accent mt-4 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Administrar CMS &rarr;
          </span>
        </Link>

        {/* Card: Libro de Reclamaciones (Corte 13) */}
        <Link
          href="/reclamaciones"
          className="group bg-white p-6 rounded-2xl border border-neutral-border hover:border-amber-500/50 shadow-sm transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-600">
                Corte 13 · Reclamaciones
              </span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600 relative">
                <span>📖</span>
                {pendingClaimsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                )}
              </div>
            </div>
            <h3 className="font-sora font-bold text-base text-brand-navy group-hover:text-amber-600 transition-colors">
              Libro de Reclamaciones
            </h3>
            <p className="font-inter text-neutral-muted text-xs mt-2 leading-relaxed">
              {claims.length} hojas registradas ({pendingClaimsCount} pendientes de respuesta).
            </p>
          </div>
          <span className="text-xs font-semibold text-amber-600 mt-4 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Atender Reclamos &rarr;
          </span>
        </Link>

        {/* Card: Usuarios & Roles RBAC (Corte 14) */}
        <Link
          href="/usuarios"
          className="group bg-white p-6 rounded-2xl border border-neutral-border hover:border-purple-500/50 shadow-sm transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-purple-600">
                Corte 14 · Seguridad & RBAC
              </span>
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <span>🛡️</span>
              </div>
            </div>
            <h3 className="font-sora font-bold text-base text-brand-navy group-hover:text-purple-600 transition-colors">
              Usuarios & Gobernanza
            </h3>
            <p className="font-inter text-neutral-muted text-xs mt-2 leading-relaxed">
              {users.length} operadores registrados con permisos por rol y hashing Argon2id.
            </p>
          </div>
          <span className="text-xs font-semibold text-purple-600 mt-4 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Gestionar Operadores &rarr;
          </span>
        </Link>

        {/* Card: Bitácora de Auditoría (Corte 14) */}
        <Link
          href="/auditoria"
          className="group bg-white p-6 rounded-2xl border border-neutral-border hover:border-blue-500/50 shadow-sm transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-blue-600">
                Corte 14 · Trazabilidad
              </span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <span>📋</span>
              </div>
            </div>
            <h3 className="font-sora font-bold text-base text-brand-navy group-hover:text-blue-600 transition-colors">
              Bitácora de Auditoría
            </h3>
            <p className="font-inter text-neutral-muted text-xs mt-2 leading-relaxed">
              Trazabilidad inmutable de mutaciones y accesos con hashing SHA-256 de IP.
            </p>
          </div>
          <span className="text-xs font-semibold text-blue-600 mt-4 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Ver Registro de Eventos &rarr;
          </span>
        </Link>

        {/* Card: Publicación ISR & Caché (Corte 15) */}
        <Link
          href="/publicacion"
          className="group bg-white p-6 rounded-2xl border border-neutral-border hover:border-emerald-500/50 shadow-sm transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-emerald-600">
                Corte 15 · Despliegue & ISR
              </span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <span>🚀</span>
              </div>
            </div>
            <h3 className="font-sora font-bold text-base text-brand-navy group-hover:text-emerald-600 transition-colors">
              Publicación On-Demand
            </h3>
            <p className="font-inter text-neutral-muted text-xs mt-2 leading-relaxed">
              Invalida la caché de Next.js y actualiza el sitio en vivo sin redeploy.
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-600 mt-4 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Control de Caché &rarr;
          </span>
        </Link>
        {/* Card: Página de Contacto (Corte 9) */}
        <Link
          href="/contacto"
          className="group bg-white p-6 rounded-2xl border border-neutral-border hover:border-brand-accent/50 shadow-sm transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-brand-accent">
                Corte 9 · Contacto
              </span>
              <div className="p-2 rounded-xl bg-brand-accent/10 text-brand-accent">
                <MailIcon size={20} />
              </div>
            </div>
            <h3 className="font-sora font-bold text-base text-brand-navy group-hover:text-brand-accent transition-colors">
              Página de Contacto
            </h3>
            <p className="font-inter text-neutral-muted text-xs mt-2 leading-relaxed">
              Hero, &quot;Cómo empezar&quot; y sección de oficina — toda la conversión pasa por WhatsApp.
            </p>
          </div>
          <span className="text-xs font-semibold text-brand-accent mt-4 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Editar Contacto &rarr;
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

        {/* Card: Promociones en Inicio (Corte 6) */}
        <Link
          href="/inicio/promociones"
          className="group bg-white p-6 rounded-2xl border border-neutral-border hover:border-brand-sunset/50 shadow-sm transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-brand-sunset">
                Corte 6 · Visibilidad
              </span>
              <div className="p-2 rounded-xl bg-brand-sunset/10 text-brand-sunset">
                <SunIcon size={20} />
              </div>
            </div>
            <h3 className="font-sora font-bold text-base text-brand-navy group-hover:text-brand-sunset transition-colors">
              Promociones en Inicio
            </h3>
            <p className="font-inter text-neutral-muted text-xs mt-2 leading-relaxed">
              {promotions.filter((p) => p.active).length} de {promotions.length} promociones visibles en portada.
            </p>
          </div>
          <span className="text-xs font-semibold text-brand-sunset mt-4 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Elegir Promociones &rarr;
          </span>
        </Link>

        {/* Card: Testimonios (ahora dentro de Inicio & Hero > Experiencias) */}
        <Link
          href="/inicio/experiencias"
          className="group bg-white p-6 rounded-2xl border border-neutral-border hover:border-amber-500/50 shadow-sm transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-600">
                Experiencias
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
            Ir a Experiencias &rarr;
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
          className="group bg-white p-6 rounded-2xl border border-neutral-border hover:border-brand-accent/60 shadow-sm transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-brand-accent">
                Corte 3 · Medios
              </span>
              <div className="p-2 rounded-xl bg-brand-accent/10 text-brand-accent">
                <ImageIcon size={20} />
              </div>
            </div>
            <h3 className="font-sora font-bold text-base text-brand-navy group-hover:text-brand-accent transition-colors">
              Biblioteca de Medios
            </h3>
            <p className="font-inter text-neutral-muted text-xs mt-2 leading-relaxed">
              {mediaData.total || 0} activos optimizados en WebP.
            </p>
          </div>
          <span className="text-xs font-semibold text-brand-accent mt-4 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
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
          href="/contacto/oficina"
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
