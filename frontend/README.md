# Frontend · Liga UGB (React + Vite + Tailwind)

## Rodar
1. Backend: na pasta `superheroes-api`, `npm install` e `npm run dev` (porta 3000).
2. Frontend: nesta pasta, `npm install` e `npm run dev` → abra o endereço que o Vite mostrar (normalmente http://localhost:5173).

## Onde editar
| Quero mudar…                           | Arquivo                          |
|----------------------------------------|----------------------------------|
| URL da API, textos, cores por universo | `src/config.js`                  |
| Paleta, fontes, sombras                | `tailwind.config.js`             |
| Layout do cartão do herói              | `src/components/HeroCard.jsx`    |
| Campos do formulário                   | `src/components/HeroForm.jsx`    |
| Cabeçalho, filtros, página             | `src/App.jsx`                    |
| Chamadas à API                         | `src/api.js`                     |

## Publicar
`npm run build` gera a pasta `dist` (pode ir para o GitHub Pages, Netlify, Vercel…).
Defina a URL do backend publicado em `VITE_API_URL` (arquivo `.env`: `VITE_API_URL=https://sua-api.com`).
