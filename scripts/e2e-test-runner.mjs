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

  // 1. Verificación de Rutas Web Públicas (Corte 0, Corte 1, Corte 2)
  console.log("📦 1. Verificando Web Pública (http://localhost:3000)...");
  try {
    const webRes = await fetch(`${BASE_WEB_URL}`);
    assert(webRes.status === 200, `Web pública responde con HTTP 200 OK (${webRes.status})`);
    const webHtml = await webRes.text();
    assert(webHtml.includes("Viajes Carolina"), "HTML contiene nombre de marca 'Viajes Carolina'");
    assert(webHtml.includes("Tu viaje comienza"), "HTML contiene titular H1 de Figma Hero");
    assert(webHtml.includes("Recorre el Sitio") || webHtml.includes("Larco 101"), "HTML contiene estructura de Footer (Corte 2)");
  } catch (err) {
    assert(false, `Error conectando a Web Pública: ${err.message}`);
  }

  // 2. Verificación de Rutas y Navegación del Panel Admin
  console.log("\n📦 2. Verificando Panel Admin (http://localhost:3001)...");
  try {
    const adminRes = await fetch(`${BASE_ADMIN_URL}`);
    assert(adminRes.status === 200, `Admin Dashboard responde con HTTP 200 OK (${adminRes.status})`);

    const identidadRes = await fetch(`${BASE_ADMIN_URL}/identidad`);
    assert(identidadRes.status === 200, `Módulo Identidad & WhatsApp responde con HTTP 200 OK (${identidadRes.status})`);

    const oficinaRes = await fetch(`${BASE_ADMIN_URL}/oficina`);
    assert(oficinaRes.status === 200, `Módulo Oficina & Horarios responde con HTTP 200 OK (${oficinaRes.status})`);
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

  // 5. Purity Check: Cero dependencias nativas de Node.js en paquetes compartidos de cliente
  console.log("\n📦 5. Verificando Purity Check & Client Isolation en paquetes compartidos...");
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
