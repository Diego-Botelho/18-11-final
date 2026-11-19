


export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";


export const texts = {
  brand: "Heroes UGB",
  title: "Adicione herois",
  subtitle: "Cadastre heróis, filtre por universo e mantenha todo mundo organizado.",
  searchPlaceholder: "Buscar por nome ou poder…",
  newButton: "Novo herói",
  emptyTitle: "Nenhum herói por aqui",
  emptyText: "Cadastre o primeiro herói para começar a liga.",
};


export const universes = {
  marvel: { bg: "bg-hot", text: "text-white" },
  dc: { bg: "bg-blue", text: "text-white" },
};


export const fallbackColors = [
  { bg: "bg-mint", text: "text-ink" },
  { bg: "bg-violet", text: "text-white" },
  { bg: "bg-pow", text: "text-ink" },
];

export function universeStyle(name) {
  const key = name.trim().toLowerCase();
  if (universes[key]) return universes[key];
  let h = 0;
  for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return fallbackColors[h % fallbackColors.length];
}
