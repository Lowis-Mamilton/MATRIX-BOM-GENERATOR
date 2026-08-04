# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static, no-build, no-dependency front-end: **MATRIX Store** — browse a product catalog with pricing/MOQ, view per-product detail pages (photo gallery, specs, description, STEP file download), set quantities, and export either a quotation/order form (PDF, shipping calculated) or a BOM (PDF / Excel / Word). A companion **local admin tool** (`admin.html`) lets the site owner add/edit/delete products without touching code.

Files: `index.html` + `shopscript.js` + `shopstyle.css` (storefront), `admin.html` + `adminscript.js` + `adminstyle.css` (admin tool, reuses `shopstyle.css`'s design tokens), `products.json` + `categories.json` (catalog data, fetched by both). There is no package.json, bundler, or test suite. Third-party libraries (html2canvas, jsPDF, docx, ExcelJS, FileSaver) are loaded via CDN `<script>` tags in `index.html`, not npm — every export path depends on the CDN being reachable.

## Running locally

**Must be served over http(s)** — both pages `fetch()` `products.json`/`categories.json` (and the storefront's CAD download) at load, which fails under `file://`. Use the repo's Live Server VSCode config (port 5501) or any static server. Double-clicking `index.html` open will show a blank catalog.

`.vscode/settings.json` deliberately puts `products.json`, `categories.json`, `img/`, and `cad/` in Live Server's `ignoreFiles` — otherwise every admin-tool write would hot-reload the page mid-edit. Consequence: after editing catalog data you must reload the storefront by hand.

There is no build, lint, or test command — no package.json, no bundler, no test suite. "Testing" a change means loading the served page in a browser and exercising it manually.

The storefront is deployed as-is via GitHub Pages (`https://lowis-mamilton.github.io/MATRIX-BOM-GENERATOR/`) — pushing to `main` is the deploy step; there's no CI/build pipeline in between.

## Catalog data (`products.json` / `categories.json`)

- **`categories.json`** — ordered list of sidebar categories: `[{ "name": "SENSOR", "sub": ["ANALOG", "DIGITAL", "IIC", "UART"] }, ...]`; `sub` is omitted for categories with no subcategories.
- **`products.json`** — flat array of product objects: `code`, `name`, `category`, optional `subCategory`, `price` (0 = "Price on request"), `weight` (grams), `moq` (minimum order quantity, default 1), optional `eol` flag, optional `description` (string, shown on the detail page), optional `specs` (object of label→value pairs, rendered as a table — shows "Specs coming soon" if absent), optional `photos` (array of extra image filenames for the detail-page gallery beyond the default two).
- `qty` (cart quantity) is **not** persisted in `products.json` — it's runtime-only state, initialized to `0` in `shopscript.js` after fetch.
- Both `shopscript.js` and `adminscript.js` read these files; `adminscript.js` is the only thing that writes them (directly to disk via the File System Access API — see below).

## Storefront architecture (`shopscript.js`)

All logic lives in `shopscript.js`, wrapped in a single `async` `DOMContentLoaded` listener with no modules/classes:

1. On load, `fetch()`es `categories.json` and `products.json` in parallel, then initializes `qty = 0` on every product.
2. **Sidebar generation** — built from `categoryConfig` into `<ul id="sidebar-menu">`; clicking a category/subcategory calls `showSection(key, mobileAll)`, which filters `productData` and renders product cards into `#content-area`.
3. **Routing** — hash-based: `#item/<code>` opens that product's detail page via `showProductDetail(code)`; any other hash (or none) shows the last-viewed category (tracked in `lastCategory`/`lastMobileAll`) via `showSection`. Wired through a single `hashchange` listener (`handleHashRoute`) called once on init. Clicking a product card (outside its qty controls) navigates by setting `location.hash`; sidebar clicks clear the hash quietly (`history.replaceState`, no re-render loop) before calling `showSection` directly.
4. **Quantity controls** — both the grid card and the detail page wire their +/-/input elements through the shared `attachQtyControl(p, { minus, input, plus })` (handles MOQ snapping and triggers `updateCart()`); quantity state lives directly on each product object (`p.qty`), not a separate cart structure.
5. **Detail page** (`showProductDetail`) — a photo gallery (large main image + thumbnail strip built from the product's own `img/<code>.png`, the shared placeholder `img/PartPhoto.png`, and any `p.photos`; clicking a thumbnail swaps the main image), code/name/description/price/MOQ, a specs table, a qty control, and a "Download STEP File" button (`attachStepDownload`, fetches `cad/<code>.step` then falls back to `cad/<code>.STEP`; shows an inline message if neither exists — the `cad/` folder's naming is inconsistent and doesn't match every product code).
6. **Cart drawer** (`#selected-panel` / `#cart-fab` / `#cart-overlay`) shows currently selected (qty > 0) items with subtotal/weight totals; shipping is calculated only at export time (`calcShipping`, supports `pickup`/`taiwan`/`international` with DHL zone-based tiers via `DHL_RATES`).
7. **Export** (`showExportModal` → callback) — the modal is built inline as an HTML string with inline styles (it is *not* in `index.html` and not styled by `shopstyle.css`). It collects a name, an export format, and — only when the "Order Form" format is picked (`refreshOrderFieldsVisibility`) — shipping address, package weight (pre-filled from `getTotalWeight()`, editable), shipping method, and DHL zone, with a live fee preview. It hands the callback `(order, formats)`; the callback dispatches to one of four exporters:
   - `exportStorePDF(order, selected)` — the customer-facing quotation/order form: line items, subtotal, shipping line, total.
   - `exportBomPDF(name, selected)` — image/SKU/name/qty table, 18 rows per page.
   - `exportBomXlsx(name, selected)` / `exportBomDocx(name, selected)` — same table via ExcelJS / docx, saved with `FileSaver`'s `saveAs`.

   Both PDF paths work the same way: build an off-DOM `210mm`-wide HTML container, rasterize with `html2canvas`, `addImage` into `jsPDF` — so PDF layout is authored as inline-styled HTML inside `shopscript.js`, not as jsPDF drawing calls. Format selection uses `<input type="radio">` (one format per export) even though the plumbing (`formats` array, `formats.includes(...)`) is written for multi-select — switching to checkboxes is a one-line change.

Product images are expected at `img/<code>.png`, matched by product `code`. Missing images degrade gracefully in the storefront (hidden `<img>` via `onerror`), in `exportBomPDF` ("No Img" cell) and in `exportBomDocx` (`fetchImageBuffer` returns `null` → "No Img" text) — but **not** in `exportBomXlsx`, whose `fetchImageBufferWithSize` has no such guard and will throw on a product with no image file.

## Admin tool (`admin.html` / `adminscript.js`)

A **local-only** tool for the site owner — not linked from the storefront, Chrome/Edge only (requires the File System Access API), and must be run via a local server (same Live Server requirement as the storefront).

- "Connect Project Folder" calls `window.showDirectoryPicker({mode:"readwrite"})` once per browser session (no persisted permission across reloads — reconnect each time you open the page) to get write access to the repo root, then grabs file handles for `products.json`/`categories.json` and a directory handle for `img/`.
- Lists/searches/sorts all products in a table; Add/Edit open a form (category/subCategory dropdowns driven by `categories.json`, a repeatable specs label/value row editor, and a photo manager).
- **Photo manager** — the main image picker writes straight to `img/<code>.png`; extra photos are written as `img/<code>-2.png`, `-3.png`, … (`nextPhotoFilename`) and the filenames accumulate in the product's `photos` array (the same array the storefront gallery reads). "Set as Main" *swaps the two files on disk* (photo ↔ `<code>.png`) rather than reordering the array. Image writes happen immediately on file pick — before you press Save — so a cancelled edit can still leave new files in `img/`.
- Every save/delete does a **full-file overwrite** of `products.json` (`persistProducts()`) — fine at ~220 entries, no batching needed.
- A product's `code` is immutable once created (rename = delete + re-add); the code must be filled in before any image can be picked (filenames derive from it). Deleting a product, or removing a photo from the list, does **not** delete the file from `img/`. Uploaded images must be `.png` (rejected otherwise).
- **This tool only edits your local clone.** Changes don't appear on the live GitHub Pages site until you `git commit` + `git push` the updated `products.json`/`img/` files.

## CAD assets

The `cad/` directory contains STEP files named after product codes, but casing/naming is inconsistent (`.step` vs `.STEP`, and some files have suffixes like ` L`/`-R`, `_New`, `(screw)` that don't match any product's `code`) — not all products have a matching file.
