import { universeStyle } from "../config.js";


export default function HeroCard({ hero, onEdit, onDelete }) {
  const s = universeStyle(hero.universe);

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border-4 border-ink bg-pow shadow-panel">
      <div className={`halftone relative flex h-36 items-center justify-center border-b-4 border-ink ${s.bg}`}>
        <span
          className={`font-display text-8xl leading-none ${s.text}`}
          style={{ textShadow: "10px 4px 0 #17143A" }}
        >
          {(hero.name.trim()[0] || "?").toUpperCase()}
        </span>
        <span className="absolute left-3 top-3 rounded-lg border-2 border-ink bg-pow px-2 py-0.5 text-sm font-bold">
          {hero.universe}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-3xl leading-tight tracking-wide">{hero.name}</h3>
        <p className="mt-1 flex-1 font-medium text-ink/75">{hero.power}</p>
        <div className="mt-5 flex gap-3">
          <button onClick={() => onEdit(hero)} className="btn flex-1 rounded-lg bg-pow py-1.5">Editar</button>
          <button onClick={() => onDelete(hero)} className="btn rounded-lg bg-pow px-4 py-1.5">Excluir</button>
        </div>
      </div>
    </article>
  );
}
