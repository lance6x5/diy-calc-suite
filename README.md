<p align="center"><img src="public/logo.svg" alt="Measure Twice logo" width="420"></p>

# Measure Twice

![Visits](https://abacus.jasoncameron.dev/get/lance6x5.github.io/diy-calc-suite/shield)

A **Silverlight DevTech** project · © 2026 Silverlight DevTech. Source-available under the [PolyForm Noncommercial License 1.0.0](LICENSE.md).

More apps: https://lance6x5.github.io/

**Cut once. Buy right.** Measure Twice is a tabbed collection of home-improvement material estimators that runs entirely in your browser (no backend, works offline as an installable PWA).

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

## Versioning

Measure Twice uses [Semantic Versioning](https://semver.org/). The current version is in `package.json`, is shown in the app footer (injected at build time as `__APP_VERSION__`), and every release is listed in [CHANGELOG.md](CHANGELOG.md) (Keep a Changelog format).

- **MAJOR**: a breaking change to stored data or the export/import schema (for example, backups from older versions need migrating).
- **MINOR**: new features that stay backward compatible, such as a new calculator or option.
- **PATCH**: bug fixes and small corrections that don't change features or data.

To cut a release: update `version` in `package.json`, move the `Unreleased` notes in `CHANGELOG.md` into a new dated version section, commit, push, then tag it (`git tag -a vX.Y.Z -m "Measure Twice vX.Y.Z"` and `git push origin vX.Y.Z`) and create a GitHub release from that changelog section.

## Branding

The logo is `public/logo.svg` (mark plus wordmark), and the mark on its own is `public/logo-mark.svg`. The favicon, `apple-touch-icon.png` and the PWA icons (`icon-192.png`, `icon-512.png`, `icon-maskable-512.png`) are rendered from the mark. The brand palette (blueprint blue `#1b4f8a` and tape-measure yellow `#f5b400`) is defined as CSS variables in `src/styles.css`, with light and dark variants.

## Feedback & issues

Found a bug or have an idea? Use **Report a bug** or **Request a feature** in the app footer, or go straight to GitHub:

- [Issues](https://github.com/lance6x5/diy-calc-suite/issues)
- [Report a bug](https://github.com/lance6x5/diy-calc-suite/issues/new?template=bug_report.yml)
- [Request a feature](https://github.com/lance6x5/diy-calc-suite/issues/new?template=feature_request.yml)

The in-app links open a pre-filled GitHub issue form (a free GitHub account is required). Only the app version and your browser name are filled in, never your projects or inputs. See [CONTRIBUTING.md](CONTRIBUTING.md) for how issues are triaged.

## Data & privacy

Everything stays in your browser: projects in IndexedDB and settings/inputs in localStorage. There is no app server, and your projects and inputs are never sent anywhere. Use **Data → Export JSON** to back up or move your data.

## Privacy & analytics

The footer shows an anonymous visit count. The app counts one page load per browser session using the open-source [Abacus](https://github.com/JasonLovesDoggo/abacus) counter; later loads in the same session only read the total.

- No cookies, no personal data stored, and nothing from the app (projects, inputs, settings) is sent.
- If your browser sends **Do Not Track** or **Global Privacy Control**, your visit is not counted (the total is still read). Nothing is counted on `localhost`.
- Like any web request, the request reveals your IP address to the counter service.
- The count is approximate (it includes bots and is not unique visitors) and public.

## License

Copyright © 2026 Silverlight DevTech. Measure Twice is **source-available**, not OSI-approved open source. It is licensed under the [PolyForm Noncommercial License 1.0.0](LICENSE.md) (SPDX: `PolyForm-Noncommercial-1.0.0`).

- **Free for noncommercial use:** personal, educational, research, nonprofit and other noncommercial use is allowed under the license terms.
- **Commercial use needs a separate license:** selling it, hosting it as a paid service, or using it inside a business product requires a commercial license from Silverlight DevTech. To ask, open a [GitHub issue](https://github.com/lance6x5/diy-calc-suite/issues) on this repo.
- **Redistribution:** anyone redistributing the code must keep [LICENSE.md](LICENSE.md), including its `Required Notice` line.

Third-party dependencies keep their own licenses.

## Trademarks

Measure Twice and its logo are trademarks of Silverlight DevTech. The license covers the code only, not the names or logos, so forks must use a different name and logo.
