import {
  SiteSettingsDTO,
  OfficeLocationDTO,
  PromotionDTO,
  ApiInfoDTO,
  MediaAssetDTO,
  MediaPageResponse,
  UpdateMediaFocalPointRequest,
  HomeHeroDTO,
  UpdateHomeHeroRequest,
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
  ContactPageDTO,
  UpdateContactPageRequest,
  SubmitContactInquiryRequest,
  ContactInquiryDTO,
  UpdateInquiryStatusRequest,
  PublicContactResponse,
  BlogCategoryDTO,
  CreateOrUpdateBlogCategoryRequest,
  BlogPostDTO,
  CreateOrUpdateBlogPostRequest,
  PublicBlogResponse,
  BlogPostDetailResponse,
  SearchResultItemDTO,
  GlobalSearchResponse,
  SearchResultType,
  HomeBlogInspirationDTO,
  UpdateHomeBlogInspirationRequest,
  PublicHomeBlogInspirationResponse,
  HomeConversationalPauseDTO,
  UpdateHomeConversationalPauseRequest,
  HomePromotionsSectionDTO,
  UpdateHomePromotionsSectionRequest,
  HomeTestimonialsSectionDTO,
  UpdateHomeTestimonialsSectionRequest,
  HomeFaqSectionDTO,
  UpdateHomeFaqSectionRequest,
  ClaimRecordDTO,
  SubmitClaimRequest,
  UpdateClaimStatusRequest,
  ContactExploreLinkDTO,
  CreateOrUpdateContactExploreLinkRequest,
  AdminUserDTO,
  LoginRequest,
  LoginResponse,
  CreateAdminUserRequest,
  UpdateAdminUserRequest,
  AuditLogDTO,
  PublishRequestDTO,
  PublishResponseDTO,
} from "./types";

export const DEFAULT_SITE_SETTINGS: SiteSettingsDTO = {
  id: 1,
  siteName: "Viajes Carolina",
  brandTagline: "El viaje comienza aquí",
  contactEmail: "contacto@viajescarolina.com",
  primaryPhone: "+51 987 654 321",
  whatsappPhone: "+51987654321",
  whatsappDisplayNumber: "+51 987 654 321",
  whatsappDefaultMessage: "Hola Viajes Carolina, deseo asesoría personalizada para mi próximo viaje.",
  facebookUrl: "https://facebook.com/viajescarolina",
  instagramUrl: "https://instagram.com/viajescarolina",
  tiktokUrl: "https://tiktok.com/@viajescarolina",
  legalCompanyName: "VIAJES CAROLINA S.A.C.",
  taxId: "20601234567",
};

export const DEFAULT_OFFICE_LOCATION: OfficeLocationDTO = {
  id: 1,
  addressLine: "Av. Larco 101, Oficina 502",
  district: "Miraflores",
  city: "Lima",
  country: "Perú",
  postalCode: "15074",
  referenceLandmark: "A media cuadra del Parque Kennedy",
  latitude: -12.058318001300801,
  longitude: -77.04422505767273,
  googleMapsUrl: "https://maps.app.goo.gl/e915tVtd7TCCUFqz7",
  scheduleWeekdays: "Lunes a Viernes: 9:00 AM – 7:00 PM",
  scheduleSaturdays: "Sábados: 9:00 AM – 2:00 PM",
  active: true,
  revision: 1,
  updatedAt: "2026-08-18T00:00:00.000Z",
};

export const DEFAULT_HOME_HERO: HomeHeroDTO = {
  id: 1,
  badgeText: "Empieza con una conversación",
  titleHighlight: "¿Qué viaje te gustaría",
  titleAccent: "recordar toda la vida?",
  description: "Cuéntanos qué imaginas. Te escuchamos y construimos contigo una experiencia que se sienta tuya desde la primera conversación.",
  whatsappCtaText: "Conversemos por WhatsApp",
  whatsappMessageOverride: "Hola Viajes Carolina, quiero empezar a planear mi próximo viaje.",
  secondaryCtaText: "Explorar promociones",
  secondaryCtaUrl: "#promociones",
  trustIndicators: ["Asesoría sin costo", "Respuesta rápida", "Acompañamiento real"],
  backgroundMediaId: 1,
  backgroundMediaUrl: "/media/demo-hero-travel.webp",
  backgroundFocalX: 50.0,
  backgroundFocalY: 40.0,
  // Collage de fotos de clientes (Hero H6): sin URL hasta que el admin suba
  // fotos reales — el componente muestra un placeholder abstracto mientras tanto.
  secondaryMedia1FocalX: 50.0,
  secondaryMedia1FocalY: 50.0,
  secondaryMedia2FocalX: 50.0,
  secondaryMedia2FocalY: 50.0,
  secondaryMedia3FocalX: 50.0,
  secondaryMedia3FocalY: 50.0,
  trustStatText: "Cada foto pertenece a viajeros que confiaron en nosotros.",
  eyebrowText: "Empecemos por lo que sueñas",
  revision: 1,
  updatedAt: "2026-08-18T00:00:00.000Z",
};

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
    inclusions: [
      "Vuelos ida y vuelta con equipaje",
      "Hotel 4 estrellas con desayuno buffet",
      "Traslados aeropuerto - hotel - aeropuerto",
      "Tour en lancha a Islas del Rosario",
    ],
    exclusions: ["Gastos no especificados", "Tarjeta de asistencia médica opcional"],
    whatsappMessageTemplate:
      'Hola Viajes Carolina, me interesa la promoción "Cartagena: Donde el mar te espera" desde USD 429. ¿Tienen fechas disponibles?',
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
    inclusions: [
      "Vuelos Lima - Cusco - Lima",
      "Tren turístico Expedition a Machu Picchu",
      "Entrada y guía oficial en Machu Picchu",
      "Alojamiento boutique con desayunos",
    ],
    exclusions: ["Almuerzos libres en Aguas Calientes", "Gastos personales"],
    whatsappMessageTemplate:
      'Hola Viajes Carolina, deseo cotizar el paquete "Cusco Mágico & Machu Picchu" desde S/ 1,922. ¿Me podrían brindar detalles?',
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
    inclusions: [
      "Vuelos internacionales ida y vuelta",
      "Resort 5 estrellas Todo Incluido 24h",
      "Bebidas y cenas temáticas ilimitadas",
      "Deportes acuáticos no motorizados",
    ],
    exclusions: ["Impuestos de entrada a República Dominicana", "Propinas voluntarias"],
    whatsappMessageTemplate:
      'Hola Viajes Carolina, quiero consultar sobre la oferta "Punta Cana All-Inclusive Deluxe". ¿Cuáles son las fechas disponibles?',
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
    inclusions: [
      "Vuelos Lima - Iquitos - Lima",
      "Lodge ecológico en la selva",
      "Todas las comidas incluidas (pensión completa)",
      "Excursiones guiadas por botánicos locales",
    ],
    exclusions: ["Bebidas alcohólicas", "Souvenirs"],
    whatsappMessageTemplate:
      'Hola Viajes Carolina, me encanta la opción "Iquitos & Selva Mágica Amazonas". ¿Me asesoran con las salidas?',
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
  heroBadge: "Detrás de cada viaje",
  heroTitle: "¿Qué cambia cuando alguien realmente te escucha?",
  heroSubtitle: "No empezamos por venderte un destino. Empezamos por entender qué quieres vivir, qué necesitas cuidar y cómo te gustaría recordarlo.",
  heroMediaId: 1,
  heroMediaUrl: "/media/demo-hero-travel.webp",
  heroFocalX: 50,
  heroFocalY: 50,
  heroCardBadge: "Lo primero es escuchar",
  heroCardTitle: "No necesitas tener el destino decidido para empezar.",
  heroNoteText: "Seguimos contigo hasta el regreso.",
  storyTitle: "Nuestra Historia",
  storyBody: "Viajes Carolina nació con el propósito de devolver la calidez humana y la tranquilidad a la planificación de viajes. Lo que comenzó como un sueño familiar hoy es una agencia boutique consolidada en Miraflores, Lima, con un equipo de asesoras especializadas que cuidan cada detalle de tu itinerario.",
  storyMediaId: 3,
  storyMediaUrl: "/media/demo-cusco-machupicchu.webp",
  storyFocalX: 50,
  storyFocalY: 50,
  missionTitle: "Que viajar se sienta posible, claro y tuyo.",
  missionBody: "Nuestra misión es ayudarte a convertir una idea —por pequeña o incompleta que parezca— en una experiencia que haga sentido con tu tiempo, tu presupuesto y tu manera de viajar.",
  missionQuote: "Por eso empezamos escuchando: una buena recomendación no se impone, se construye contigo.",
  journeySteps: [
    { label: "Una idea" },
    { label: "Decisiones claras" },
    { label: "Un viaje a tu ritmo" },
    { label: "Un recuerdo propio" },
  ],
  values: ["Atención humana y cálida", "Transparencia sin letra chica", "Acompañamiento 24/7", "Pasión por los detalles"],
  accompanyBadge: "03 · Cómo te acompañamos",
  accompanyTitle: "Acompañarte no es darte un itinerario y desaparecer.",
  accompanySubtitle: "Es permanecer disponible cuando aparecen dudas, cambios o nuevas ideas.",
  accompanySteps: [
    { title: "Escucharte", body: "Partimos de tu ritmo, tus prioridades y lo que realmente quieres vivir." },
    { title: "Dar forma contigo", body: "Ordenamos destinos, tiempos y decisiones para que el plan se sienta posible." },
    { title: "Permanecer presente", body: "Si algo cambia, sabes que hay una persona al otro lado del mensaje." },
  ],
  accompanyQuote: "No queremos que sientas que compraste un viaje. Queremos que sientas que alguien lo pensó contigo.",
  accompanyQuoteAttribution: "— La forma Viajes Carolina",
  momentsBadge: "04 · Lo que queda del viaje",
  momentsTitle: "Una agencia también se conoce por lo que sus viajeros recuerdan.",
  momentsSubtitle: "Estas escenas representan historias reales que luego podrán mostrarse con las fotografías de clientes administradas desde el panel.",
  momentsMediaId: 2,
  momentsMediaUrl: "/media/demo-cartagena-caribe.webp",
  momentsFocalX: 50,
  momentsFocalY: 50,
  moments: [
    { title: "Una familia que necesitaba ir sin prisa", body: "El viaje se diseñó pensando en pausas, compañía y tiempo para disfrutar juntos." },
    { title: "Una pareja que aún no tenía destino", body: "La conversación empezó por lo que querían sentir, no por una lista de lugares." },
    { title: "Un grupo que quería sentirse acompañado", body: "Cada decisión quedó clara y siempre supieron dónde escribir si algo cambiaba." },
  ],
  humanBadge: "05 · Quién te acompaña",
  humanTitle: "Al otro lado no hay respuestas automáticas.",
  humanSubtitle: "Hay una persona que lee tu mensaje, entiende el contexto y piensa contigo el siguiente paso.",
  humanTagline: "Te lee · Te orienta · Permanece",
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
    quote: "Quiero que cada persona sienta que puede preguntar, decidir con calma y disfrutar desde antes de viajar.",
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

