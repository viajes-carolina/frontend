import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

function findMediaFile(filename: string): { buffer: Buffer; contentType: string } | null {
  const possibleDirs = [
    path.resolve(process.cwd(), ".data", "media"),
    path.resolve(process.cwd(), "public", "media"),
    path.resolve(process.cwd(), "..", "..", ".data", "media"),
    path.resolve(process.cwd(), "..", "web", "public", "media"),
    path.resolve(process.cwd(), "..", "admin", "public", "media"),
  ];

  for (const dir of possibleDirs) {
    const fullPath = path.join(dir, filename);
    if (fs.existsSync(fullPath)) {
      try {
        const buffer = fs.readFileSync(fullPath);
        const ext = path.extname(filename).toLowerCase();
        let contentType = "image/webp";
        if (ext === ".png") contentType = "image/png";
        else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
        else if (ext === ".svg") contentType = "image/svg+xml";
        else if (ext === ".gif") contentType = "image/gif";
        return { buffer, contentType };
      } catch {
        // ignore
      }
    }
  }
  return null;
}

export async function GET(req: NextRequest, context: { params: Promise<{ filename: string }> }) {
  const { filename } = await context.params;

  // 1. Check if real file exists on disk
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

  // 2. Dynamic SVG Fallback for demo placeholders
  const cleanName = decodeURIComponent(filename || "").replace(/\.[^/.]+$/, "").replace(/-/g, " ");
  const title = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

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

  const svg = `
  <svg width="1200" height="800" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#102432" />
        <stop offset="50%" stop-color="#1b2a38" />
        <stop offset="100%" stop-color="${accentColor}" stop-opacity="0.7" />
      </linearGradient>
    </defs>
    
    <rect width="100%" height="100%" fill="url(#bg)"/>
    
    <g transform="translate(600, 400)">
      <circle r="70" fill="#ffffff" fill-opacity="0.08" stroke="#ffffff" stroke-width="1.5"/>
      <text y="15" text-anchor="middle" font-size="48" font-family="system-ui, -apple-system, sans-serif">${icon}</text>
      
      <text y="120" text-anchor="middle" fill="#ffffff" font-size="34" font-weight="700" font-family="'Sora', system-ui, sans-serif" letter-spacing="-0.5">${title}</text>
      <text y="160" text-anchor="middle" fill="${accentColor}" font-size="16" font-weight="600" font-family="'Inter', system-ui, sans-serif" letter-spacing="3" text-transform="uppercase">Viajes Carolina · Destinos de Calidad</text>
    </g>
    
    <g transform="translate(50, 750)">
      <text fill="#ffffff" fill-opacity="0.6" font-size="14" font-family="'Inter', system-ui, sans-serif" font-weight="500">VIAJES CAROLINA · PANEL DE CONTROL</text>
    </g>
  </svg>
  `.trim();

  return new NextResponse(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
