
const C = window.APP_CONFIG;
const $ = (sel) => document.querySelector(sel);
const state = { heroes: [], query: "", universe: "all", editingId: null };


async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(C.API_URL + path, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new Error("OFFLINE");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Erro ${res.status}`);
  return data;
}

const api = {
  list:   ()         => request("/heroes"),
  create: (hero)     => request("/heroes", { method: "POST", body: JSON.stringify(hero) }),
  update: (id, hero) => request(`/heroes/${id}`, { method: "PUT", body: JSON.stringify(hero) }),
  remove: (id)       => request(`/heroes/${id}`, { method: "DELETE" }),
};


const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function universeStyle(name) {
  const key = name.trim().toLowerCase();
  if (C.universes[key]) return C.universes[key];
  let h = 0;
  for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return C.fallbackColors[h % C.fallbackColors.length];
}

let toastTimer;
function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add("hidden"), 2600);
}


function heroCard(h) {
  const s = universeStyle(h.universe);
  return `
    <article class="flex flex-col overflow-hidden rounded-2xl border-4 border-ink bg-white shadow-panel">
      <div class="halftone relative flex h-36 items-center justify-center border-b-4 border-ink ${s.bg}">
        <span class="font-display text-8xl leading-none ${s.text}" style="text-shadow: 4px 4px 0 #17143A">${esc(h.name.trim()[0] || "?").toUpperCase()}</span>
        <span class="absolute left-3 top-3 rounded-lg border-2 border-ink bg-white px-2 py-0.5 text-sm font-bold">${esc(h.universe)}</span>
      </div>
      <div class="flex flex-1 flex-col p-5">
        <h3 class="font-display text-3xl leading-tight tracking-wide">${esc(h.name)}</h3>
        <p class="mt-1 flex-1 font-medium text-ink/75">${esc(h.power)}</p>
        <div class="mt-5 flex gap-3">
          <button data-edit="${h.id}" class="btn flex-1 rounded-lg border-4 border-ink bg-pow py-1.5 font-bold shadow-press">Editar</button>
          <button data-delete="${h.id}" class="btn rounded-lg border-4 border-ink bg-white px-4 py-1.5 font-bold shadow-press">Excluir</button>
        </div>
      </div>
    </article>`;
}

function stateCard(title, text, button = "") {
  return `
    <div class="col-span-full rounded-2xl border-4 border-dashed border-ink bg-white p-10 text-center">
      <h3 class="font-display text-4xl tracking-wide">${title}</h3>
      <p class="mx-auto mt-2 max-w-md font-medium">${text}</p>
      ${button}
    </div>`;
}

function render() {
  const q = state.query.toLowerCase();
  const universes = [...new Set(state.heroes.map((h) => h.universe.trim()))].sort();

  // Filtros por universo
  const chip = (value, label) => {
    const on = state.universe === value;
    return `<button data-universe="${esc(value)}" class="btn rounded-full border-4 border-ink px-4 py-1 text-sm font-bold ${on ? "bg-ink text-white" : "bg-white"} shadow-press">${esc(label)}</button>`;
  };
  $("#chips").innerHTML = universes.length ? chip("all", "Todos") + universes.map((u) => chip(u, u)).join("") : "";
  $("#universeList").innerHTML = universes.map((u) => `<option value="${esc(u)}">`).join("");

  // Lista filtrada
  const list = state.heroes.filter(
    (h) =>
      (state.universe === "all" || h.universe.trim() === state.universe) &&
      (h.name + " " + h.power + " " + h.universe).toLowerCase().includes(q)
  );
  $("#count").textContent = state.heroes.length ? `${list.length} de ${state.heroes.length} heróis` : "";

  if (!state.heroes.length) {
    $("#grid").innerHTML = stateCard(C.texts.emptyTitle, C.texts.emptyText,
      `<button data-new class="btn mt-5 rounded-xl border-4 border-ink bg-hot px-6 py-2 font-display text-2xl tracking-wide text-white shadow-panel">${C.texts.newButton}</button>`);
  } else if (!list.length) {
    $("#grid").innerHTML = stateCard("Nada encontrado", "Tente outro nome, poder ou universo.");
  } else {
    $("#grid").innerHTML = list.map(heroCard).join("");
  }
}


async function load() {
  try {
    state.heroes = await api.list();
    render();
  } catch (err) {
    $("#chips").innerHTML = "";
    $("#count").textContent = "";
    $("#grid").innerHTML = stateCard(
      "Não consegui falar com a API",
      `Confira se o servidor está rodando em <b>${esc(C.API_URL)}</b> (na pasta <b>superheroes-api</b>, rode <b>npm run dev</b>).`,
      `<button data-retry class="btn mt-5 rounded-xl border-4 border-ink bg-pow px-6 py-2 font-bold shadow-press">Tentar de novo</button>`
    );
  }
}

function openForm(hero = null) {
  state.editingId = hero ? hero.id : null;
  $("#modalTitle").textContent = hero ? "Editar herói" : C.texts.newButton;
  $("#formError").classList.add("hidden");
  const f = $("#form");
  f.name.value = hero?.name ?? "";
  f.universe.value = hero?.universe ?? "";
  f.power.value = hero?.power ?? "";
  $("#modal").showModal();
  f.name.focus();
}

$("#form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = e.target;
  const data = { name: f.name.value.trim(), universe: f.universe.value.trim(), power: f.power.value.trim() };
  const save = $("#saveBtn");
  save.disabled = true;
  try {
    if (state.editingId) await api.update(state.editingId, data);
    else await api.create(data);
    $("#modal").close();
    toast(state.editingId ? "Herói atualizado" : "Herói cadastrado");
    await load();
  } catch (err) {
    const box = $("#formError");
    box.textContent = err.message === "OFFLINE" ? "A API está fora do ar. Inicie o servidor e tente de novo." : err.message;
    box.classList.remove("hidden");
  } finally {
    save.disabled = false;
  }
});

document.addEventListener("click", async (e) => {
  const t = e.target.closest("button");
  if (!t) return;

  if (t.dataset.universe) { state.universe = t.dataset.universe; render(); }
  else if (t.hasAttribute("data-new")) openForm();
  else if (t.hasAttribute("data-retry")) load();
  else if (t.dataset.edit) openForm(state.heroes.find((h) => h.id == t.dataset.edit));
  else if (t.dataset.delete) {
    const hero = state.heroes.find((h) => h.id == t.dataset.delete);
    if (!confirm(`Excluir ${hero.name}? Essa ação não pode ser desfeita.`)) return;
    try { await api.remove(hero.id); toast("Herói excluído"); await load(); }
    catch (err) { toast(err.message === "OFFLINE" ? "API fora do ar" : err.message); }
  }
});

$("#search").addEventListener("input", (e) => { state.query = e.target.value; render(); });
$("#newBtn").addEventListener("click", () => openForm());
$("#cancelBtn").addEventListener("click", () => $("#modal").close());


$("#brand").textContent = C.texts.brand;
$("#title").textContent = C.texts.title;
$("#subtitle").textContent = C.texts.subtitle;
$("#search").placeholder = C.texts.searchPlaceholder;
$("#newBtn").textContent = C.texts.newButton;
load();