// Devuelve como máximo 3 promociones activas, ordenadas por recencia
// (createdAt desc, id como desempate) — la primera es la más reciente/
// protagonista. Espeja el contrato de GET /api/public/v1/promotions/featured.
export function getMockFeaturedPromotions(): PromotionDTO[] {
  return MOCK_PROMOTIONS
    .filter((p) => p.active)
    .sort((a, b) => {
      const diff = new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      return diff !== 0 ? diff : b.id - a.id;
    })
    .slice(0, 3);
}

export function getMockAdminPromotions(): PromotionDTO[] {
  return MOCK_PROMOTIONS;
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
    quote: req.quote,
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
    quote: req.quote ?? current.quote,
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

export const DEFAULT_BLOG_CATEGORIES: BlogCategoryDTO[] = [
  {
    id: 1,
    name: "Guías de Destinos",
    slug: "guias-de-destinos",
    description: "Consejos detallados, qué ver y cómo planificar tu estancia en los mejores destinos del mundo.",
    displayOrder: 1,
    active: true,
  },
  {
    id: 2,
    name: "Consejos de Viaje",
    slug: "consejos-de-viaje",
    description: "Tips prácticos sobre equipaje, documentación, seguros de viaje y cambio de moneda.",
    displayOrder: 2,
    active: true,
  },
  {
    id: 3,
    name: "Lunas de Miel & Romance",
    slug: "lunas-de-miel",
    description: "Inspiración, hoteles boutique y resorts exclusivos para parejas y recién casados.",
    displayOrder: 3,
    active: true,
  },
  {
    id: 4,
    name: "Gastronomía & Cultura",
    slug: "gastronomia-y-cultura",
    description: "Descubre los sabores ancestrales y las tradiciones culturales de cada rincón turístico.",
    displayOrder: 4,
    active: true,
  },
];

export const DEFAULT_BLOG_POSTS: BlogPostDTO[] = [
  {
    id: 1,
    slug: "guia-completa-para-viajar-a-cartagena-2026",
    title: "Guía Completa para viajar a Cartagena de Indias: Qué ver, clima y mejores zonas",
    summary: "Descubre por qué Cartagena es la joya del Caribe: desde sus murallas históricas en la Ciudad Amurallada hasta las aguas cristalinas de las Islas del Rosario.",
    contentMarkdown: `# Guía Completa para viajar a Cartagena de Indias 🌴\n\nCartagena de Indias es uno de los destinos más vibrantes y coloridos de Sudamérica. Con su arquitectura colonial, atardeceres mágicos sobre el mar Caribe y gastronomía de primer nivel, es perfecta para escapadas de 4 a 5 días.\n\n---\n\n## 1. La Mejor Época para Viajar\nEl clima en Cartagena es tropical todo el año, con una temperatura promedio de 28°C a 32°C.\n- **Temporada seca (Diciembre a Abril):** Brisa fresca, cielos despejados y poca lluvia. Ideal para días de playa y paseos en catamarán.\n- **Temporada verde (Mayo a Noviembre):** Menor afluencia turística, mejores tarifas hoteleras y chaparrones breves al caer la tarde.\n\n---\n\n## 2. Zonas Imperdibles\n- **Ciudad Amurallada & San Diego:** Camina entre balcones floridos, plazas históricas y los mejores restaurantes de mariscos.\n- **Barrio Getsemaní:** El corazón bohemio y artístico, famoso por su arte urbano, música en vivo y ambiente nocturno.\n- **Islas del Rosario & Barú:** A solo 45 minutos en lancha, encontrarás playas de arena blanca y aguas turquesas ideales para snorkel.\n\n---\n\n## 3. Consejos de una Asesora\n> *"En Viajes Carolina recomendamos dedicar al menos un día completo a navegar hacia un resort de playa privado en las Islas del Rosario para disfrutar de la tranquilidad sin vendedores ambulantes."* — **Carolina Zúñiga**, Directora de Experiencias.\n\n¿Quieres cotizar tu paquete a Cartagena con vuelos y hotel boutique incluido? ¡Escríbenos por WhatsApp!`,
    categoryId: 1,
    categoryName: "Guías de Destinos",
    categorySlug: "guias-de-destinos",
    coverMediaId: 2,
    coverMediaUrl: "/media/demo-cartagena-caribe.webp",
    coverFocalX: 50,
    coverFocalY: 50,
    authorName: "Carolina Zúñiga",
    authorAvatarFocalX: 50,
    authorAvatarFocalY: 50,
    readingTimeMinutes: 6,
    tags: ["Cartagena", "Caribe", "Colombia", "Playas", "Consejos"],
    status: "PUBLISHED",
    publishedAt: "2026-08-18T00:00:00.000Z",
    viewCount: 342,
    isFeatured: true,
    active: true,
  },
  {
    id: 2,
    slug: "machu-picchu-todo-lo-que-debes-saber-antes-de-subir",
    title: "Machu Picchu: Todo lo que debes saber sobre circuitos, trenes y entradas",
    summary: "Planifica tu visita a la maravilla del mundo sin contratiempos. Te explicamos los nuevos circuitos del santuario, tipos de trenes y aclimatación en Cusco.",
    contentMarkdown: `# Machu Picchu: Guía Definitiva y Consejos Prácticos 🏔️\n\nSubir a Machu Picchu es el sueño de millones de viajeros. Sin embargo, debido a las regulaciones de conservación y los nuevos circuitos oficiales del Ministerio de Cultura, una planificación anticipada es esencial.\n\n---\n\n## 1. Los Nuevos Circuitos Oficiales\nA partir del 2024, el santuario se divide en circuitos específicos:\n- **Circuito Panorámico (Terraza Clásica):** Perfecto para la foto postal emblemática y las vistas superiores.\n- **Circuito Clásico (Ciudadela Central):** Recorre el Templo del Sol, la Plaza Principal y las terrazas agrícolas.\n- **Circuito de la Realeza:** Acceso directo a la zona baja y fuentes ceremoniales.\n\n---\n\n## 2. Tipos de Trenes desde Ollantaytambo\n- **Expedition / The 360°:** Opciones cómodas con ventanas panorámicas superiores para apreciar el Valle Sagrado.\n- **Vistadome / Observatory:** Vagones con shows folclóricos en vivo, música andina y aperitivos tradicionales.\n- **Hiram Bingham (Belmond):** Lujo supremo con comida gourmet y coche bar abierto.\n\n---\n\n## 3. Claves para Evitar el Mal de Altura (Soroche)\n1. Pasa al menos el primer día descansando en el Valle Sagrado (2,870 msnm) antes de pernoctar en Cusco ciudad (3,400 msnm).\n2. Bebe suficiente mate de coca o infusión de muña.\n3. Come ligero durante las primeras 24 horas.\n\n¿Deseas que coordinemos tus boletos de tren y guiado privado en Machu Picchu? ¡Contáctanos y diseñamos tu itinerario!`,
    categoryId: 1,
    categoryName: "Guías de Destinos",
    categorySlug: "guias-de-destinos",
    coverMediaId: 3,
    coverMediaUrl: "/media/demo-cusco-machupicchu.webp",
    coverFocalX: 50,
    coverFocalY: 50,
    authorName: "Valeria Gómez",
    authorAvatarFocalX: 50,
    authorAvatarFocalY: 50,
    readingTimeMinutes: 8,
    tags: ["Cusco", "Machu Picchu", "Perú", "Aventura", "Historia"],
    status: "PUBLISHED",
    publishedAt: "2026-08-18T00:00:00.000Z",
    viewCount: 518,
    isFeatured: true,
    active: true,
  },
  {
    id: 3,
    slug: "consejos-para-tu-primer-resort-all-inclusive-en-punta-cana",
    title: "Consejos para tu primer resort All-Inclusive en Punta Cana",
    summary: "Maximiza tu experiencia todo incluido: cómo elegir entre resorts familiares o solo adultos, reservas de cenas temáticas y propinas.",
    contentMarkdown: `# Cómo Disfrutar al Máximo un Resort Todo Incluido en Punta Cana 🍹\n\nPunta Cana es el sinónimo universal de desconexión caribeña. Con kilómetros de costa en Playa Bávaro y Uvero Alto, elegir el hotel correcto marcará la diferencia en tus vacaciones.\n\n---\n\n## 1. Solo Adultos vs. Resort Familiar\n- **Family-Friendly:** Cuentan con parques acuáticos, clubes infantiles con monitores certificados y restaurantes con menú para niños.\n- **Adults-Only:** Piscinas infinity con ambiente chill-out, cenas gourmet a la luz de las velas y serenidad garantizada.\n\n---\n\n## 2. Trucos para las Cenas a la Carta\nLa mayoría de los resorts 5 estrellas incluyen cenas temáticas (japonesa teppanyaki, francesa, italiana o cortes de carne).\n- **Tip Pro:** Descarga la app del hotel apenas hagas el check-in para reservar tus horarios favoritos de cena y evitar filas.\n\n---\n\n## 3. ¿Qué Ropa Empacar?\n- Trajes de baño y ropa ligera de lino/algodón.\n- Al menos un atuendo *elegante sport* (pantalón largo para caballeros) para los restaurantes temáticos nocturnos.\n- Protector solar biodegradable para proteger los arrecifes coralinos.\n\n¡Cotiza tu paquete All-Inclusive a Punta Cana con vuelos y traslados privados con Viajes Carolina!`,
    categoryId: 3,
    categoryName: "Lunas de Miel & Romance",
    categorySlug: "lunas-de-miel",
    coverMediaId: 2,
    coverMediaUrl: "/media/demo-cartagena-caribe.webp",
    coverFocalX: 50,
    coverFocalY: 50,
    authorName: "Lucía Ramos",
    authorAvatarFocalX: 50,
    authorAvatarFocalY: 50,
    readingTimeMinutes: 5,
    tags: ["Punta Cana", "All Inclusive", "Caribe", "Lunas de Miel", "Resorts"],
    status: "PUBLISHED",
    publishedAt: "2026-08-18T00:00:00.000Z",
    viewCount: 289,
    isFeatured: false,
    active: true,
  },
  {
    id: 4,
    slug: "documentacion-y-seguros-que-necesitas-para-viajar-en-2026",
    title: "Documentación y seguros: Lo que necesitas saber antes de salir del Perú",
    summary: "Vigencia de pasaporte, requisitos para viajar por Sudamérica con DNI y la importancia de contar con tarjeta de asistencia médica internacional.",
    contentMarkdown: `# Documentos y Asistencia Médica: Viaja con Total Tranquilidad 📋\n\nPlanear un viaje no solo se trata de elegir el destino y el hotel; asegurarte de que tu documentación esté al día te ahorrará sorpresas desagradables en el counter del aeropuerto.\n\n---\n\n## 1. Vigencia del Pasaporte\nLa mayoría de los países internacionales (incluyendo la Unión Europea, Estados Unidos y países del Caribe) exigen que tu pasaporte tenga **al menos 6 meses de vigencia** a partir de la fecha de retorno.\n\n---\n\n## 2. ¿Cuándo Puedes Viajar Solo con DNI?\nGracias a los acuerdos de la Comunidad Andina y el Mercosur, los ciudadanos peruanos pueden viajar a:\n- Colombia, Ecuador, Bolivia, Chile, Argentina, Brasil, Uruguay y Paraguay portando únicamente su **DNI vigente en buen estado**.\n\n---\n\n## 3. La Importancia de la Tarjeta de Asistencia Médica\nUn imprevisto de salud en el extranjero puede costar miles de dólares. En Viajes Carolina siempre incluimos planes integrales que cubren:\n- Asistencia médica por accidente o enfermedad 24/7.\n- Compensación por pérdida o demora de equipaje.\n- Telemedicina en español a través de app móvil.\n\n¿Tienes dudas sobre los requisitos de tu próximo destino? ¡Nuestras asesoras te guían paso a paso!`,
    categoryId: 2,
    categoryName: "Consejos de Viaje",
    categorySlug: "consejos-de-viaje",
    coverMediaId: 1,
    coverMediaUrl: "/media/demo-hero-travel.webp",
    coverFocalX: 50,
    coverFocalY: 50,
    authorName: "Carolina Zúñiga",
    authorAvatarFocalX: 50,
    authorAvatarFocalY: 50,
    readingTimeMinutes: 4,
    tags: ["Documentación", "Seguros", "Tips", "Aeropuertos", "DNI"],
    status: "PUBLISHED",
    publishedAt: "2026-08-18T00:00:00.000Z",
    viewCount: 195,
    isFeatured: false,
    active: true,
  },
];

export let MOCK_BLOG_CATEGORIES: BlogCategoryDTO[] = [...DEFAULT_BLOG_CATEGORIES];
export let MOCK_BLOG_POSTS: BlogPostDTO[] = [...DEFAULT_BLOG_POSTS];

export function getMockPublicBlog(categorySlug?: string, search?: string, page = 0, size = 9): PublicBlogResponse {
  let filtered = MOCK_BLOG_POSTS.filter((p) => p.active && p.status === "PUBLISHED");
  if (categorySlug && categorySlug !== "all") {
    filtered = filtered.filter((p) => p.categorySlug === categorySlug);
  }
  if (search && search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }
  const total = filtered.length;
  const start = page * size;
  const items = filtered.slice(start, start + size);
  const featuredPost = (!categorySlug || categorySlug === "all") && (!search || !search.trim())
    ? MOCK_BLOG_POSTS.find((p) => p.isFeatured && p.active && p.status === "PUBLISHED") || items[0]
    : undefined;

  return {
    items,
    categories: MOCK_BLOG_CATEGORIES.filter((c) => c.active),
    featuredPost,
    total,
    page,
    size,
    totalPages: Math.ceil(total / (size > 0 ? size : 9)),
  };
}

export function getMockBlogCategories(admin = false): BlogCategoryDTO[] {
  return admin ? MOCK_BLOG_CATEGORIES : MOCK_BLOG_CATEGORIES.filter((c) => c.active);
}

export function getMockBlogPostBySlug(slug: string): BlogPostDetailResponse {
  const post = MOCK_BLOG_POSTS.find((p) => p.slug === slug && p.active);
  if (!post) throw new Error(`Artículo no encontrado con slug: ${slug}`);
  post.viewCount = (post.viewCount || 0) + 1;
  const relatedPosts = MOCK_BLOG_POSTS.filter(
    (p) => p.categoryId === post.categoryId && p.id !== post.id && p.active && p.status === "PUBLISHED"
  ).slice(0, 3);
  return { post, relatedPosts };
}

export function getMockAdminBlogPosts(status?: string, search?: string): BlogPostDTO[] {
  let list = [...MOCK_BLOG_POSTS];
  if (status && status !== "ALL") {
    list = list.filter((p) => p.status === status);
  }
  if (search && search.trim()) {
    const q = search.toLowerCase();
    list = list.filter(
      (p) => p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q)
    );
  }
  return list;
}

