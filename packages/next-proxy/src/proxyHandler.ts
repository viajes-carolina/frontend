import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import {
  DEFAULT_SITE_SETTINGS,
  DEFAULT_OFFICE_LOCATION,
  DEFAULT_MEDIA_ASSETS,
  MediaAssetDTO,
  DEFAULT_HOME_HERO,
  DEFAULT_PROMOTIONS,
  DEFAULT_TESTIMONIALS,
  DEFAULT_FAQS,
  DEFAULT_ABOUT_PAGE,
  DEFAULT_ADVISORS,
  DEFAULT_CONTACT_PAGE,
  DEFAULT_INQUIRIES,
  updateMockMediaFocalPoint,
  SiteSettingsDTO,
  OfficeLocationDTO,
  HomeHeroDTO,
  PromotionDTO,
  TestimonialDTO,
  FaqItemDTO,
  PublicTrustResponse,
  AboutPageDTO,
  TravelAdvisorDTO,
  PublicAboutResponse,
  ContactPageDTO,
  ContactInquiryDTO,
  PublicContactResponse,
  DEFAULT_BLOG_CATEGORIES,
  DEFAULT_BLOG_POSTS,
  BlogCategoryDTO,
  BlogPostDTO,
  PublicBlogResponse,
  BlogPostDetailResponse,
  SearchResultType,
  getMockGlobalSearch,
  DEFAULT_HOME_BLOG_INSPIRATION,
  HomeBlogInspirationDTO,
  PublicHomeBlogInspirationResponse,
  DEFAULT_CLAIM_RECORDS,
  ClaimRecordDTO,
  DEFAULT_CONTACT_EXPLORE_LINKS,
  ContactExploreLinkDTO,
  DEFAULT_ADMIN_USERS,
  DEFAULT_AUDIT_LOGS,
  AdminUserDTO,
  AuditLogDTO,
  DEFAULT_PUBLISH_RESPONSE,
  PublishResponseDTO,
} from "@vc/api-client";

export type ProxyMode = "admin" | "web";

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || "http://127.0.0.1:8080";

// Siempre resuelve contra la raíz del monorepo (marcador package.json.name) ANTES de
// aceptar cualquier carpeta ".data" local — así admin y web comparten siempre el mismo
// almacén de fallback, sin importar cuál de las dos ya tenga una carpeta ".data" creada.
function getDataDir(): string {
  let curr = process.cwd();
  for (let i = 0; i < 4; i++) {
    const pkgJson = path.join(curr, "package.json");
    if (fs.existsSync(pkgJson)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgJson, "utf-8"));
        if (pkg.name === "viajes-carolina-monorepo") {
          const target = path.join(curr, ".data");
          if (!fs.existsSync(target)) fs.mkdirSync(target, { recursive: true });
          return target;
        }
      } catch {
        // ignore
      }
    }
    const parent = path.dirname(curr);
    if (parent === curr) break;
    curr = parent;
  }
  // No se encontró la raíz del monorepo (ej. ejecución empaquetada fuera del workspace).
  const fallback = path.resolve(process.cwd(), ".data");
  if (!fs.existsSync(fallback)) fs.mkdirSync(fallback, { recursive: true });
  return fallback;
}

function readStoredJson<T>(filename: string, fallback: T): T {
  try {
    const dataDir = getDataDir();
    const filePath = path.join(dataDir, filename);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(content) as T;
    }
  } catch {
    // fallback
  }
  return fallback;
}

function writeStoredJson<T>(filename: string, data: T): void {
  try {
    const dataDir = getDataDir();
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const filePath = path.join(dataDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    // ignore
  }
}

// Slug simple para el mock offline de creación de promociones — el backend
// real autogenera el suyo; este solo necesita ser único y legible dentro del
// almacén local persistido en disco.
function slugifyPromotionTitle(title: string, uniqueSuffix: number): string {
  const base = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return base ? `${base}-${uniqueSuffix}` : `promocion-${uniqueSuffix}`;
}

function saveUploadedMediaFile(filename: string, buffer: Buffer) {
  const dir = path.join(getDataDir(), "media");
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(path.join(dir, filename), buffer);
  } catch {
    // ignore
  }
}

