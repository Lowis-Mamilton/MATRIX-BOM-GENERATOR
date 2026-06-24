# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static, no-build, no-dependency front-end: **MATRIX Store** — browse a product catalog with pricing/MOQ, view per-product detail pages, set quantities, and export a quotation (PDF) with shipping cost calculated.

Files: `index.html` + `shopscript.js` + `shopstyle.css`. There is no package.json, bundler, or test suite. Everything runs directly in the browser; third-party libraries (html2canvas, jsPDF) are loaded via CDN `<script>` tags in `index.html`, not npm.

## Running locally

Open `index.html` directly, or serve the folder with any static server (the repo includes a Live Server VSCode config on port 5501). There is no build step — edits to `shopscript.js`/`shopstyle.css`/`index.html` are reflected on reload.

## Architecture

All logic lives in `shopscript.js`, wrapped in a single `DOMContentLoaded` listener with no modules/classes:

1. **`categoryConfig`** — ordered list of sidebar categories, some with a `sub` array of subcategories (e.g. `SENSOR` → `ANALOG/DIGITAL/IIC/UART`, `MOTOR` → `SERVO/TT/DC`).
2. **`productData`** — flat array of product objects: `code`, `name`, `category`, optional `subCategory`, `price`, `weight`, optional `eol` flag, optional `specs` (object of label→value pairs, rendered on the detail page — left empty until filled in per-product). `qty` (current cart quantity) and `moq` (from `MOQ_MAP`, default 1) are initialized at load.
3. **Sidebar generation** — built from `categoryConfig` into `<ul id="sidebar-menu">`; clicking a category/subcategory calls `showSection(key, mobileAll)`, which filters `productData` and renders product cards into `#content-area`.
4. **Routing** — hash-based: `#item/<code>` opens that product's detail page via `showProductDetail(code)`; any other hash (or none) shows the last-viewed category (tracked in `lastCategory`/`lastMobileAll`) via `showSection`. Wired through a single `hashchange` listener (`handleHashRoute`) called once on init. Clicking a product card (outside its qty controls) navigates by setting `location.hash`; sidebar clicks clear the hash quietly (`history.replaceState`, no re-render loop) before calling `showSection` directly.
5. **Quantity controls** — both the grid card and the detail page wire their +/-/input elements through the shared `attachQtyControl(p, { minus, input, plus })` (handles MOQ snapping and triggers `updateCart()`); quantity state lives directly on each product object (`p.qty`), not a separate cart structure.
6. **Cart drawer** (`#selected-panel` / `#cart-fab` / `#cart-overlay`) shows currently selected (qty > 0) items with subtotal/weight totals (`getSubtotal`, `getTotalWeight`); shipping is calculated only at export time (`calcShipping`).
7. **Export modal** (`showExportModal`) collects a name and invokes `exportStorePDF`, which builds an off-DOM HTML container and rasterizes it with `html2canvas` into a `jsPDF` document — all client-side, no server involved.

Product images are expected at `img/<code>.png`, matched by product `code`. Missing images degrade gracefully (hidden `<img>` via `onerror`). The detail page shows a second image, `img/PartPhoto.png`, as a shared placeholder slot alongside the per-product image (`attachStepDownload`'s sibling in `showProductDetail`).

## Shipping logic

`calcShipping(method, weight, zone)` supports `pickup` (free), `taiwan` (flat NT$150), and `international` (DHL zone-based tiers via `calcDHLShipping`, using the `DHL_RATES` table keyed by `zone1`–`zone6` and weight in grams).

## Editing product data

Category names in `categoryConfig` must match the `category`/`subCategory` strings used in `productData` exactly, since filtering is a straight string comparison. To add specs to a product's detail page, add a `specs: { "Label": "Value", ... }` object to its entry in `productData` — the detail page renders a "Specs coming soon" placeholder for any product without one.

## CAD assets

The `cad/` directory contains STEP files named after product codes, but casing/naming is inconsistent (`.step` vs `.STEP`, and some files have suffixes like ` L`/`-R`, `_New`, `(screw)` that don't match any `productData.code`). The detail page's "Download STEP File" button (`attachStepDownload` in `shopscript.js`) fetches `cad/<code>.step`, falling back to `cad/<code>.STEP`; it shows "CAD file not available for this part" if neither exists. This `fetch` requires the page to be served over http(s) (Live Server / GitHub Pages) — it won't work when `index.html` is opened directly via `file://`.
