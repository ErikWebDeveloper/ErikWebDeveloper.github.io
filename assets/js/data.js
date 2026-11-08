/* =============================================================================
   data.js — Carga del contenido
   Toda la información editable del portfolio vive en assets/data/site.json.
   Se carga una sola vez y se comparte entre el resto de scripts.
   ============================================================================= */

window.PortfolioData = (function () {
  "use strict";

  const DATA_URL = "assets/data/site.json";
  const CACHE_KEY = "portfolio:data:v1";
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

  let pending = null;

  /** Lee la copia en localStorage (permite navegar sin reconectar). */
  function readCache() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;

      const { savedAt, data } = JSON.parse(raw);
      if (!data || Date.now() - savedAt > CACHE_TTL) return null;
      return data;
    } catch {
      return null;
    }
  }

  /** Guarda una copia local para resilience offline. */
  function writeCache(data) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), data }));
    } catch {
      /* modo privado o cuota llena: no es crítico */
    }
  }

  /** Normaliza la estructura para que el render nunca falle por campos ausentes. */
  function normalize(data) {
    return {
      links: data.links ?? {},
      focus: Array.isArray(data.focus) ? data.focus : [],
      projects: Array.isArray(data.projects) ? data.projects : [],
      stack: Array.isArray(data.stack) ? data.stack : [],
    };
  }

  /**
   * Devuelve el contenido del portfolio.
   * @returns {Promise<{links: object, focus: object[], projects: object[], stack: object[]}>}
   */
  function load() {
    if (pending) return pending;

    pending = fetch(DATA_URL, { cache: "no-cache" })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data) => {
        writeCache(data);
        return normalize(data);
      })
      .catch((error) => {
        const cached = readCache();
        if (cached) {
          console.warn("[portfolio] Usando contenido en caché:", error.message);
          return normalize(cached);
        }
        console.error("[portfolio] No se pudo cargar site.json:", error);
        throw error;
      });

    return pending;
  }

  return { load };
})();