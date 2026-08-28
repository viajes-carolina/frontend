import { Suspense } from "react";
import { Skeleton } from "@vc/ui";
import { HeroPreviewCard } from "./HeroPreviewCard";

export const dynamic = "force-dynamic";

export default function InicioHeroLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-8">
      {/* Vista previa simplificada — el Hero real es marfil con collage de 3 fotos,
          esta tarjeta solo confirma texto/CTA y la foto principal, no replica el collage completo */}
      <Suspense fallback={<Skeleton className="h-40 w-full rounded-2xl" />}>
        <HeroPreviewCard />
      </Suspense>

      {children}
    </div>
  );
}
