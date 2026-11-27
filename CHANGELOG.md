# Changelog

All notable changes to **Measure Twice** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.0] - 2026-11-27

### Added

- Anonymous visit counter in the footer (for example "12,345 visits"), using the open-source Abacus counter. Only the first page load of a browser session is counted; Do Not Track and Global Privacy Control are respected, nothing is counted on localhost, no cookies are used and no app data is sent. Shows nothing if the counter is unreachable.
- Visits badge and a "Privacy & analytics" section in the README.
- Unit tests for the visit counter.

### Changed

- The service worker never caches counter requests (network-only rule for the counter service).

## [1.1.0] - 2026-11-27

### Added

- In-app feedback: "Report a bug" and "Request a feature" links in the footer open a pre-filled GitHub issue (app version and browser filled in automatically; no personal data is sent).
- GitHub issue forms for bug reports and feature requests, labelled `bug`/`enhancement` plus `triage`.
- CONTRIBUTING.md describing the issue triage flow, and a "Feedback & issues" section in the README.
- Unit tests for the feedback URL builder.

### Fixed

- The logo wordmark is now readable on dark backgrounds (for example the README in GitHub dark mode).

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

[Unreleased]: https://github.com/lance6x5/diy-calc-suite/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/lance6x5/diy-calc-suite/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/lance6x5/diy-calc-suite/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/lance6x5/diy-calc-suite/releases/tag/v1.0.0
