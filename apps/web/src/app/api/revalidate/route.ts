import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET || "revalidation-secret-viajes-carolina-2026";

export async function POST(req: NextRequest) {
  try {
    const headerSecret = req.headers.get("x-revalidation-secret");
    let bodySecret = null;
    let tagsOrPaths: string[] = [];

    try {
      const body = await req.json();
      bodySecret = body?.secret;
      if (Array.isArray(body?.tags)) tagsOrPaths = body.tags;
      if (Array.isArray(body?.paths)) tagsOrPaths = [...tagsOrPaths, ...body.paths];
    } catch {
      // Body parsing optional
    }

    const searchSecret = req.nextUrl.searchParams.get("secret");
    const secret = headerSecret || bodySecret || searchSecret;

    if (secret !== REVALIDATION_SECRET) {
      return NextResponse.json({ message: "Token o secreto de revalidación inválido." }, { status: 401 });
    }

    const defaultPaths = ["/", "/promociones", "/blog", "/nosotros", "/contacto", "/reclamaciones", "/buscar"];
    const targets = tagsOrPaths.length > 0 ? tagsOrPaths : defaultPaths;

    const revalidated: string[] = [];
    for (const target of targets) {
      if (target.startsWith("/")) {
        try {
          revalidatePath(target);
          revalidated.push(target);
        } catch (e) {
          console.error(`Error revalidating path ${target}:`, e);
        }
      } else {
        // Tag based or named path
        const mappedPath = target === "home" ? "/" : `/${target}`;
        try {
          revalidatePath(mappedPath);
          revalidated.push(mappedPath);
        } catch {}
      }
    }

    return NextResponse.json({
      revalidated: true,
      message: "Caché ISR invalidada y revalidada exitosamente en Next.js App Router.",
      revalidatedPaths: revalidated,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al revalidar ISR.";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  const pathParam = req.nextUrl.searchParams.get("path") || "/";

  if (secret !== REVALIDATION_SECRET) {
    return NextResponse.json({ message: "Token o secreto de revalidación inválido." }, { status: 401 });
  }

  try {
    revalidatePath(pathParam);
    return NextResponse.json({
      revalidated: true,
      path: pathParam,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al revalidar.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
