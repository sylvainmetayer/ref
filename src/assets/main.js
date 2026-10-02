// Amélioration progressive : sans JS, les codes restent lisibles, tous les services
// affichés et les liens /go/ fonctionnent (comptés côté serveur sans contexte).

let currentFilter = "";

// Référent externe d'arrivée, mémorisé pour la session (domaine uniquement)
const externalReferrer = (() => {
  const key = "ref:referrer";
  try {
    let host = sessionStorage.getItem(key);
    if (host === null) {
      host = document.referrer ? new URL(document.referrer).hostname : "";
      if (host === location.hostname) host = "";
      sessionStorage.setItem(key, host);
    }
    return host;
  } catch {
    return "";
  }
})();

const context = () => ({ from: location.pathname, filter: currentFilter, ref: externalReferrer });

// Événements navigateur → Pages Function /api/event (Workers Analytics Engine)
const track = (event, data = {}) => {
  navigator.sendBeacon?.("/api/event", JSON.stringify({ event, ...context(), ...data }));
};

document.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link) return;

  // Lien de parrainage : le contexte part en paramètres, la Function /go/ le compte
  if (link.pathname.startsWith("/go/")) {
    link.search = new URLSearchParams(context()).toString();
  } else if (link.classList.contains("other")) {
    track("other", { slug: link.dataset.slug });
  }
});

// Boutons "Copier" (masqués sans Clipboard API)
if (navigator.clipboard) {
  document.querySelectorAll(".copy-button").forEach((button) => {
    const label = button.querySelector(".copy-button__label");
    const initial = label.textContent;
    let timer;
    button.hidden = false;
    button.addEventListener("click", async () => {
      await navigator.clipboard.writeText(button.dataset.copy);
      track("copy", { slug: button.dataset.slug });
      button.classList.add("is-copied");
      label.textContent = initial === "Copier" ? "Copié" : "Code copié";
      clearTimeout(timer);
      timer = setTimeout(() => {
        button.classList.remove("is-copied");
        label.textContent = initial;
      }, 2000);
    });
  });
}

// Filtres par catégorie
const filters = document.querySelector(".filters");
if (filters) {
  const chips = filters.querySelectorAll(".chip");
  const cards = document.querySelectorAll(".card");
  filters.hidden = false;
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      currentFilter = chip.dataset.filter;
      chips.forEach((other) => other.setAttribute("aria-pressed", String(other === chip)));
      cards.forEach((card) => {
        card.hidden = currentFilter !== "" && card.dataset.category !== currentFilter;
      });
      track("filter", { filter: currentFilter || "Tous" });
    });
  });
}
