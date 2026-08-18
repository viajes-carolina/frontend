import {
  SiteSettingsDTO,
  OfficeLocationDTO,
  PromotionDTO,
  CreateOrUpdatePromotionRequest,
  BlogPostDTO,
  ApiInfoDTO,
  MediaAssetDTO,
  MediaPageResponse,
  UpdateMediaFocalPointRequest,
  HomeHeroDTO,
  UpdateHomeHeroRequest,
  TravelIntentionDTO,
  CreateOrUpdateTravelIntentionRequest,
  TestimonialDTO,
  CreateOrUpdateTestimonialRequest,
  FaqItemDTO,
  CreateOrUpdateFaqRequest,
  PublicTrustResponse,
  AboutPageDTO,
  UpdateAboutPageRequest,
  TravelAdvisorDTO,
  CreateOrUpdateAdvisorRequest,
  PublicAboutResponse,
} from "./types";

export const DEFAULT_SITE_SETTINGS: SiteSettingsDTO = {
  id: 1,
  siteName: "Viajes Carolina",
  brandTagline: "El viaje comienza aquí",
  contactEmail: "contacto@viajescarolina.com",
  primaryPhone: "+51 987 654 321",
  whatsappPhone: "+51987654321",
  whatsappDefaultMessage: "Hola Viajes Carolina, deseo asesoría personalizada para mi próximo viaje.",
  facebookUrl: "https://facebook.com/viajescarolina",
  instagramUrl: "https://instagram.com/viajescarolina",
  tiktokUrl: "https://tiktok.com/@viajescarolina",
};

export const DEFAULT_OFFICE_LOCATION: OfficeLocationDTO = {
  id: 1,
  addressLine: "Av. Larco 101, Oficina 502",
  district: "Miraflores",
  city: "Lima",
  country: "Perú",
  postalCode: "15074",
  referenceLandmark: "A media cuadra del Parque Kennedy",
  latitude: -12.1215430,
  longitude: -77.0298760,
  googleMapsUrl: "https://maps.google.com/?q=Miraflores,Lima,Peru",
  scheduleWeekdays: "Lunes a Viernes: 9:00 AM – 7:00 PM",
  scheduleSaturdays: "Sábados: 9:00 AM – 2:00 PM",
  active: true,
  revision: 1,
  updatedAt: "2026-08-18T00:00:00.000Z",
};

export const DEFAULT_HOME_HERO: HomeHeroDTO = {
  id: 1,
  badgeText: "Empieza con una conversación",
  titleHighlight: "Tu viaje comienza",
  titleAccent: "antes de despegar",
  description: "Desde la primera idea hasta tu regreso, una asesora te acompaña con opciones claras, atención humana y respaldo en cada etapa.",
  whatsappCtaText: "Cuéntame tu viaje",
  whatsappMessageOverride: "Hola Viajes Carolina, quiero empezar a planear mi próximo viaje.",
  secondaryCtaText: "Explorar promociones",
  secondaryCtaUrl: "#promociones",
  trustIndicators: ["Asesoría sin costo", "Respuesta rápida", "Acompañamiento real"],
  backgroundMediaId: 1,
  backgroundMediaUrl: "/media/demo-hero-travel.webp",
  backgroundFocalX: 50.0,
  backgroundFocalY: 40.0,
  featuredCardBadge: "Próxima Parada · Cusco",
  featuredCardTitle: "Machu Picchu & Valle Sagrado",
  featuredCardSubtitle: "Experiencia personalizada de 5 días / 4 noches",
  featuredCardPricePen: 1922,
  featuredCardOrigin: "Desde Lima",
  featuredCardMediaId: 3,
  featuredCardMediaUrl: "/media/demo-cusco-machupicchu.webp",
  revision: 1,
  updatedAt: "2026-08-18T00:00:00.000Z",
};

