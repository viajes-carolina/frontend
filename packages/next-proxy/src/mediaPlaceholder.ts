import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export type MediaPlaceholderVariant = "admin" | "web";

function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".svg") return "image/svg+xml";
  if (ext === ".gif") return "image/gif";
  if (ext === ".webp") return "image/webp";
  return "image/webp";
}

// Misma raíz que getDataDir() en proxyHandler.ts: siempre la carpeta ".data" de la raíz
// del monorepo, nunca una copia local por app.
function resolveMediaDir(): string {
  let curr = process.cwd();
  for (let i = 0; i < 4; i++) {
    const pkgJson = path.join(curr, "package.json");
    if (fs.existsSync(pkgJson)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgJson, "utf-8"));
        if (pkg.name === "viajes-carolina-monorepo") {
          return path.join(curr, ".data", "media");
        }
      } catch {
        // ignore
      }
    }
    const parent = path.dirname(curr);
    if (parent === curr) break;
    curr = parent;
  }
  return path.resolve(process.cwd(), ".data", "media");
}

function findMediaFile(filename: string): { buffer: Buffer; contentType: string } | null {
  const decoded = decodeURIComponent(filename || "");

  // Nunca aceptar segmentos que puedan escapar del directorio de medios (path traversal).
  if (!decoded || decoded.includes("..") || path.isAbsolute(decoded)) {
    return null;
  }

  const dir = resolveMediaDir();
  if (!fs.existsSync(dir)) return null;

  const fullPath = path.join(dir, decoded);
  if (fullPath !== dir && !fullPath.startsWith(dir + path.sep)) {
    return null;
  }

  if (fs.existsSync(fullPath)) {
    try {
      if (fs.statSync(fullPath).isFile()) {
        return { buffer: fs.readFileSync(fullPath), contentType: getContentType(fullPath) };
      }
    } catch {
      // ignore
    }
  }

  // Match por prefijo de ID (ej. 1787158399489-*)
  const idPrefixMatch = decoded.match(/^(\d+)-/);
  const idPrefix = idPrefixMatch ? idPrefixMatch[1] : null;
  if (idPrefix) {
    try {
      const files = fs.readdirSync(dir);
      const match = files.find((f) => f.startsWith(`${idPrefix}-`));
      if (match) {
        const matchPath = path.join(dir, match);
        if (fs.existsSync(matchPath) && fs.statSync(matchPath).isFile()) {
          return { buffer: fs.readFileSync(matchPath), contentType: getContentType(matchPath) };
        }
      }
    } catch {
      // ignore
    }
  }
  return null;
}

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || "http://127.0.0.1:8080";

function buildPlaceholderSvg(filename: string, variant: MediaPlaceholderVariant): string {
  let accentColor = "#ff7900";
  let icon = "✈️";

  if (filename.includes("cartagena") || filename.includes("playa") || filename.includes("punta-cana")) {
    accentColor = "#ffb238";
    icon = "🏖️";
  } else if (filename.includes("cusco") || filename.includes("machupicchu") || filename.includes("cultura")) {
    accentColor = "#d4af37";
    icon = "🏛️";
  } else if (filename.includes("iquitos") || filename.includes("selva") || filename.includes("aventura")) {
    accentColor = "#25d366";
    icon = "🌴";
  } else if (filename.includes("carolina") || filename.includes("lucia") || filename.includes("valeria") || filename.includes("asesora")) {
    accentColor = "#ff7900";
    icon = "👩‍💼";
  }

  // Superficie neutra intencional: degradado cálido + ícono de contexto, sin texto de
  // nombre de archivo ni marca de agua — no debe competir visualmente con el contenido
  // real ni leerse como un asset roto. El `alt` accesible vive en el <img>/ResponsiveImage
  // del componente consumidor (título real del destino/artículo), no aquí.
  const decorativeLines = variant === "web"
    ? `<path d="M-100,600 Q300,300 800,500 T1300,200" fill="none" stroke="${accentColor}" stroke-width="2" stroke-dasharray="8,8" opacity="0.35"/>
    <path d="M-100,700 Q400,450 900,650 T1300,350" fill="none" stroke="#2980b9" stroke-width="1.5" opacity="0.25"/>`
    : "";

  return `
  <svg width="1200" height="800" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#102432" />
        <stop offset="50%" stop-color="#1b2a38" />
        <stop offset="100%" stop-color="${accentColor}" stop-opacity="0.6" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#bg)"/>
    ${decorativeLines}
    <g transform="translate(600, 400)">
      <circle r="64" fill="#ffffff" fill-opacity="0.08" stroke="#ffffff" stroke-width="1.5"/>
      <text y="16" text-anchor="middle" font-size="44" font-family="system-ui, -apple-system, sans-serif">${icon}</text>
    </g>
  </svg>
  `.trim();
}

export async function servePlaceholderMedia(
  req: NextRequest,
  params: Promise<{ filename: string }>,
  variant: MediaPlaceholderVariant
) {
  const { filename } = await params;

  // 1. Check if real file exists on disk (semillas de demo copiadas manualmente a .data/media)
  const diskFile = findMediaFile(filename);
  if (diskFile) {
    return new NextResponse(new Uint8Array(diskFile.buffer), {
      status: 200,
      headers: {
        "Content-Type": diskFile.contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  // 2. Los archivos subidos vía backend real viven en su propio disco (viajescarolina.media.storage-dir),
  // no en .data/media — pedirlo directo al backend en vez de caer al placeholder.
  const decoded = decodeURIComponent(filename || "");
  if (decoded && !decoded.includes("..") && !path.isAbsolute(decoded)) {
    try {
      const backendRes = await fetch(`${BACKEND_URL}/api/public/v1/media/${encodeURIComponent(decoded)}/file`);
      if (backendRes.ok) {
        const buffer = Buffer.from(await backendRes.arrayBuffer());
        return new NextResponse(new Uint8Array(buffer), {
          status: 200,
          headers: {
            "Content-Type": backendRes.headers.get("content-type") || getContentType(decoded),
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }
    } catch {
      // Backend inalcanzable — sigue al placeholder SVG.
    }
  }

  // 3. Dynamic SVG Fallback for demo placeholders
  const svg = buildPlaceholderSvg(filename, variant);

  return new NextResponse(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
