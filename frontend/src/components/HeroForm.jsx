import { useEffect, useRef, useState } from "react";
import { texts } from "../config.js";


const empty = { name: "", universe: "", power: "" };

export default function HeroForm({ open, hero, universes, onSave, onClose }) {
  const dialog = useRef(null);
  const [values, setValues] = useState(empty);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setValues(hero ? { name: hero.name, universe: hero.universe, power: hero.power } : empty);
      setError("");
      dialog.current?.showModal();
    } else {
      dialog.current?.close();
    }
  }, [open, hero]);

  const set = (field) => (e) => setValues({ ...values, [field]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        name: values.name.trim(),
        universe: values.universe.trim(),
        power: values.power.trim(),
      });
    } catch (err) {
      setError(err.message === "OFFLINE" ? "A API está fora do ar. Inicie o servidor e tente de novo." : err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      className="w-[min(92vw,28rem)] rounded-2xl border-4 border-ink bg-white p-0 shadow-panel"
    >
      <form onSubmit={submit} className="space-y-4 p-6">
        <h2 className="font-display text-4xl tracking-wide">{hero ? "Editar herói" : texts.newButton}</h2>

        <label className="block text-sm font-bold">
          Nome
          <input className="field" required value={values.name} onChange={set("name")} placeholder="Ex.: Mulher-Maravilha" />
        </label>
        <label className="block text-sm font-bold">
          Universo
          <input className="field" required list="universeList" value={values.universe} onChange={set("universe")} placeholder="Ex.: DC" />
          <datalist id="universeList">
            {universes.map((u) => <option key={u} value={u} />)}
          </datalist>
        </label>
        <label className="block text-sm font-bold">
          Poder
          <input className="field" required value={values.power} onChange={set("power")} placeholder="Ex.: Super força" />
        </label>

        {error && <p className="rounded-lg bg-hot/10 px-3 py-2 text-sm font-bold text-hot">{error}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn rounded-xl bg-white px-5 py-2">Cancelar</button>
          <button type="submit" disabled={saving} className="btn rounded-xl bg-pow px-5 py-2 disabled:opacity-60">
            Salvar herói
          </button>
        </div>
      </form>
    </dialog>
  );
}
