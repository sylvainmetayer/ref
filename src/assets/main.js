// Amélioration progressive : sans JS, les codes restent lisibles, tous les services
// affichés et les liens /go/ fonctionnent.

let currentFilter = "";

// Boutons "Copier" (masqués sans Clipboard API)
if (navigator.clipboard) {
  document.querySelectorAll(".copy-button").forEach((button) => {
    const label = button.querySelector(".copy-button__label");
    const initial = label.textContent;
    let timer;
    button.hidden = false;
    button.addEventListener("click", async () => {
      await navigator.clipboard.writeText(button.dataset.copy);
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

const plural = (n) => `${n} service${n > 1 ? "s" : ""}`;

// Filtres par catégorie et par texte
const filters = document.querySelector(".filters");
if (filters) {
  const chips = filters.querySelectorAll(".chip");
  const cards = document.querySelectorAll(".card");
  const input = filters.querySelector(".filters__search");
  const count = filters.querySelector(".filters__count");
  const apply = () => {
    const term = input.value.trim().toLowerCase();
    let shown = 0;
    cards.forEach((card) => {
      card.hidden =
        (currentFilter !== "" && card.dataset.category !== currentFilter) || !`${card.querySelector("h2").textContent} ${card.dataset.category}`.toLowerCase().includes(term);
      if (!card.hidden) shown++;
    });
    count.textContent = shown === cards.length ? "" : plural(shown);
  };
  filters.hidden = false;
  input.addEventListener("input", apply);
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      currentFilter = chip.dataset.filter;
      chips.forEach((other) => other.setAttribute("aria-pressed", String(other === chip)));
      apply();
    });
  });
}

// Recherche rapide (bouton « Rechercher » ou Ctrl/Cmd+K) vers la page d'un service
const search = document.querySelector("dialog.search");
const openButton = document.querySelector(".search-open");
if (search?.showModal && openButton) {
  const input = search.querySelector(".search__input");
  const items = [...search.querySelectorAll("li")];
  const count = search.querySelector(".search__count");
  const apply = () => {
    const term = input.value.trim().toLowerCase();
    items.forEach((item) => (item.hidden = !item.dataset.search.includes(term)));
    count.textContent = plural(items.filter((item) => !item.hidden).length);
  };
  const open = () => {
    input.value = "";
    apply();
    search.showModal();
  };
  openButton.hidden = false;
  openButton.addEventListener("click", open);
  search.querySelector(".search__close").addEventListener("click", () => search.close());
  // Clic sur le fond (hors du contenu) : fermeture
  search.addEventListener("click", (event) => event.target === search && search.close());
  input.addEventListener("input", apply);
  input.addEventListener("keydown", (event) => {
    const first = items.find((item) => !item.hidden);
    if (event.key === "Enter" && first) location.href = first.querySelector("a").href;
  });
  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      search.open ? search.close() : open();
    }
  });
}
