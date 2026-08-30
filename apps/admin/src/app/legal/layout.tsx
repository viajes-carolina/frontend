export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-sora font-extrabold text-3xl text-brand-navy">Páginas Legales</h1>
        <p className="font-inter text-neutral-muted text-sm mt-1">
          Administra el copy de Términos y condiciones, Política de privacidad, Política de cookies, Compromiso
          contra la ESNNA y Constancia MINCETUR.
        </p>
      </div>

      {children}
    </div>
  );
}
