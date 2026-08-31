"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { useConfirmDialog, type FormFeedbackState } from "@vc/ui";
import {
  apiClient,
  ApiError,
  AdminPromotionsPageResponse,
  CreateOrUpdatePromotionRequest,
  MediaAssetDTO,
  PromotionDTO,
  PromotionsCatalogSummaryDTO,
} from "@vc/api-client";
import {
  DEFAULT_PAGE_SIZE,
  useServerDataTable,
  type ServerDataTableQuery,
} from "../components/table";
import { estimatePricePenFromUsd } from "../lib/promotionPricing";
import type { PromotionTemplateDraft } from "../lib/promotionTemplate";
import {
  MIN_ACTIVE_PROMOTIONS,
  PROMOTION_CATALOG_FILTERS,
  collectPromotionFormWarnings,
  countActivePromotions,
  getPromotionRowId,
  hasFormErrors,
  summarizeBulkOutcome,
  toAdminPromotionsQuery,
  validatePromotionForm,
  type PromotionBulkOperation,
  type PromotionBulkOutcome,
  type PromotionFormBinding,
  type PromotionFormDraft,
  type PromotionFormErrors,
  type PromotionModalMode,
} from "../lib/promotionsCatalog";

/**
 * El texto que el backend manda, o el `fallback` si no manda ninguno.
 *
 * Bean Validation no responde con `message` sino con `violations[]` (400 de
 * `CreateOrUpdatePromotionRequest`). Sin este caso, un rechazo de validación se
 * leía como "Error de API (HTTP 400)", que no dice qué campo falla. No debería
 * llegar aquí — el formulario valida antes de enviar — pero si llega, se cuenta.
 */
function extractErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof ApiError && err.body && typeof err.body === "object") {
    const body = err.body as { message?: unknown; violations?: unknown };

    const msg = String(body.message ?? "").trim();
    if (msg) return msg;

    if (Array.isArray(body.violations) && body.violations.length > 0) {
      const fields = body.violations
        .map((violation) =>
          violation && typeof violation === "object" && "field" in violation
            ? String((violation as { field: unknown }).field).split(".").pop()
            : null
        )
        .filter((field): field is string => Boolean(field));
      if (fields.length > 0) {
        return `${fallback} El servidor rechazó estos campos: ${fields.join(", ")}.`;
      }
    }
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

function defaultValidFrom(): string {
  return new Date().toISOString().split("T")[0];
}

function defaultValidUntil(): string {
  return new Date(Date.now() + 180 * 86400000).toISOString().split("T")[0];
}

/**
 * Estado y reglas de la pantalla de Promociones.
 *
 * La pantalla `.tsx` solo declara columnas y disposición; todo lo que llama a la
 * API, decide qué se puede hacer y redacta lo que se muestra vive aquí. Las
 * reglas puras (filtros, validación, resumen de una tanda) están un paso más
 * allá, en `lib/promotionsCatalog.ts`.
 *
 * ── Quién manda sobre la lista ───────────────────────────────────────────
 * El servidor. `useServerDataTable` guarda lo que la persona ha escrito, elegido
 * y pulsado, y lo resume en una `query`; este hook la traduce al contrato del
 * endpoint y trae UNA página. El navegador nunca tiene las 32 filas, así que
 * ni el podio del Home ni los cuatro contadores se calculan aquí: llegan en el
 * DTO (`featuredInHome`) y en el `summary` de la respuesta.
 */
export function useAdminPromotionsCatalog(initialPage: AdminPromotionsPageResponse) {
  const [promotions, setPromotions] = useState<PromotionDTO[]>(initialPage.items);
  const [totalRows, setTotalRows] = useState(initialPage.total);
  /* `catalogSummary` y no `summary`: el formulario ya tiene un campo `summary`,
     que es el texto de la tarjeta del Home. Son dos cosas sin relación. */
  const [catalogSummary, setCatalogSummary] = useState<PromotionsCatalogSummaryDTO>(
    initialPage.summary
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  /* El error de RECARGA es distinto del feedback de una acción: persiste, no
     es efímero, y lleva su propio botón de reintento (`RetryableError`). */
  const [listError, setListError] = useState<string | null>(null);
  // Antes era un `statusMessage: string` único, así que los rechazos del
  // backend se pintaban en el banner verde de éxito. El tono los distingue.
  const [feedback, setFeedback] = useState<FormFeedbackState | null>(null);
  const showSuccess = (message: string) => setFeedback({ tone: "success", message });
  const showError = (message: string) => setFeedback({ tone: "error", message });
  const confirmation = useConfirmDialog();

  /* Modal de contenido: la MISMA caja crea y corrige. El backend expone
     POST /promotions y PUT /promotions/{id} con idéntico payload; lo único que
     cambia aquí es a cuál se llama y qué dicen el título y el botón. */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<PromotionDTO | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isBulkRunning, setIsBulkRunning] = useState(false);
  /* Los errores de campo se pintan cuando hay algo que decir, no siempre: en
     una promoción legada ya se sabe al abrirla (el destino viene vacío), en una
     creación en blanco no tiene sentido hasta el primer intento de guardar. */
  const [showFieldErrors, setShowFieldErrors] = useState(false);

  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [departureCity, setDepartureCity] = useState("Lima");
  const [priceUsd, setPriceUsdRaw] = useState<number | string>("");
  const [pricePen, setPricePen] = useState<number | string>("");
  const [durationDays, setDurationDays] = useState<number>(4);
  const [durationNights, setDurationNights] = useState<number>(3);
  const [validFrom, setValidFrom] = useState(defaultValidFrom());
  const [validUntil, setValidUntil] = useState(defaultValidUntil());
  const [summary, setSummary] = useState("");
  const [inclusionsInput, setInclusionsInput] = useState("");
  const [exclusionsInput, setExclusionsInput] = useState("");
  const [whatsappTemplate, setWhatsappTemplate] = useState("");
  const [featuredMediaId, setFeaturedMediaId] = useState<number | undefined>(undefined);
  const [featuredMediaUrl, setFeaturedMediaUrl] = useState<string | undefined>(undefined);
  const [featuredMediaFocalX, setFeaturedMediaFocalX] = useState<number | undefined>(undefined);
  const [featuredMediaFocalY, setFeaturedMediaFocalY] = useState<number | undefined>(undefined);

  /* ── Lista ─────────────────────────────────────────────────────────────── */

  const table = useServerDataTable<PromotionDTO>({
    rows: promotions,
    getRowId: getPromotionRowId,
    totalRows,
    unfilteredTotal: catalogSummary.total,
    filters: PROMOTION_CATALOG_FILTERS,
    searchable: true,
    pageSize: DEFAULT_PAGE_SIZE,
    selectable: true,
  });

  const { query } = table;

  /**
   * Trae una página y deja la pantalla entera coherente con ella: filas, total
   * para la paginación y `summary` para las métricas, que siguen contando el
   * catálogo completo aunque haya un filtro puesto.
   *
   * Devuelve `void` y no lanza: quien la llama (el efecto, un reintento, la
   * recarga tras guardar) solo necesita que la pantalla quede como toca.
   */
  const loadPage = useCallback(async (target: ServerDataTableQuery): Promise<void> => {
    setIsRefreshing(true);
    try {
      const data = await apiClient.getAdminPromotionsPage(toAdminPromotionsQuery(target));
      setPromotions(data.items);
      setTotalRows(data.total);
      setCatalogSummary(data.summary);
      setListError(null);
    } catch (err) {
      console.error(err);
      /* La página anterior se conserva a propósito: vaciar la tabla porque una
         recarga falló borra de la pantalla datos que siguen siendo válidos. */
      setListError(
        "No se pudo cargar esta página del catálogo. Se sigue mostrando la última que llegó y tus filtros siguen puestos."
      );
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  /**
   * Cada consulta nueva es una petición.
   *
   * La primera se salta: la página inicial ya viene servida desde el servidor
   * (`page.tsx`) y volver a pedirla nada más hidratar sería la misma llamada dos
   * veces. `query` solo cambia de identidad cuando cambia su contenido, así que
   * este efecto no se dispara por un render cualquiera.
   */
  const servedQueryRef = useRef<ServerDataTableQuery | null>(query);
  useEffect(() => {
    if (servedQueryRef.current === query) return;
    servedQueryRef.current = query;
    void loadPage(query);
  }, [query, loadPage]);

  /** Vuelve a pedir la página que se está viendo, con los filtros puestos. */
  const reloadCurrentPage = useCallback(async (): Promise<void> => {
    servedQueryRef.current = query;
    await loadPage(query);
  }, [loadPage, query]);

  /* Las activas de TODO el catálogo, no las de esta página: es la cifra con la
     que el backend decide si un 409 bloquea la ocultación. */
  const activeCount = countActivePromotions(catalogSummary);

  const canHide = useCallback(
    (promo: PromotionDTO): boolean => !promo.active || activeCount > MIN_ACTIVE_PROMOTIONS,
    [activeCount]
  );

  const hideBlockedReason = useCallback(
    (promo: PromotionDTO): string | undefined =>
      promo.active && !canHide(promo)
        ? `No se puede ocultar: el Home necesita al menos ${MIN_ACTIVE_PROMOTIONS} promociones visibles.`
        : undefined,
    [canHide]
  );

  /* ── Visibilidad ───────────────────────────────────────────────────────── */

  const handleToggleActive = async (promo: PromotionDTO): Promise<void> => {
    const willHide = promo.active === true;
    if (willHide && !canHide(promo)) {
      showError(
        `No se puede ocultar "${promo.title}": el Home necesita al menos ${MIN_ACTIVE_PROMOTIONS} promociones activas. Activa otra antes de ocultar esta.`
      );
      return;
    }

    setFeedback(null);
    try {
      await apiClient.setPromotionActive(promo.id, !promo.active);
      showSuccess(
        willHide ? `"${promo.title}" ya no se muestra en Inicio.` : `"${promo.title}" ahora se muestra en Inicio.`
      );
      await reloadCurrentPage();
    } catch (err) {
      console.error(err);
      // Carrera entre pestañas: el backend puede rechazar con 409 aunque el
      // cálculo local de canHide() lo permitiera — se muestra el mensaje real
      // del backend en vez de uno genérico (con un fallback específico si el
      // backend no trae mensaje, en vez de un genérico ciego).
      const fallback =
        err instanceof ApiError && err.status === 409
          ? `No se puede ocultar "${promo.title}": el Home necesita al menos ${MIN_ACTIVE_PROMOTIONS} promociones activas.`
          : `No se pudo actualizar el estado de "${promo.title}".`;
      showError(extractErrorMessage(err, fallback));
      await reloadCurrentPage();
    }
  };

  /* ── Borrado ───────────────────────────────────────────────────────────── */

  const deletePromotion = async (promo: PromotionDTO): Promise<void> => {
    setFeedback(null);
    try {
      await apiClient.deletePromotion(promo.id);
      showSuccess(`"${promo.title}" se borró definitivamente.`);
      await reloadCurrentPage();
    } catch (err) {
      console.error(err);
      const fallback =
        err instanceof ApiError && err.status === 409
          ? `No se puede borrar "${promo.title}": el Home necesita al menos ${MIN_ACTIVE_PROMOTIONS} promociones activas.`
          : `No se pudo borrar "${promo.title}".`;
      showError(extractErrorMessage(err, fallback));
      await reloadCurrentPage();
    }
  };

  /**
   * Pide confirmación antes de borrar. La comprobación de las 3 promociones
   * activas va ANTES de preguntar: si la acción no se puede completar, no tiene
   * sentido pedir que se confirme — se explica por qué y se para ahí.
   *
   * Sustituye al `confirm()` nativo. El título nombra la promoción y el cuerpo
   * dice qué se elimina y que no se puede deshacer, que es lo que pide la guía
   * ("la consecuencia y el objeto afectado deben aparecer explícitamente").
   */
  const handleDelete = (promo: PromotionDTO): void => {
    if (promo.active && !canHide(promo)) {
      showError(
        `No se puede borrar "${promo.title}": el Home necesita al menos ${MIN_ACTIVE_PROMOTIONS} promociones activas. Ocúltala o activa otra antes de borrarla.`
      );
      return;
    }

    confirmation.ask({
      title: `¿Eliminar "${promo.title}"?`,
      description: "Esta acción eliminará la promoción del catálogo. No se puede deshacer.",
      confirmLabel: "Sí, eliminar",
      busyLabel: "Eliminando…",
      onConfirm: () => deletePromotion(promo),
    });
  };

  /* ── Acciones masivas ──────────────────────────────────────────────────── */

  /**
   * Ejecuta una tanda como N peticiones sueltas, en serie.
   *
   * No hay endpoints en lote, y el guard de las 3 activas se evalúa por
   * petición: en paralelo, varias llamadas leerían el mismo `countActive()` y
   * el resultado dependería del orden de llegada. En serie, cada una ve el
   * estado que dejó la anterior — que es exactamente lo que hace que una tanda
   * de 5 ocultaciones se aplique a 2 y se rechace en la tercera.
   *
   * El resultado se cuenta entero (`summarizeBulkOutcome`): aplicadas sobre
   * pedidas, cuáles bloqueó la regla y cuáles fallaron de verdad.
   *
   * ── Por qué los ids se resuelven contra la página ────────────────────────
   * Para omitir las que ya están como se pide y para NOMBRAR en el parte final
   * las que se bloquearon, hace falta el DTO de cada una: su `active` y su
   * título. Con la lista paginada, el navegador solo tiene los de la página
   * visible — y por eso `useServerDataTable` mantiene la selección dentro de la
   * página. Todo id seleccionado se resuelve aquí; el `.filter` es una red por
   * si una fila desapareció entre la selección y el clic.
   */
  const runBulk = async (
    ids: readonly string[],
    operation: PromotionBulkOperation,
    onFinished?: () => void
  ): Promise<void> => {
    const selected = ids
      .map((id) => promotions.find((promo) => String(promo.id) === id))
      .filter((promo): promo is PromotionDTO => Boolean(promo));

    const outcome: PromotionBulkOutcome = {
      operation,
      requested: selected.length,
      applied: [],
      blocked: [],
      failed: [],
      skipped: [],
    };

    setFeedback(null);
    setIsBulkRunning(true);
    try {
      for (const promo of selected) {
        /* Pedirle al backend que active lo ya activo devolvería 200 y contaría
           como "aplicada" una promoción que nadie tocó. */
        if (operation === "show" && promo.active) {
          outcome.skipped.push(promo.title);
          continue;
        }
        if (operation === "hide" && !promo.active) {
          outcome.skipped.push(promo.title);
          continue;
        }

        try {
          if (operation === "delete") {
            await apiClient.deletePromotion(promo.id);
          } else {
            await apiClient.setPromotionActive(promo.id, operation === "show");
          }
          outcome.applied.push(promo.title);
        } catch (err) {
          console.error(err);
          if (err instanceof ApiError && err.status === 409) {
            outcome.blocked.push(promo.title);
          } else {
            outcome.failed.push(promo.title);
          }
        }
      }
    } finally {
      setIsBulkRunning(false);
    }

    setFeedback(summarizeBulkOutcome(outcome));
    await reloadCurrentPage();
    onFinished?.();
  };

  const confirmBulkDelete = (ids: readonly string[], onFinished?: () => void): void => {
    const count = ids.length;
    confirmation.ask({
      title:
        count === 1
          ? "¿Eliminar la promoción seleccionada?"
          : `¿Eliminar ${count} promociones seleccionadas?`,
      description:
        "Se eliminarán del catálogo una por una y no se puede deshacer. Las que estén visibles y dejarían el Home con menos de 3 promociones no se podrán eliminar: al terminar se detalla cuáles.",
      confirmLabel: count === 1 ? "Sí, eliminar" : `Sí, eliminar ${count}`,
      busyLabel: "Eliminando…",
      onConfirm: () => runBulk(ids, "delete", onFinished),
    });
  };

  /* ── Post de Facebook ──────────────────────────────────────────────────── */

  const openFacebookPost = (promo: PromotionDTO): void => {
    if (!promo.facebookPermalinkUrl) return;
    window.open(promo.facebookPermalinkUrl, "_blank", "noopener,noreferrer");
  };

  /* ── Formulario ────────────────────────────────────────────────────────── */

  const draft: PromotionFormDraft = {
    title,
    destination,
    summary,
    priceUsd,
    durationDays,
    durationNights,
  };
  const errors = validatePromotionForm(draft);
  const warnings = collectPromotionFormWarnings(draft);
  const fieldErrors: PromotionFormErrors = showFieldErrors ? errors : {};

  const fillForm = (promo: PromotionDTO | null) => {
    setTitle(promo?.title ?? "");
    setDestination(promo?.destination ?? "");
    setDepartureCity(promo?.departureCity || "Lima");
    setPriceUsdRaw(promo ? promo.priceUsd : "");
    setPricePen(promo?.pricePen ?? "");
    setDurationDays(promo?.durationDays ?? 4);
    setDurationNights(promo?.durationNights ?? 3);
    setValidFrom(promo?.validFrom || defaultValidFrom());
    setValidUntil(promo?.validUntil || defaultValidUntil());
    setSummary(promo?.summary ?? "");
    setInclusionsInput((promo?.inclusions ?? []).join("\n"));
    setExclusionsInput((promo?.exclusions ?? []).join("\n"));
    setWhatsappTemplate(promo?.whatsappMessageTemplate ?? "");
    setFeaturedMediaId(promo?.featuredMediaId);
    setFeaturedMediaUrl(promo?.featuredMediaUrl);
    setFeaturedMediaFocalX(promo?.featuredMediaFocalX);
    setFeaturedMediaFocalY(promo?.featuredMediaFocalY);
  };

  /**
   * Vuelca sobre el formulario lo que traía una plantilla .md.
   *
   * A diferencia de `fillForm`, que reemplaza el formulario entero, aquí solo
   * se tocan los campos que el archivo trae con valor. Es lo que hace segura
   * una plantilla a medio rellenar sobre una promoción que ya existe: lo que no
   * viene, se queda como estaba.
   *
   * Los errores de campo se encienden después de aplicar: si el archivo dejó el
   * destino en blanco, se ve en rojo al momento y no al pulsar «Guardar».
   */
  const applyTemplateDraft = (incoming: PromotionTemplateDraft) => {
    if (incoming.title !== undefined) setTitle(incoming.title);
    if (incoming.destination !== undefined) setDestination(incoming.destination);
    if (incoming.departureCity !== undefined) setDepartureCity(incoming.departureCity);

    /* `setPriceUsd` sugiere el precio en soles cuando está vacío. Se llama
       igualmente y, si la plantilla trae su propio precio en soles, se escribe
       después: la última actualización encolada es la que gana. */
    if (incoming.priceUsd !== undefined) setPriceUsd(incoming.priceUsd);
    if (incoming.pricePen !== undefined) setPricePen(incoming.pricePen);

    if (incoming.durationDays !== undefined) setDurationDays(incoming.durationDays);
    if (incoming.durationNights !== undefined) setDurationNights(incoming.durationNights);
    if (incoming.validFrom !== undefined) setValidFrom(incoming.validFrom);
    if (incoming.validUntil !== undefined) setValidUntil(incoming.validUntil);
    if (incoming.summary !== undefined) setSummary(incoming.summary);
    if (incoming.inclusionsInput !== undefined) setInclusionsInput(incoming.inclusionsInput);
    if (incoming.exclusionsInput !== undefined) setExclusionsInput(incoming.exclusionsInput);
    if (incoming.whatsappTemplate !== undefined) setWhatsappTemplate(incoming.whatsappTemplate);

    setShowFieldErrors(true);
  };

  const openCreateModal = () => {
    fillForm(null);
    setEditingPromotion(null);
    setShowFieldErrors(false);
    setIsModalOpen(true);
  };

  /**
   * Abre una promoción existente para corregirla.
   *
   * Los errores de campo se encienden de entrada cuando lo que llega ya es
   * inválido. Es el caso mayoritario: 25 de las 32 promociones vienen del
   * ingestor de Facebook ya retirado y quedaron sin `destination`, que el
   * backend exige. Sin esto, abrir una de ellas y pulsar "Guardar cambios" sin
   * tocar nada devolvería un 400 sin explicación visible.
   */
  const openEditModal = (promo: PromotionDTO) => {
    fillForm(promo);
    setEditingPromotion(promo);
    setShowFieldErrors(
      hasFormErrors(
        validatePromotionForm({
          title: promo.title ?? "",
          destination: promo.destination ?? "",
          summary: promo.summary ?? "",
          priceUsd: promo.priceUsd,
          durationDays: promo.durationDays,
          durationNights: promo.durationNights,
        })
      )
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPromotion(null);
  };

  // Al escribir el precio en USD, sugiere el precio en PEN si aún no fue editado a mano.
  const setPriceUsd = (value: number | string) => {
    setPriceUsdRaw(value);
    if (value && !pricePen) {
      setPricePen(estimatePricePenFromUsd(Number(value)));
    }
  };

  const handleSelectFeaturedMedia = (media: MediaAssetDTO) => {
    setFeaturedMediaId(media.id);
    setFeaturedMediaUrl(media.storagePath);
    setFeaturedMediaFocalX(media.focalX);
    setFeaturedMediaFocalY(media.focalY);
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setShowFieldErrors(true);
    if (hasFormErrors(errors)) {
      /* Sin banner: el problema ya está señalado campo a campo. Esta frase solo
         dice dónde mirar. */
      showError("Revisa los campos marcados en rojo antes de guardar.");
      return;
    }

    setFeedback(null);
    setIsSaving(true);

    const toLines = (value: string) =>
      value
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

    const payload: CreateOrUpdatePromotionRequest = {
      title: title.trim(),
      destination: destination.trim(),
      summary: summary.trim(),
      priceUsd: Number(priceUsd),
      pricePen: pricePen ? Number(pricePen) : undefined,
      durationDays: Number(durationDays),
      durationNights: Number(durationNights),
      departureCity: departureCity.trim() || undefined,
      validFrom: validFrom.trim() || undefined,
      validUntil: validUntil.trim() || undefined,
      featuredMediaId,
      inclusions: toLines(inclusionsInput),
      exclusions: toLines(exclusionsInput),
      whatsappMessageTemplate: whatsappTemplate.trim() || undefined,
    };

    const target = editingPromotion;
    try {
      if (target) {
        const updated = await apiClient.updatePromotion(target.id, payload);
        showSuccess(
          `"${updated.title}" se actualizó. La dirección pública (/${updated.slug}) y el post de Facebook no cambian.`
        );
      } else {
        const created = await apiClient.createPromotion(payload);
        showSuccess(
          created.facebookPermalinkUrl
            ? `Promoción "${created.title}" creada y publicada en Facebook.`
            : `Promoción "${created.title}" creada correctamente.`
        );
      }
      closeModal();
      await reloadCurrentPage();
    } catch (err) {
      console.error(err);
      showError(
        extractErrorMessage(
          err,
          target ? "No se pudo guardar la promoción." : "No se pudo crear la promoción."
        )
      );
    } finally {
      setIsSaving(false);
    }
  };

  return {
    /** Solo la página visible. El catálogo entero ya no está en el navegador. */
    promotions,
    /** El controlador que consumen `AdminDataTable` y sus piezas. */
    table: table.controller,
    isRefreshing,
    /**
     * Lo que se ve NO corresponde a lo que hay escrito o elegido: o bien la
     * petición está en vuelo, o bien el buscador aún está esperando su debounce.
     * Los dos casos se pintan igual — filas atenuadas — porque para quien mira
     * son el mismo: "esto todavía no es la respuesta".
     */
    isStale: isRefreshing || table.isSearchPending,
    listError,
    retryLoad: reloadCurrentPage,
    feedback,
    /** Contadores del catálogo completo, sin filtros: vienen del servidor. */
    summary: catalogSummary,
    activeCount,
    canHide,
    hideBlockedReason,
    handleToggleActive,
    handleDelete,
    openFacebookPost,
    /** Props para `<ConfirmDialog {...confirmDialog} />`. Sirve a los dos borrados. */
    confirmDialog: confirmation.dialogProps,
    // Acciones masivas
    isBulkRunning,
    runBulk,
    confirmBulkDelete,
    // Modal de contenido
    modalMode: (editingPromotion ? "edit" : "create") as PromotionModalMode,
    editingPromotion,
    isModalOpen,
    openCreateModal,
    openEditModal,
    closeModal,
    isSaving,
    handleSubmit,
    /** Rellena el formulario con lo que trajo una plantilla .md. */
    applyTemplateDraft,
    /** Los catorce campos y su validación, para `<CreatePromotionModal form={…} />`. */
    form: {
      title, setTitle,
      destination, setDestination,
      departureCity, setDepartureCity,
      priceUsd, setPriceUsd,
      pricePen, setPricePen,
      durationDays, setDurationDays,
      durationNights, setDurationNights,
      validFrom, setValidFrom,
      validUntil, setValidUntil,
      summary, setSummary,
      inclusionsInput, setInclusionsInput,
      exclusionsInput, setExclusionsInput,
      whatsappTemplate, setWhatsappTemplate,
      featuredMediaId, featuredMediaUrl, featuredMediaFocalX, featuredMediaFocalY,
      onSelectFeaturedMedia: handleSelectFeaturedMedia,
      errors: fieldErrors,
      warnings,
    } satisfies PromotionFormBinding,
  };
}