export const DEFAULT_TRAVEL_INTENTIONS: TravelIntentionDTO[] = [
  {
    id: 1,
    slug: "playa-relax",
    title: "Playa & Relax Caribe",
    tagline: "Desconéctate frente al mar turquesa con resorts todo incluido y paseos en catamarán.",
    iconName: "SunIcon",
    featuredDestinations: ["Cartagena", "Cancún", "Punta Cana", "San Andrés", "Varadero"],
    whatsappMessageTemplate: "Hola Viajes Carolina, me interesa planear unas vacaciones de Playa y Relax en el Caribe. ¿Qué opciones tienen disponibles?",
    coverMediaId: 2,
    coverMediaUrl: "/media/demo-cartagena-caribe.webp",
    coverFocalX: 60.0,
    coverFocalY: 50.0,
    displayOrder: 1,
    active: true,
    createdAt: "2026-08-18T00:00:00.000Z",
    updatedAt: "2026-08-18T00:00:00.000Z",
  },
  {
    id: 2,
    slug: "cultura-maravillas",
    title: "Cultura & Maravillas",
    tagline: "Conéctate con la historia milenaria, ciudadelas ancestrales y gastronomía única.",
    iconName: "LandmarkIcon",
    featuredDestinations: ["Cusco & Machu Picchu", "Arequipa & Cañón del Colca", "Puno & Lago Titicaca"],
    whatsappMessageTemplate: "Hola Viajes Carolina, deseo cotizar un viaje cultural a Cusco y maravillas del Perú. ¿Me podrían asesorar?",
    coverMediaId: 3,
    coverMediaUrl: "/media/demo-cusco-machupicchu.webp",
    coverFocalX: 50.0,
    coverFocalY: 35.0,
    displayOrder: 2,
    active: true,
    createdAt: "2026-08-18T00:00:00.000Z",
    updatedAt: "2026-08-18T00:00:00.000Z",
  },
  {
    id: 3,
    slug: "luna-de-miel",
    title: "Lunas de Miel & Romance",
    tagline: "Experiencias íntimas y exclusivas diseñadas al detalle para celebrar el amor.",
    iconName: "HeartIcon",
    featuredDestinations: ["Riviera Maya", "Bora Bora", "Aruba", "Paracas Deluxe"],
    whatsappMessageTemplate: "Hola Viajes Carolina, estamos buscando un paquete especial de Luna de Miel. ¿Qué destinos románticos recomiendan?",
    coverMediaId: 2,
    coverMediaUrl: "/media/demo-cartagena-caribe.webp",
    coverFocalX: 60.0,
    coverFocalY: 50.0,
    displayOrder: 3,
    active: true,
    createdAt: "2026-08-18T00:00:00.000Z",
    updatedAt: "2026-08-18T00:00:00.000Z",
  },
  {
    id: 4,
    slug: "aventura-naturaleza",
    title: "Aventura & Naturaleza",
    tagline: "Trekking, selva amazónica, avistamiento de fauna y paisajes sobrecogedores.",
    iconName: "CompassIcon",
    featuredDestinations: ["Iquitos & Amazonas", "Huaraz & Cordillera Blanca", "Tarapoto & Cataratas"],
    whatsappMessageTemplate: "Hola Viajes Carolina, busco un paquete de aventura y ecoturismo. ¿Cuáles son las mejores alternativas?",
    coverMediaId: 1,
    coverMediaUrl: "/media/demo-hero-travel.webp",
    coverFocalX: 72.5,
    coverFocalY: 28.0,
    displayOrder: 4,
    active: true,
    createdAt: "2026-08-18T00:00:00.000Z",
    updatedAt: "2026-08-18T00:00:00.000Z",
  },
];

export const DEFAULT_PROMOTIONS: PromotionDTO[] = [
  {
    id: 1,
    slug: "cartagena-donde-el-mar-te-espera",
    title: "Cartagena: Donde el mar te espera",
    destination: "Cartagena de Indias, Colombia",
    summary: "Disfruta del encanto caribeño con playas de arena cálida, murallas históricas y atardeceres mágicos frente al mar.",
    priceUsd: 429,
    pricePen: 1590,
    durationDays: 4,
    durationNights: 3,
    departureCity: "Lima",
    validFrom: "2026-08-18",
    validUntil: "2027-02-14",
    featuredMediaId: 2,
    featuredMediaUrl: "/media/demo-cartagena-caribe.webp",
    featuredMediaFocalX: 60.0,
    featuredMediaFocalY: 50.0,
    isFeatured: true,
    inclusions: [
      "Vuelos ida y vuelta con equipaje",
      "Hotel 4 estrellas con desayuno buffet",
      "Traslados aeropuerto - hotel - aeropuerto",
      "Tour en lancha a Islas del Rosario",
    ],
    exclusions: ["Gastos no especificados", "Tarjeta de asistencia médica opcional"],
    whatsappMessageTemplate:
      'Hola Viajes Carolina, me interesa la promoción "Cartagena: Donde el mar te espera" desde USD 429. ¿Tienen fechas disponibles?',
    displayOrder: 1,
    active: true,
  },
  {
    id: 2,
    slug: "cusco-magico-y-machu-picchu",
    title: "Cusco Mágico & Machu Picchu",
    destination: "Cusco & Valle Sagrado, Perú",
    summary: "Una experiencia inolvidable recorriendo la capital del Imperio Incaico, templos sagrados y la maravilla de Machu Picchu.",
    priceUsd: 520,
    pricePen: 1922,
    durationDays: 5,
    durationNights: 4,
    departureCity: "Lima",
    validFrom: "2026-08-18",
    validUntil: "2027-02-14",
    featuredMediaId: 3,
    featuredMediaUrl: "/media/demo-cusco-machupicchu.webp",
    featuredMediaFocalX: 50.0,
    featuredMediaFocalY: 35.0,
    isFeatured: true,
    inclusions: [
      "Vuelos Lima - Cusco - Lima",
      "Tren turístico Expedition a Machu Picchu",
      "Entrada y guía oficial en Machu Picchu",
      "Alojamiento boutique con desayunos",
    ],
    exclusions: ["Almuerzos libres en Aguas Calientes", "Gastos personales"],
    whatsappMessageTemplate:
      'Hola Viajes Carolina, deseo cotizar el paquete "Cusco Mágico & Machu Picchu" desde S/ 1,922. ¿Me podrían brindar detalles?',
    displayOrder: 2,
    active: true,
  },
  {
    id: 3,
    slug: "punta-cana-all-inclusive-caribe",
    title: "Punta Cana All-Inclusive Deluxe",
    destination: "Punta Cana, República Dominicana",
    summary: "Relax absoluto en resorts de primer nivel con comidas y bebidas ilimitadas, playas de arena blanca y actividades acuáticas.",
    priceUsd: 799,
    pricePen: 2956,
    durationDays: 5,
    durationNights: 4,
    departureCity: "Lima",
    validFrom: "2026-08-18",
    validUntil: "2027-02-14",
    featuredMediaId: 2,
    featuredMediaUrl: "/media/demo-cartagena-caribe.webp",
    featuredMediaFocalX: 60.0,
    featuredMediaFocalY: 50.0,
    isFeatured: true,
    inclusions: [
      "Vuelos internacionales ida y vuelta",
      "Resort 5 estrellas Todo Incluido 24h",
      "Bebidas y cenas temáticas ilimitadas",
      "Deportes acuáticos no motorizados",
    ],
    exclusions: ["Impuestos de entrada a República Dominicana", "Propinas voluntarias"],
    whatsappMessageTemplate:
      'Hola Viajes Carolina, quiero consultar sobre la oferta "Punta Cana All-Inclusive Deluxe". ¿Cuáles son las fechas disponibles?',
    displayOrder: 3,
    active: true,
  },
  {
    id: 4,
    slug: "iquitos-selva-magica-amazonas",
    title: "Iquitos & Selva Mágica Amazonas",
    destination: "Iquitos & Río Amazonas, Perú",
    summary: "Adéntrate en el pulmón del mundo con expediciones nocturnas, avistamiento de delfines rosados y conexión con la naturaleza.",
    priceUsd: 380,
    pricePen: 1406,
    durationDays: 4,
    durationNights: 3,
    departureCity: "Lima",
    validFrom: "2026-08-18",
    validUntil: "2027-02-14",
    featuredMediaId: 1,
    featuredMediaUrl: "/media/demo-hero-travel.webp",
    featuredMediaFocalX: 72.5,
    featuredMediaFocalY: 28.0,
    isFeatured: true,
    inclusions: [
      "Vuelos Lima - Iquitos - Lima",
      "Lodge ecológico en la selva",
      "Todas las comidas incluidas (pensión completa)",
      "Excursiones guiadas por botánicos locales",
    ],
    exclusions: ["Bebidas alcohólicas", "Souvenirs"],
    whatsappMessageTemplate:
      'Hola Viajes Carolina, me encanta la opción "Iquitos & Selva Mágica Amazonas". ¿Me asesoran con las salidas?',
    displayOrder: 4,
    active: true,
  },
];

