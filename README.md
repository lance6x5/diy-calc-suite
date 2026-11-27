# DIY Project Calculator Suite

A tabbed collection of home-improvement material estimators that runs entirely in your browser (no backend, works offline as an installable PWA).

**Live app:** https://lance6x5.github.io/diy-calc-suite/

## Features

- **Six calculators**, one tab each:
  1. **Paint**: multiple walls, minus doors/windows, number of coats, coverage per gallon (default 350 sq ft, editable). Outputs gallons + quarts (or 4 L + 1 L cans in metric).
  2. **Deck boards**: deck size, board width/length, gap, waste factor. Outputs boards plus joists at 12/16/24 in on-center.
  3. **Concrete**: slab, round footings (cylinder) or solid steps. Outputs cu ft / cu yd (or m³), plus 40/60/80 lb bag counts.
  4. **Drywall**: room size, optional ceiling, 4×8 or 4×12 sheets. Outputs sheets, screws, joint compound and tape.
  5. **Flooring / Tile**: area, piece size, waste (10% straight, 15% diagonal), coverage per box. Outputs boxes.
  6. **Mulch / Gravel / Soil**: area and depth. Outputs cubic yards (or m³) and bag count.
- A global **Imperial / Metric** toggle converts all inputs and outputs.
- Optional **unit prices** on every purchasable item give a cost estimate.
- Every result is **rounded up to whole purchasable units**, and the exact value is shown too.
- A **"How this is calculated"** section on every calculator.
- **Projects**: save named projects (e.g. "Basement drywall") that bundle several calculator results into one shopping list. Projects are stored in IndexedDB.
- **Printable shopping list** with print-friendly CSS.
- **Export / Import** of all data as JSON, plus **Reset all data** with a confirmation step.
- Light and dark mode, responsive down to 375 px, keyboard accessible.

> Results are estimates. Always confirm quantities with your supplier.

## Local development

```bash
npm install
npm run dev      # start dev server at http://localhost:5173/diy-calc-suite/
npm test         # run Vitest unit tests (non-watch)
npm run build    # production build into dist/
npm run preview  # preview the production build
```

## Deploying to GitHub Pages

1. Push this repo to GitHub on the `main` branch.
2. One-time setup: **Repo Settings → Pages → Source: "GitHub Actions"**.
3. Every push to `main` (or a manual run of the workflow) runs `.github/workflows/deploy.yml`, which installs, tests, builds and deploys `dist/`.

`vite.config.js` sets `base: '/diy-calc-suite/'`. If you rename the repo, update `base` and the manifest `start_url`/`scope` to match.

## Project structure

```
src/
  calculators/
    index.js              # registry of all calculators + input merging
    paint/                # one folder per calculator
      calc.js             #   pure functions: defaults, calculate, present, formula
      calc.test.js        #   Vitest unit tests
      PaintForm.jsx       #   input UI
      index.js            #   module descriptor
    deck/ concrete/ drywall/ flooring/ landscape/
  components/             # shared UI: CalculatorView, ResultsPanel, NumberField, ...
  views/                  # Projects list, Project shopping list, Data (export/import/reset)
  lib/                    # units, math, IndexedDB, localStorage, hash router, shopping helpers
```

### How units work

All calculator state is stored in **imperial** units. `NumberField` converts values to and from metric for display, so the calculation functions only work in imperial. Each calculator's `present(result, units)` turns a result into display values and purchasable items for the chosen unit system.

## Adding a calculator

1. Create `src/calculators/<id>/calc.js` exporting:
   - `defaults`: initial inputs in imperial units, including `prices: {}`.
   - `calculate(inputs)`: a **pure** function returning raw numbers.
   - `present(result, units)`: returns `{ summary: [{label, value, unit}], items: [{key, label, qty, unit, exact, exactUnit, priceKey}] }`. `qty` is the rounded-up purchasable quantity. `priceKey` enables an optional unit-price field.
   - `formula`: an array of strings for "How this is calculated".
2. Add `calc.test.js` with Vitest tests for `calculate` (and `present` if it does rounding).
3. Create a form component `<Name>Form.jsx` receiving `{ inputs, update, units }`. Use `NumberField` with a `dim` (`length`, `small`, `area`, `volume`, `coverage`, `bag`) so the field converts units automatically.
4. Create `index.js` exporting `{ id, title, description, defaults, calculate, present, formula, Form }`.
5. Import it in `src/calculators/index.js` and add it to `CALCULATORS`. The tab, route (`#/<id>`), persistence and project saving work automatically.

## Data & privacy

Everything stays in your browser: projects in IndexedDB and settings/inputs in localStorage. There is no server and no tracking. Use **Data → Export JSON** to back up or move your data.
