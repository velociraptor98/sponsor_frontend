# Sponsrr

A fast, searchable viewer for the UK Home Office's register of licensed visa sponsors. Load the latest list in one click, or upload any CSV export to browse and filter thousands of organisations.

## Features

- **Instant search** — filter by organisation name, town, or county in real time
- **Load or upload** — fetch the bundled register directly or drop in your own CSV
- **Paginated table** — 25 results per page with keyboard-friendly navigation
- **Dark / light mode** — Everforest-themed palette with a smooth animated toggle
- **Animated transitions** — framer-motion powered entrance and page-switch animations

## Tech stack

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Chakra UI](https://chakra-ui.com/) — component library and theming
- [Framer Motion](https://www.framer.com/motion/) — animations
- [react-table-library](https://react-table-library.com/) — virtualised, paginated table
- [PapaParse](https://www.papaparse.com/) — CSV parsing

## Getting started

```bash
npm install
npm start        # http://localhost:3000
```

## Scripts

| Command | Description |
|---|---|
| `npm start` | Start the development server |
| `npm test` | Run the test suite |
| `npm run build` | Production build to `build/` |

## CI

GitHub Actions runs the test suite on every push and pull request targeting `main`. See [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

## Data

The bundled `current_list.csv` is the publicly available register of licensed sponsors published by the UK Home Office. You can replace it at any time or upload a fresh export via the UI.
