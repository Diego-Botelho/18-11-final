import { API_URL } from "./config.js";

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(API_URL + path, {
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

export const api = {
  list: () => request("/heroes"),
  create: (hero) => request("/heroes", { method: "POST", body: JSON.stringify(hero) }),
  update: (id, hero) => request(`/heroes/${id}`, { method: "PUT", body: JSON.stringify(hero) }),
  remove: (id) => request(`/heroes/${id}`, { method: "DELETE" }),
};