export const DEFAULT_TESTIMONIALS: TestimonialDTO[] = [
  {
    id: 1,
    clientName: "Mariana & Gonzalo Torres",
    clientLocation: "Lima, Perú",
    tripDestination: "Luna de Miel en Punta Cana",
    comment: "Desde que escribimos por WhatsApp nos atendieron con muchísima paciencia. Nos recomendaron un resort espectacular y el check-in fue sin complicaciones. ¡Totalmente recomendadas!",
    rating: 5,
    avatarMediaId: 2,
    avatarMediaUrl: "/media/demo-cartagena-caribe.webp",
    consentConfirmed: true,
    displayOrder: 1,
    active: true,
    createdAt: "2026-08-18T00:00:00.000Z",
    updatedAt: "2026-08-18T00:00:00.000Z",
  },
  {
    id: 2,
    clientName: "Carlos Mendoza",
    clientLocation: "Arequipa, Perú",
    tripDestination: "Vacaciones Familiares en Cartagena",
    comment: "Excelente asesoría de inicio a fin. Los vuelos, traslados y el hotel estuvieron perfectamente coordinados. Nos dio mucha seguridad tener asistencia durante el viaje.",
    rating: 5,
    avatarMediaId: 2,
    avatarMediaUrl: "/media/demo-cartagena-caribe.webp",
    consentConfirmed: true,
    displayOrder: 2,
    active: true,
    createdAt: "2026-08-18T00:00:00.000Z",
    updatedAt: "2026-08-18T00:00:00.000Z",
  },
  {
    id: 3,
    clientName: "Familia Quispe Valdivia",
    clientLocation: "Trujillo, Perú",
    tripDestination: "Cusco & Machu Picchu 5D/4N",
    comment: "Viajar con niños pequeños siempre es un reto, pero Viajes Carolina organizó los horarios de tren y entradas a la perfección. La experiencia en Machu Picchu fue inolvidable.",
    rating: 5,
    avatarMediaId: 3,
    avatarMediaUrl: "/media/demo-cusco-machupicchu.webp",
    consentConfirmed: true,
    displayOrder: 3,
    active: true,
    createdAt: "2026-08-18T00:00:00.000Z",
    updatedAt: "2026-08-18T00:00:00.000Z",
  },
];

