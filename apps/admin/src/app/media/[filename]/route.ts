import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: { params: Promise<{ filename: string }> }) {
  const { filename } = await context.params;
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
