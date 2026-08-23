export default function InicioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-sora font-extrabold text-3xl text-brand-navy">
          Inicio · Contenido y Secciones de Portada
        </h1>
        <p className="font-inter text-neutral-muted text-sm mt-1">
          Administra el copy de cada sección de Inicio: hero principal, Promociones, inspiración desde el
          blog, Pausa Conversacional, Experiencias y Preguntas Frecuentes.
        </p>
      </div>

      {children}
    </div>
  );
}