export const DEFAULT_FAQS: FaqItemDTO[] = [
  {
    id: 1,
    question: "¿La asesoría para cotizar mi viaje tiene algún costo?",
    answer: "No, nuestra asesoría personalizada por WhatsApp o presencial en oficina es 100% gratuita y sin compromiso. Te brindamos opciones transparentes ajustadas a tu presupuesto.",
    category: "Asesoría y Cotización",
    displayOrder: 1,
    active: true,
    createdAt: "2026-08-18T00:00:00.000Z",
    updatedAt: "2026-08-18T00:00:00.000Z",
  },
  {
    id: 2,
    question: "¿Qué facilidades de pago aceptan?",
    answer: "Aceptamos transferencias bancarias directas (BCP, BBVA, Interbank), tarjetas de crédito y débito (Visa, Mastercard, Amex) con opciones de cuotas sin intereses según tu entidad financiera.",
    category: "Pagos y Métodos",
    displayOrder: 2,
    active: true,
    createdAt: "2026-08-18T00:00:00.000Z",
    updatedAt: "2026-08-18T00:00:00.000Z",
  },
  {
    id: 3,
    question: "¿Los paquetes incluyen boletos aéreos y equipaje?",
    answer: "Sí, todos nuestros paquetes detallan explícitamente el tipo de tarifa aérea, equipaje en cabina o bodega incluido y traslados aeropuerto-hotel para que viajes sin sorpresas.",
    category: "Paquetes y Servicios",
    displayOrder: 3,
    active: true,
    createdAt: "2026-08-18T00:00:00.000Z",
    updatedAt: "2026-08-18T00:00:00.000Z",
  },
  {
    id: 4,
    question: "¿Tienen oficina física donde pueda recibir asesoría personalizada?",
    answer: "Sí, te esperamos en nuestra oficina en Av. Larco 101, Oficina 502, Miraflores, Lima (a media cuadra del Parque Kennedy). Atendemos de Lunes a Viernes de 9:00 AM a 7:00 PM y Sábados de 9:00 AM a 2:00 PM.",
    category: "Oficina y Ubicación",
    displayOrder: 4,
    active: true,
    createdAt: "2026-08-18T00:00:00.000Z",
    updatedAt: "2026-08-18T00:00:00.000Z",
  },
];

export const DEFAULT_ABOUT_PAGE: AboutPageDTO = {
  id: 1,
  heroBadge: "Conoce Nuestra Esencia",
  heroTitle: "Más de 12 años transformando viajes en recuerdos inolvidables",
  heroSubtitle: "Somos una agencia peruana apasionada por diseñar experiencias turísticas personalizadas, con atención cálida y respaldo antes, durante y después de tu viaje.",
  heroMediaId: 1,
  heroMediaUrl: "/media/demo-hero-travel.webp",
  storyTitle: "Nuestra Historia",
  storyBody: "Viajes Carolina nació con el propósito de devolver la calidez humana y la tranquilidad a la planificación de viajes. Lo que comenzó como un sueño familiar hoy es una agencia boutique consolidada en Miraflores, Lima, con un equipo de asesoras especializadas que cuidan cada detalle de tu itinerario.",
  storyMediaId: 3,
  storyMediaUrl: "/media/demo-cusco-machupicchu.webp",
  missionTitle: "Nuestra Misión",
  missionBody: "Brindar asesoría turística experta, honesta y personalizada, garantizando experiencias de viaje seguras y memorables que superen las expectativas de cada familia y viajero.",
  visionTitle: "Nuestra Visión",
  visionBody: "Ser la agencia de viajes boutique referente en el Perú por nuestra excelencia en el servicio al cliente, innovación y acompañamiento constante.",
  values: ["Atención humana y cálida", "Transparencia sin letra chica", "Acompañamiento 24/7", "Pasión por los detalles"],
  experienceYears: 12,
  happyTravelers: 15000,
  destinationsCount: 85,
  satisfactionRatePercent: 99,
  revision: 1,
  updatedAt: "2026-08-18T00:00:00.000Z",
};

export const DEFAULT_ADVISORS: TravelAdvisorDTO[] = [
  {
    id: 1,
    fullName: "Carolina Zúñiga",
    roleTitle: "Fundadora & Directora de Experiencias",
    specialty: "Destinos Internacionales & Lunas de Miel",
    bio: "Más de 15 años diseñando itinerarios de ensueño en el Caribe y Europa. Apasionada por hacer de cada viaje una experiencia irrepetible.",
    photoMediaId: 2,
    photoMediaUrl: "/media/demo-cartagena-caribe.webp",
    whatsappPhone: "+51987654321",
    whatsappMessageTemplate: "Hola Carolina, me gustaría una asesoría personalizada contigo para planificar mi viaje.",
    displayOrder: 1,
    active: true,
    createdAt: "2026-08-18T00:00:00.000Z",
    updatedAt: "2026-08-18T00:00:00.000Z",
  },
  {
    id: 2,
    fullName: "Lucía Ramos",
    roleTitle: "Asesora Senior de Viajes",
    specialty: "Caribe, Resorts All-Inclusive & Cruceros",
    bio: "Especialista en vacaciones familiares y escapadas de relax. Conoce al detalle los mejores resorts de Punta Cana, Cancún y Cartagena.",
    photoMediaId: 2,
    photoMediaUrl: "/media/demo-cartagena-caribe.webp",
    whatsappPhone: "+51987654321",
    whatsappMessageTemplate: "Hola Lucía, deseo cotizar un paquete al Caribe y recibir tu recomendación de resorts.",
    displayOrder: 2,
    active: true,
    createdAt: "2026-08-18T00:00:00.000Z",
    updatedAt: "2026-08-18T00:00:00.000Z",
  },
  {
    id: 3,
    fullName: "Valeria Gómez",
    roleTitle: "Especialista en Destinos Nacionales",
    specialty: "Cusco, Selva Amazónica & Trekking",
    bio: "Guía experta en las maravillas del Perú. Diseña rutas culturales y de aventura con los mejores horarios y operadores certificados.",
    photoMediaId: 3,
    photoMediaUrl: "/media/demo-cusco-machupicchu.webp",
    whatsappPhone: "+51987654321",
    whatsappMessageTemplate: "Hola Valeria, me interesa cotizar un viaje a Cusco / Selva peruana con tu asesoría.",
    displayOrder: 3,
    active: true,
    createdAt: "2026-08-18T00:00:00.000Z",
    updatedAt: "2026-08-18T00:00:00.000Z",
  },
];

