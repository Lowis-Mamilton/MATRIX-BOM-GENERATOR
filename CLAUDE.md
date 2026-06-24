# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static, no-build, no-dependency front-end suite with two standalone pages sharing the same patterns:

- **`index.html` + `script.js` + `style.css`** — MATRIX BOM Generator: browse a product catalog, set quantities, export a Bill of Materials (PDF / Word / Excel).
- **`shopping.html` + `shopscript.js` + `shopstyle.css`** — MATRIX Store: a storefront with pricing, MOQ, and shipping-cost calculation, exporting a quotation (PDF only).

There is no package.json, bundler, or test suite. Everything runs directly in the browser; third-party libraries (html2canvas, jsPDF, docx, ExcelJS, FileSaver.js) are loaded via CDN `<script>` tags in the HTML, not npm.

## Running locally

Open `index.html` or `shopping.html` directly, or serve the folder with any static server (the repo includes a Live Server VSCode config on port 5501). There is no build step — edits to `.js`/`.css`/`.html` are reflected on reload.

## Architecture (per page)

Each page's script follows the same structure, all wrapped in a single `DOMContentLoaded` listener with no modules/classes:

1. **`categoryConfig`** — ordered list of sidebar categories, some with a `sub` array of subcategories (e.g. `SENSOR` → `ANALOG/DIGITAL/IIC/UART`, `MOTOR` → `SERVO/TT/DC`).
2. **`productData`** — flat array of product objects (`code`, `name`, `category`, optional `subCategory`). In `shopscript.js` each product also carries `price`, `weight`, and an `eol` flag; an `MOQ_MAP` keyed by product `code` sets minimum order quantities (defaults to 1).
3. **Sidebar generation** — built from `categoryConfig` into `<ul id="sidebar-menu">`; clicking a category/subcategory calls `showSection(key)`, which filters `productData` and renders product cards into `#content-area`.
4. **Quantity state** lives directly on each product object (`p.qty`), mutated by the `+`/`-`/input controls on each card — there is no separate cart data structure.
5. **Cart drawer** (`#selected-panel` / `#cart-fab` / `#cart-overlay`) shows currently selected (qty > 0) items; `shopscript.js` additionally computes subtotal/weight/shipping totals here (`getSubtotal`, `getTotalWeight`, `calcShipping`).
6. **Export modal** (`showExportModal`) collects a name (+ format for the BOM generator) and invokes one of the export functions.
7. **Export functions** build an off-DOM HTML container, rasterize it with `html2canvas` for PDF, or use `docx`/`ExcelJS` APIs directly for Word/Excel — all client-side, no server involved.

Product images are expected at `img/<code>.png`, matched by product `code`. Missing images degrade gracefully to a "No Img" placeholder in exports.

## Shipping logic (shopscript.js only)

`calcShipping(method, weight, zone)` supports `pickup` (free), `taiwan` (flat NT$150), and `international` (DHL zone-based tiers via `calcDHLShipping`, using the `DHL_RATES` table keyed by `zone1`–`zone6` and weight in grams).

## Editing product data

When adding/changing a product, keep `script.js` and `shopscript.js` in sync where applicable (the BOM generator's `productData` is a subset of the Store's, without pricing/weight/MOQ fields). Category names in `categoryConfig` must match the `category`/`subCategory` strings used in `productData` exactly, since filtering is a straight string comparison.

## CAD assets

The `cad/` directory contains STEP files (`.step`/`.STEP`, inconsistent casing) named after product codes — reference CAD models, not used by the running app itself.
