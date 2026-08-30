"use client";

import { useCallback, useEffect, useState } from "react";
import type { CookieCategoryDTO } from "@vc/api-client";
import { getCookieConsent, setCookieConsent } from "./cookieConsent";

export type CookiePreferenceValues = Record<string, boolean>;

// El SSR no tiene `document`, así que siempre calcularía "sin consentimiento"
// (todo en false salvo las requeridas). Si el estado inicial de React
// dependiera de la cookie real desde el primer render, la hidratación
// quedaría desincronizada: React actualiza sus props internas al valor
// correcto, pero el checkbox del DOM no refleja el cambio (bug conocido de
// React con `checked` en la reconciliación de hidratación). Por eso el
// valor "seguro para SSR" (todo en false) se usa como estado inicial, y la
// cookie real se lee después del montaje, en el efecto de abajo — ahí sí es
// una actualización de estado normal en cliente, no una hidratación.
function buildDefaultValues(categories: CookieCategoryDTO[]): CookiePreferenceValues {
  const values: CookiePreferenceValues = {};
  categories.forEach((category) => {
    values[category.key] = Boolean(category.required);
  });
  return values;
}

function buildValuesFromConsent(
  categories: CookieCategoryDTO[],
  consent: ReturnType<typeof getCookieConsent>
): CookiePreferenceValues {
  const values: CookiePreferenceValues = {};
  categories.forEach((category) => {
    if (category.required) {
      values[category.key] = true;
      return;
    }
    if (!consent) {
      values[category.key] = false;
      return;
    }
    if (category.key === "analytics") {
      values[category.key] = consent.analytics;
    } else if (category.key === "preferences") {
      values[category.key] = consent.preferences;
    } else {
      values[category.key] = false;
    }
  });
  return values;
}

function toConsentPayload(categories: CookieCategoryDTO[], values: CookiePreferenceValues) {
  const analyticsCategory = categories.find((c) => c.key === "analytics");
  const preferencesCategory = categories.find((c) => c.key === "preferences");
  return {
    analytics: analyticsCategory ? Boolean(values[analyticsCategory.key]) : false,
    preferences: preferencesCategory ? Boolean(values[preferencesCategory.key]) : false,
  };
}

// Estado del panel de preferencias de cookies: el primer render usa el
// default seguro para SSR (ver comentario de `buildDefaultValues`), y un
// efecto post-montaje corrige el estado con la cookie real del navegador
// si existe. Persiste cada decisión del visitante en esa misma cookie — no
// integra ningún script de analítica, solo guarda la preferencia.
export function useCookiePreferences(categories: CookieCategoryDTO[]) {
  const [values, setValues] = useState<CookiePreferenceValues>(() => buildDefaultValues(categories));
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    const consent = getCookieConsent();
    if (consent) {
      setValues(buildValuesFromConsent(categories, consent));
    }
    // Solo debe correr una vez al montar: `categories` viene de props del
    // servidor y no cambia durante la vida del componente.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleCategory = useCallback(
    (key: string) => {
      const category = categories.find((c) => c.key === key);
      if (!category || category.required) return;
      setValues((prev) => ({ ...prev, [key]: !prev[key] }));
      setJustSaved(false);
    },
    [categories]
  );

  const acceptAll = useCallback(() => {
    const allEnabled: CookiePreferenceValues = {};
    categories.forEach((category) => {
      allEnabled[category.key] = true;
    });
    setValues(allEnabled);
    setCookieConsent(toConsentPayload(categories, allEnabled));
    setJustSaved(true);
  }, [categories]);

  const savePreferences = useCallback(() => {
    setCookieConsent(toConsentPayload(categories, values));
    setJustSaved(true);
  }, [categories, values]);

  return { values, toggleCategory, acceptAll, savePreferences, justSaved };
}
