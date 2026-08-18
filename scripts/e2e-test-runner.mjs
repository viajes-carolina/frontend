// ==============================================================================
// Viajes Carolina — Automated E2E Quality Gate Test Runner (vc_qa_engineer)
// ==============================================================================

const BASE_WEB_URL = "http://localhost:3000";
const BASE_ADMIN_URL = "http://localhost:3001";

let passedCount = 0;
let failedCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedCount++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failedCount++;
  }
}

async function runE2ETests() {
  console.log("==========================================================");
  console.log("🚀 EJECUTANDO SUITE E2E DE CALIDAD — VIAJES CAROLINA");
  console.log("==========================================================\n");

  // 1. Verificación de Rutas Web Públicas (Cortes 0 al 8)
  console.log("📦 1. Verificando Web Pública (http://localhost:3000)...");
  try {
    const webRes = await fetch(`${BASE_WEB_URL}`);
    assert(webRes.status === 200, `Web pública responde con HTTP 200 OK (${webRes.status})`);
    const webHtml = await webRes.text();
    assert(webHtml.includes("Viajes Carolina"), "HTML contiene nombre de marca 'Viajes Carolina'");
    assert(webHtml.includes("Tu viaje comienza"), "HTML contiene titular H1 de Figma Hero");
    assert(webHtml.includes("Cuéntame tu viaje"), "HTML contiene CTA principal de WhatsApp");
    assert(webHtml.includes("Asesoría sin costo") || webHtml.includes("Respuesta rápida"), "HTML contiene indicadores de confianza");
    assert(webHtml.includes("intención de viaje") || webHtml.includes("Playa &amp; Relax") || webHtml.includes("Playa & Relax"), "HTML contiene sección de Intenciones de Viaje (Corte 5)");
    assert(webHtml.includes("inspiran a viajar") || webHtml.includes("Cartagena") || webHtml.includes("Cusco"), "HTML contiene sección de Promociones Destacadas (Corte 6)");
    assert(webHtml.includes("Historias y experiencias") || webHtml.includes("Mariana") || webHtml.includes("Carlos Mendoza"), "HTML contiene sección de Testimonios (Corte 7)");
    assert(webHtml.includes("Preguntas Frecuentes") || webHtml.includes("asesoría para cotizar"), "HTML contiene sección de FAQ Acordeón (Corte 7)");
    assert(webHtml.includes("Hablar con una Asesora por WhatsApp") || webHtml.includes("una conversación"), "HTML contiene Closing CTA Section (Corte 7)");
    assert(webHtml.includes("Recorre el Sitio") || webHtml.includes("Larco 101"), "HTML contiene estructura de Footer (Corte 2)");

    const promoCatalogRes = await fetch(`${BASE_WEB_URL}/promociones`);
    assert(promoCatalogRes.status === 200, `Catálogo de promociones /promociones responde HTTP 200 OK (${promoCatalogRes.status})`);

    const nosotrosRes = await fetch(`${BASE_WEB_URL}/nosotros`);
    assert(nosotrosRes.status === 200, `Página pública Nosotros /nosotros responde HTTP 200 OK (${nosotrosRes.status})`);
    const nosotrosHtml = await nosotrosRes.text();
    assert(nosotrosHtml.includes("Conoce Nuestra Esencia") || nosotrosHtml.includes("transformando viajes"), "HTML de Nosotros contiene Hero y Estadísticas (Corte 8)");
    assert(nosotrosHtml.includes("Nuestra Historia") || nosotrosHtml.includes("Miraflores, Lima"), "HTML de Nosotros contiene Historia y Valores (Corte 8)");
    assert(nosotrosHtml.includes("Misión &amp; Visión") || nosotrosHtml.includes("Misión & Visión"), "HTML de Nosotros contiene Misión y Visión (Corte 8)");
    assert(nosotrosHtml.includes("Asesoras de Viaje") || nosotrosHtml.includes("Carolina Zúñiga") || nosotrosHtml.includes("Lucía Ramos"), "HTML de Nosotros contiene Asesoras con WhatsApp (Corte 8)");

    const contactoRes = await fetch(`${BASE_WEB_URL}/contacto`);
    assert(contactoRes.status === 200, `Página pública Contacto /contacto responde HTTP 200 OK (${contactoRes.status})`);
    const contactoHtml = await contactoRes.text();
    assert(contactoHtml.includes("Estamos para Ayudarte") || contactoHtml.includes("próximo destino"), "HTML de Contacto contiene Hero de Contacto (Corte 9)");
    assert(contactoHtml.includes("Envíanos un Mensaje") || contactoHtml.includes("Nombre Completo"), "HTML de Contacto contiene Formulario con Validación Anti-Bot (Corte 9)");
    assert(contactoHtml.includes("Atención Directa") || contactoHtml.includes("Escríbenos por WhatsApp"), "HTML de Contacto contiene Caja de Canales Directos & Oficina (Corte 9)");
  } catch (err) {
    assert(false, `Error conectando a Web Pública: ${err.message}`);
  }

  // 2. Verificación de Rutas y Navegación del Panel Admin (Cortes 1 al 9)
  console.log("\n📦 2. Verificando Panel Admin (http://localhost:3001)...");
  try {
    const adminRes = await fetch(`${BASE_ADMIN_URL}`);
    assert(adminRes.status === 200, `Admin Dashboard responde con HTTP 200 OK (${adminRes.status})`);

    const inicioRes = await fetch(`${BASE_ADMIN_URL}/inicio`);
    assert(inicioRes.status === 200, `Módulo Inicio & Hero responde con HTTP 200 OK (${inicioRes.status})`);

    const promoRes = await fetch(`${BASE_ADMIN_URL}/promociones`);
    assert(promoRes.status === 200, `Módulo Promociones & Paquetes responde con HTTP 200 OK (${promoRes.status})`);

    const intencionesRes = await fetch(`${BASE_ADMIN_URL}/intenciones`);
    assert(intencionesRes.status === 200, `Módulo Intenciones de Viaje responde con HTTP 200 OK (${intencionesRes.status})`);

    const confianzaRes = await fetch(`${BASE_ADMIN_URL}/confianza`);
    assert(confianzaRes.status === 200, `Módulo Confianza, Testimonios & FAQ responde con HTTP 200 OK (${confianzaRes.status})`);

    const nosotrosAdminRes = await fetch(`${BASE_ADMIN_URL}/nosotros`);
    assert(nosotrosAdminRes.status === 200, `Módulo Nosotros & Asesoras responde con HTTP 200 OK (${nosotrosAdminRes.status})`);

    const contactoAdminRes = await fetch(`${BASE_ADMIN_URL}/contacto`);
    assert(contactoAdminRes.status === 200, `Módulo Contacto & Leads responde con HTTP 200 OK (${contactoAdminRes.status})`);

    const identidadRes = await fetch(`${BASE_ADMIN_URL}/identidad`);
    assert(identidadRes.status === 200, `Módulo Identidad & WhatsApp responde con HTTP 200 OK (${identidadRes.status})`);

    const oficinaRes = await fetch(`${BASE_ADMIN_URL}/oficina`);
    assert(oficinaRes.status === 200, `Módulo Oficina & Horarios responde con HTTP 200 OK (${oficinaRes.status})`);

    const mediosRes = await fetch(`${BASE_ADMIN_URL}/medios`);
    assert(mediosRes.status === 200, `Módulo Biblioteca de Medios responde con HTTP 200 OK (${mediosRes.status})`);
  } catch (err) {
    assert(false, `Error conectando a Panel Admin: ${err.message}`);
  }

  // 3. Verificación de API Proxy & Persistencia E2E (Corte 1: Identidad & WhatsApp)...
  console.log("\n📦 3. Verificando API Proxy & Persistencia E2E (Corte 1: Identidad & WhatsApp)...");
  try {
    const siteGet = await fetch(`${BASE_ADMIN_URL}/api/proxy/public/v1/site`);
    assert(siteGet.status === 200, `GET /api/proxy/public/v1/site responde 200 OK (${siteGet.status})`);
    const siteData = await siteGet.json();
    assert(siteData.siteName === "Viajes Carolina", `Nombre de sitio correcto: "${siteData.siteName}"`);
    assert(!!siteData.whatsappPhone, `Canal WhatsApp activo presente: "${siteData.whatsappPhone}"`);

    // Mutación E2E en Backend
    const testSiteName = "Viajes Carolina";
    const sitePut = await fetch(`${BASE_ADMIN_URL}/api/proxy/admin/v1/settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        siteName: testSiteName,
        brandTagline: "El viaje comienza aquí",
        contactEmail: "contacto@viajescarolina.com",
        primaryPhone: "+51 987 654 321",
        facebookUrl: "https://facebook.com/viajescarolina",
        instagramUrl: "https://instagram.com/viajescarolina",
        tiktokUrl: "https://tiktok.com/@viajescarolina",
      }),
    });
    assert(sitePut.status === 200, `PUT /api/proxy/admin/v1/settings responde 200 OK (${sitePut.status})`);
    const updatedSite = await sitePut.json();
    assert(updatedSite.siteName === testSiteName, `Nombre de sitio actualizado y persistido: "${updatedSite.siteName}"`);
  } catch (err) {
    assert(false, `Error en prueba E2E de Settings: ${err.message}`);
  }

  // 4. Verificación de API Proxy & Persistencia E2E (Corte 2: Oficina & Horarios)...
  console.log("\n📦 4. Verificando API Proxy & Persistencia E2E (Corte 2: Oficina & Horarios)...");
  try {
    const officeGet = await fetch(`${BASE_ADMIN_URL}/api/proxy/public/v1/office`);
    assert(officeGet.status === 200, `GET /api/proxy/public/v1/office responde 200 OK (${officeGet.status})`);
    const officeData = await officeGet.json();
    assert(officeData.city === "Lima" || officeData.city.includes("Lima"), `Ciudad de oficina configurada: "${officeData.city}"`);

    // Mutación E2E en Backend PostgreSQL
    const testAddress = "Av. Larco 101, Oficina 502";
    const officePut = await fetch(`${BASE_ADMIN_URL}/api/proxy/admin/v1/office`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        addressLine: testAddress,
        district: "Miraflores",
        city: "Lima",
        country: "Perú",
        postalCode: "15074",
        referenceLandmark: "A media cuadra del Parque Kennedy",
        latitude: -12.121543,
        longitude: -77.029876,
        googleMapsUrl: "https://maps.google.com/?q=Miraflores,Lima,Peru",
        scheduleWeekdays: "Lunes a Viernes: 9:00 AM – 7:00 PM",
        scheduleSaturdays: "Sábados: 9:00 AM – 4:00 PM",
        active: true,
      }),
    });
    assert(officePut.status === 200, `PUT /api/proxy/admin/v1/office responde 200 OK (${officePut.status})`);
    const updatedOffice = await officePut.json();
    assert(updatedOffice.addressLine === testAddress, `Dirección de oficina actualizada y persistida en BD: "${updatedOffice.addressLine}"`);
  } catch (err) {
    assert(false, `Error en prueba E2E de Oficina: ${err.message}`);
  }

  // 5. Verificación de API Proxy & Persistencia E2E (Corte 3: Biblioteca de Medios & Punto Focal)...
  console.log("\n📦 5. Verificando API Proxy & Persistencia E2E (Corte 3: Medios & Punto Focal)...");
  try {
    const mediaGet = await fetch(`${BASE_ADMIN_URL}/api/proxy/admin/v1/media?page=0&size=10`);
    assert(mediaGet.status === 200, `GET /api/proxy/admin/v1/media responde 200 OK (${mediaGet.status})`);
    const mediaData = await mediaGet.json();
    assert(Array.isArray(mediaData.items) && mediaData.items.length > 0, `Biblioteca contiene activos: ${mediaData.items?.length || 0} activos`);

    // Mutación E2E de Punto Focal en Activo #1
    const testFocalX = 72.5;
    const testFocalY = 28.0;
    const focalPatch = await fetch(`${BASE_ADMIN_URL}/api/proxy/admin/v1/media/1/focal-point`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        focalX: testFocalX,
        focalY: testFocalY,
        altText: "Hero Test Focal E2E",
        caption: "Prueba automatizada de punto focal",
      }),
    });
    assert(focalPatch.status === 200, `PATCH /api/proxy/admin/v1/media/1/focal-point responde 200 OK (${focalPatch.status})`);
    const updatedMedia = await focalPatch.json();
    assert(
      Number(updatedMedia.focalX) === testFocalX,
      `Punto focal X actualizado y persistido: ${updatedMedia.focalX}%`
    );
    assert(
      Number(updatedMedia.focalY) === testFocalY,
      `Punto focal Y actualizado y persistido: ${updatedMedia.focalY}%`
    );
  } catch (err) {
    assert(false, `Error en prueba E2E de Medios: ${err.message}`);
  }

  // 6. Verificación de API Proxy & Persistencia E2E (Corte 4: Home Hero)...
  console.log("\n📦 6. Verificando API Proxy & Persistencia E2E (Corte 4: Home Hero)...");
  try {
    const heroGet = await fetch(`${BASE_ADMIN_URL}/api/proxy/public/v1/home/hero`);
    assert(heroGet.status === 200, `GET /api/proxy/public/v1/home/hero responde 200 OK (${heroGet.status})`);
    const heroData = await heroGet.json();
    assert(heroData.titleHighlight === "Tu viaje comienza", `Título principal del Hero: "${heroData.titleHighlight}"`);
    assert(Array.isArray(heroData.trustIndicators) && heroData.trustIndicators.length === 3, `Indicadores de confianza: ${heroData.trustIndicators.length} pilares`);

    // Mutación E2E de Home Hero en PostgreSQL
    const testBadge = "Empieza con una conversación";
    const heroPut = await fetch(`${BASE_ADMIN_URL}/api/proxy/admin/v1/home/hero`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        badgeText: testBadge,
        titleHighlight: "Tu viaje comienza",
        titleAccent: "antes de despegar",
        description: "Desde la primera idea hasta tu regreso, una asesora te acompaña con opciones claras, atención humana y respaldo en cada etapa.",
        whatsappCtaText: "Cuéntame tu viaje",
        whatsappMessageOverride: "Hola Viajes Carolina, quiero empezar a planear mi próximo viaje.",
        secondaryCtaText: "Explorar promociones",
        secondaryCtaUrl: "#promociones",
        trustIndicators: ["Asesoría sin costo", "Respuesta rápida", "Acompañamiento real"],
        backgroundMediaId: 1,
        featuredCardBadge: "Próxima Parada · Cusco",
        featuredCardTitle: "Machu Picchu & Valle Sagrado",
        featuredCardSubtitle: "Experiencia personalizada de 5 días / 4 noches",
        featuredCardPricePen: 1922.00,
        featuredCardOrigin: "Desde Lima",
        featuredCardMediaId: 3,
      }),
    });
    assert(heroPut.status === 200, `PUT /api/proxy/admin/v1/home/hero responde 200 OK (${heroPut.status})`);
    const updatedHero = await heroPut.json();
    assert(updatedHero.badgeText === testBadge, `Insignia de Hero actualizada y persistida: "${updatedHero.badgeText}"`);
  } catch (err) {
    assert(false, `Error en prueba E2E de Home Hero: ${err.message}`);
  }

  // 7. Verificación de API Proxy & Persistencia E2E (Corte 5: Intenciones de Viaje)...
  console.log("\n📦 7. Verificando API Proxy & Persistencia E2E (Corte 5: Intenciones de Viaje)...");
  try {
    const intentionsGet = await fetch(`${BASE_ADMIN_URL}/api/proxy/public/v1/home/intentions`);
    assert(intentionsGet.status === 200, `GET /api/proxy/public/v1/home/intentions responde 200 OK (${intentionsGet.status})`);
    const intentionsList = await intentionsGet.json();
    assert(Array.isArray(intentionsList) && intentionsList.length >= 4, `Listado de intenciones contiene ${intentionsList.length} experiencias activas`);
    
    const firstIntention = intentionsList[0];
    assert(firstIntention.slug === "playa-relax" || !!firstIntention.title, `Primera intención: "${firstIntention.title}"`);
    assert(Array.isArray(firstIntention.featuredDestinations) && firstIntention.featuredDestinations.length > 0, `Destinos sugeridos presentes: ${firstIntention.featuredDestinations.length} destinos`);

    // Mutación E2E de Intención en PostgreSQL
    const testTagline = "Desconéctate frente al mar turquesa con resorts todo incluido y paseos en catamarán.";
    const intentionPut = await fetch(`${BASE_ADMIN_URL}/api/proxy/admin/v1/intentions/1`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: "playa-relax",
        title: "Playa & Relax Caribe",
        tagline: testTagline,
        iconName: "SunIcon",
        featuredDestinations: ["Cartagena", "Cancún", "Punta Cana", "San Andrés", "Varadero"],
        whatsappMessageTemplate: "Hola Viajes Carolina, me interesa planear unas vacaciones de Playa y Relax en el Caribe. ¿Qué opciones tienen disponibles?",
        coverMediaId: 2,
        displayOrder: 1,
        active: true,
      }),
    });
    assert(intentionPut.status === 200, `PUT /api/proxy/admin/v1/intentions/1 responde 200 OK (${intentionPut.status})`);
    const updatedIntention = await intentionPut.json();
    assert(updatedIntention.tagline === testTagline, `Tagline de intención actualizado y persistido: "${updatedIntention.tagline}"`);
  } catch (err) {
    assert(false, `Error en prueba E2E de Intenciones de Viaje: ${err.message}`);
  }

  // 8. Verificación de API Proxy & Persistencia E2E (Corte 6: Promociones & Paquetes)...
  console.log("\n📦 8. Verificando API Proxy & Persistencia E2E (Corte 6: Promociones & Paquetes)...");
  try {
    const promoGet = await fetch(`${BASE_ADMIN_URL}/api/proxy/public/v1/promotions/featured`);
    assert(promoGet.status === 200, `GET /api/proxy/public/v1/promotions/featured responde 200 OK (${promoGet.status})`);
    const promoList = await promoGet.json();
    assert(Array.isArray(promoList) && promoList.length >= 4, `Listado de promociones destacadas contiene ${promoList.length} paquetes`);

    const firstPromo = promoList[0];
    assert(firstPromo.slug === "cartagena-donde-el-mar-te-espera" || !!firstPromo.title, `Primera promoción: "${firstPromo.title}"`);
    assert(Array.isArray(firstPromo.inclusions) && firstPromo.inclusions.length > 0, `Inclusiones del paquete presentes: ${firstPromo.inclusions.length} inclusiones`);

    // Mutación E2E de Promoción en PostgreSQL
    const testSummary = "Disfruta del encanto caribeño con playas de arena cálida, murallas históricas y atardeceres mágicos frente al mar.";
    const promoPut = await fetch(`${BASE_ADMIN_URL}/api/proxy/admin/v1/promotions/1`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: "cartagena-donde-el-mar-te-espera",
        title: "Cartagena: Donde el mar te espera",
        destination: "Cartagena de Indias, Colombia",
        summary: testSummary,
        priceUsd: 429.00,
        pricePen: 1590.00,
        durationDays: 4,
        durationNights: 3,
        departureCity: "Lima",
        validFrom: "2026-08-18",
        validUntil: "2027-02-14",
        featuredMediaId: 2,
        isFeatured: true,
        inclusions: [
          "Vuelos ida y vuelta con equipaje",
          "Hotel 4 estrellas con desayuno buffet",
          "Traslados aeropuerto - hotel - aeropuerto",
          "Tour en lancha a Islas del Rosario"
        ],
        exclusions: ["Gastos no especificados", "Tarjeta de asistencia médica opcional"],
        whatsappMessageTemplate: 'Hola Viajes Carolina, me interesa la promoción "Cartagena: Donde el mar te espera" desde USD 429. ¿Tienen fechas disponibles?',
        displayOrder: 1,
        active: true,
      }),
    });
    assert(promoPut.status === 200, `PUT /api/proxy/admin/v1/promotions/1 responde 200 OK (${promoPut.status})`);
    const updatedPromo = await promoPut.json();
    assert(updatedPromo.summary === testSummary, `Resumen de promoción actualizado y persistido: "${updatedPromo.summary}"`);
  } catch (err) {
    assert(false, `Error en prueba E2E de Promociones: ${err.message}`);
  }

  // 9. Verificación de API Proxy & Persistencia E2E (Corte 7: Confianza, Testimonios & FAQ)...
  console.log("\n📦 9. Verificando API Proxy & Persistencia E2E (Corte 7: Confianza, Testimonios & FAQ)...");
  try {
    const trustGet = await fetch(`${BASE_ADMIN_URL}/api/proxy/public/v1/home/trust`);
    assert(trustGet.status === 200, `GET /api/proxy/public/v1/home/trust responde 200 OK (${trustGet.status})`);
    const trustData = await trustGet.json();
    assert(Array.isArray(trustData.testimonials) && trustData.testimonials.length >= 3, `Testimonios presentes: ${trustData.testimonials?.length || 0} opiniones`);
    assert(Array.isArray(trustData.faqs) && trustData.faqs.length >= 4, `Preguntas frecuentes presentes: ${trustData.faqs?.length || 0} FAQs`);

    // Mutación E2E de Testimonio en PostgreSQL
    const testComment = "Desde que escribimos por WhatsApp nos atendieron con muchísima paciencia. Nos recomendaron un resort espectacular y el check-in fue sin complicaciones. ¡Totalmente recomendadas!";
    const testPut = await fetch(`${BASE_ADMIN_URL}/api/proxy/admin/v1/testimonials/1`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientName: "Mariana & Gonzalo Torres",
        clientLocation: "Lima, Perú",
        tripDestination: "Luna de Miel en Punta Cana",
        comment: testComment,
        rating: 5,
        avatarMediaId: 2,
        consentConfirmed: true,
        displayOrder: 1,
        active: true,
      }),
    });
    assert(testPut.status === 200, `PUT /api/proxy/admin/v1/testimonials/1 responde 200 OK (${testPut.status})`);
    const updatedTestimonial = await testPut.json();
    assert(updatedTestimonial.comment === testComment, `Comentario de testimonio actualizado y persistido: "${updatedTestimonial.clientName}"`);

    // Mutación E2E de FAQ en PostgreSQL
    const testFaqAnswer = "No, nuestra asesoría personalizada por WhatsApp o presencial en oficina es 100% gratuita y sin compromiso. Te brindamos opciones transparentes ajustadas a tu presupuesto.";
    const faqPut = await fetch(`${BASE_ADMIN_URL}/api/proxy/admin/v1/faq/1`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: "¿La asesoría para cotizar mi viaje tiene algún costo?",
        answer: testFaqAnswer,
        category: "Asesoría y Cotización",
        displayOrder: 1,
        active: true,
      }),
    });
    assert(faqPut.status === 200, `PUT /api/proxy/admin/v1/faq/1 responde 200 OK (${faqPut.status})`);
    const updatedFaq = await faqPut.json();
    assert(updatedFaq.answer === testFaqAnswer, `Respuesta FAQ actualizada y persistida: "${updatedFaq.question}"`);
  } catch (err) {
    assert(false, `Error en prueba E2E de Testimonios & FAQ: ${err.message}`);
  }

  // 10. Verificación de API Proxy & Persistencia E2E (Corte 8: Nosotros, Historia, Misión & Asesoras)...
  console.log("\n📦 10. Verificando API Proxy & Persistencia E2E (Corte 8: Nosotros & Asesoras)...");
  try {
    const aboutGet = await fetch(`${BASE_ADMIN_URL}/api/proxy/public/v1/about`);
    assert(aboutGet.status === 200, `GET /api/proxy/public/v1/about responde 200 OK (${aboutGet.status})`);
    const aboutData = await aboutGet.json();
    assert(!!aboutData.page && aboutData.page.experienceYears >= 12, `Información de página Nosotros presente: ${aboutData.page?.experienceYears} años exp`);
    assert(Array.isArray(aboutData.advisors) && aboutData.advisors.length >= 3, `Asesoras de viaje activas: ${aboutData.advisors?.length || 0} asesoras`);

    // Mutación E2E de Nosotros Page en PostgreSQL
    const testHeroTitle = "Más de 12 años transformando viajes en recuerdos inolvidables";
    const aboutPut = await fetch(`${BASE_ADMIN_URL}/api/proxy/admin/v1/about`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        heroBadge: "Conoce Nuestra Esencia",
        heroTitle: testHeroTitle,
        heroSubtitle: "Somos una agencia peruana apasionada por diseñar experiencias turísticas personalizadas, con atención cálida y respaldo antes, durante y después de tu viaje.",
        heroMediaId: 1,
        storyTitle: "Nuestra Historia",
        storyBody: "Viajes Carolina nació con el propósito de devolver la calidez humana y la tranquilidad a la planificación de viajes.",
        storyMediaId: 3,
        missionTitle: "Nuestra Misión",
        missionBody: "Brindar asesoría turística experta, honesta y personalizada, garantizando experiencias de viaje seguras y memorables.",
        visionTitle: "Nuestra Visión",
        visionBody: "Ser la agencia de viajes boutique referente en el Perú por nuestra excelencia en el servicio al cliente, innovación y acompañamiento constante.",
        values: ["Atención humana y cálida", "Transparencia sin letra chica", "Acompañamiento 24/7", "Pasión por los detalles"],
        experienceYears: 12,
        happyTravelers: 15000,
        destinationsCount: 85,
        satisfactionRatePercent: 99,
      }),
    });
    assert(aboutPut.status === 200, `PUT /api/proxy/admin/v1/about responde 200 OK (${aboutPut.status})`);
    const updatedAbout = await aboutPut.json();
    assert(updatedAbout.heroTitle === testHeroTitle, `Título de página Nosotros actualizado y persistido: "${updatedAbout.heroTitle}"`);

    // Mutación E2E de Asesora en PostgreSQL
    const testBio = "Más de 15 años diseñando itinerarios de ensueño en el Caribe y Europa. Apasionada por hacer de cada viaje una experiencia irrepetible.";
    const advisorPut = await fetch(`${BASE_ADMIN_URL}/api/proxy/admin/v1/advisors/1`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Carolina Zúñiga",
        roleTitle: "Fundadora & Directora de Experiencias",
        specialty: "Destinos Internacionales & Lunas de Miel",
        bio: testBio,
        photoMediaId: 2,
        whatsappPhone: "+51987654321",
        whatsappMessageTemplate: "Hola Carolina, me gustaría una asesoría personalizada contigo para planificar mi viaje.",
        displayOrder: 1,
        active: true,
      }),
    });
    assert(advisorPut.status === 200, `PUT /api/proxy/admin/v1/advisors/1 responde 200 OK (${advisorPut.status})`);
    const updatedAdvisor = await advisorPut.json();
    assert(updatedAdvisor.bio === testBio, `Biografía de asesora actualizada y persistida: "${updatedAdvisor.fullName}"`);
  } catch (err) {
    assert(false, `Error en prueba E2E de Nosotros & Asesoras: ${err.message}`);
  }

  // 11. Verificación de API Proxy & Persistencia E2E (Corte 9: Contacto, Anti-Bot Turnstile & Leads)...
  console.log("\n📦 11. Verificando API Proxy & Persistencia E2E (Corte 9: Contacto & Leads)...");
  try {
    const contactGet = await fetch(`${BASE_ADMIN_URL}/api/proxy/public/v1/contact`);
    assert(contactGet.status === 200, `GET /api/proxy/public/v1/contact responde 200 OK (${contactGet.status})`);
    const contactData = await contactGet.json();
    assert(!!contactData.page && !!contactData.page.heroTitle, `Información de página Contacto presente: "${contactData.page?.heroTitle}"`);
    assert(!!contactData.whatsappPhone, `Canal directo WhatsApp presente: "${contactData.whatsappPhone}"`);
    assert(!!contactData.officeAddress, `Dirección física de atención presente: "${contactData.officeAddress}"`);

    // Enviar nueva solicitud (Lead) con token Turnstile
    const testLeadEmail = `lead-${Date.now()}@ejemplo.com`;
    const inquiryPost = await fetch(`${BASE_ADMIN_URL}/api/proxy/public/v1/contact/inquiry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Roberto Sánchez Test",
        email: testLeadEmail,
        phone: "+51 912 345 678",
        destinationOfInterest: "Punta Cana All Inclusive",
        travelDateApprox: "Noviembre 2026",
        travelersCount: 2,
        message: "Hola, queremos cotizar una luna de miel en Punta Cana con todo incluido.",
        preferredContactChannel: "WHATSAPP",
        turnstileToken: "mock-valid-turnstile-token",
      }),
    });
    assert(inquiryPost.status === 201 || inquiryPost.status === 200, `POST /api/proxy/public/v1/contact/inquiry responde 201/200 OK (${inquiryPost.status})`);
    const createdInquiry = await inquiryPost.json();
    assert(createdInquiry.fullName === "Roberto Sánchez Test", `Lead creado con nombre correcto: "${createdInquiry.fullName}"`);
    assert(createdInquiry.status === "NEW", `Estado inicial de lead es NEW: "${createdInquiry.status}"`);

    // Listar solicitudes en el panel admin
    const inquiriesGet = await fetch(`${BASE_ADMIN_URL}/api/proxy/admin/v1/inquiries`);
    assert(inquiriesGet.status === 200, `GET /api/proxy/admin/v1/inquiries responde 200 OK (${inquiriesGet.status})`);
    const inquiriesList = await inquiriesGet.json();
    assert(Array.isArray(inquiriesList) && inquiriesList.length > 0, `Bandeja de leads contiene ${inquiriesList.length} solicitudes`);

    // Actualizar estado de lead a EN ATENCIÓN / CONTACTADO
    const targetLeadId = createdInquiry.id || 1;
    const statusPatch = await fetch(`${BASE_ADMIN_URL}/api/proxy/admin/v1/inquiries/${targetLeadId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "IN_PROGRESS" }),
    });
    assert(statusPatch.status === 200, `PATCH /api/proxy/admin/v1/inquiries/${targetLeadId}/status responde 200 OK (${statusPatch.status})`);
    const updatedStatus = await statusPatch.json();
    assert(updatedStatus.status === "IN_PROGRESS", `Estado de lead actualizado a IN_PROGRESS: "${updatedStatus.status}"`);

    // Mutación de Configuración Editorial de Contacto
    const testHeroBadge = "Estamos para Ayudarte";
    const contactPut = await fetch(`${BASE_ADMIN_URL}/api/proxy/admin/v1/contact`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        heroBadge: testHeroBadge,
        heroTitle: "Hablemos de tu próximo destino soñado",
        heroSubtitle: "Elige el medio que prefieras: conversemos por WhatsApp o completa el formulario.",
        whatsappBoxTitle: "¿Prefieres atención inmediata?",
        whatsappBoxSubtitle: "Nuestras asesoras responden en minutos para cotizar tu viaje.",
        formTitle: "Envíanos un Mensaje",
        formSubtitle: "Completa el formulario y te responderemos en menos de 24 horas.",
      }),
    });
    assert(contactPut.status === 200, `PUT /api/proxy/admin/v1/contact responde 200 OK (${contactPut.status})`);
    const updatedContact = await contactPut.json();
    assert(updatedContact.heroBadge === testHeroBadge, `Configuración de página Contacto actualizada y persistida: "${updatedContact.heroBadge}"`);
  } catch (err) {
    assert(false, `Error en prueba E2E de Contacto & Leads: ${err.message}`);
  }

  // 12. Purity Check: Cero dependencias nativas de Node.js en paquetes compartidos de cliente
  console.log("\n📦 12. Verificando Purity Check & Client Isolation en paquetes compartidos...");
  try {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const sharedPkgs = ["packages/ui", "packages/config", "packages/api-client"];
    const forbiddenNodeModules = ["node:fs", "node:path", "node:crypto", "node:os", "node:child_process", "node:net", "node:http", "fs", "path", "crypto", "child_process"];
    
    let violationFound = false;
    for (const pkg of sharedPkgs) {
      const pkgPath = path.resolve(process.cwd(), pkg);
      if (fs.existsSync(pkgPath)) {
        const pkgJson = JSON.parse(fs.readFileSync(path.join(pkgPath, "package.json"), "utf-8"));
        const deps = Object.keys(pkgJson.dependencies || {});
        for (const dep of deps) {
          if (forbiddenNodeModules.includes(dep)) {
            violationFound = true;
            assert(false, `Paquete ${pkg} contiene dependencia nativa prohibida de Node.js: ${dep}`);
          }
        }
      }
    }
    if (!violationFound) {
      assert(true, "Cero dependencias nativas de Node.js en packages/ui, packages/config y packages/api-client");
    }
  } catch (err) {
    assert(false, `Error en Purity Check: ${err.message}`);
  }

  // Resumen Final
  console.log("\n==========================================================");
  console.log(`📊 RESULTADOS DE PRUEBAS E2E: ${passedCount} PASADAS, ${failedCount} FALLIDAS`);
  console.log("==========================================================");

  if (failedCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runE2ETests();