export const DEFAULT_MEDIA_ASSETS: MediaAssetDTO[] = [
  {
    id: 1,
    filename: "demo-hero-travel.webp",
    originalName: "hero-travel-banner.webp",
    mimeType: "image/webp",
    fileSizeBytes: 245800,
    width: 1920,
    height: 1080,
    focalX: 50.0,
    focalY: 40.0,
    altText: "Paisaje de viaje y aventura en los Andes",
    caption: "Vista panorámica de montaña y cielo despejado",
    storagePath: "/media/demo-hero-travel.webp",
    variantsJson: '{"thumb": "/media/demo-hero-travel-thumb.webp", "medium": "/media/demo-hero-travel-med.webp", "large": "/media/demo-hero-travel.webp"}',
    active: true,
    createdAt: "2026-08-18T00:00:00.000Z",
    updatedAt: "2026-08-18T00:00:00.000Z",
  },
  {
    id: 2,
    filename: "demo-cartagena-caribe.webp",
    originalName: "cartagena-playa.webp",
    mimeType: "image/webp",
    fileSizeBytes: 184500,
    width: 1200,
    height: 800,
    focalX: 60.0,
    focalY: 50.0,
    altText: "Calles coloniales y mar de Cartagena de Indias",
    caption: "Cartagena de Indias al atardecer",
    storagePath: "/media/demo-cartagena-caribe.webp",
    variantsJson: '{"thumb": "/media/demo-cartagena-thumb.webp", "medium": "/media/demo-cartagena-med.webp"}',
    active: true,
    createdAt: "2026-08-18T00:00:00.000Z",
    updatedAt: "2026-08-18T00:00:00.000Z",
  },
  {
    id: 3,
    filename: "demo-cusco-machupicchu.webp",
    originalName: "cusco-valle-sagrado.webp",
    mimeType: "image/webp",
    fileSizeBytes: 210400,
    width: 1200,
    height: 800,
    focalX: 50.0,
    focalY: 35.0,
    altText: "Santuario Histórico de Machu Picchu y Valle Sagrado",
    caption: "Machu Picchu bajo la luz de la mañana",
    storagePath: "/media/demo-cusco-machupicchu.webp",
    variantsJson: '{"thumb": "/media/demo-cusco-thumb.webp", "medium": "/media/demo-cusco-med.webp"}',
    active: true,
    createdAt: "2026-08-18T00:00:00.000Z",
    updatedAt: "2026-08-18T00:00:00.000Z",
  },
  {
    id: 4,
    filename: "demo-logo-viajes-carolina.webp",
    originalName: "logo-vc-oficial.webp",
    mimeType: "image/webp",
    fileSizeBytes: 45200,
    width: 600,
    height: 200,
    focalX: 50.0,
    focalY: 50.0,
    altText: "Logo Oficial de Viajes Carolina",
    caption: "Logo corporativo",
    storagePath: "/media/demo-logo-viajes-carolina.webp",
    variantsJson: "{}",
    active: true,
    createdAt: "2026-08-18T00:00:00.000Z",
    updatedAt: "2026-08-18T00:00:00.000Z",
  },
];

export let MOCK_SITE_SETTINGS: SiteSettingsDTO = { ...DEFAULT_SITE_SETTINGS };
export let MOCK_OFFICE_LOCATION: OfficeLocationDTO = { ...DEFAULT_OFFICE_LOCATION };
export let MOCK_MEDIA_ASSETS: MediaAssetDTO[] = [...DEFAULT_MEDIA_ASSETS];
export let MOCK_HOME_HERO: HomeHeroDTO = { ...DEFAULT_HOME_HERO };
export let MOCK_TRAVEL_INTENTIONS: TravelIntentionDTO[] = [...DEFAULT_TRAVEL_INTENTIONS];
export let MOCK_PROMOTIONS: PromotionDTO[] = [...DEFAULT_PROMOTIONS];
export let MOCK_TESTIMONIALS: TestimonialDTO[] = [...DEFAULT_TESTIMONIALS];
export let MOCK_FAQS: FaqItemDTO[] = [...DEFAULT_FAQS];
export let MOCK_ABOUT_PAGE: AboutPageDTO = { ...DEFAULT_ABOUT_PAGE };
export let MOCK_ADVISORS: TravelAdvisorDTO[] = [...DEFAULT_ADVISORS];

