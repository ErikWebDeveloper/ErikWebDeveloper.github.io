/* =============================================================================
   main.js — Orquestación e interacciones
   1. Carga de datos y render
   2. Terminal de arranque (efecto máquina de escribir)
   3. Hora local de Andorra
   4. Filtros de proyectos
   5. Animación de entrada al hacer scroll
   6. Navegación activa + menú móvil
   7. Blips de terminal opcionales (Web Audio, desactivados por defecto)
   ============================================================================= */

(function () {
  "use strict";

  const { load } = window.PortfolioData;
  const { hydrateLinks, renderFocus, renderProjects, renderStack } = window.PortfolioRender;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const STORAGE_KEY = "portfolio:sound";

  /* ---------------------------------------------------------------- boot log */

  const BOOT_LINES = [
    { text: "$ ./whoami --verbose", type: "muted" },
    { text: "erik  ·  software developer", type: "info" },
    { text: "base: andorra 🇦🇩  ·  status: available", type: "muted" },
    { text: "$ cat focus.txt", type: "muted" },
    { text: "web · mobile · minigames · cli · local-ai · audio", type: "warn" },
    { text: "$ node portfolio.js --ship", type: "muted" },
    { text: "✓ 200 OK  ·  ship it 🚀", type: "ok" },
  ];

  const BOOT_DURATION = 2600; // duración total garantizada del arranque (ms)

  /**
   * Escribe la terminal como una sesión de shell.
   * El progreso se calcula con el tiempo transcurrido (no por caracteres escritos),
   * así la animación termina puntual aunque el navegador ralentice los
   * temporizadores o la pestaña pierda el foco.
   */
  function initBootLog() {
    const log = document.querySelector("[data-boot-log]");
    if (!log) return;

    // Respetamos la preferencia de movimiento reducido: texto completo, sin animación.
    if (prefersReducedMotion) {
      log.replaceChildren(...BOOT_LINES.map(createBootLine));
      return;
    }

    const cursor = document.querySelector(".panel-cursor");
    if (cursor) cursor.hidden = true;

    log.textContent = "";

    // Desplazamiento inicial de cada línea dentro del flujo total de caracteres.
    const offsets = BOOT_LINES.reduce((acc, line) => [...acc, acc.at(-1) + line.text.length], [0]);
    const totalChars = offsets.at(-1);
    const nodes = [];
    const start = performance.now();

    const frame = (now) => {
      const progress = Math.min((now - start) / BOOT_DURATION, 1);
      const chars = Math.round(progress * totalChars);

      BOOT_LINES.forEach((line, index) => {
        if (chars <= offsets[index]) return; // la línea todavía no empieza

        // El <span> de cada línea se crea la primera vez que aparece.
        if (!nodes[index]) {
          nodes[index] = createBootLine(line, "");
          log.append(nodes[index]);
        }
        nodes[index].textContent = line.text.slice(0, chars - offsets[index]);
      });

      if (progress < 1) {
        requestAnimationFrame(frame);
        return;
      }

      if (cursor) cursor.hidden = false;
    };

    requestAnimationFrame(frame);
  }

  /** Crea un <span class="boot-line"> con el color indicado. */
  function createBootLine(line, text = line.text) {
    const span = document.createElement("span");
    span.className = `boot-line ${line.type ?? ""}`.trim();
    span.textContent = text;
    return span;
  }

  /* -------------------------------------------------------------- hora local */

  /** Muestra la hora de Andorra (Europe/Andorra) y la actualiza cada minuto. */
  function initLocalTime() {
    const target = document.querySelector("[data-local-time]");
    if (!target) return;

    const formatter = new Intl.DateTimeFormat("ca-ES", {
      timeZone: "Europe/Andorra",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const tick = () => {
      target.textContent = formatter.format(new Date());
    };

    tick();
    setInterval(tick, 60_000);
  }

  /* ----------------------------------------------------------------- filtros */

  /** Filtra la cuadrícula de proyectos por tipo (producto / experimento). */
  function initFilters() {
    const buttons = [...document.querySelectorAll("[data-filter]")];
    const cards = [...document.querySelectorAll("[data-projects-list] .card-project")];
    const counter = document.querySelector("[data-work-count]");
    if (!buttons.length || !cards.length) return;

    const apply = (kind) => {
      let visible = 0;

      cards.forEach((card) => {
        const match = kind === "all" || card.dataset.kind === kind;
        card.classList.toggle("is-hidden", !match);
        if (match) visible += 1;
      });

      buttons.forEach((button) => {
        const active = button.dataset.filter === kind;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });

      if (counter) {
        const noun = visible === 1 ? "proyecto" : "proyectos";
        counter.textContent = `${String(visible).padStart(2, "0")} ${noun}`;
      }

      Sound.play("tick");
    };

    buttons.forEach((button) => {
      button.addEventListener("click", () => apply(button.dataset.filter));
    });

    apply("all");
  }

  /* ----------------------------------------------------------- reveal on scroll */

  /** Revela elementos con .reveal cuando entran en el viewport. */
  function initReveal() {
    const targets = [...document.querySelectorAll(".reveal:not(.is-visible)")];

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      targets.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );

    targets.forEach((node) => observer.observe(node));
  }

  /* ---------------------------------------------------------- navegación activa */

  /** Marca el enlace de navegación de la sección visible. */
  function initActiveNav() {
    const links = [...document.querySelectorAll("[data-nav-link]")];
    const sections = links
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);
    if (!links.length || !sections.length || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
  }

  /* ------------------------------------------------------------ menú móvil */

  /** Menú colapsable en pantallas pequeñas. */
  function initMobileNav() {
    const toggle = document.querySelector("[data-nav-toggle]");
    const nav = document.querySelector("#site-nav");
    if (!toggle || !nav) return;

    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      nav.classList.toggle("is-open", open);
    };

    toggle.addEventListener("click", () => {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
      Sound.play("tick");
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });

    // Al volver a escritorio, ensure que el menú queda cerrado.
    window.matchMedia("(min-width: 761px)").addEventListener("change", (event) => {
      if (event.matches) setOpen(false);
    });
  }

  /* ------------------------------------------------------- sonido (opcional) */

  /**
   * Blips cortos de terminal con Web Audio.
   * Desactivados por defecto; el usuario los activa desde la cabecera.
   */
  const Sound = (function () {
    let enabled = false;
    let ctx = null;

    try {
      enabled = localStorage.getItem(STORAGE_KEY) === "on";
    } catch {
      /* almacenamiento no disponible */
    }

    /** Crea el AudioContext solo tras una interacción del usuario. */
    const context = () => {
      if (!ctx) {
        const AudioCtx = window.AudioContext ?? window.webkitAudioContext;
        if (!AudioCtx) return null;
        ctx = new AudioCtx();
      }
      if (ctx.state === "suspended") ctx.resume();
      return ctx;
    };

    return {
      get enabled() {
        return enabled;
      },

      /** @param {"tick"|"hover"|"key"} name */
      play(name = "tick") {
        if (!enabled) return;
        const audio = context();
        if (!audio) return;

        const presets = {
          tick: { freq: 660, end: 520, duration: 0.05, gain: 0.035 },
          hover: { freq: 980, end: 980, duration: 0.03, gain: 0.02 },
          key: { freq: 420, end: 300, duration: 0.08, gain: 0.04 },
        };
        const preset = presets[name] ?? presets.tick;

        const osc = audio.createOscillator();
        const gain = audio.createGain();
        const now = audio.currentTime;

        osc.type = "square"; // onda cuadrada = estética 8-bit
        osc.frequency.setValueAtTime(preset.freq, now);
        osc.frequency.exponentialRampToValueAtTime(preset.end, now + preset.duration);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(preset.gain, now + 0.006);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + preset.duration);

        osc.connect(gain).connect(audio.destination);
        osc.start(now);
        osc.stop(now + preset.duration + 0.01);
      },

      toggle() {
        enabled = !enabled;
        try {
          localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");
        } catch {
          /* almacenamiento no disponible */
        }
        if (enabled) this.play("key");
        return enabled;
      },
    };
  })();

  /** Botón de la cabecera que activa/desactiva los sonidos. */
  function initSoundToggle() {
    const button = document.querySelector("[data-sound-toggle]");
    if (!button) return;

    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", "#i-mute");

    const paint = () => {
      const on = Sound.enabled;
      button.setAttribute("aria-pressed", String(on));
      button.setAttribute("aria-label", on ? "Desactivar sonidos de terminal" : "Activar sonidos de terminal");
      use.setAttribute("href", on ? "#i-sound" : "#i-mute");
    };

    button.querySelector("use")?.replaceWith(use);
    paint();

    button.addEventListener("click", () => {
      Sound.toggle();
      paint();
    });

    // Blip suave al pasar el ratón por los elementos marcados con data-sound.
    document.addEventListener("pointerover", (event) => {
      if (event.target.closest("[data-sound]")) Sound.play("hover");
    });
  }

  /* ------------------------------------------------------------------ año */

  /** Mantiene el año del footer al día sin editar el HTML cada año. */
  function initYear() {
    const target = document.querySelector("[data-current-year]");
    if (target) target.textContent = new Date().getFullYear();
  }

  /* ------------------------------------------------------------------ init */

  function init() {
    initYear();
    initLocalTime();
    initBootLog();
    initSoundToggle();
    initMobileNav();
    initActiveNav();

    load()
      .then((data) => {
        hydrateLinks(data.links);
        renderFocus(document.querySelector("[data-focus-list]"), data.focus);
        renderProjects(document.querySelector("[data-projects-list]"), data.projects);
        renderStack(document.querySelector("[data-stack-list]"), data.stack);

        initFilters();
        initReveal(); // se ejecuta tras renderizar: ya existen los nodos a observar
      })
      .catch(() => {
        document.querySelectorAll(".skeleton-card").forEach((node) => node.remove());
        console.error("[portfolio] Secciones de contenido vacías: revisa assets/data/site.json");
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();