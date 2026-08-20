export const BRAND_CONFIG = {
  name: "Viajes Carolina",
  tagline: "El viaje comienza aquí",
  colors: {
    navy: "#1B2A38",
    blue: "#2980B9",
    accent: "#FF7900",
    sunset: "#FFB238",
    whatsapp: "#25D366",
    twilight: "#102432",
    sky: "#DFF3FF",
    cloud: "#F9FCFF",
    sea: "#77C5E8",
    sand: "#FFF3DF",
  },
  typography: {
    headings: "Sora, sans-serif",
    body: "Inter, sans-serif",
  },
} as const;

// Tasa de referencia USD -> PEN usada solo para sugerir un precio inicial editable
// en el panel admin y en los datos de demo/fallback; no es un tipo de cambio en vivo.
export const USD_TO_PEN_RATE = 3.7;

// Fallbacks de contacto usados solo cuando SiteSettingsDTO/OfficeLocationDTO aún no
// cargó (ej. primer render antes de la hidratación); la fuente real siempre es la API.
export const DEFAULT_WHATSAPP_PHONE = "+51987654321";
export const DEFAULT_PRIMARY_PHONE = "+51 987 654 321";
export const DEFAULT_CONTACT_EMAIL = "contacto@viajescarolina.com";
export const DEFAULT_OFFICE_ADDRESS_LINE = "Av. Larco 101, Oficina 502";
export const DEFAULT_OFFICE_DISTRICT = "Miraflores";
export const DEFAULT_OFFICE_CITY = "Lima";
export const DEFAULT_OFFICE_SCHEDULE_WEEKDAYS = "Lunes a Viernes: 9:00 AM – 7:00 PM";
export const DEFAULT_OFFICE_SCHEDULE_SATURDAYS = "Sábados: 9:00 AM – 2:00 PM";
export const DEFAULT_FACEBOOK_URL = "https://facebook.com/viajescarolina";
export const DEFAULT_INSTAGRAM_URL = "https://instagram.com/viajescarolina";
export const DEFAULT_TIKTOK_URL = "https://tiktok.com/@viajescarolina";