export function getMockSiteSettings(): SiteSettingsDTO {
  return MOCK_SITE_SETTINGS;
}

export function updateMockSiteSettings(updated: Partial<SiteSettingsDTO>): SiteSettingsDTO {
  MOCK_SITE_SETTINGS = {
    ...MOCK_SITE_SETTINGS,
    ...updated,
  };
  return MOCK_SITE_SETTINGS;
}

export function getMockOfficeLocation(): OfficeLocationDTO {
  return MOCK_OFFICE_LOCATION;
}

export function updateMockOfficeLocation(updated: Partial<OfficeLocationDTO>): OfficeLocationDTO {
  MOCK_OFFICE_LOCATION = {
    ...MOCK_OFFICE_LOCATION,
    ...updated,
    revision: (MOCK_OFFICE_LOCATION.revision || 1) + 1,
    updatedAt: new Date().toISOString(),
  };
  return MOCK_OFFICE_LOCATION;
}

export function getMockHomeHero(): HomeHeroDTO {
  return MOCK_HOME_HERO;
}

export function updateMockHomeHero(updated: Partial<HomeHeroDTO>): HomeHeroDTO {
  MOCK_HOME_HERO = {
    ...MOCK_HOME_HERO,
    ...updated,
    revision: (MOCK_HOME_HERO.revision || 1) + 1,
    updatedAt: new Date().toISOString(),
  };
  return MOCK_HOME_HERO;
}

export function getMockTravelIntentions(): TravelIntentionDTO[] {
  return MOCK_TRAVEL_INTENTIONS.filter((i) => i.active);
}

export function getMockAdminTravelIntentions(): TravelIntentionDTO[] {
  return MOCK_TRAVEL_INTENTIONS;
}

