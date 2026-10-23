# Sponsrr

Search the UK Home Office's list of licensed visa sponsors. The official list is a CSV with over 100,000 rows; Sponsrr lets you search it by company name, town or county and filter by town, visa route and rating.

## Features

- **Search** by company name, town or county as you type.
- **Filters** for town, visa route and rating. Each count shows how many results you'd get if you picked that option.
- **One row per company.** The Home Office list repeats a company once per visa route; Sponsrr merges those rows and lists the routes together.
- **CSV export** of the current results.
- A paginated table on desktop and a scrolling list on mobile.

## Under the hood

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Chakra UI](https://chakra-ui.com/) for components and theming
- [PapaParse](https://www.papaparse.com/) to parse the CSV in a web worker

## Run it

```bash
npm install
npm start        # → http://localhost:5173
```

## Other scripts

| Command | What it does |
|---|---|
| `npm test` | Run the test suite |
| `npm run build` | Production build into `dist/` |
| `npm run typecheck` | Type-check without emitting |

## CI

GitHub Actions runs the tests on every push and PR to `main`. Config is in [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

## About the data

`public/current_list.csv` is the public register of licensed sponsors published by the UK Home Office. Replace the file to update the data.
