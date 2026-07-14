# Sponsrr 🔍

Ever tried to find a company in the UK Home Office's register of licensed visa sponsors? It's a giant CSV with tens of thousands of rows. Ctrl+F is not a search engine. Sponsrr is.

Load the latest register with one click, then search and filter thousands of organisations as fast as you can type.

## What it does

- ⚡ **Instant search** — filter by organisation name, town, or county in real time. No spinners, no waiting.
- 📄 **Paginated table** — 25 results per page, keyboard-friendly, no infinite-scroll doom.
- 🎨 **Warm, muted palette** — paper and ink, with clay as the accent, and a light touch of glass on the navbar, hero and search panel.
- ✨ **Animations** — framer-motion entrances and page transitions, because spreadsheets deserve nice things too.

## Under the hood

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Chakra UI](https://chakra-ui.com/) for components and theming
- [Framer Motion](https://www.framer.com/motion/) for the fancy bits
- [react-table-library](https://react-table-library.com/) for the virtualised, paginated table
- [PapaParse](https://www.papaparse.com/) for chewing through CSVs

## Run it

```bash
npm install
npm start        # → http://localhost:3000
```

That's it. Really.

## Other scripts

| Command | What it does |
|---|---|
| `npm test` | Run the test suite |
| `npm run build` | Production build into `build/` |

## CI

GitHub Actions runs the tests on every push and PR to `main`, so broken builds get caught before they get cosy. Config lives in [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

## About the data

The bundled `current_list.csv` is the publicly available register of licensed sponsors published by the UK Home Office. Swap the file out whenever you like to refresh the data.