export function createMockTravelIntention(req: CreateOrUpdateTravelIntentionRequest): TravelIntentionDTO {
  const newIntention: TravelIntentionDTO = {
    id: Date.now(),
    slug: req.slug,
    title: req.title,
    tagline: req.tagline,
    iconName: req.iconName || "SunIcon",
    featuredDestinations: req.featuredDestinations,
    whatsappMessageTemplate: req.whatsappMessageTemplate,
    coverMediaId: req.coverMediaId,
    coverMediaUrl: "/media/demo-cartagena-caribe.webp",
    coverFocalX: 50.0,
    coverFocalY: 50.0,
    displayOrder: req.displayOrder || MOCK_TRAVEL_INTENTIONS.length + 1,
    active: req.active ?? true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  MOCK_TRAVEL_INTENTIONS.push(newIntention);
  return newIntention;
}

export function updateMockTravelIntention(id: number, req: CreateOrUpdateTravelIntentionRequest): TravelIntentionDTO {
  const index = MOCK_TRAVEL_INTENTIONS.findIndex((i) => i.id === id);
  if (index === -1) {
    throw new Error(`Intención no encontrada con ID: ${id}`);
  }
  const current = MOCK_TRAVEL_INTENTIONS[index];
  const updated: TravelIntentionDTO = {
    ...current,
    slug: req.slug,
    title: req.title,
    tagline: req.tagline,
    iconName: req.iconName || current.iconName,
    featuredDestinations: req.featuredDestinations,
    whatsappMessageTemplate: req.whatsappMessageTemplate,
    coverMediaId: req.coverMediaId,
    displayOrder: req.displayOrder ?? current.displayOrder,
    active: req.active ?? current.active,
    updatedAt: new Date().toISOString(),
  };
  MOCK_TRAVEL_INTENTIONS[index] = updated;
  return updated;
}

export function deleteMockTravelIntention(id: number): void {
  const index = MOCK_TRAVEL_INTENTIONS.findIndex((i) => i.id === id);
  if (index !== -1) {
    MOCK_TRAVEL_INTENTIONS[index].active = false;
  }
}

export function getMockFeaturedPromotions(): PromotionDTO[] {
  return MOCK_PROMOTIONS.filter((p) => p.isFeatured && p.active);
}

export function getMockPromotions(): PromotionDTO[] {
  return MOCK_PROMOTIONS.filter((p) => p.active);
}

export function getMockAdminPromotions(): PromotionDTO[] {
  return MOCK_PROMOTIONS;
}

export function getMockPromotionBySlug(slug: string): PromotionDTO | null {
  return MOCK_PROMOTIONS.find((p) => p.slug === slug) || null;
}

export function createMockPromotion(req: CreateOrUpdatePromotionRequest): PromotionDTO {
  const newPromo: PromotionDTO = {
    id: Date.now(),
    slug: req.slug,
    title: req.title,
    destination: req.destination,
    summary: req.summary,
    priceUsd: Number(req.priceUsd),
    pricePen: req.pricePen ? Number(req.pricePen) : Number(req.priceUsd) * 3.7,
    durationDays: Number(req.durationDays),
    durationNights: Number(req.durationNights),
    departureCity: req.departureCity || "Lima",
    validFrom: req.validFrom || new Date().toISOString().split("T")[0],
    validUntil: req.validUntil || new Date(Date.now() + 180 * 86400000).toISOString().split("T")[0],
    featuredMediaId: req.featuredMediaId,
    featuredMediaUrl: "/media/demo-cartagena-caribe.webp",
    featuredMediaFocalX: 50.0,
    featuredMediaFocalY: 50.0,
    isFeatured: req.isFeatured ?? true,
    inclusions: req.inclusions,
    exclusions: req.exclusions,
    whatsappMessageTemplate: req.whatsappMessageTemplate,
    displayOrder: req.displayOrder || MOCK_PROMOTIONS.length + 1,
    active: req.active ?? true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  MOCK_PROMOTIONS.push(newPromo);
  return newPromo;
}

export function updateMockPromotion(id: number, req: CreateOrUpdatePromotionRequest): PromotionDTO {
  const index = MOCK_PROMOTIONS.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error(`Promoción no encontrada con ID: ${id}`);
  }
  const current = MOCK_PROMOTIONS[index];
  const updated: PromotionDTO = {
    ...current,
    slug: req.slug,
    title: req.title,
    destination: req.destination,
    summary: req.summary,
    priceUsd: Number(req.priceUsd),
    pricePen: req.pricePen ? Number(req.pricePen) : current.pricePen,
    durationDays: Number(req.durationDays),
    durationNights: Number(req.durationNights),
    departureCity: req.departureCity || current.departureCity,
    validFrom: req.validFrom || current.validFrom,
    validUntil: req.validUntil || current.validUntil,
    featuredMediaId: req.featuredMediaId,
    isFeatured: req.isFeatured ?? current.isFeatured,
    inclusions: req.inclusions,
    exclusions: req.exclusions,
    whatsappMessageTemplate: req.whatsappMessageTemplate,
    displayOrder: req.displayOrder ?? current.displayOrder,
    active: req.active ?? current.active,
    updatedAt: new Date().toISOString(),
  };
  MOCK_PROMOTIONS[index] = updated;
  return updated;
}

export function deleteMockPromotion(id: number): void {
  const index = MOCK_PROMOTIONS.findIndex((p) => p.id === id);
  if (index !== -1) {
    MOCK_PROMOTIONS[index].active = false;
  }
}

// Trust Mock Helpers (Corte 7)
export function getMockPublicTrust(): PublicTrustResponse {
  return {
    testimonials: MOCK_TESTIMONIALS.filter((t) => t.active),
    faqs: MOCK_FAQS.filter((f) => f.active),
  };
}

export function getMockTestimonials(): TestimonialDTO[] {
  return MOCK_TESTIMONIALS;
}

export function createMockTestimonial(req: CreateOrUpdateTestimonialRequest): TestimonialDTO {
  const newT: TestimonialDTO = {
    id: Date.now(),
    clientName: req.clientName,
    clientLocation: req.clientLocation,
    tripDestination: req.tripDestination,
    comment: req.comment,
    rating: req.rating || 5,
    avatarMediaId: req.avatarMediaId,
    avatarMediaUrl: "/media/demo-cartagena-caribe.webp",
    consentConfirmed: req.consentConfirmed ?? true,
    displayOrder: req.displayOrder || MOCK_TESTIMONIALS.length + 1,
    active: req.active ?? true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  MOCK_TESTIMONIALS.push(newT);
  return newT;
}

export function updateMockTestimonial(id: number, req: CreateOrUpdateTestimonialRequest): TestimonialDTO {
  const index = MOCK_TESTIMONIALS.findIndex((t) => t.id === id);
  if (index === -1) throw new Error(`Testimonio no encontrado con ID: ${id}`);
  const current = MOCK_TESTIMONIALS[index];
  const updated: TestimonialDTO = {
    ...current,
    clientName: req.clientName,
    clientLocation: req.clientLocation,
    tripDestination: req.tripDestination,
    comment: req.comment,
    rating: req.rating,
    avatarMediaId: req.avatarMediaId,
    consentConfirmed: req.consentConfirmed ?? current.consentConfirmed,
    displayOrder: req.displayOrder ?? current.displayOrder,
    active: req.active ?? current.active,
    updatedAt: new Date().toISOString(),
  };
  MOCK_TESTIMONIALS[index] = updated;
  return updated;
}

export function deleteMockTestimonial(id: number): void {
  const index = MOCK_TESTIMONIALS.findIndex((t) => t.id === id);
  if (index !== -1) MOCK_TESTIMONIALS[index].active = false;
}

export function getMockFaqs(): FaqItemDTO[] {
  return MOCK_FAQS;
}

export function createMockFaq(req: CreateOrUpdateFaqRequest): FaqItemDTO {
  const newF: FaqItemDTO = {
    id: Date.now(),
    question: req.question,
    answer: req.answer,
    category: req.category || "General",
    displayOrder: req.displayOrder || MOCK_FAQS.length + 1,
    active: req.active ?? true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  MOCK_FAQS.push(newF);
  return newF;
}

export function updateMockFaq(id: number, req: CreateOrUpdateFaqRequest): FaqItemDTO {
  const index = MOCK_FAQS.findIndex((f) => f.id === id);
  if (index === -1) throw new Error(`FAQ no encontrado con ID: ${id}`);
  const current = MOCK_FAQS[index];
  const updated: FaqItemDTO = {
    ...current,
    question: req.question,
    answer: req.answer,
    category: req.category ?? current.category,
    displayOrder: req.displayOrder ?? current.displayOrder,
    active: req.active ?? current.active,
    updatedAt: new Date().toISOString(),
  };
  MOCK_FAQS[index] = updated;
  return updated;
}

export function deleteMockFaq(id: number): void {
  const index = MOCK_FAQS.findIndex((f) => f.id === id);
  if (index !== -1) MOCK_FAQS[index].active = false;
}

// About Us & Advisors Mock Helpers (Corte 8)
export function getMockPublicAbout(): PublicAboutResponse {
  return {
    page: MOCK_ABOUT_PAGE,
    advisors: MOCK_ADVISORS.filter((a) => a.active),
  };
}

export function getMockAdminAbout(): AboutPageDTO {
  return MOCK_ABOUT_PAGE;
}

export function updateMockAdminAbout(req: UpdateAboutPageRequest): AboutPageDTO {
  MOCK_ABOUT_PAGE = {
    ...MOCK_ABOUT_PAGE,
    ...req,
    revision: (MOCK_ABOUT_PAGE.revision || 1) + 1,
    updatedAt: new Date().toISOString(),
  };
  return MOCK_ABOUT_PAGE;
}

export function getMockAdminAdvisors(): TravelAdvisorDTO[] {
  return MOCK_ADVISORS;
}

export function createMockAdvisor(req: CreateOrUpdateAdvisorRequest): TravelAdvisorDTO {
  const newAdvisor: TravelAdvisorDTO = {
    id: Date.now(),
    fullName: req.fullName,
    roleTitle: req.roleTitle,
    specialty: req.specialty,
    bio: req.bio,
    photoMediaId: req.photoMediaId,
    photoMediaUrl: "/media/demo-cartagena-caribe.webp",
    whatsappPhone: req.whatsappPhone || "+51987654321",
    whatsappMessageTemplate: req.whatsappMessageTemplate || `Hola ${req.fullName}, deseo asesoría personalizada para mi viaje.`,
    displayOrder: req.displayOrder || MOCK_ADVISORS.length + 1,
    active: req.active ?? true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  MOCK_ADVISORS.push(newAdvisor);
  return newAdvisor;
}

export function updateMockAdvisor(id: number, req: CreateOrUpdateAdvisorRequest): TravelAdvisorDTO {
  const index = MOCK_ADVISORS.findIndex((a) => a.id === id);
  if (index === -1) throw new Error(`Asesora no encontrada con ID: ${id}`);
  const current = MOCK_ADVISORS[index];
  const updated: TravelAdvisorDTO = {
    ...current,
    fullName: req.fullName,
    roleTitle: req.roleTitle,
    specialty: req.specialty,
    bio: req.bio,
    photoMediaId: req.photoMediaId,
    whatsappPhone: req.whatsappPhone || current.whatsappPhone,
    whatsappMessageTemplate: req.whatsappMessageTemplate || current.whatsappMessageTemplate,
    displayOrder: req.displayOrder ?? current.displayOrder,
    active: req.active ?? current.active,
    updatedAt: new Date().toISOString(),
  };
  MOCK_ADVISORS[index] = updated;
  return updated;
}

export function deleteMockAdvisor(id: number): void {
  const index = MOCK_ADVISORS.findIndex((a) => a.id === id);
  if (index !== -1) MOCK_ADVISORS[index].active = false;
}

export function getMockMediaPage(page = 0, size = 24): MediaPageResponse {
  const start = page * size;
  const items = MOCK_MEDIA_ASSETS.slice(start, start + size);
  return {
    items,
    total: MOCK_MEDIA_ASSETS.length,
    page,
    size,
  };
}

export function updateMockMediaFocalPoint(id: number, req: UpdateMediaFocalPointRequest): MediaAssetDTO | null {
  const index = MOCK_MEDIA_ASSETS.findIndex((m) => m.id === id);
  if (index === -1) return null;
  const current = MOCK_MEDIA_ASSETS[index];
  const updated: MediaAssetDTO = {
    ...current,
    focalX: req.focalX,
    focalY: req.focalY,
    altText: req.altText || current.altText,
    caption: req.caption || current.caption,
    updatedAt: new Date().toISOString(),
  };
  MOCK_MEDIA_ASSETS[index] = updated;
  return updated;
}

export const MOCK_BLOG_POSTS: BlogPostDTO[] = [
  {
    id: 1,
    slug: "guia-completa-para-viajar-al-caribe",
    title: "Guía completa para tu primer viaje al Caribe",
    excerpt: "Todo lo que necesitas saber sobre pasaportes, temporadas ideales y qué empacar.",
    content: "Viajar al Caribe es una de las experiencias más revitalizantes...",
    category: "Consejos de Viaje",
    publishedAt: "2026-08-10",
    readingTimeMinutes: 5,
    authorName: "Carolina Zúñiga",
  },
];

export const MOCK_API_INFO: ApiInfoDTO = {
  name: "Viajes Carolina API (Mock)",
  version: "1.0.0",
  status: "UP",
  architecture: "Hexagonal Architecture with Quarkus 3.x & Java 25 LTS",
  timestamp: "2026-08-18T00:00:00.000Z",
};
