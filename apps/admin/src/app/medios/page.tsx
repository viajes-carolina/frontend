import { MediaGallery } from "./MediaGallery";

export const dynamic = "force-dynamic";

export default function MediaLibraryPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-sora font-extrabold text-3xl text-brand-navy">
          Biblioteca de Medios
        </h1>
        <p className="font-inter text-neutral-muted text-sm mt-1">
          Administra imágenes, fotografías de promociones y configura el punto focal interactivo para vistas responsivas óptimas.
        </p>
      </div>

      <MediaGallery />
    </div>
  );
}
