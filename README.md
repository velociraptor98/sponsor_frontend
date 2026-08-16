# Sponsrr 🔍

Ever tried to find a company in the UK Home Office's register of licensed visa sponsors? It's a giant CSV with tens of thousands of rows. Ctrl+F is not a search engine. Sponsrr is.

The register loads as the page opens, so the entry screen leads with what is actually in it. Search it, or narrow it down by town, visa route and licence rating.

## What it does

- ⚡ **Instant search** — filter by organisation name, town, or county in real time. No spinners, no waiting.
- 🧭 **Live facets** — town, route and rating counts are computed against everything *except* the facet they belong to, so a number tells you what picking it would actually give you.
- 🏢 **One row per organisation** — the register lists an employer once per route; Sponsrr groups those back together and shows the routes in one cell.
- 📄 **Paginated table** on the desktop, a compact list with *load more* on mobile.
- 🎨 **Modernist** — warm grey ground, near-black ink, one vermilion accent, Archivo throughout, and no rounded corners anywhere. Structure is drawn with rules, not shadows.

## Under the hood

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Chakra UI](https://chakra-ui.com/) for components and theming
- [PapaParse](https://www.papaparse.com/) for chewing through CSVs, in a worker so the UI stays live

## Run it

```bash
npm install
npm start        # → http://localhost:5173
```

That's it. Really.

## Other scripts

| Command | What it does |
|---|---|
| `npm test` | Run the test suite |
| `npm run build` | Production build into `dist/` |
| `npm run typecheck` | Type-check without emitting |

## CI

GitHub Actions runs the tests on every push and PR to `main`, so broken builds get caught before they get cosy. Config lives in [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

## About the data

The bundled `current_list.csv` is the publicly available register of licensed sponsors published by the UK Home Office. Swap the file out whenever you like to refresh the data.