export function createMockBlogPost(req: CreateOrUpdateBlogPostRequest): BlogPostDTO {
  const cat = MOCK_BLOG_CATEGORIES.find((c) => c.id === req.categoryId) || MOCK_BLOG_CATEGORIES[0];
  const newPost: BlogPostDTO = {
    id: Date.now(),
    slug: req.slug,
    title: req.title,
    summary: req.summary,
    contentMarkdown: req.contentMarkdown,
    categoryId: req.categoryId,
    categoryName: cat.name,
    categorySlug: cat.slug,
    coverMediaId: req.coverMediaId,
    coverMediaUrl: "/media/demo-cartagena-caribe.webp",
    coverFocalX: req.coverFocalX ?? 50,
    coverFocalY: req.coverFocalY ?? 50,
    authorName: req.authorName || "Equipo Viajes Carolina",
    authorAvatarMediaId: req.authorAvatarMediaId,
    authorAvatarUrl: req.authorAvatarMediaId ? "/media/demo-hero-travel.webp" : undefined,
    authorAvatarFocalX: req.authorAvatarFocalX ?? 50,
    authorAvatarFocalY: req.authorAvatarFocalY ?? 50,
    readingTimeMinutes: req.readingTimeMinutes || 5,
    tags: req.tags || [],
    status: req.status || "PUBLISHED",
    publishedAt: req.status === "PUBLISHED" ? new Date().toISOString() : undefined,
    viewCount: 0,
    isFeatured: req.isFeatured ?? false,
    active: req.active ?? true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  MOCK_BLOG_POSTS.unshift(newPost);
  return newPost;
}

export function updateMockBlogPost(id: number, req: CreateOrUpdateBlogPostRequest): BlogPostDTO {
  const index = MOCK_BLOG_POSTS.findIndex((p) => p.id === id);
  if (index === -1) throw new Error(`Artículo no encontrado con ID: ${id}`);
  const current = MOCK_BLOG_POSTS[index];
  const cat = req.categoryId ? MOCK_BLOG_CATEGORIES.find((c) => c.id === req.categoryId) || current : current;
  const updated: BlogPostDTO = {
    ...current,
    slug: req.slug || current.slug,
    title: req.title || current.title,
    summary: req.summary || current.summary,
    contentMarkdown: req.contentMarkdown || current.contentMarkdown,
    categoryId: req.categoryId || current.categoryId,
    categoryName: (cat as any).name || current.categoryName,
    categorySlug: (cat as any).slug || current.categorySlug,
    coverMediaId: req.coverMediaId !== undefined ? req.coverMediaId : current.coverMediaId,
    coverFocalX: req.coverFocalX ?? current.coverFocalX,
    coverFocalY: req.coverFocalY ?? current.coverFocalY,
    authorName: req.authorName || current.authorName,
    authorAvatarMediaId: req.authorAvatarMediaId !== undefined ? req.authorAvatarMediaId : current.authorAvatarMediaId,
    authorAvatarFocalX: req.authorAvatarFocalX ?? current.authorAvatarFocalX,
    authorAvatarFocalY: req.authorAvatarFocalY ?? current.authorAvatarFocalY,
    readingTimeMinutes: req.readingTimeMinutes || current.readingTimeMinutes,
    tags: req.tags || current.tags,
    status: req.status || current.status,
    isFeatured: req.isFeatured !== undefined ? req.isFeatured : current.isFeatured,
    active: req.active !== undefined ? req.active : current.active,
    updatedAt: new Date().toISOString(),
  };
  MOCK_BLOG_POSTS[index] = updated;
  return updated;
}

export function deleteMockBlogPost(id: number): void {
  const index = MOCK_BLOG_POSTS.findIndex((p) => p.id === id);
  if (index !== -1) {
    MOCK_BLOG_POSTS[index].active = false;
    MOCK_BLOG_POSTS[index].status = "ARCHIVED";
  }
}

export function createMockBlogCategory(req: CreateOrUpdateBlogCategoryRequest): BlogCategoryDTO {
  const newCat: BlogCategoryDTO = {
    id: Date.now(),
    name: req.name,
    slug: req.slug,
    description: req.description,
    displayOrder: req.displayOrder || MOCK_BLOG_CATEGORIES.length + 1,
    active: req.active ?? true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  MOCK_BLOG_CATEGORIES.push(newCat);
  return newCat;
}

export function updateMockBlogCategory(id: number, req: CreateOrUpdateBlogCategoryRequest): BlogCategoryDTO {
  const index = MOCK_BLOG_CATEGORIES.findIndex((c) => c.id === id);
  if (index === -1) throw new Error(`Categoría no encontrada con ID: ${id}`);
  const current = MOCK_BLOG_CATEGORIES[index];
  const updated: BlogCategoryDTO = {
    ...current,
    name: req.name || current.name,
    slug: req.slug || current.slug,
    description: req.description !== undefined ? req.description : current.description,
    displayOrder: req.displayOrder ?? current.displayOrder,
    active: req.active !== undefined ? req.active : current.active,
    updatedAt: new Date().toISOString(),
  };
  MOCK_BLOG_CATEGORIES[index] = updated;
  return updated;
}

export function deleteMockBlogCategory(id: number): void {
  const index = MOCK_BLOG_CATEGORIES.findIndex((c) => c.id === id);
  if (index !== -1) {
    MOCK_BLOG_CATEGORIES[index].active = false;
  }
}

export const DEFAULT_CONTACT_PAGE: ContactPageDTO = {
  id: 1,
  heroBadge: "CONTACTO DIRECTO",
  heroTitle: "¿Cómo prefieres que conversemos?",
  heroSubtitle: "La forma más rápida es WhatsApp. También puedes escribirnos o visitarnos en nuestra oficina.",
  heroCtaText: "Escríbenos por WhatsApp",
  heroNoteText: "Te responde una persona, no un formulario.",
  heroCtaMessage: "Hola Viajes Carolina, quiero contarles qué tengo en mente para mi próximo viaje.",
  heroInfoTitle: "Información de contacto",
  heroInfoWhatsappLabel: "WHATSAPP",
  heroInfoWhatsappValue: "Atención inmediata",
  heroInfoEmailLabel: "CORREO",
  heroInfoScheduleLabel: "HORARIO",
  heroInfoOfficeLabel: "OFICINA",
  officeSectionBadge: "UBICACIÓN",
  officeSectionTitle: "Encuéntranos en Google Maps.",
  officeMapTitle: "Horario de atención",
  officeVisitNote: "Si deseas atención presencial, escríbenos primero por WhatsApp.",
  officeMapEyebrow: "MAPA REAL INTEGRADO",
  officeMapPinTitle: "Viajes Carolina",
  officeMapPinSubtitle: "Ubicación verificada en Google Maps",
  officeMapsLinkText: "Abrir ubicación en Google Maps",
  officeVisitLabel: "ANTES DE VENIR",
  revision: 1,
  updatedAt: "2026-08-18T00:00:00.000Z",
};

export const DEFAULT_INQUIRIES: ContactInquiryDTO[] = [
  {
    id: 1,
    fullName: "Andrea Salazar",
    email: "andrea.salazar@gmail.com",
    phone: "+51998877665",
    destinationOfInterest: "Cartagena de Indias",
    travelDateApprox: "Noviembre 2026",
    travelersCount: 2,
    message: "Hola, me gustaría cotizar un viaje de 5 días para mi aniversario en Cartagena con hotel frente al mar.",
    preferredContactChannel: "WHATSAPP",
    status: "NEW",
    turnstileVerified: true,
    createdAt: "2026-08-18T10:00:00.000Z",
    updatedAt: "2026-08-18T10:00:00.000Z",
  },
  {
    id: 2,
    fullName: "Jorge Villanueva",
    email: "jorge.villanueva@outlook.com",
    phone: "+51912345678",
    destinationOfInterest: "Cusco & Machu Picchu",
    travelDateApprox: "Diciembre 2026",
    travelersCount: 4,
    message: "Deseo cotizar paquete familiar para 2 adultos y 2 niños con tren turístico a Machu Picchu y excursión a Valle Sagrado.",
    preferredContactChannel: "WHATSAPP",
    status: "IN_PROGRESS",
    turnstileVerified: true,
    createdAt: "2026-08-17T15:00:00.000Z",
    updatedAt: "2026-08-17T15:00:00.000Z",
  },
];

export let MOCK_CONTACT_PAGE: ContactPageDTO = { ...DEFAULT_CONTACT_PAGE };
export let MOCK_INQUIRIES: ContactInquiryDTO[] = [...DEFAULT_INQUIRIES];

export function getMockPublicContact(): PublicContactResponse {
  return {
    page: MOCK_CONTACT_PAGE,
    primaryPhone: MOCK_SITE_SETTINGS.primaryPhone,
    whatsappPhone: MOCK_SITE_SETTINGS.whatsappPhone || "+51987654321",
    contactEmail: MOCK_SITE_SETTINGS.contactEmail,
    officeAddress: `${MOCK_OFFICE_LOCATION.addressLine}, ${MOCK_OFFICE_LOCATION.district}, ${MOCK_OFFICE_LOCATION.city}`,
    officeHours: MOCK_OFFICE_LOCATION.scheduleWeekdays,
    officeScheduleSaturdays: MOCK_OFFICE_LOCATION.scheduleSaturdays,
    officeGoogleMapsUrl: MOCK_OFFICE_LOCATION.googleMapsUrl,
    officeLatitude: MOCK_OFFICE_LOCATION.latitude,
    officeLongitude: MOCK_OFFICE_LOCATION.longitude,
  };
}

export function submitMockContactInquiry(req: SubmitContactInquiryRequest): ContactInquiryDTO {
  const newInquiry: ContactInquiryDTO = {
    id: Date.now(),
    fullName: req.fullName,
    email: req.email,
    phone: req.phone,
    destinationOfInterest: req.destinationOfInterest,
    travelDateApprox: req.travelDateApprox,
    travelersCount: req.travelersCount || 1,
    message: req.message,
    preferredContactChannel: req.preferredContactChannel || "WHATSAPP",
    status: "NEW",
    turnstileVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  MOCK_INQUIRIES.unshift(newInquiry);
  return newInquiry;
}

export function getMockAdminContact(): ContactPageDTO {
  return MOCK_CONTACT_PAGE;
}

export function updateMockAdminContact(req: UpdateContactPageRequest): ContactPageDTO {
  MOCK_CONTACT_PAGE = {
    ...MOCK_CONTACT_PAGE,
    ...req,
    revision: (MOCK_CONTACT_PAGE.revision || 1) + 1,
    updatedAt: new Date().toISOString(),
  };
  return MOCK_CONTACT_PAGE;
}

export function getMockAdminInquiries(statusFilter?: string): ContactInquiryDTO[] {
  if (statusFilter && statusFilter !== "ALL") {
    return MOCK_INQUIRIES.filter((i) => i.status === statusFilter);
  }
  return MOCK_INQUIRIES;
}

export function updateMockInquiryStatus(id: number, status: string): ContactInquiryDTO {
  const index = MOCK_INQUIRIES.findIndex((i) => i.id === id);
  if (index === -1) throw new Error(`Solicitud no encontrada con ID: ${id}`);
  const current = MOCK_INQUIRIES[index];
  const updated: ContactInquiryDTO = {
    ...current,
    status,
    updatedAt: new Date().toISOString(),
  };
  MOCK_INQUIRIES[index] = updated;
  return updated;
}

export const MOCK_API_INFO: ApiInfoDTO = {
  name: "Viajes Carolina API (Mock)",
  version: "1.0.0",
  status: "UP",
  architecture: "Hexagonal Architecture with Quarkus 3.x & Java 25 LTS",
  timestamp: "2026-08-18T00:00:00.000Z",
};

export function getMockGlobalSearch(query = "", type: SearchResultType = "ALL", limit = 20): GlobalSearchResponse {
  const q = query.trim().toLowerCase();
  const allResults: SearchResultItemDTO[] = [];

  // 1. Promotions
  if (type === "ALL" || type === "PROMOTION") {
    MOCK_PROMOTIONS.filter((p) => p.active).forEach((p) => {
      let score = 0;
      if (!q) {
        score = 1.0;
      } else {
        if (p.title.toLowerCase().includes(q)) score += 3.0;
        if (p.destination.toLowerCase().includes(q)) score += 2.5;
        if (p.summary.toLowerCase().includes(q)) score += 1.0;
      }
      if (score > 0) {
        allResults.push({
          entityType: "PROMOTION",
          entityId: p.id,
          entitySlug: p.slug,
          title: p.title,
          subtitle: p.summary,
          metadataInfo: p.destination,
          imageUrl: p.featuredMediaUrl || "/media/demo-cartagena-caribe.webp",
          targetUrl: "/#promociones",
          badgeText: `USD ${p.priceUsd}`,
          score,
        });
      }
    });
  }

  // 2. Blog Posts
  if (type === "ALL" || type === "BLOG_POST") {
    MOCK_BLOG_POSTS.filter((b) => b.active && b.status === "PUBLISHED").forEach((b) => {
      let score = 0;
      if (!q) {
        score = 1.0;
      } else {
        if (b.title.toLowerCase().includes(q)) score += 3.0;
        if (b.summary.toLowerCase().includes(q)) score += 2.0;
        if (b.tags.some((t) => t.toLowerCase().includes(q))) score += 1.5;
      }
      if (score > 0) {
        allResults.push({
          entityType: "BLOG_POST",
          entityId: b.id,
          entitySlug: b.slug,
          title: b.title,
          subtitle: b.summary,
          metadataInfo: b.categoryName || "Blog",
          imageUrl: b.coverMediaUrl || "/media/demo-cartagena-caribe.webp",
          targetUrl: `/blog/${b.slug}`,
          badgeText: `${b.readingTimeMinutes} min`,
          score,
        });
      }
    });
  }

  allResults.sort((a, b) => (b.score || 0) - (a.score || 0));
  const results = allResults.slice(0, limit);

  return {
    query,
    filterType: type,
    total: results.length,
    results,
    suggestedQueries: ["Cartagena", "Machu Picchu", "Punta Cana", "Playa & Relax", "Consejos de Viaje", "Cusco"],
  };
}

// Home Blog Inspiration Mocks (Corte 12)
export const DEFAULT_HOME_BLOG_INSPIRATION: HomeBlogInspirationDTO = {
  id: 1,
  badgeText: "03 · Historias para guardar",
  titleHighlight: "Historias que te ayudan a viajar mejor",
  titleAccent: "",
  subtitle: "Guías breves, claras y nacidas de dudas reales para disfrutar cada etapa con más confianza.",
  ctaText: "Entrar al diario de viaje",
  ctaUrl: "/blog",
  postsLimit: 3,
  active: true,
  createdAt: "2026-08-18T00:00:00.000Z",
  updatedAt: "2026-08-18T00:00:00.000Z",
};

export let MOCK_HOME_BLOG_INSPIRATION: HomeBlogInspirationDTO = { ...DEFAULT_HOME_BLOG_INSPIRATION };

export function getMockHomeBlogInspiration(): PublicHomeBlogInspirationResponse {
  const posts = MOCK_BLOG_POSTS.filter((p) => p.active && p.status === "PUBLISHED").slice(0, MOCK_HOME_BLOG_INSPIRATION.postsLimit || 3);
  return {
    config: MOCK_HOME_BLOG_INSPIRATION,
    posts,
  };
}

export function updateMockHomeBlogInspiration(req: UpdateHomeBlogInspirationRequest): HomeBlogInspirationDTO {
  MOCK_HOME_BLOG_INSPIRATION = {
    ...MOCK_HOME_BLOG_INSPIRATION,
    ...req,
    updatedAt: new Date().toISOString(),
  };
  return MOCK_HOME_BLOG_INSPIRATION;
}

// Home Conversational Pause Mocks — sección "04 · Antes de seguir"
export const DEFAULT_HOME_CONVERSATIONAL_PAUSE: HomeConversationalPauseDTO = {
  id: 1,
  badgeText: "04 · Antes de seguir",
  title: "¿Ya imaginas cómo podría sentirse tu próximo viaje?",
  subtitle: "No necesitas tener todo decidido. Cuéntanos qué te ilusiona y una asesora te ayuda a darle forma.",
  whatsappCtaText: "Conversarlo por WhatsApp",
  whatsappMessageTemplate: "Hola Viajes Carolina, quiero contarles qué tengo en mente para mi próximo viaje.",
  createdAt: "2026-08-22T00:00:00.000Z",
  updatedAt: "2026-08-22T00:00:00.000Z",
};

export let MOCK_HOME_CONVERSATIONAL_PAUSE: HomeConversationalPauseDTO = { ...DEFAULT_HOME_CONVERSATIONAL_PAUSE };

export function getMockHomeConversationalPause(): HomeConversationalPauseDTO {
  return MOCK_HOME_CONVERSATIONAL_PAUSE;
}

export function updateMockHomeConversationalPause(req: UpdateHomeConversationalPauseRequest): HomeConversationalPauseDTO {
  MOCK_HOME_CONVERSATIONAL_PAUSE = { ...MOCK_HOME_CONVERSATIONAL_PAUSE, ...req, updatedAt: new Date().toISOString() };
  return MOCK_HOME_CONVERSATIONAL_PAUSE;
}

// Home Promotions Section Mocks — copy de "02 · Promociones" + CTA de cierre
export const DEFAULT_HOME_PROMOTIONS_SECTION: HomePromotionsSectionDTO = {
  id: 1,
  badgeText: "02 · Viajes para empezar a imaginar",
  title: "Algunas formas de vivir tu próximo viaje",
  subtitle: "Experiencias que podemos ajustar a tus tiempos, compañía y presupuesto.",
  bottomCtaQuestion: "Cuéntanos qué imaginas y lo armamos contigo.",
  bottomCtaEyebrow: "SI NINGUNO ENCAJA EXACTAMENTE",
  bottomCtaCopy: "Fechas, presupuesto y tipo de viaje: una asesora prepara opciones reales para ti.",
  bottomCtaWhatsappText: "Quiero una propuesta a mi medida",
  bottomCtaWhatsappMessage: "Hola Viajes Carolina, me gustaría conversar sobre una de sus promociones.",
  createdAt: "2026-08-22T00:00:00.000Z",
  updatedAt: "2026-08-22T00:00:00.000Z",
};

export let MOCK_HOME_PROMOTIONS_SECTION: HomePromotionsSectionDTO = { ...DEFAULT_HOME_PROMOTIONS_SECTION };

export function getMockHomePromotionsSection(): HomePromotionsSectionDTO {
  return MOCK_HOME_PROMOTIONS_SECTION;
}

export function updateMockHomePromotionsSection(req: UpdateHomePromotionsSectionRequest): HomePromotionsSectionDTO {
  MOCK_HOME_PROMOTIONS_SECTION = { ...MOCK_HOME_PROMOTIONS_SECTION, ...req, updatedAt: new Date().toISOString() };
  return MOCK_HOME_PROMOTIONS_SECTION;
}

// Home Testimonials Section Mocks — copy de "05 · Historias reales"
export const DEFAULT_HOME_TESTIMONIALS_SECTION: HomeTestimonialsSectionDTO = {
  id: 1,
  badgeText: "05 · Experiencias reales",
  title: "Lo que nuestros viajeros más valoran",
  subtitle: "Escucha, claridad y acompañamiento antes, durante y después del viaje.",
  createdAt: "2026-08-22T00:00:00.000Z",
  updatedAt: "2026-08-22T00:00:00.000Z",
};

export let MOCK_HOME_TESTIMONIALS_SECTION: HomeTestimonialsSectionDTO = { ...DEFAULT_HOME_TESTIMONIALS_SECTION };

export function getMockHomeTestimonialsSection(): HomeTestimonialsSectionDTO {
  return MOCK_HOME_TESTIMONIALS_SECTION;
}

export function updateMockHomeTestimonialsSection(req: UpdateHomeTestimonialsSectionRequest): HomeTestimonialsSectionDTO {
  MOCK_HOME_TESTIMONIALS_SECTION = { ...MOCK_HOME_TESTIMONIALS_SECTION, ...req, updatedAt: new Date().toISOString() };
  return MOCK_HOME_TESTIMONIALS_SECTION;
}

// Home FAQ Section Mocks — copy de "06 · Antes de continuar"
export const DEFAULT_HOME_FAQ_SECTION: HomeFaqSectionDTO = {
  id: 1,
  badgeText: "06 · Antes de continuar",
  title: "Lo que solemos conversar antes de viajar",
  subtitle: "Es normal tener dudas sobre fechas, pagos o destinos. Aquí respondemos las más frecuentes.",
  createdAt: "2026-08-22T00:00:00.000Z",
  updatedAt: "2026-08-22T00:00:00.000Z",
};

export let MOCK_HOME_FAQ_SECTION: HomeFaqSectionDTO = { ...DEFAULT_HOME_FAQ_SECTION };

export function getMockHomeFaqSection(): HomeFaqSectionDTO {
  return MOCK_HOME_FAQ_SECTION;
}

export function updateMockHomeFaqSection(req: UpdateHomeFaqSectionRequest): HomeFaqSectionDTO {
  MOCK_HOME_FAQ_SECTION = { ...MOCK_HOME_FAQ_SECTION, ...req, updatedAt: new Date().toISOString() };
  return MOCK_HOME_FAQ_SECTION;
}

// Claims & Contact Explore Links Mocks (Corte 13)
export const DEFAULT_CONTACT_EXPLORE_LINKS: ContactExploreLinkDTO[] = [
  {
    id: 1,
    title: "Libro de Reclamaciones",
    description: "Conforme a lo establecido en el Código de Protección y Defensa del Consumidor del Perú.",
    iconName: "BookOpenIcon",
    targetUrl: "/reclamaciones",
    buttonText: "Registrar Hoja de Reclamación",
    displayOrder: 1,
    active: true,
    createdAt: "2026-08-18T00:00:00.000Z",
    updatedAt: "2026-08-18T00:00:00.000Z",
  },
  {
    id: 2,
    title: "Preguntas Frecuentes",
    description: "Resuelve tus dudas sobre reservas, métodos de pago, equipaje y políticas de viaje.",
    iconName: "QuestionMarkCircleIcon",
    targetUrl: "/#faq",
    buttonText: "Ver Preguntas Frecuentes",
    displayOrder: 2,
    active: true,
    createdAt: "2026-08-18T00:00:00.000Z",
    updatedAt: "2026-08-18T00:00:00.000Z",
  },
  {
    id: 3,
    title: "Visita Nuestra Oficina",
    description: "Te atendemos en Miraflores con previa cita para planificar tu itinerario personalizado.",
    iconName: "MapPinIcon",
    targetUrl: "https://maps.google.com/?q=Av.+Larco+101,+Miraflores,+Lima",
    buttonText: "Cómo Llegar en Google Maps",
    displayOrder: 3,
    active: true,
    createdAt: "2026-08-18T00:00:00.000Z",
    updatedAt: "2026-08-18T00:00:00.000Z",
  },
];

export const DEFAULT_CLAIM_RECORDS: ClaimRecordDTO[] = [
  {
    id: 1,
    claimCode: "REC-2026-0001",
    fullName: "Juan Pérez Alarcón",
    documentType: "DNI",
    documentNumber: "45892314",
    email: "juan.perez@ejemplo.com",
    phone: "+51987112233",
    address: "Calle Las Flores 230, San Isidro, Lima",
    isMinor: false,
    contractedType: "SERVICIO",
    claimedAmount: 1250.0,
    currency: "PEN",
    description: "Servicio de paquete turístico a Cusco contratado para Julio 2026",
    claimType: "RECLAMO",
    consumerDetail: "Deseo solicitar la reprogramación de fechas debido a motivos de fuerza mayor justificados con anticipación.",
    consumerRequest: "Reubicación de fecha de viaje sin cobro de penalidad administrativa.",
    status: "PENDING",
    createdAt: "2026-08-18T00:00:00.000Z",
    updatedAt: "2026-08-18T00:00:00.000Z",
    relatedService: "paquete",
    reservationCode: "RES-48291",
    serviceDate: "2026-07-01",
    responseChannel: "EMAIL",
  },
];

export let MOCK_CONTACT_EXPLORE_LINKS: ContactExploreLinkDTO[] = [...DEFAULT_CONTACT_EXPLORE_LINKS];
export let MOCK_CLAIM_RECORDS: ClaimRecordDTO[] = [...DEFAULT_CLAIM_RECORDS];

export function getMockContactExploreLinks(): ContactExploreLinkDTO[] {
  return MOCK_CONTACT_EXPLORE_LINKS.filter((l) => l.active);
}

export function getMockAdminClaims(status?: string): ClaimRecordDTO[] {
  if (status && status !== "ALL") {
    return MOCK_CLAIM_RECORDS.filter((c) => c.status === status);
  }
  return MOCK_CLAIM_RECORDS;
}

export function getMockClaimByCode(claimCode: string): ClaimRecordDTO | null {
  return MOCK_CLAIM_RECORDS.find((c) => c.claimCode === claimCode) || null;
}

export function submitMockClaim(req: SubmitClaimRequest): ClaimRecordDTO {
  const year = new Date().getFullYear();
  const nextNum = MOCK_CLAIM_RECORDS.length + 1;
  const claimCode = `REC-${year}-${String(nextNum).padStart(4, "0")}`;

  const newClaim: ClaimRecordDTO = {
    id: Date.now(),
    claimCode,
    fullName: req.fullName,
    documentType: req.documentType,
    documentNumber: req.documentNumber,
    email: req.email,
    phone: req.phone,
    address: req.address,
    isMinor: req.isMinor ?? false,
    parentName: req.parentName,
    parentDocument: req.parentDocument,
    contractedType: req.contractedType || "SERVICIO",
    claimedAmount: req.claimedAmount,
    currency: req.currency || "PEN",
    description: req.description,
    claimType: req.claimType || "RECLAMO",
    consumerDetail: req.consumerDetail,
    consumerRequest: req.consumerRequest,
    status: "PENDING",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    relatedService: req.relatedService || "otro",
    reservationCode: req.reservationCode,
    serviceDate: req.serviceDate,
    responseChannel: req.responseChannel || "EMAIL",
  };

  MOCK_CLAIM_RECORDS.unshift(newClaim);
  return newClaim;
}

export function updateMockClaimStatus(id: number, status: string, responseNotes?: string): ClaimRecordDTO {
  const index = MOCK_CLAIM_RECORDS.findIndex((c) => c.id === id);
  if (index === -1) throw new Error(`Reclamo no encontrado con ID: ${id}`);
  const current = MOCK_CLAIM_RECORDS[index];
  const updated: ClaimRecordDTO = {
    ...current,
    status,
    responseNotes: responseNotes !== undefined ? responseNotes : current.responseNotes,
    responseAt: responseNotes ? new Date().toISOString() : current.responseAt,
    updatedAt: new Date().toISOString(),
  };
  MOCK_CLAIM_RECORDS[index] = updated;
  return updated;
}

// Auth, Users & Governance Mock Data & Helpers (Corte 14)
export const DEFAULT_ADMIN_USERS: AdminUserDTO[] = [
  {
    id: 1,
    username: "admin",
    email: "admin@viajescarolina.com",
    fullName: "Administrador General",
    role: "SUPER_ADMIN",
    active: true,
    lastLoginAt: "2026-08-18T12:00:00.000Z",
    createdAt: "2026-08-18T00:00:00.000Z",
    updatedAt: "2026-08-18T00:00:00.000Z",
  },
  {
    id: 2,
    username: "editor",
    email: "editor@viajescarolina.com",
    fullName: "Editor de Contenidos",
    role: "CONTENT_EDITOR",
    active: true,
    lastLoginAt: "2026-08-18T10:30:00.000Z",
    createdAt: "2026-08-18T00:00:00.000Z",
    updatedAt: "2026-08-18T00:00:00.000Z",
  },
  {
    id: 3,
    username: "carolina",
    email: "carolina@viajescarolina.com",
    fullName: "Carolina Zúñiga",
    role: "ADVISOR",
    active: true,
    lastLoginAt: "2026-08-18T09:15:00.000Z",
    createdAt: "2026-08-18T00:00:00.000Z",
    updatedAt: "2026-08-18T00:00:00.000Z",
  },
];

export const DEFAULT_AUDIT_LOGS: AuditLogDTO[] = [
  {
    id: 1,
    userId: 1,
    username: "admin",
    action: "INITIAL_SYSTEM_BOOTSTRAP",
    entityType: "SYSTEM",
    entityId: "1",
    ipHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    detailsJson: '{"message": "Sistema inicializado con gobernanza y roles RBAC"}',
    createdAt: "2026-08-18T00:00:00.000Z",
  },
  {
    id: 2,
    userId: 1,
    username: "admin",
    action: "UPDATE_SETTINGS",
    entityType: "SITE_SETTINGS",
    entityId: "1",
    ipHash: "a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0",
    detailsJson: '{"siteName": "Viajes Carolina", "brandTagline": "El viaje comienza aquí"}',
    createdAt: "2026-08-18T08:30:00.000Z",
  },
  {
    id: 3,
    userId: 2,
    username: "editor",
    action: "PUBLISH_PROMOTION",
    entityType: "PROMOTION",
    entityId: "1",
    ipHash: "b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef01",
    detailsJson: '{"slug": "cartagena-donde-el-mar-te-espera", "priceUsd": 429}',
    createdAt: "2026-08-18T09:45:00.000Z",
  },
  {
    id: 4,
    userId: 1,
    username: "admin",
    action: "UPDATE_CLAIM_STATUS",
    entityType: "CLAIM",
    entityId: "1",
    ipHash: "c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef012",
    detailsJson: '{"claimCode": "REC-2026-0001", "status": "RESOLVED"}',
    createdAt: "2026-08-18T11:20:00.000Z",
  },
];

export let MOCK_ADMIN_USERS: AdminUserDTO[] = [...DEFAULT_ADMIN_USERS];
export let MOCK_AUDIT_LOGS: AuditLogDTO[] = [...DEFAULT_AUDIT_LOGS];

export function loginMockAdmin(req: LoginRequest): LoginResponse {
  const ident = req.usernameOrEmail.trim().toLowerCase();
  const user = MOCK_ADMIN_USERS.find((u) => u.username.toLowerCase() === ident || u.email.toLowerCase() === ident);

  if (!user || !user.active) {
    throw new Error("Credenciales inválidas o cuenta de usuario inactiva.");
  }

  user.lastLoginAt = new Date().toISOString();

  // Registrar auditoría de login
  recordMockAuditLog("LOGIN_SUCCESS", "AUTH", String(user.id), JSON.stringify({ username: user.username }));

  return {
    token: `jwt-mock-${user.username}-${Date.now()}`,
    tokenType: "Bearer",
    expiresInSeconds: 86400,
    user,
  };
}

export function getMockAdminUsers(): AdminUserDTO[] {
  return MOCK_ADMIN_USERS;
}

export function createMockAdminUser(req: CreateAdminUserRequest): AdminUserDTO {
  const exists = MOCK_ADMIN_USERS.some(
    (u) => u.username.toLowerCase() === req.username.toLowerCase() || u.email.toLowerCase() === req.email.toLowerCase()
  );
  if (exists) {
    throw new Error("El usuario o correo electrónico ya se encuentra registrado.");
  }

  const newUser: AdminUserDTO = {
    id: Date.now(),
    username: req.username.trim().toLowerCase(),
    email: req.email.trim().toLowerCase(),
    fullName: req.fullName.trim(),
    role: req.role || "CONTENT_EDITOR",
    active: req.active ?? true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  MOCK_ADMIN_USERS.push(newUser);
  recordMockAuditLog("CREATE_ADMIN_USER", "USER", String(newUser.id), JSON.stringify({ username: newUser.username, role: newUser.role }));
  return newUser;
}

export function updateMockAdminUser(id: number, req: UpdateAdminUserRequest): AdminUserDTO {
  const index = MOCK_ADMIN_USERS.findIndex((u) => u.id === id);
  if (index === -1) throw new Error(`Usuario no encontrado con ID: ${id}`);
  const current = MOCK_ADMIN_USERS[index];

  const updated: AdminUserDTO = {
    ...current,
    username: req.username.trim().toLowerCase(),
    email: req.email.trim().toLowerCase(),
    fullName: req.fullName.trim(),
    role: req.role ?? current.role,
    active: req.active ?? current.active,
    updatedAt: new Date().toISOString(),
  };

  MOCK_ADMIN_USERS[index] = updated;
  recordMockAuditLog("UPDATE_ADMIN_USER", "USER", String(id), JSON.stringify({ username: updated.username, role: updated.role }));
  return updated;
}

export function getMockAuditLogs(entityType?: string, limit: number = 50): AuditLogDTO[] {
  let list = MOCK_AUDIT_LOGS;
  if (entityType && entityType !== "ALL") {
    list = list.filter((l) => l.entityType.toUpperCase() === entityType.toUpperCase());
  }
  return list.slice(0, limit);
}

export function recordMockAuditLog(action: string, entityType: string, entityId?: string, detailsJson: string = "{}"): AuditLogDTO {
  const newLog: AuditLogDTO = {
    id: Date.now(),
    username: "admin",
    action,
    entityType,
    entityId,
    ipHash: "a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0",
    detailsJson,
    createdAt: new Date().toISOString(),
  };
  MOCK_AUDIT_LOGS.unshift(newLog);
  return newLog;
}

// Publishing & ISR Mock Helpers (Corte 15)
export const DEFAULT_PUBLISH_RESPONSE: PublishResponseDTO = {
  status: "READY",
  revalidatedTags: ["all", "home", "promotions", "blog", "about", "contact", "reclamaciones"],
  publishedAt: "2026-08-18T00:00:00.000Z",
  triggeredBy: "SYSTEM",
  message: "Motor de publicación ISR On-Demand activo y en espera de eventos.",
};

export let MOCK_LAST_PUBLISH: PublishResponseDTO = { ...DEFAULT_PUBLISH_RESPONSE };

export function getMockPublishingStatus(): PublishResponseDTO {
  return MOCK_LAST_PUBLISH;
}

export function publishMockContent(req: PublishRequestDTO): PublishResponseDTO {
  const target = req.target || "ALL";
  let tags: string[] = [];

  if (req.customTags && req.customTags.length > 0) {
    tags = req.customTags;
  } else {
    switch (target.toUpperCase()) {
      case "HOME":
        tags = ["home", "/"];
        break;
      case "PROMOTIONS":
        tags = ["promotions", "/"];
        break;
      case "BLOG":
        tags = ["blog", "/blog"];
        break;
      case "ABOUT":
        tags = ["about", "/nosotros"];
        break;
      case "CONTACT":
        tags = ["contact", "/contacto"];
        break;
      default:
        tags = ["all", "/", "/blog", "/nosotros", "/contacto", "/reclamaciones"];
        break;
    }
  }

  const response: PublishResponseDTO = {
    status: "SUCCESS",
    revalidatedTags: tags,
    publishedAt: new Date().toISOString(),
    triggeredBy: "admin",
    message: `Publicación completada exitosamente. Se revalidaron ${tags.length} tags/rutas en Next.js ISR.`,
  };

  MOCK_LAST_PUBLISH = response;
  recordMockAuditLog("PUBLISH_ON_DEMAND_ISR", "PUBLISHING", target, JSON.stringify({ target, tags, reason: req.reason }));
  return response;
}






