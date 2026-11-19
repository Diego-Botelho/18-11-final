import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "./api.js";
import { API_URL, texts } from "./config.js";
import HeroCard from "./components/HeroCard.jsx";
import HeroForm from "./components/HeroForm.jsx";
import StateCard from "./components/StateCard.jsx";

export default function App() {
  const [heroes, setHeroes] = useState([]);
  const [offline, setOffline] = useState(false);
  const [query, setQuery] = useState("");
  const [universe, setUniverse] = useState("all");
  const [form, setForm] = useState({ open: false, hero: null });
  const [toast, setToast] = useState("");

  const load = useCallback(async () => {
    try {
      setHeroes(await api.list());
      setOffline(false);
    } catch {
      setOffline(true);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const universes = useMemo(() => [...new Set(heroes.map((h) => h.universe.trim()))].sort(), [heroes]);

  const visible = heroes.filter(
    (h) =>
      (universe === "all" || h.universe.trim() === universe) &&
      `${h.name} ${h.power} ${h.universe}`.toLowerCase().includes(query.toLowerCase())
  );

  async function save(data) {
    const editing = form.hero;
    if (editing) await api.update(editing.id, data);
    else await api.create(data);
    setForm({ open: false, hero: null });
    setToast(editing ? "Herói atualizado" : "Herói cadastrado");
    load();
  }

  async function remove(hero) {
    if (!confirm(`Excluir ${hero.name}? Essa ação não pode ser desfeita.`)) return;
    try {
      await api.remove(hero.id);
      setToast("Herói excluído");
      load();
    } catch (err) {
      setToast(err.message === "OFFLINE" ? "API fora do ar" : err.message);
    }
  }

  const openNew = () => setForm({ open: true, hero: null });

  return (
    <>
      {/* Cabeçalho + busca */}
      <header className="halftone border-b-4 border-ink bg-pow">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
          <p className="font-display text-2xl tracking-wide">{texts.brand}</p>
          <h1 className="mt-1 font-display text-6xl leading-none tracking-wide sm:text-8xl" style={{ textShadow: "4px 4px 0 #941a1a" }}>
            {texts.title}
          </h1>
          <p className="mt-4 max-w-xl text-lg font-medium">{texts.subtitle}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              aria-label="Buscar heróis"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={texts.searchPlaceholder}
              className="w-full rounded-xl border-4 border-ink bg-white px-4 py-3 font-medium shadow-panel placeholder:text-ink/50 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue sm:max-w-md"
            />
            <button onClick={openNew} className="btn rounded-xl bg-hot px-6 py-3 font-display text-2xl tracking-wide text-white shadow-panel">
              {texts.newButton}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">
        {/* Filtros por universo */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {universes.length > 0 &&
            ["all", ...universes].map((u) => (
              <button
                key={u}
                onClick={() => setUniverse(u)}
                className={`btn rounded-full px-4 py-1 text-sm ${universe === u ? "bg-ink text-white" : "bg-white"}`}
              >
                {u === "all" ? "Todos" : u}
              </button>
            ))}
          {heroes.length > 0 && (
            <span className="ml-auto text-sm font-bold">{visible.length} de {heroes.length} heróis</span>
          )}
        </div>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
          {offline ? (
            <StateCard
              title="Não consegui falar com a API"
              action={<button onClick={load} className="btn mt-5 rounded-xl bg-pow px-6 py-2">Tentar de novo</button>}
            >
              Confira se o servidor está rodando em <b>{API_URL}</b> (na pasta <b>superheroes-api</b>, rode <b>npm run dev</b>).
            </StateCard>
          ) : heroes.length === 0 ? (
            <StateCard
              title={texts.emptyTitle}
              action={<button onClick={openNew} className="btn mt-5 rounded-xl bg-hot px-6 py-2 font-display text-2xl tracking-wide text-white">{texts.newButton}</button>}
            >
              {texts.emptyText}
            </StateCard>
          ) : visible.length === 0 ? (
            <StateCard title="Nada encontrado">Tente outro nome, poder ou universo.</StateCard>
          ) : (
            visible.map((h) => (
              <HeroCard key={h.id} hero={h} onEdit={(hero) => setForm({ open: true, hero })} onDelete={remove} />
            ))
          )}
        </section>
      </main>

      <HeroForm
        open={form.open}
        hero={form.hero}
        universes={universes}
        onSave={save}
        onClose={() => setForm({ open: false, hero: null })}
      />

      {toast && (
        <div role="status" className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-xl border-4 border-ink bg-white px-5 py-3 font-bold shadow-panel">
          {toast}
        </div>
      )}
    </>
  );
}
