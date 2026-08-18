import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: { params: Promise<{ filename: string }> }) {
  const { filename } = await context.params;
  const cleanName = decodeURIComponent(filename || "").replace(/\.[^/.]+$/, "").replace(/-/g, " ");
  const title = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

  // Determinar paleta de color según el nombre
  let bgGradient = "linear-gradient(135deg, #102432 0%, #1b2a38 50%, #2980b9 100%)";
  let accentColor = "#ff7900";
  let icon = "✈️";

  if (filename.includes("cartagena") || filename.includes("playa") || filename.includes("punta-cana")) {
    bgGradient = "linear-gradient(135deg, #0f4c75 0%, #1b2a38 40%, #ff7900 100%)";
    accentColor = "#ffb238";
    icon = "🏖️";
  } else if (filename.includes("cusco") || filename.includes("machupicchu") || filename.includes("cultura")) {
    bgGradient = "linear-gradient(135deg, #1b2a38 0%, #2980b9 50%, #d4af37 100%)";
    accentColor = "#d4af37";
    icon = "🏛️";
  } else if (filename.includes("iquitos") || filename.includes("selva") || filename.includes("aventura")) {
    bgGradient = "linear-gradient(135deg, #0d3b2e 0%, #1b2a38 50%, #25d366 100%)";
    accentColor = "#25d366";
    icon = "🌴";
  } else if (filename.includes("carolina") || filename.includes("lucia") || filename.includes("valeria") || filename.includes("asesora")) {
    bgGradient = "linear-gradient(135deg, #1b2a38 0%, #2b3a4a 100%)";
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
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="10" stdDeviation="15" flood-opacity="0.3"/>
      </filter>
    </defs>
    
    <rect width="100%" height="100%" fill="url(#bg)"/>
    
    <!-- Decorative travel lines -->
    <path d="M-100,600 Q300,300 800,500 T1300,200" fill="none" stroke="${accentColor}" stroke-width="2" stroke-dasharray="8,8" opacity="0.4"/>
    <path d="M-100,700 Q400,450 900,650 T1300,350" fill="none" stroke="#2980b9" stroke-width="1.5" opacity="0.3"/>
    
    <!-- Central Card -->
    <g transform="translate(600, 400)">
      <circle r="70" fill="#ffffff" fill-opacity="0.08" stroke="#ffffff" stroke-width="1.5"/>
      <text y="15" text-anchor="middle" font-size="48" font-family="system-ui, -apple-system, sans-serif">${icon}</text>
      
      <text y="120" text-anchor="middle" fill="#ffffff" font-size="34" font-weight="700" font-family="'Sora', system-ui, sans-serif" letter-spacing="-0.5">${title}</text>
      <text y="160" text-anchor="middle" fill="${accentColor}" font-size="16" font-weight="600" font-family="'Inter', system-ui, sans-serif" letter-spacing="3" text-transform="uppercase">Viajes Carolina · Destinos de Calidad</text>
    </g>
    
    <!-- Brand mark bottom left -->
    <g transform="translate(50, 750)">
      <text fill="#ffffff" fill-opacity="0.6" font-size="14" font-family="'Inter', system-ui, sans-serif" font-weight="500">VIAJES CAROLINA · AGENCIA DE VIAJES EXCLUSIVA</text>
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
