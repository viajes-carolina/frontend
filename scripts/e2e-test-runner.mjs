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

  // 1. Verificación de Rutas Web Públicas (Corte 0 al 7)
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
  } catch (err) {
    assert(false, `Error conectando a Web Pública: ${err.message}`);
  }

  // 2. Verificación de Rutas y Navegación del Panel Admin (Cortes 1 al 7)
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

  // 10. Purity Check: Cero dependencias nativas de Node.js en paquetes compartidos de cliente
  console.log("\n📦 10. Verificando Purity Check & Client Isolation en paquetes compartidos...");
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
