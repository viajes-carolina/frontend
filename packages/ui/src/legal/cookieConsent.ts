// Lectura/escritura de la preferencia de cookies del visitante en una cookie
// propia del navegador (`vc_cookie_consent`). Sin dependencia de backend: la
// única fuente de verdad de esta preferencia es el propio navegador del
// visitante — coherente con que hoy el sitio no integra ningún script de
// analítica real, solo persiste la elección para cuando lo haga.

const COOKIE_NAME = "vc_cookie_consent";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 año

export interface CookieConsentPreferences {
  essential: true;
  analytics: boolean;
  preferences: boolean;
  decidedAt: string;
}

function readRawCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.split("; ").find((row) => row.startsWith(`${name}=`));
  if (!match) return null;
  return decodeURIComponent(match.slice(name.length + 1));
}

export function getCookieConsent(): CookieConsentPreferences | null {
  const raw = readRawCookie(COOKIE_NAME);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<CookieConsentPreferences>;
    if (typeof parsed.decidedAt !== "string") return null;
    return {
      essential: true,
      analytics: Boolean(parsed.analytics),
      preferences: Boolean(parsed.preferences),
      decidedAt: parsed.decidedAt,
    };
  } catch {
    return null;
  }
}

export function setCookieConsent(prefs: { analytics: boolean; preferences: boolean }): CookieConsentPreferences {
  const value: CookieConsentPreferences = {
    essential: true,
    analytics: prefs.analytics,
    preferences: prefs.preferences,
    decidedAt: new Date().toISOString(),
  };
  if (typeof document !== "undefined") {
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(value))}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
  }
  return value;
}
