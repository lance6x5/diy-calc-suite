# Changelog

All notable changes to **Measure Twice** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-11-27

### Added

- Six material calculators, one tab each: Paint (multiple walls, doors/windows, coats, editable coverage), Deck boards (boards plus joists at 12/16/24 in on-center), Concrete (slab, cylinder footing, steps; cu yd plus 40/60/80 lb bags), Drywall (sheets, screws, joint compound, tape), Flooring/Tile (boxes with 10%/15% waste), and Mulch/Gravel/Soil (cu yd and bags).
- Global Imperial/Metric toggle that converts all inputs and outputs.
- Optional unit prices on each purchasable item, with a cost estimate.
- Purchase quantities rounded up to whole units, with the exact value shown too.
- "How this is calculated" section on every calculator.
- Named projects stored in IndexedDB that bundle calculator results into a shopping list.
- Printable shopping list view with print-friendly CSS.
- JSON export/import of all data, and "Reset all data" with a confirmation step.
- Installable offline PWA with the Measure Twice logo, favicon and 192/512/maskable icons.
- Brand palette with light and dark mode, and the app version shown in the footer.
- Vitest unit tests for every calculation function.
- GitHub Actions workflow that tests, builds and deploys to GitHub Pages.

### Changed

- Nothing yet. This is the first release.

### Fixed

- Nothing yet. This is the first release.

[Unreleased]: https://github.com/lance6x5/diy-calc-suite/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/lance6x5/diy-calc-suite/releases/tag/v1.0.0
