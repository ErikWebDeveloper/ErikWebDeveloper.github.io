/* =============================================================================
   render.js — Renderizado de las secciones a partir de site.json
   Funciones puras: reciben datos y devuelven nodos DOM.
   ============================================================================= */

window.PortfolioRender = (function () {
  "use strict";

  /** Crea un <li> con clases y contenido textual. */
  function li(className, text) {
    const node = document.createElement("li");
    node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  /** Crea un icono del sprite de pixel art. */
  function icon(symbolId, extraClass = "") {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", `icon ${extraClass}`.trim());
    svg.setAttribute("aria-hidden", "true");

    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", `#${symbolId}`);
    svg.append(use);
    return svg;
  }

  /** Extrae el nombre legible de un slug de proyecto (pixel-dungeon → pixel dungeon). */
  function humanize(slug) {
    return String(slug)
      .split(/[-_]/)
      .join(" ")
      .toLowerCase();
  }

  /** Aplica los enlaces del JSON a cualquier elemento con data-link="<id>". */
  function hydrateLinks(links) {
    document.querySelectorAll("[data-link]").forEach((node) => {
      const entry = links[node.dataset.link];
      if (!entry?.url) return;

      node.href = entry.url;
      node.setAttribute("data-hydrated", "true");

      const label = node.querySelector("[data-link-text]") ?? (entry.label ? node : null);
      if (label) label.textContent = entry.label;
    });
  }

  /** Sección 2: tarjetas de enfoque. */
  function renderFocus(container, items) {
    if (!container || !items.length) return;

    const fragment = document.createDocumentFragment();

    items.forEach((item) => {
      const card = li("card card-focus reveal");

      if (item.icon) card.append(icon(item.icon, "card-icon"));

      const title = document.createElement("h3");
      title.className = "card-title";
      title.textContent = item.title ?? "";

      const text = document.createElement("p");
      text.className = "card-text";
      text.textContent = item.description ?? "";

      card.append(title, text);

      if (item.tags?.length) {
        const tags = document.createElement("div");
        tags.className = "tags";
        item.tags.forEach((tag) => {
          const chip = document.createElement("span");
          chip.className = "tag";
          chip.textContent = tag;
          tags.append(chip);
        });
        card.append(tags);
      }

      fragment.append(card);
    });

    container.replaceChildren(fragment);
  }

  /** Sección 3: tarjetas de proyectos y experimentos. */
  function renderProjects(container, projects) {
    if (!container || !projects.length) return;

    const fragment = document.createDocumentFragment();

    projects.forEach((project) => {
      const isExperiment = project.kind === "experiment";
      const card = li("card card-project reveal");
      card.dataset.kind = isExperiment ? "experiment" : "product";
      card.dataset.id = project.id ?? humanize(project.title);

      /* Cabecera: título + badge de tipo */
      const head = document.createElement("div");
      head.className = "project-head";

      const title = document.createElement("h3");
      title.className = "project-title";

      const hash = document.createElement("span");
      hash.className = "pixel-hash";
      hash.setAttribute("aria-hidden", "true");
      hash.textContent = "#";
      title.append(hash, project.title ?? "");

      const badge = document.createElement("span");
      badge.className = `badge ${isExperiment ? "badge-purple" : "badge-cyan"}`;
      badge.textContent = isExperiment ? "Experimento" : "Producto";

      head.append(title, badge);

      /* Resumen */
      const summary = document.createElement("p");
      summary.className = "project-summary";
      summary.textContent = project.summary ?? "";

      /* Stack de tecnologías */
      const tags = document.createElement("div");
      tags.className = "tags";
      (project.stack ?? []).forEach((tech) => {
        const chip = document.createElement("span");
        chip.className = "tag";
        chip.textContent = tech;
        tags.append(chip);
      });

      /* Pie: meta + enlaces */
      const foot = document.createElement("div");
      foot.className = "project-foot";

      const meta = document.createElement("p");
      meta.className = "project-meta";
      [project.year, project.status].filter(Boolean).forEach((text, index) => {
        if (index > 0) {
          const sep = document.createElement("span");
          sep.setAttribute("aria-hidden", "true");
          sep.textContent = "//";
          meta.append(sep);
        }
        meta.append(document.createTextNode(text));
      });

      const links = document.createElement("div");
      links.className = "project-links";

      if (project.links?.repo) {
        const repo = document.createElement("a");
        repo.className = "link-chip";
        repo.href = project.links.repo;
        repo.target = "_blank";
        repo.rel = "noopener";
        repo.dataset.sound = "";
        repo.append(icon("i-github"), document.createTextNode("Código"));
        links.append(repo);
      }

      if (project.links?.demo) {
        const demo = document.createElement("a");
        demo.className = "link-chip";
        demo.href = project.links.demo;
        demo.target = "_blank";
        demo.rel = "noopener";
        demo.dataset.sound = "";
        demo.append(icon("i-arrow"), document.createTextNode("Demo"));
        links.append(demo);
      }

      foot.append(meta, links);
      card.append(head, summary, tags, foot);
      fragment.append(card);
    });

    container.replaceChildren(fragment);
  }

  /** Sección 4: grupos de stack tecnológico. */
  function renderStack(container, groups) {
    if (!container || !groups.length) return;

    const fragment = document.createDocumentFragment();

    groups.forEach((group) => {
      const card = li("card stack-group reveal");

      const title = document.createElement("h3");
      title.className = "stack-title";
      title.textContent = group.title ?? "";

      const items = document.createElement("div");
      items.className = "stack-items";
      (group.items ?? []).forEach((item) => {
        const chip = document.createElement("span");
        chip.className = "stack-item";
        chip.textContent = item;
        items.append(chip);
      });

      card.append(title, items);
      fragment.append(card);
    });

    container.replaceChildren(fragment);
  }

  return { hydrateLinks, renderFocus, renderProjects, renderStack };
})();