export async function handleProxyRequest(
  req: NextRequest,
  params: Promise<{ path: string[] }>,
  mode: ProxyMode
) {
  try {
    const resolvedParams = params ? await params : { path: [] };
    const routeParams = Array.isArray(resolvedParams?.path) ? resolvedParams.path : [];
    const targetPath = routeParams.join("/");
    const queryString = req.nextUrl.search || "";
    const targetUrl = `${BACKEND_URL}/api/${targetPath}${queryString}`;
    const method = req.method;

    // Read request body safely once
    let bodyText: string | undefined = undefined;
    let bodyJson: Record<string, unknown> | undefined = undefined;
    const isMultipart = req.headers.get("content-type")?.includes("multipart/form-data") || targetPath.includes("upload");
    let uploadedFileBuffer: Buffer | null = null;
    let uploadedFileName = "";
    let uploadedMimeType = "image/webp";
    let uploadedFileSize = 0;
    let formAltText = "";
    let formCaption = "";

    if (isMultipart && method === "POST") {
      try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        if (file) {
          uploadedFileName = file.name;
          uploadedMimeType = file.type || "image/webp";
          uploadedFileSize = file.size;
          const arrayBuffer = await file.arrayBuffer();
          uploadedFileBuffer = Buffer.from(arrayBuffer);
        }
        formAltText = (formData.get("altText") as string) || "";
        formCaption = (formData.get("caption") as string) || "";
      } catch (err) {
        console.error("Error reading formData in proxy:", err);
      }
    } else if (["POST", "PUT", "PATCH"].includes(method)) {
      try {
        bodyText = await req.text();
        if (bodyText) {
          bodyJson = JSON.parse(bodyText);
        }
      } catch {
        // ignore
      }
    }

    // Try real Quarkus backend first if online
    try {
      const headers = new Headers();
      req.headers.forEach((val, key) => {
        // content-type se excluye siempre aquí: para multipart, el content-type original
        // trae el boundary de la petición YA CONSUMIDA por req.formData() más arriba —
        // reenviarlo tal cual produce un body vacío con un boundary que no coincide con
        // nada, y el backend real lo rechaza. Se reconstruye explícitamente más abajo
        // según el tipo real de body que se va a enviar.
        if (!["host", "connection", "content-length", "content-type"].includes(key.toLowerCase())) {
          headers.set(key, val);
        }
      });

      let requestBody: BodyInit | undefined;
      if (isMultipart && method === "POST" && uploadedFileBuffer) {
        // Reconstruir un FormData nuevo a partir de los bytes ya leídos — fetch() genera
        // su propio content-type con boundary correcto a partir de este objeto, así que
        // NO se debe fijar el header a mano.
        const forwardForm = new FormData();
        forwardForm.append(
          "file",
          new Blob([new Uint8Array(uploadedFileBuffer)], { type: uploadedMimeType }),
          uploadedFileName || "upload"
        );
        if (formAltText) forwardForm.append("altText", formAltText);
        if (formCaption) forwardForm.append("caption", formCaption);
        requestBody = forwardForm;
      } else {
        requestBody = bodyText;
        if (bodyText && !headers.has("content-type")) {
          headers.set("content-type", "application/json");
        }
      }

      const controller = new AbortController();
      // Las subidas de archivos (optimización de imagen incluida) tardan más que un
      // CRUD normal — un timeout de 2s las abortaría de forma espuria y las mandaría
      // al fallback local, enmascarando una subida real pero lenta.
      const timeoutId = setTimeout(() => controller.abort(), isMultipart ? 15000 : 2000);

      const response = await fetch(targetUrl, {
        method,
        headers,
        body: requestBody,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const nextRes = NextResponse.json(data, { status: response.status });
        // Reenviar Set-Cookie del backend real (ej. vc_admin_jwt en /auth/login) — sin esto
        // el login "exitoso" nunca deja sesión real en el navegador y toda escritura
        // posterior cae al fallback local silenciosamente (ver hallazgo de Fase B).
        const setCookies = typeof response.headers.getSetCookie === "function"
          ? response.headers.getSetCookie()
          : (response.headers.get("set-cookie") ? [response.headers.get("set-cookie") as string] : []);
        for (const cookie of setCookies) {
          nextRes.headers.append("set-cookie", cookie);
        }
        return nextRes;
      }

      // El backend real respondió (no es un problema de conectividad): propagar su error
      // tal cual en vez de caer al fallback local, que devolvería un 200 falso y ocultaría
      // el fallo real (ver hallazgo de Fase B — un 401 real quedaba enmascarado como éxito).
      let errorBody: unknown;
      const contentType = response.headers.get("content-type") || "";
      try {
        errorBody = contentType.includes("application/json")
          ? await response.json()
          : { message: await response.text() };
      } catch {
        errorBody = { message: "Error del backend" };
      }
      return NextResponse.json(errorBody, { status: response.status });
    } catch {
      // Backend offline / dev fallback
    }

    // Graceful Offline / Dev Fallback with Disk Persistence
    if (targetPath.includes("explore-links")) {
      const current = readStoredJson<ContactExploreLinkDTO[]>("contact_explore_links.json", DEFAULT_CONTACT_EXPLORE_LINKS);
      return NextResponse.json(current.filter((l) => l.active), { status: 200 });
    }

    if (targetPath === "public/v1/contact" || (targetPath.includes("contact") && targetPath.includes("public") && !targetPath.includes("inquiry") && !targetPath.includes("explore-links"))) {
      const p = readStoredJson<ContactPageDTO>("contact_page.json", DEFAULT_CONTACT_PAGE);
      const settings = readStoredJson<SiteSettingsDTO>("site_settings.json", DEFAULT_SITE_SETTINGS);
      const office = readStoredJson<OfficeLocationDTO>("office_location.json", DEFAULT_OFFICE_LOCATION);
      const res: PublicContactResponse = {
        page: p,
        primaryPhone: settings.primaryPhone,
        whatsappPhone: settings.whatsappPhone || "+51987654321",
        contactEmail: settings.contactEmail,
        officeAddress: `${office.addressLine}, ${office.district}, ${office.city}`,
        officeHours: office.scheduleWeekdays,
        officeGoogleMapsUrl: office.googleMapsUrl,
      };
      return NextResponse.json(res, { status: 200 });
    }

    if (targetPath.includes("inquir") || targetPath.includes("inquiry")) {
      const current = readStoredJson<ContactInquiryDTO[]>("inquiries.json", DEFAULT_INQUIRIES);
      if (method === "POST") {
        const newInq: ContactInquiryDTO = {
          id: Date.now(),
          fullName: String(bodyJson?.fullName || "Lead"),
          email: String(bodyJson?.email || "correo@ejemplo.com"),
          phone: bodyJson?.phone ? String(bodyJson.phone) : undefined,
          destinationOfInterest: bodyJson?.destinationOfInterest ? String(bodyJson.destinationOfInterest) : undefined,
          travelDateApprox: bodyJson?.travelDateApprox ? String(bodyJson.travelDateApprox) : undefined,
          travelersCount: bodyJson?.travelersCount ? Number(bodyJson.travelersCount) : 1,
          message: String(bodyJson?.message || ""),
          preferredContactChannel: String(bodyJson?.preferredContactChannel || "WHATSAPP"),
          status: "NEW",
          // El modo fallback no puede validar el token contra Cloudflare (no hay backend);
          // solo registra si el cliente envió alguno, nunca lo asume verificado.
          turnstileVerified: Boolean(bodyJson?.turnstileToken && String(bodyJson.turnstileToken).trim().length > 0),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const updated = [newInq, ...current];
        writeStoredJson("inquiries.json", updated);
        return NextResponse.json(newInq, { status: 201 });
      }
      if (method === "PATCH") {
        const idMatch = targetPath.match(/inquiries\/(\d+)/);
        const id = idMatch ? parseInt(idMatch[1], 10) : 1;
        const index = current.findIndex((i) => i.id === id);
        if (index !== -1) {
          const updatedItem = {
            ...current[index],
            status: String(bodyJson?.status || current[index].status),
            updatedAt: new Date().toISOString(),
          };
          current[index] = updatedItem as ContactInquiryDTO;
          writeStoredJson("inquiries.json", current);
          return NextResponse.json(updatedItem, { status: 200 });
        }
      }
      return NextResponse.json(current, { status: 200 });
    }

    if (targetPath.includes("contact")) {
      const current = readStoredJson<ContactPageDTO>("contact_page.json", DEFAULT_CONTACT_PAGE);
      if (method === "PUT" || method === "POST") {
        const updated = {
          ...current,
          ...(bodyJson || {}),
          revision: (current.revision || 1) + 1,
          updatedAt: new Date().toISOString(),
        };
        writeStoredJson("contact_page.json", updated);
        return NextResponse.json(updated, { status: 200 });
      }
      return NextResponse.json(current, { status: 200 });
    }

    if (targetPath === "public/v1/about" || (targetPath.includes("about") && targetPath.includes("public"))) {
      const p = readStoredJson<AboutPageDTO>("about_page.json", DEFAULT_ABOUT_PAGE);
      const adv = readStoredJson<TravelAdvisorDTO[]>("advisors.json", DEFAULT_ADVISORS);
      const res: PublicAboutResponse = {
        page: p,
        advisors: adv.filter((a) => a.active),
      };
      return NextResponse.json(res, { status: 200 });
    }

    if (targetPath.includes("advisors")) {
      const current = readStoredJson<TravelAdvisorDTO[]>("advisors.json", DEFAULT_ADVISORS);
      if (method === "POST") {
        const newA: TravelAdvisorDTO = {
          id: Date.now(),
          fullName: String(bodyJson?.fullName || "Nueva Asesora"),
          roleTitle: String(bodyJson?.roleTitle || "Asesora"),
          specialty: String(bodyJson?.specialty || "Destinos"),
          bio: String(bodyJson?.bio || ""),
          photoMediaId: bodyJson?.photoMediaId ? Number(bodyJson.photoMediaId) : undefined,
          photoMediaUrl: "/media/demo-cartagena-caribe.webp",
          whatsappPhone: String(bodyJson?.whatsappPhone || "+51987654321"),
          whatsappMessageTemplate: String(bodyJson?.whatsappMessageTemplate || ""),
          displayOrder: bodyJson?.displayOrder ? Number(bodyJson.displayOrder) : current.length + 1,
          active: bodyJson?.active !== undefined ? Boolean(bodyJson.active) : true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const updated = [...current, newA];
        writeStoredJson("advisors.json", updated);
        return NextResponse.json(newA, { status: 201 });
      }
      if (method === "PUT") {
        const idMatch = targetPath.match(/advisors\/(\d+)/);
        const id = idMatch ? parseInt(idMatch[1], 10) : 1;
        const index = current.findIndex((a) => a.id === id);
        if (index !== -1) {
          const updatedItem = {
            ...current[index],
            ...(bodyJson || {}),
            updatedAt: new Date().toISOString(),
          };
          current[index] = updatedItem as TravelAdvisorDTO;
          writeStoredJson("advisors.json", current);
          return NextResponse.json(updatedItem, { status: 200 });
        }
      }
      if (method === "DELETE") {
        const idMatch = targetPath.match(/advisors\/(\d+)/);
        const id = idMatch ? parseInt(idMatch[1], 10) : 1;
        const index = current.findIndex((a) => a.id === id);
        if (index !== -1) {
          current[index].active = false;
          writeStoredJson("advisors.json", current);
        }
        return new NextResponse(null, { status: 204 });
      }
      return NextResponse.json(current, { status: 200 });
    }

    if (targetPath.includes("about")) {
      const current = readStoredJson<AboutPageDTO>("about_page.json", DEFAULT_ABOUT_PAGE);
      if (method === "PUT" || method === "POST") {
        const updated = {
          ...current,
          ...(bodyJson || {}),
          revision: (current.revision || 1) + 1,
          updatedAt: new Date().toISOString(),
        };
        writeStoredJson("about_page.json", updated);
        return NextResponse.json(updated, { status: 200 });
      }
      return NextResponse.json(current, { status: 200 });
    }

    if (targetPath.includes("trust")) {
      const tList = readStoredJson<TestimonialDTO[]>("testimonials.json", DEFAULT_TESTIMONIALS);
      const fList = readStoredJson<FaqItemDTO[]>("faqs.json", DEFAULT_FAQS);
      const res: PublicTrustResponse = {
        testimonials: tList.filter((t) => t.active),
        faqs: fList.filter((f) => f.active),
      };
      return NextResponse.json(res, { status: 200 });
    }

    if (targetPath.includes("testimonials")) {
      const current = readStoredJson<TestimonialDTO[]>("testimonials.json", DEFAULT_TESTIMONIALS);
      if (method === "POST") {
        const newT: TestimonialDTO = {
          id: Date.now(),
          clientName: String(bodyJson?.clientName || "Cliente"),
          clientLocation: bodyJson?.clientLocation ? String(bodyJson.clientLocation) : undefined,
          tripDestination: String(bodyJson?.tripDestination || "Destino"),
          comment: String(bodyJson?.comment || ""),
          rating: Number(bodyJson?.rating || 5),
          avatarMediaId: bodyJson?.avatarMediaId ? Number(bodyJson.avatarMediaId) : undefined,
          avatarMediaUrl: "/media/demo-cartagena-caribe.webp",
          consentConfirmed: bodyJson?.consentConfirmed !== undefined ? Boolean(bodyJson.consentConfirmed) : true,
          displayOrder: bodyJson?.displayOrder ? Number(bodyJson.displayOrder) : current.length + 1,
          active: bodyJson?.active !== undefined ? Boolean(bodyJson.active) : true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const updated = [...current, newT];
        writeStoredJson("testimonials.json", updated);
        return NextResponse.json(newT, { status: 201 });
      }
      if (method === "PUT") {
        const idMatch = targetPath.match(/testimonials\/(\d+)/);
        const id = idMatch ? parseInt(idMatch[1], 10) : 1;
        const index = current.findIndex((t) => t.id === id);
        if (index !== -1) {
          const updatedItem = {
            ...current[index],
            ...(bodyJson || {}),
            updatedAt: new Date().toISOString(),
          };
          current[index] = updatedItem as TestimonialDTO;
          writeStoredJson("testimonials.json", current);
          return NextResponse.json(updatedItem, { status: 200 });
        }
      }
      if (method === "DELETE") {
        const idMatch = targetPath.match(/testimonials\/(\d+)/);
        const id = idMatch ? parseInt(idMatch[1], 10) : 1;
        const index = current.findIndex((t) => t.id === id);
        if (index !== -1) {
          current[index].active = false;
          writeStoredJson("testimonials.json", current);
        }
        return new NextResponse(null, { status: 204 });
      }
      return NextResponse.json(current, { status: 200 });
    }

    if (targetPath.includes("faq")) {
      const current = readStoredJson<FaqItemDTO[]>("faqs.json", DEFAULT_FAQS);
      if (method === "POST") {
        const newF: FaqItemDTO = {
          id: Date.now(),
          question: String(bodyJson?.question || "¿Pregunta?"),
          answer: String(bodyJson?.answer || "Respuesta"),
          category: String(bodyJson?.category || "General"),
          displayOrder: bodyJson?.displayOrder ? Number(bodyJson.displayOrder) : current.length + 1,
          active: bodyJson?.active !== undefined ? Boolean(bodyJson.active) : true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const updated = [...current, newF];
        writeStoredJson("faqs.json", updated);
        return NextResponse.json(newF, { status: 201 });
      }
      if (method === "PUT") {
        const idMatch = targetPath.match(/faq\/(\d+)/);
        const id = idMatch ? parseInt(idMatch[1], 10) : 1;
        const index = current.findIndex((f) => f.id === id);
        if (index !== -1) {
          const updatedItem = {
            ...current[index],
            ...(bodyJson || {}),
            updatedAt: new Date().toISOString(),
          };
          current[index] = updatedItem as FaqItemDTO;
          writeStoredJson("faqs.json", current);
          return NextResponse.json(updatedItem, { status: 200 });
        }
      }
      if (method === "DELETE") {
        const idMatch = targetPath.match(/faq\/(\d+)/);
        const id = idMatch ? parseInt(idMatch[1], 10) : 1;
        const index = current.findIndex((f) => f.id === id);
        if (index !== -1) {
          current[index].active = false;
          writeStoredJson("faqs.json", current);
        }
        return new NextResponse(null, { status: 204 });
      }
      return NextResponse.json(current, { status: 200 });
    }

    if (targetPath.includes("promotions")) {
      const current = readStoredJson<PromotionDTO[]>("promotions.json", DEFAULT_PROMOTIONS);

      // Creación estructurada (título, precio, fechas, foto, inclusiones) — el mock
      // offline no publica de verdad en Facebook, así que la promoción se crea sin
      // facebookPostId/facebookPermalinkUrl (a diferencia del backend real, que sí
      // publica automáticamente al crear).
      if (method === "POST" && /promotions\/?$/.test(targetPath)) {
        const id = Date.now();
        const newPromotion: PromotionDTO = {
          id,
          slug: slugifyPromotionTitle(String(bodyJson?.title || "promocion"), id),
          title: String(bodyJson?.title || "Nueva Promoción"),
          destination: String(bodyJson?.destination || ""),
          summary: String(bodyJson?.summary || ""),
          priceUsd: Number(bodyJson?.priceUsd || 0),
          pricePen: bodyJson?.pricePen !== undefined ? Number(bodyJson.pricePen) : undefined,
          durationDays: Number(bodyJson?.durationDays || 1),
          durationNights: Number(bodyJson?.durationNights || 0),
          departureCity: String(bodyJson?.departureCity || ""),
          validFrom: bodyJson?.validFrom ? String(bodyJson.validFrom) : "",
          validUntil: bodyJson?.validUntil ? String(bodyJson.validUntil) : "",
          featuredMediaId: bodyJson?.featuredMediaId !== undefined ? Number(bodyJson.featuredMediaId) : undefined,
          inclusions: Array.isArray(bodyJson?.inclusions) ? (bodyJson?.inclusions as string[]) : [],
          exclusions: Array.isArray(bodyJson?.exclusions) ? (bodyJson?.exclusions as string[]) : [],
          whatsappMessageTemplate: bodyJson?.whatsappMessageTemplate ? String(bodyJson.whatsappMessageTemplate) : undefined,
          active: true,
          source: "MANUAL",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const updated = [newPromotion, ...current];
        writeStoredJson("promotions.json", updated);
        return NextResponse.json(newPromotion, { status: 201 });
      }

      // Mostrar/Ocultar en portada: guarda la misma regla de negocio del backend real:
      // el Home siempre debe tener al menos 3 promociones activas para mostrar.
      if (method === "PATCH" && /promotions\/\d+\/active$/.test(targetPath)) {
        const idMatch = targetPath.match(/promotions\/(\d+)\/active/);
        const id = idMatch ? parseInt(idMatch[1], 10) : 1;
        const index = current.findIndex((p) => p.id === id);
        if (index === -1) {
          return NextResponse.json({ message: "Promoción no encontrada." }, { status: 404 });
        }
        const nextActive = bodyJson?.active !== undefined ? Boolean(bodyJson.active) : current[index].active;
        const activeCount = current.filter((p) => p.active).length;
        if (current[index].active && !nextActive && activeCount <= 3) {
          return NextResponse.json(
            { message: "No se puede ocultar esta promoción: quedarían menos de 3 promociones activas para mostrar en Inicio." },
            { status: 409 }
          );
        }
        const updatedItem = {
          ...current[index],
          active: nextActive,
          updatedAt: new Date().toISOString(),
        };
        current[index] = updatedItem as PromotionDTO;
        writeStoredJson("promotions.json", current);
        return NextResponse.json(updatedItem, { status: 200 });
      }

      if (targetPath.includes("featured")) {
        // Como máximo 3 promociones activas, ordenadas por recencia (createdAt desc,
        // id como desempate) — la primera del array es la más reciente/protagonista.
        const sorted = [...current]
          .filter((p) => p.active)
          .sort((a, b) => {
            const diff = new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
            return diff !== 0 ? diff : b.id - a.id;
          });
        return NextResponse.json(sorted.slice(0, 3), { status: 200 });
      }

      // Borrado definitivo: mismo guard de "nunca menos de 3 activas" que el toggle.
      if (method === "DELETE" && /promotions\/\d+$/.test(targetPath)) {
        const idMatch = targetPath.match(/promotions\/(\d+)$/);
        const id = idMatch ? parseInt(idMatch[1], 10) : -1;
        const index = current.findIndex((p) => p.id === id);
        if (index === -1) {
          return NextResponse.json({ message: "Promoción no encontrada." }, { status: 404 });
        }
        const activeCount = current.filter((p) => p.active).length;
        if (current[index].active && activeCount <= 3) {
          return NextResponse.json(
            { message: "No se puede borrar esta promoción: quedarían menos de 3 promociones activas para mostrar en Inicio." },
            { status: 409 }
          );
        }
        const updated = current.filter((p) => p.id !== id);
        writeStoredJson("promotions.json", updated);
        return new NextResponse(null, { status: 204 });
      }

      return NextResponse.json(current, { status: 200 });
    }

    if (targetPath.includes("blog-inspiration")) {
      const config = readStoredJson<HomeBlogInspirationDTO>("home_blog_inspiration.json", DEFAULT_HOME_BLOG_INSPIRATION);
      if (method === "PUT" || method === "POST") {
        const updated = {
          ...config,
          ...(bodyJson || {}),
          updatedAt: new Date().toISOString(),
        };
        writeStoredJson("home_blog_inspiration.json", updated);
        return NextResponse.json(updated, { status: 200 });
      }
      if (targetPath.includes("public")) {
        const posts = readStoredJson<BlogPostDTO[]>("blog_posts.json", DEFAULT_BLOG_POSTS);
        const activePosts = posts.filter((p) => p.active && p.status === "PUBLISHED").slice(0, config.postsLimit || 3);
        const res: PublicHomeBlogInspirationResponse = {
          config,
          posts: activePosts,
        };
        return NextResponse.json(res, { status: 200 });
      }
      return NextResponse.json(config, { status: 200 });
    }

    if (targetPath.includes("hero")) {
      const current = readStoredJson<HomeHeroDTO>("home_hero.json", DEFAULT_HOME_HERO);
      if (method === "PUT" || method === "POST") {
        const updated = {
          ...current,
          ...(bodyJson || {}),
          revision: (current.revision || 1) + 1,
          updatedAt: new Date().toISOString(),
        };
        writeStoredJson("home_hero.json", updated);
        return NextResponse.json(updated, { status: 200 });
      }
      return NextResponse.json(current, { status: 200 });
    }

    if (targetPath.includes("settings") || targetPath.includes("site")) {
      const current = readStoredJson<SiteSettingsDTO>("site_settings.json", DEFAULT_SITE_SETTINGS);
      if (method === "PUT" || method === "POST") {
        const updated = { ...current, ...(bodyJson || {}) };
        writeStoredJson("site_settings.json", updated);
        return NextResponse.json(updated, { status: 200 });
      }
      return NextResponse.json(current, { status: 200 });
    }

    if (targetPath.includes("office")) {
      const current = readStoredJson<OfficeLocationDTO>("office_location.json", DEFAULT_OFFICE_LOCATION);
      if (method === "PUT" || method === "POST") {
        const updated = {
          ...current,
          ...(bodyJson || {}),
          revision: (current.revision || 1) + 1,
          updatedAt: new Date().toISOString(),
        };
        writeStoredJson("office_location.json", updated);
        return NextResponse.json(updated, { status: 200 });
      }
      return NextResponse.json(current, { status: 200 });
    }

    if (targetPath.includes("media")) {
      const currentMedia = readStoredJson<MediaAssetDTO[]>("media_assets.json", DEFAULT_MEDIA_ASSETS);

      if (method === "POST" || targetPath.includes("upload")) {
        const id = Date.now();
        let cleanOriginalName = uploadedFileName || `imagen-${id}.webp`;
        let safeFilename = `${id}-${cleanOriginalName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        let altText = formAltText || cleanOriginalName.replace(/\.[^/.]+$/, "");
        let caption = formCaption || "";
        let storagePath = `/media/${safeFilename}`;

        if (bodyJson) {
          if (bodyJson.originalName) cleanOriginalName = String(bodyJson.originalName);
          if (bodyJson.filename) safeFilename = String(bodyJson.filename);
          if (bodyJson.altText) altText = String(bodyJson.altText);
          if (bodyJson.caption) caption = String(bodyJson.caption);
          if (bodyJson.storagePath) storagePath = String(bodyJson.storagePath);
        }

        if (uploadedFileBuffer) {
          saveUploadedMediaFile(safeFilename, uploadedFileBuffer);
        }

        const newAsset: MediaAssetDTO = {
          id,
          filename: safeFilename,
          originalName: cleanOriginalName,
          mimeType: uploadedMimeType,
          fileSizeBytes: uploadedFileSize || (uploadedFileBuffer ? uploadedFileBuffer.length : 245000),
          width: 1920,
          height: 1080,
          focalX: 50.0,
          focalY: 50.0,
          altText,
          caption,
          storagePath,
          variantsJson: "{}",
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const updated = [newAsset, ...currentMedia];
        writeStoredJson("media_assets.json", updated);
        return NextResponse.json(newAsset, { status: 201 });
      }

      if (method === "PATCH" || method === "PUT") {
        const idMatch = targetPath.match(/media\/(\d+)/);
        const id = idMatch ? parseInt(idMatch[1], 10) : 1;
        const idx = currentMedia.findIndex((m) => m.id === id);
        if (idx !== -1) {
          const updatedItem = {
            ...currentMedia[idx],
            ...(bodyJson || {}),
            updatedAt: new Date().toISOString(),
          };
          currentMedia[idx] = updatedItem as MediaAssetDTO;
          writeStoredJson("media_assets.json", currentMedia);
          return NextResponse.json(updatedItem, { status: 200 });
        }
        const fallbackUpdated = updateMockMediaFocalPoint(id, {
          focalX: typeof bodyJson?.focalX === "number" ? bodyJson.focalX : 50,
          focalY: typeof bodyJson?.focalY === "number" ? bodyJson.focalY : 50,
        });
        return NextResponse.json(fallbackUpdated || currentMedia[0], { status: 200 });
      }

      if (method === "DELETE") {
        const idMatch = targetPath.match(/media\/(\d+)/);
        const id = idMatch ? parseInt(idMatch[1], 10) : 1;
        const filtered = currentMedia.filter((m) => m.id !== id);
        writeStoredJson("media_assets.json", filtered);
        return new NextResponse(null, { status: 204 });
      }

      const idMatch = targetPath.match(/media\/(\d+)/);
      if (idMatch && method === "GET") {
        const id = parseInt(idMatch[1], 10);
        const found = currentMedia.find((m) => m.id === id);
        if (found) return NextResponse.json(found, { status: 200 });
      }

      const activeMedia = currentMedia.filter((m) => m.active !== false);
      return NextResponse.json({
        items: activeMedia,
        total: activeMedia.length,
        page: 0,
        size: 50,
        totalPages: Math.ceil(activeMedia.length / 50) || 1,
      }, { status: 200 });
    }

    if (targetPath.includes("blog")) {
      const posts = readStoredJson<BlogPostDTO[]>("blog_posts.json", DEFAULT_BLOG_POSTS);
      const categories = readStoredJson<BlogCategoryDTO[]>("blog_categories.json", DEFAULT_BLOG_CATEGORIES);

      if (targetPath === "public/v1/blog" || (targetPath.includes("blog") && targetPath.includes("public") && !targetPath.includes("categories") && !targetPath.includes("posts"))) {
        const publicPosts = posts.filter((p) => p.status === "PUBLISHED" && p.active);
        const publicCategories = categories.filter((c) => c.active);
        const featured = publicPosts.find((p) => p.isFeatured);
        const res: PublicBlogResponse = {
          items: publicPosts,
          categories: publicCategories,
          featuredPost: featured,
          total: publicPosts.length,
          page: 0,
          size: 10,
          totalPages: Math.ceil(publicPosts.length / 10),
        };
        return NextResponse.json(res, { status: 200 });
      }

      if (targetPath.includes("categories")) {
        if (method === "POST") {
          const newCat: BlogCategoryDTO = {
            id: Date.now(),
            name: String(bodyJson?.name || "Nueva Categoría"),
            slug: String(bodyJson?.slug || `cat-${Date.now()}`),
            description: bodyJson?.description ? String(bodyJson.description) : undefined,
            displayOrder: bodyJson?.displayOrder ? Number(bodyJson.displayOrder) : categories.length + 1,
            active: bodyJson?.active !== undefined ? Boolean(bodyJson.active) : true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          const updated = [...categories, newCat];
          writeStoredJson("blog_categories.json", updated);
          return NextResponse.json(newCat, { status: 201 });
        }
        if (method === "PUT") {
          const idMatch = targetPath.match(/categories\/(\d+)/);
          const id = idMatch ? parseInt(idMatch[1], 10) : 1;
          const idx = categories.findIndex((c) => c.id === id);
          if (idx !== -1) {
            const updatedItem = { ...categories[idx], ...(bodyJson || {}), updatedAt: new Date().toISOString() };
            categories[idx] = updatedItem as BlogCategoryDTO;
            writeStoredJson("blog_categories.json", categories);
            return NextResponse.json(updatedItem, { status: 200 });
          }
        }
        if (method === "DELETE") {
          const idMatch = targetPath.match(/categories\/(\d+)/);
          const id = idMatch ? parseInt(idMatch[1], 10) : 1;
          const idx = categories.findIndex((c) => c.id === id);
          if (idx !== -1) {
            categories[idx].active = false;
            writeStoredJson("blog_categories.json", categories);
          }
          return new NextResponse(null, { status: 204 });
        }
        // En modo "web" solo se listan categorías activas (superficie pública); en "admin"
        // se listan todas, incluidas las inactivas, para poder reactivarlas desde el CMS.
        return NextResponse.json(mode === "web" ? categories.filter((c) => c.active) : categories, { status: 200 });
      }

      if (targetPath.includes("posts/") && method === "GET") {
        const slug = targetPath.split("posts/")[1]?.split("?")[0];
        const post = mode === "web"
          ? posts.find((p) => p.slug === slug && p.active)
          : posts.find((p) => p.slug === slug || String(p.id) === slug);
        if (post) {
          post.viewCount = (post.viewCount || 0) + 1;
          if (mode === "web") writeStoredJson("blog_posts.json", posts);
          const related = mode === "web"
            ? posts.filter((p) => p.categoryId === post.categoryId && p.id !== post.id && p.active && p.status === "PUBLISHED").slice(0, 3)
            : posts.filter((p) => p.id !== post.id && p.status === "PUBLISHED" && p.active).slice(0, 3);
          const detailRes: BlogPostDetailResponse = { post, relatedPosts: related };
          return NextResponse.json(detailRes, { status: 200 });
        }
      }

      if (method === "POST") {
        const cat = categories.find((c) => c.id === bodyJson?.categoryId) || categories[0];
        const newPost: BlogPostDTO = {
          id: Date.now(),
          slug: String(bodyJson?.slug || `post-${Date.now()}`),
          title: String(bodyJson?.title || "Nuevo Artículo"),
          summary: String(bodyJson?.summary || ""),
          contentMarkdown: String(bodyJson?.contentMarkdown || ""),
          categoryId: Number(bodyJson?.categoryId || cat.id),
          categoryName: cat.name,
          categorySlug: cat.slug,
          coverMediaId: bodyJson?.coverMediaId ? Number(bodyJson.coverMediaId) : undefined,
          coverMediaUrl: "/media/demo-cartagena-caribe.webp",
          authorName: String(bodyJson?.authorName || "Equipo Viajes Carolina"),
          readingTimeMinutes: Number(bodyJson?.readingTimeMinutes || 5),
          tags: Array.isArray(bodyJson?.tags) ? (bodyJson?.tags as string[]) : [],
          status: String(bodyJson?.status || "PUBLISHED"),
          publishedAt: String(bodyJson?.status || "PUBLISHED") === "PUBLISHED" ? new Date().toISOString() : undefined,
          viewCount: 0,
          isFeatured: bodyJson?.isFeatured !== undefined ? Boolean(bodyJson.isFeatured) : false,
          active: bodyJson?.active !== undefined ? Boolean(bodyJson.active) : true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const updated = [newPost, ...posts];
        writeStoredJson("blog_posts.json", updated);
        return NextResponse.json(newPost, { status: 201 });
      }

      if (method === "PUT") {
        const idMatch = targetPath.match(/posts\/(\d+)/);
        const id = idMatch ? parseInt(idMatch[1], 10) : 1;
        const idx = posts.findIndex((p) => p.id === id);
        if (idx !== -1) {
          const cat = bodyJson?.categoryId ? categories.find((c) => c.id === bodyJson?.categoryId) || categories[0] : null;
          const updatedItem = {
            ...posts[idx],
            ...(bodyJson || {}),
            ...(cat ? { categoryName: cat.name, categorySlug: cat.slug } : {}),
            updatedAt: new Date().toISOString(),
          };
          posts[idx] = updatedItem as BlogPostDTO;
          writeStoredJson("blog_posts.json", posts);
          return NextResponse.json(updatedItem, { status: 200 });
        }
      }

      if (method === "DELETE") {
        const idMatch = targetPath.match(/posts\/(\d+)/);
        const id = idMatch ? parseInt(idMatch[1], 10) : 1;
        const idx = posts.findIndex((p) => p.id === id);
        if (idx !== -1) {
          posts[idx].active = false;
          posts[idx].status = "ARCHIVED";
          writeStoredJson("blog_posts.json", posts);
        }
        return new NextResponse(null, { status: 204 });
      }

      const url = new URL(req.url);
      if (mode === "web") {
        // Public Blog List Response — filtra por categoría/búsqueda e incluye el destacado.
        const catSlug = url.searchParams.get("category");
        const search = url.searchParams.get("search");
        let filtered = posts.filter((p) => p.active && p.status === "PUBLISHED");
        if (catSlug && catSlug !== "all") {
          filtered = filtered.filter((p) => p.categorySlug === catSlug);
        }
        if (search && search.trim()) {
          const q = search.toLowerCase();
          filtered = filtered.filter((p) => p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q)));
        }
        const featured = (!catSlug || catSlug === "all") && (!search || !search.trim()) ? posts.find((p) => p.isFeatured && p.active && p.status === "PUBLISHED") : undefined;
        const res: PublicBlogResponse = {
          items: filtered,
          categories: categories.filter((c) => c.active),
          featuredPost: featured,
          total: filtered.length,
          page: 0,
          size: 9,
          totalPages: Math.ceil(filtered.length / 9),
        };
        return NextResponse.json(res, { status: 200 });
      }

      // Admin Blog List — sin filtrar por estado activo, con filtros propios de gestión.
      const status = url.searchParams.get("status");
      const search = url.searchParams.get("search");
      let list = [...posts];
      if (status && status !== "ALL") {
        list = list.filter((p) => p.status === status);
      }
      if (search && search.trim()) {
        const q = search.toLowerCase();
        list = list.filter((p) => p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q));
      }
      return NextResponse.json(list, { status: 200 });
    }

    if (targetPath.includes("claims")) {
      const claims = readStoredJson<ClaimRecordDTO[]>("claims.json", DEFAULT_CLAIM_RECORDS);
      if (method === "POST") {
        const year = new Date().getFullYear();
        const nextNum = claims.length + 1;
        const claimCode = `REC-${year}-${String(nextNum).padStart(4, "0")}`;
        const newClaim: ClaimRecordDTO = {
          id: Date.now(),
          claimCode,
          fullName: String(bodyJson?.fullName || ""),
          documentType: String(bodyJson?.documentType || "DNI"),
          documentNumber: String(bodyJson?.documentNumber || ""),
          email: String(bodyJson?.email || ""),
          phone: String(bodyJson?.phone || ""),
          address: String(bodyJson?.address || ""),
          isMinor: Boolean(bodyJson?.isMinor),
          parentName: bodyJson?.parentName ? String(bodyJson.parentName) : undefined,
          parentDocument: bodyJson?.parentDocument ? String(bodyJson.parentDocument) : undefined,
          contractedType: String(bodyJson?.contractedType || "SERVICIO"),
          claimedAmount: bodyJson?.claimedAmount ? Number(bodyJson.claimedAmount) : undefined,
          currency: String(bodyJson?.currency || "PEN"),
          description: String(bodyJson?.description || ""),
          claimType: String(bodyJson?.claimType || "RECLAMO"),
          consumerDetail: String(bodyJson?.consumerDetail || ""),
          consumerRequest: String(bodyJson?.consumerRequest || ""),
          status: "PENDING",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const updated = [newClaim, ...claims];
        writeStoredJson("claims.json", updated);
        return NextResponse.json(newClaim, { status: 201 });
      }

      if (method === "PATCH") {
        const idMatch = targetPath.match(/claims\/(\d+)/);
        const id = idMatch ? parseInt(idMatch[1], 10) : 1;
        const idx = claims.findIndex((c) => c.id === id);
        if (idx !== -1) {
          const updatedItem = {
            ...claims[idx],
            status: String(bodyJson?.status || claims[idx].status),
            responseNotes: bodyJson?.responseNotes !== undefined ? String(bodyJson.responseNotes) : claims[idx].responseNotes,
            responseAt: bodyJson?.responseNotes ? new Date().toISOString() : claims[idx].responseAt,
            updatedAt: new Date().toISOString(),
          };
          claims[idx] = updatedItem as ClaimRecordDTO;
          writeStoredJson("claims.json", claims);
          return NextResponse.json(updatedItem, { status: 200 });
        }
      }

      if (targetPath.includes("public/v1/claims/")) {
        const code = decodeURIComponent(targetPath.split("public/v1/claims/")[1]?.split("?")[0] || "");
        const found = claims.find((c) => c.claimCode === code);
        if (found) {
          return NextResponse.json(found, { status: 200 });
        }
        return NextResponse.json({ message: "Not found" }, { status: 404 });
      }

      const url = new URL(req.url);
      const statusParam = url.searchParams.get("status");
      if (statusParam && statusParam !== "ALL") {
        return NextResponse.json(claims.filter((c) => c.status === statusParam), { status: 200 });
      }
      return NextResponse.json(claims, { status: 200 });
    }

    // Auth & Session (Corte 14): la autenticación NUNCA se simula localmente.
    // Si el backend real no responde, se rechaza en vez de aceptar cualquier credencial (ver SEC-020).
    if (targetPath.includes("auth/login") || targetPath.includes("auth/me") || targetPath.includes("auth/password")) {
      return NextResponse.json(
        { message: "El backend de autenticación no está disponible. Intenta nuevamente en unos segundos." },
        { status: 503 }
      );
    }

    if (targetPath.includes("auth/logout")) {
      const res = NextResponse.json({ status: "LOGGED_OUT" }, { status: 200 });
      res.cookies.delete("vc_admin_jwt");
      return res;
    }

    // Users & RBAC (Corte 14)
    if (targetPath.includes("users")) {
      const users = readStoredJson<AdminUserDTO[]>("admin_users.json", DEFAULT_ADMIN_USERS);
      if (method === "POST") {
        const username = String(bodyJson?.username || "").trim().toLowerCase();
        const email = String(bodyJson?.email || "").trim().toLowerCase();
        const exists = users.some((u) => u.username.toLowerCase() === username || u.email.toLowerCase() === email);
        if (exists) {
          return NextResponse.json({ message: "El usuario o correo electrónico ya existe." }, { status: 409 });
        }

        const newUser: AdminUserDTO = {
          id: Date.now(),
          username,
          email,
          fullName: String(bodyJson?.fullName || "").trim(),
          role: String(bodyJson?.role || "CONTENT_EDITOR"),
          active: bodyJson?.active !== undefined ? Boolean(bodyJson.active) : true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const updated = [...users, newUser];
        writeStoredJson("admin_users.json", updated);

        // Audit Log
        const auditLogs = readStoredJson<AuditLogDTO[]>("audit_logs.json", DEFAULT_AUDIT_LOGS);
        const newLog: AuditLogDTO = {
          id: Date.now(),
          username: "admin",
          action: "CREATE_ADMIN_USER",
          entityType: "USER",
          entityId: String(newUser.id),
          ipHash: "a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0",
          detailsJson: JSON.stringify({ username: newUser.username, role: newUser.role }),
          createdAt: new Date().toISOString(),
        };
        writeStoredJson("audit_logs.json", [newLog, ...auditLogs]);

        return NextResponse.json(newUser, { status: 201 });
      }

      if (method === "PUT") {
        const idMatch = targetPath.match(/users\/(\d+)/);
        const id = idMatch ? parseInt(idMatch[1], 10) : 1;
        const idx = users.findIndex((u) => u.id === id);
        if (idx !== -1) {
          const updatedItem = {
            ...users[idx],
            username: bodyJson?.username ? String(bodyJson.username).trim().toLowerCase() : users[idx].username,
            email: bodyJson?.email ? String(bodyJson.email).trim().toLowerCase() : users[idx].email,
            fullName: bodyJson?.fullName ? String(bodyJson.fullName).trim() : users[idx].fullName,
            role: bodyJson?.role ? String(bodyJson.role) : users[idx].role,
            active: bodyJson?.active !== undefined ? Boolean(bodyJson.active) : users[idx].active,
            updatedAt: new Date().toISOString(),
          };
          users[idx] = updatedItem as AdminUserDTO;
          writeStoredJson("admin_users.json", users);

          // Audit Log
          const auditLogs = readStoredJson<AuditLogDTO[]>("audit_logs.json", DEFAULT_AUDIT_LOGS);
          const newLog: AuditLogDTO = {
            id: Date.now(),
            username: "admin",
            action: "UPDATE_ADMIN_USER",
            entityType: "USER",
            entityId: String(id),
            ipHash: "a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0",
            detailsJson: JSON.stringify({ username: updatedItem.username, role: updatedItem.role }),
            createdAt: new Date().toISOString(),
          };
          writeStoredJson("audit_logs.json", [newLog, ...auditLogs]);

          return NextResponse.json(updatedItem, { status: 200 });
        }
      }

      return NextResponse.json(users, { status: 200 });
    }

    // Audit Logs (Corte 14)
    if (targetPath.includes("audit-logs")) {
      const logs = readStoredJson<AuditLogDTO[]>("audit_logs.json", DEFAULT_AUDIT_LOGS);
      const url = new URL(req.url);
      const entityType = url.searchParams.get("entityType");
      const limit = parseInt(url.searchParams.get("limit") || "50", 10);
      let list = logs;
      if (entityType && entityType !== "ALL") {
        list = list.filter((l) => l.entityType.toUpperCase() === entityType.toUpperCase());
      }
      return NextResponse.json(list.slice(0, limit), { status: 200 });
    }

    // Publishing & ISR (Corte 15)
    if (targetPath.includes("publishing/publish")) {
      const target = bodyJson?.target || "ALL";
      let tags: string[] = [];
      if (Array.isArray(bodyJson?.customTags) && bodyJson.customTags.length > 0) {
        tags = bodyJson.customTags as string[];
      } else {
        switch (String(target).toUpperCase()) {
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

      const publishRes: PublishResponseDTO = {
        status: "SUCCESS",
        revalidatedTags: tags,
        publishedAt: new Date().toISOString(),
        triggeredBy: "admin",
        message: `Publicación completada exitosamente. Se revalidaron ${tags.length} tags/rutas en Next.js ISR.`,
      };

      writeStoredJson("last_publish_status.json", publishRes);

      // Audit Log
      const auditLogs = readStoredJson<AuditLogDTO[]>("audit_logs.json", DEFAULT_AUDIT_LOGS);
      const newLog: AuditLogDTO = {
        id: Date.now(),
        username: "admin",
        action: "PUBLISH_ON_DEMAND_ISR",
        entityType: "PUBLISHING",
        entityId: String(target),
        ipHash: "a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0",
        detailsJson: JSON.stringify({ target, tags, reason: bodyJson?.reason }),
        createdAt: new Date().toISOString(),
      };
      writeStoredJson("audit_logs.json", [newLog, ...auditLogs]);

      return NextResponse.json(publishRes, { status: 200 });
    }

    if (targetPath.includes("publishing/status")) {
      const current = readStoredJson<PublishResponseDTO>("last_publish_status.json", DEFAULT_PUBLISH_RESPONSE);
      return NextResponse.json(current, { status: 200 });
    }

    if (targetPath.includes("search")) {
      const url = new URL(req.url);
      const query = url.searchParams.get("q") || "";
      const type = (url.searchParams.get("type") || "ALL") as SearchResultType;
      const limit = parseInt(url.searchParams.get("limit") || "20", 10);
      const searchRes = getMockGlobalSearch(query, type, limit);
      return NextResponse.json(searchRes, { status: 200 });
    }

    return NextResponse.json({ status: "UP", mock: true }, { status: 200 });
  } catch (error) {
    // Un error inesperado en la lógica del proxy (ej. JSON malformado en disco) debe
    // propagarse como error real — devolver DEFAULT_SITE_SETTINGS con 200 aquí simularía
    // éxito para CUALQUIER endpoint (login, subida de medios, reclamos...) y ocultaría el
    // fallo real, exactamente el antipatrón que esta sesión viene corrigiendo en capas.
    console.error("Proxy handler error:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Error interno del proxy" },
      { status: 500 }
    );
  }
}
