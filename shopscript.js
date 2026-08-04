document.addEventListener("DOMContentLoaded", async () => {
  const [categoryConfig, productData] = await Promise.all([
    fetch("categories.json").then(r => r.json()),
    fetch("products.json").then(r => r.json()),
  ]);

  productData.forEach(p => { p.qty = 0; });

  // ─── DOM refs ────────────────────────────────────────────────
  const sidebar       = document.getElementById("sidebar-menu");
  const content       = document.getElementById("content-area");
  const cartFab       = document.getElementById("cart-fab");
  const cartCount     = document.getElementById("cart-count");
  const selectedPanel = document.getElementById("selected-panel");
  const selectedList  = document.getElementById("selected-list");
  const cartOverlay   = document.getElementById("cart-overlay");
  const panelClose    = document.getElementById("panel-close");
  const cartSubtotal  = document.getElementById("cart-subtotal");
  const cartShipping  = document.getElementById("cart-shipping");
  const cartTotal     = document.getElementById("cart-total");

  // ─── Routing state ──────────────────────────────────────────
  // Remembers the last category/subcategory shown so we can return to it
  // from a product detail page or after a hash route falls back to default.
  let lastCategory  = "BUNDLE";
  let lastMobileAll = false;

  // ─── Helpers ─────────────────────────────────────────────────
  const formatMoney = n => Number(n || 0).toLocaleString("en-US");

  function getSelected()    { return productData.filter(p => p.qty > 0); }
  function getSubtotal()    { return getSelected().reduce((s, p) => s + p.price * p.qty, 0); }
  function getTotalWeight() { return getSelected().reduce((s, p) => s + p.weight * p.qty, 0); }

  // ─── DHL Express Easy 2026 rate table (incl. fuel surcharge + 5% tax, NT$) ───
  const DHL_RATES = {
    zone1: [
      { maxWeight:  500, price:  599 },
      { maxWeight: 1500, price: 1649 },
      { maxWeight: 2500, price: 2449 },
      { maxWeight: 5000, price: 3499 },
      { maxWeight:10000, price: 3999 },
      { maxWeight:15000, price: 5249 },
      { maxWeight:20000, price: 5499 },
      { maxWeight:25000, price: 6499 },
    ],
    zone2: [
      { maxWeight:  500, price:  649 },
      { maxWeight: 1500, price: 1749 },
      { maxWeight: 2500, price: 2549 },
      { maxWeight: 5000, price: 3649 },
      { maxWeight:10000, price: 4399 },
      { maxWeight:15000, price: 5399 },
      { maxWeight:20000, price: 5999 },
      { maxWeight:25000, price: 6799 },
    ],
    zone3: [
      { maxWeight:  500, price:  699 },
      { maxWeight: 1500, price: 1849 },
      { maxWeight: 2500, price: 2649 },
      { maxWeight: 5000, price: 3799 },
      { maxWeight:10000, price: 4799 },
      { maxWeight:15000, price: 5449 },
      { maxWeight:20000, price: 6299 },
      { maxWeight:25000, price: 7199 },
    ],
    zone4: [
      { maxWeight:  500, price:  749 },
      { maxWeight: 1500, price: 1949 },
      { maxWeight: 2500, price: 2749 },
      { maxWeight: 5000, price: 3999 },
      { maxWeight:10000, price: 5249 },
      { maxWeight:15000, price: 5799 },
      { maxWeight:20000, price: 6959 },
      { maxWeight:25000, price: 8199 },
    ],
    zone5: [
      { maxWeight:  500, price:  999 },
      { maxWeight: 1500, price: 2499 },
      { maxWeight: 2500, price: 3399 },
      { maxWeight: 5000, price: 4999 },
      { maxWeight:10000, price: 6649 },
      { maxWeight:15000, price: 8649 },
      { maxWeight:20000, price:10399 },
      { maxWeight:25000, price:12499 },
    ],
    zone6: [
      { maxWeight:  500, price: 1449 },
      { maxWeight: 1500, price: 3399 },
      { maxWeight: 2500, price: 4199 },
      { maxWeight: 5000, price: 7899 },
      { maxWeight:10000, price:12899 },
      { maxWeight:15000, price:13999 },
      { maxWeight:20000, price:15299 },
      { maxWeight:25000, price:18999 },
    ],
  };

  function calcDHLShipping(zone, weightGram) {
    const table = DHL_RATES[zone];
    if (!table) return 0;
    const tier = table.find(t => weightGram <= t.maxWeight);
    return tier ? tier.price : table[table.length - 1].price;
  }

  function calcShipping(method, weight, zone) {
    if (method === "pickup") return 0;
    if (method === "taiwan") return 150;
    if (method === "international") return calcDHLShipping(zone || "zone5", weight);
    return 0;
  }

  // ─── Sidebar ─────────────────────────────────────────────────
  categoryConfig.forEach(cat => {
    const li = document.createElement("li");
    const a  = document.createElement("a");
    a.textContent = cat.name;
    a.dataset.cat = cat.name;
    li.appendChild(a);

    if (cat.sub) {
      const ul = document.createElement("ul");
      cat.sub.forEach(sub => {
        const subLi = document.createElement("li");
        const subA  = document.createElement("a");
        subA.textContent = sub;
        subA.dataset.cat = cat.name;
        subA.dataset.sub = sub;
        subLi.appendChild(subA);
        ul.appendChild(subLi);
      });
      li.appendChild(ul);
    }

    sidebar.appendChild(li);
  });

  // Highlights the sidebar entry matching a category/subcategory key
  // (used when returning from a product detail page or on initial load).
  function highlightSidebarFor(key) {
    sidebar.querySelectorAll("li").forEach(li => li.classList.remove("active"));
    const link = sidebar.querySelector(`a[data-sub="${key}"]`) || sidebar.querySelector(`a[data-cat="${key}"]`);
    if (!link) return;
    link.parentNode.classList.add("active");
    if (link.dataset.sub) {
      const parentLi = link.parentNode.parentNode.parentNode;
      if (parentLi && parentLi.tagName === "LI") parentLi.classList.add("active");
    }
  }

  sidebar.addEventListener("click", e => {
    if (e.target.tagName !== "A") return;

    // Clear any product-detail hash quietly (no hashchange re-render) so
    // the back button doesn't loop back into the detail page we're leaving.
    if (location.hash) history.replaceState(null, "", location.pathname + location.search);

    const clickedLi  = e.target.parentNode;
    const isMobile   = window.innerWidth <= 768;
    const isTopLevel = clickedLi.parentNode === sidebar;
    const hasSub     = clickedLi.querySelector("ul") !== null;
    const sub        = e.target.dataset.sub;
    const cat        = e.target.dataset.cat;

    sidebar.querySelectorAll("li").forEach(li => li.classList.remove("active"));
    clickedLi.classList.add("active");

    // Mobile: tapping a parent category with subcategories shows all of
    // its products directly instead of expanding the dropdown.
    if (isMobile && isTopLevel && hasSub && !sub) {
      showSection(cat, true);
      return;
    }

    // Desktop subcategory: also mark the parent li active (keeps dropdown expanded)
    if (sub) {
      const parentLi = clickedLi.parentNode.parentNode;
      if (parentLi && parentLi.tagName === "LI") parentLi.classList.add("active");
    }

    showSection(sub || cat, false);
  });

  // ─── Shared quantity control wiring ───────────────────────────
  // Wires up +/-/input behavior for a product against any set of DOM
  // elements — used by both the grid card and the detail page so MOQ
  // snapping and cart updates stay in one place.
  function attachQtyControl(p, { minus, input, plus }) {
    function applyMOQ(val) {
      let v = Math.floor(Number(val));
      if (isNaN(v) || v < 0) v = 0;
      if (v > 0 && v < p.moq) v = p.moq; // snap up to MOQ
      return v;
    }

    function setQty(v) {
      p.qty = v;
      input.value = v;
      updateCart();
    }

    plus.addEventListener("click", () => {
      const current = p.qty;
      setQty(current === 0 ? p.moq : current + 1); // first click → jump to MOQ
    });

    minus.addEventListener("click", () => {
      const current = p.qty;
      setQty(current <= p.moq ? 0 : current - 1); // drop to 0 (remove from cart)
    });

    input.addEventListener("change", () => {
      setQty(applyMOQ(input.value));
    });
  }

  // ─── CAD (STEP file) download ─────────────────────────────────
  // Each part's CAD file is expected at cad/<code>.step. Some existing
  // files in cad/ use a .STEP extension instead, so we try that as a
  // same-origin fallback before giving up. Requires the page to be
  // served over http(s) (e.g. Live Server / GitHub Pages) — fetch
  // cannot read local files when opened directly via file://.
  function attachStepDownload(p, { button, status }) {
    if (!button) return;

    async function tryFetch(path) {
      try {
        const res = await fetch(path);
        if (res.ok) return res.blob();
      } catch {
        // ignore — likely opened via file:// or genuinely missing
      }
      return null;
    }

    button.addEventListener("click", async () => {
      button.disabled = true;
      status.textContent = "";
      status.className = "step-status";

      const blob =
        (await tryFetch(`cad/${encodeURIComponent(p.code)}.step`)) ||
        (await tryFetch(`cad/${encodeURIComponent(p.code)}.STEP`));

      button.disabled = false;

      if (!blob) {
        status.textContent = "CAD file not available for this part.";
        status.className = "step-status error";
        return;
      }

      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${p.code}.step`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
    });
  }

  // ─── Product section ─────────────────────────────────────────
  function showSection(key, mobileAll = false) {
    content.innerHTML = "";
    lastCategory  = key;
    lastMobileAll = mobileAll;

    const catConfig  = categoryConfig.find(c => c.name === key);
    const hasSub     = catConfig && catConfig.sub && catConfig.sub.length > 0;
    const isSub      = categoryConfig.some(c => c.sub && c.sub.includes(key));

    let items;
    if (mobileAll && hasSub) {
      // Mobile mode: list all subcategory products together, ungrouped
      items = productData.filter(p => p.category === key);
    } else if (isSub) {
      items = productData.filter(p => p.subCategory === key);
    } else {
      items = productData.filter(p => p.category === key);
    }

    const section = document.createElement("div");
    section.className = "product-section";

    const header = document.createElement("div");
    header.className = "section-header";
    header.innerHTML = `
      <h2>${key}</h2>
      <span class="section-count">${items.length} items</span>
    `;
    section.appendChild(header);

    const grid = document.createElement("div");
    grid.className = "product-grid";
    section.appendChild(grid);

    items.forEach(p => {
      const card = document.createElement("div");
      card.className = "product-card" + (p.eol ? " eol" : "");

      // Image area
      const imgWrap = document.createElement("div");
      imgWrap.className = "card-img-wrap";
      if (p.eol) {
        const eolBadge = document.createElement("span");
        eolBadge.className = "badge-eol";
        eolBadge.textContent = "EOL";
        imgWrap.appendChild(eolBadge);
      }
      if (p.price === 0 && !p.eol) {
        const naBadge = document.createElement("span");
        naBadge.className = "badge-na";
        naBadge.textContent = "INQUIRE";
        imgWrap.appendChild(naBadge);
      }
      const img = document.createElement("img");
      img.src = `img/${p.code}.png`;
      img.alt = p.code;
      img.onerror = function() { this.style.visibility = "hidden"; };
      imgWrap.appendChild(img);
      card.appendChild(imgWrap);

      // Card body
      const body = document.createElement("div");
      body.className = "card-body";

      const codeEl = document.createElement("div");
      codeEl.className = "product-code";
      codeEl.textContent = p.code;

      const nameEl = document.createElement("div");
      nameEl.className = "product-name";
      nameEl.textContent = p.name;

      const priceEl = document.createElement("div");
      priceEl.className = "product-price" + (p.price === 0 ? " na" : "");
      priceEl.textContent = p.price === 0 ? "Price on request" : `NT$${formatMoney(p.price)}`;

      const moqEl = document.createElement("div");
      moqEl.className = "moq-badge";
      moqEl.innerHTML = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg> MOQ: ${p.moq}`;

      // Quantity control — built as real DOM elements so events work
      const qtyRow = document.createElement("div");
      qtyRow.className = "qty-row";

      const qtyCtrl = document.createElement("div");
      qtyCtrl.className = "quantity-control";

      const minusBtn = document.createElement("button");
      minusBtn.className = "minus";
      minusBtn.textContent = "−";
      minusBtn.type = "button";

      const qtyInput = document.createElement("input");
      qtyInput.type = "number";
      qtyInput.min = "0";
      qtyInput.value = p.qty;

      const plusBtn = document.createElement("button");
      plusBtn.className = "plus";
      plusBtn.textContent = "+";
      plusBtn.type = "button";

      qtyCtrl.appendChild(minusBtn);
      qtyCtrl.appendChild(qtyInput);
      qtyCtrl.appendChild(plusBtn);
      qtyRow.appendChild(qtyCtrl);

      body.appendChild(codeEl);
      body.appendChild(nameEl);
      body.appendChild(priceEl);
      body.appendChild(moqEl);
      body.appendChild(qtyRow);
      card.appendChild(body);
      grid.appendChild(card);

      attachQtyControl(p, { minus: minusBtn, input: qtyInput, plus: plusBtn });

      // Clicking the card (outside the qty controls) opens the detail page.
      card.addEventListener("click", e => {
        if (qtyRow.contains(e.target)) return;
        location.hash = `item/${encodeURIComponent(p.code)}`;
      });
    });

    content.appendChild(section);
  }

  // ─── Product detail page ──────────────────────────────────────
  // Renders a single product's detail view (image, price, MOQ, specs
  // table, qty control) into #content-area, addressed via #item/<code>.
  function showProductDetail(code) {
    const p = productData.find(prod => prod.code === code);
    if (!p) {
      showSection(lastCategory, lastMobileAll);
      highlightSidebarFor(lastCategory);
      return;
    }

    content.innerHTML = "";

    const specsEntries = p.specs ? Object.entries(p.specs) : [];
    const specsRows = specsEntries.length
      ? specsEntries.map(([label, value]) => `<tr><th>${label}</th><td>${value}</td></tr>`).join("")
      : `<tr><td colspan="2" class="specs-empty">Specs coming soon.</td></tr>`;

    // Gallery images: the product's main photo, plus any extra photos listed
    // in p.photos. Falls back to the shared placeholder photo only when no
    // real extra photos have been uploaded yet.
    const galleryImages = [
      { src: `img/${p.code}.png`, alt: p.code },
      ...(p.photos && p.photos.length
        ? p.photos.map(file => ({ src: `img/${file}`, alt: p.code }))
        : [{ src: "img/PartPhoto.png", alt: `${p.code} photo` }]),
    ];
    const thumbs = galleryImages
      .map((img, i) => `
        <button type="button" class="detail-thumb${i === 0 ? " active" : ""}" data-src="${img.src}" data-alt="${img.alt}">
          <img src="${img.src}" alt="${img.alt}" onerror="this.closest('.detail-thumb').style.display='none'">
        </button>`)
      .join("");

    const detail = document.createElement("div");
    detail.className = "product-detail";
    detail.innerHTML = `
      <a href="#" class="detail-back-link">&larr; Back to ${lastCategory}</a>
      <div class="detail-main">
        <div class="detail-gallery">
          <div class="detail-img-main">
            <img src="${galleryImages[0].src}" alt="${galleryImages[0].alt}" onerror="this.style.visibility='hidden'">
            <span class="detail-zoom-hint">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
              Click to enlarge
            </span>
          </div>
          <div class="detail-thumbs">${thumbs}</div>
        </div>
        <div class="detail-info">
          <div class="product-code">${p.code}</div>
          <h1 class="detail-name">${p.name}</h1>
          ${p.description ? `<p class="detail-description">${p.description}</p>` : ""}
          <div class="product-price${p.price === 0 ? " na" : ""}">${p.price === 0 ? "Price on request" : `NT$${formatMoney(p.price)}`}</div>
          <div class="moq-badge"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg> MOQ: ${p.moq}</div>
          <div class="quantity-control detail-qty">
            <button type="button" class="minus">−</button>
            <input type="number" min="0" value="${p.qty}">
            <button type="button" class="plus">+</button>
          </div>
          <button type="button" class="step-download-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download STEP File
          </button>
          <div class="step-status"></div>
        </div>
      </div>
      <table class="specs-table">
        <tbody>${specsRows}</tbody>
      </table>
    `;
    content.appendChild(detail);

    const mainImg = detail.querySelector(".detail-img-main img");
    detail.querySelectorAll(".detail-thumb").forEach(thumb => {
      thumb.addEventListener("click", () => {
        mainImg.src = thumb.dataset.src;
        mainImg.alt = thumb.dataset.alt;
        mainImg.style.visibility = "visible";
        detail.querySelectorAll(".detail-thumb").forEach(t => t.classList.remove("active"));
        thumb.classList.add("active");
      });
    });

    attachQtyControl(p, {
      minus: detail.querySelector(".detail-qty .minus"),
      input: detail.querySelector(".detail-qty input"),
      plus:  detail.querySelector(".detail-qty .plus"),
    });

    attachStepDownload(p, {
      button: detail.querySelector(".step-download-btn"),
      status: detail.querySelector(".step-status"),
    });

    detail.querySelector(".detail-back-link").addEventListener("click", e => {
      e.preventDefault();
      history.replaceState(null, "", location.pathname + location.search);
      showSection(lastCategory, lastMobileAll);
      highlightSidebarFor(lastCategory);
    });
  }

  // ─── Cart update ─────────────────────────────────────────────
  function updateCart() {
    const selected = getSelected();
    let subtotal = 0;
    let count    = 0;

    selectedList.innerHTML = "";

    if (selected.length === 0) {
      selectedList.innerHTML = `
        <div class="empty-bag">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          <span>Your bag is empty</span>
        </div>`;
    }

    selected.forEach(p => {
      const itemSub = p.price * p.qty;
      subtotal += itemSub;
      count    += p.qty;

      const row = document.createElement("div");
      row.className = "selected-item";
      row.innerHTML = `
        <img class="selected-item-img" src="img/${p.code}.png" alt="${p.code}" onerror="this.style.visibility='hidden'">
        <div>
          <div class="sku">${p.code}</div>
          <div class="name">${p.name}</div>
          <div class="money">
            ${p.price === 0
              ? `${p.qty} × <span style="color:var(--text3)">Price on request</span>`
              : `${p.qty} × NT$${formatMoney(p.price)}&nbsp;=&nbsp;<span class="subtotal">NT$${formatMoney(itemSub)}</span>`
            }
          </div>
        </div>
      `;
      selectedList.appendChild(row);
    });

    cartCount.textContent    = count;
    cartSubtotal.textContent = formatMoney(subtotal);
    cartShipping.textContent = "Calculated at export";
    cartTotal.textContent    = formatMoney(subtotal);
  }

  // ─── Panel open / close ──────────────────────────────────────
  function openPanel() {
    selectedPanel.classList.add("open");
    cartOverlay.classList.add("open");
    updateCart();
  }
  function closePanel() {
    selectedPanel.classList.remove("open");
    cartOverlay.classList.remove("open");
  }

  cartFab.addEventListener("click", () =>
    selectedPanel.classList.contains("open") ? closePanel() : openPanel()
  );
  if (panelClose) panelClose.addEventListener("click", closePanel);
  cartOverlay.addEventListener("click", closePanel);

  // ─── Export modal ────────────────────────────────────────────
  function showExportModal(cb) {
    const autoWeight = getTotalWeight();
    const m = document.createElement("div");
    m.style.cssText = `
      position:fixed;top:0;left:0;width:100%;height:100%;
      background:rgba(0,0,0,0.4);
      display:flex;justify-content:center;align-items:center;
      z-index:1300;
    `;
    m.innerHTML = `
      <div style="
        background:#fff;padding:22px;border-radius:10px;
        width:340px;text-align:center;font-family:Microsoft JhengHei;
        max-height:90vh;overflow-y:auto;
      ">
        <h3 style="margin-bottom:16px;">Export</h3>

        <div style="width:90%;margin:0 auto 14px;text-align:left;">
          <label style="font-size:13px;color:#555;display:block;margin-bottom:6px;font-weight:bold;">Export Formats</label>
          <label style="display:block;font-size:13px;margin-bottom:4px;"><input type="radio" name="export-format" class="export-format" value="order" checked> Order Form (PDF)</label>
          <label style="display:block;font-size:13px;margin-bottom:4px;"><input type="radio" name="export-format" class="export-format" value="bomPdf"> BOM (PDF)</label>
          <label style="display:block;font-size:13px;margin-bottom:4px;"><input type="radio" name="export-format" class="export-format" value="bomXlsx"> BOM (Excel)</label>
          <label style="display:block;font-size:13px;"><input type="radio" name="export-format" class="export-format" value="bomDocx"> BOM (Word)</label>
        </div>

        <input id="order-name" placeholder="Name"
          style="width:90%;padding:8px;margin-bottom:10px;display:block;margin-inline:auto;">

        <div id="order-fields">
          <textarea id="order-address" placeholder="Shipping Address"
            style="width:90%;height:70px;padding:8px;margin-bottom:10px;display:block;margin-inline:auto;"></textarea>

          <div style="width:90%;margin:0 auto 10px;text-align:left;">
            <label style="font-size:13px;color:#555;display:block;margin-bottom:4px;">Package Weight (g)</label>
            <input id="order-weight" type="number" min="1" max="25000" value="${autoWeight}"
              style="width:100%;padding:8px;box-sizing:border-box;">
            <div style="font-size:11px;color:#888;margin-top:3px;">
              Auto-calculated: ${autoWeight}g. You may adjust if needed.
            </div>
          </div>

          <select id="shipping-method" style="width:90%;padding:8px;margin-bottom:10px;display:block;margin-inline:auto;">
            <option value="pickup">Self Pickup - NT$0</option>
            <option value="taiwan">Taiwan Delivery - NT$150</option>
            <option value="international">International Delivery (DHL)</option>
          </select>

          <div id="zone-row" style="display:none;width:90%;margin:0 auto 10px;">
            <label style="font-size:13px;color:#555;display:block;margin-bottom:4px;text-align:left;">Destination Region</label>
            <select id="shipping-zone" style="width:100%;padding:8px;">
              <option value="zone1">Zone 1 — China / Hong Kong / Macau</option>
              <option value="zone2">Zone 2 — Japan / South Korea</option>
              <option value="zone3">Zone 3 — Singapore / Malaysia / Philippines / Thailand / Vietnam / Indonesia</option>
              <option value="zone4">Zone 4 — Other Asia / Australia / New Zealand</option>
              <option value="zone5" selected>Zone 5 — Europe / North America</option>
              <option value="zone6">Zone 6 — Latin America / Africa / Others</option>
            </select>
            <div style="font-size:11px;color:#888;margin-top:4px;text-align:left;">
              ※ DHL Express Easy 2026 rate (incl. fuel surcharge &amp; 5% tax). Max 25kg.
            </div>
          </div>

          <div id="shipping-preview" style="margin-bottom:14px;font-size:14px;color:#1e4f8a;font-weight:bold;">
            Shipping: NT$0
          </div>
        </div>

        <button id="export-cancel" style="background:#e74c3c;color:#fff;border:none;padding:8px 16px;border-radius:4px;margin-right:10px;cursor:pointer;">CANCEL</button>
        <button id="export-ok"     style="background:#27ae60;color:#fff;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;">EXPORT</button>
      </div>
    `;
    document.body.appendChild(m);

    const orderCheckbox = m.querySelector('.export-format[value="order"]');
    const formatRadios  = m.querySelectorAll(".export-format");
    const orderFields   = m.querySelector("#order-fields");
    const methodSelect  = m.querySelector("#shipping-method");
    const zoneSelect    = m.querySelector("#shipping-zone");
    const zoneRow       = m.querySelector("#zone-row");
    const weightInput   = m.querySelector("#order-weight");
    const preview       = m.querySelector("#shipping-preview");

    function refreshOrderFieldsVisibility() {
      orderFields.style.display = orderCheckbox.checked ? "block" : "none";
    }
    formatRadios.forEach(r => r.addEventListener("change", refreshOrderFieldsVisibility));
    refreshOrderFieldsVisibility();

    function getCustomWeight() {
      const v = parseInt(weightInput.value, 10);
      return (isNaN(v) || v < 1) ? autoWeight : v;
    }

    function refreshPreview() {
      const method = methodSelect.value;
      const weight = getCustomWeight();
      const zone   = zoneSelect.value;

      zoneRow.style.display = (method === "international") ? "block" : "none";

      const fee = calcShipping(method, weight, zone);

      if (method === "pickup") {
        preview.textContent = `Shipping: NT$0  (Self Pickup)`;
      } else if (method === "taiwan") {
        preview.textContent = `Shipping: NT$150  /  Weight: ${weight}g`;
      } else {
        const zoneName = zoneSelect.options[zoneSelect.selectedIndex].text.split("—")[0].trim();
        preview.textContent = `Shipping: NT$${formatMoney(fee)}  /  ${zoneName}  /  Weight: ${weight}g`;
      }
    }

    methodSelect.addEventListener("change", refreshPreview);
    zoneSelect.addEventListener("change", refreshPreview);
    weightInput.addEventListener("input", refreshPreview);
    refreshPreview();

    m.querySelector("#export-cancel").onclick = () => m.remove();
    m.querySelector("#export-ok").onclick = () => {
      const formats = Array.from(m.querySelectorAll(".export-format:checked")).map(cb => cb.value);
      if (formats.length === 0) {
        alert("Please select at least one export format.");
        return;
      }
      const name = m.querySelector("#order-name").value.trim();
      if (!name) {
        alert("Please enter a name.");
        return;
      }
      const order = { name };
      if (formats.includes("order")) {
        const method  = methodSelect.value;
        const zone    = zoneSelect.value;
        const weight  = getCustomWeight();
        order.address        = m.querySelector("#order-address").value.trim();
        order.weight          = weight;
        order.shippingMethod  = method;
        order.shippingZone    = method === "international" ? zoneSelect.options[zoneSelect.selectedIndex].text : "";
        order.shippingFee     = calcShipping(method, weight, zone);
        if (!order.address) {
          alert("Please fill in the shipping address for the Order Form.");
          return;
        }
      }
      m.remove();
      cb(order, formats);
    };
  }

  document.querySelector(".export-btn").addEventListener("click", () => {
    if (getSelected().length === 0) {
      alert("Didn't select any item yet.");
      return;
    }
    showExportModal((order, formats) => {
      const selected = getSelected();
      if (formats.includes("order"))   exportStorePDF(order, selected);
      if (formats.includes("bomPdf"))  exportBomPDF(order.name, selected);
      if (formats.includes("bomXlsx")) exportBomXlsx(order.name, selected);
      if (formats.includes("bomDocx")) exportBomDocx(order.name, selected);
    });
  });

  // ─── PDF Export ──────────────────────────────────────────────
  async function exportStorePDF(order, selected) {
    const { jsPDF }    = window.jspdf;
    const pdf          = new jsPDF("p", "mm", "a4");
    const pageWidth    = pdf.internal.pageSize.getWidth();
    const itemsPerPage = 18;
    const totalPages   = Math.ceil(selected.length / itemsPerPage);
    const subtotal     = selected.reduce((s, p) => s + p.price * p.qty, 0);
    const shipping     = order.shippingFee;
    const total        = subtotal + shipping;

    const methodName = m => {
      if (m === "pickup") return "Self Pickup";
      if (m === "taiwan") return "Taiwan Delivery";
      if (m === "international") return `International Delivery (DHL) — ${order.shippingZone || ""}`;
      return m;
    };

    // Load image as a DataURL to avoid a tainted canvas
    function loadImg(src) {
      return new Promise(resolve => {
        const img = new Image();
        img.onload = () => {
          try {
            const c = document.createElement("canvas");
            c.width = img.width; c.height = img.height;
            c.getContext("2d").drawImage(img, 0, 0);
            resolve(c.toDataURL("image/png"));
          } catch { resolve(""); }
        };
        img.onerror = () => resolve("");
        img.src = src;
      });
    }

    for (let page = 0; page < totalPages; page++) {
      const chunk    = selected.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
      const dataUrls = await Promise.all(chunk.map(p => loadImg(`img/${p.code}.png`)));

      const container = document.createElement("div");
      container.style = `
        position:relative;
        width:210mm; min-height:297mm;
        padding:0; margin:0; background:#fff;
        font-family:"Microsoft JhengHei",sans-serif;
      `;

      container.innerHTML = `
        <div style="
          width:100%;background:#1e4f8a;color:#fff;
          text-align:center;padding:12px 0;
          font-size:18px;font-weight:bold;
        ">MATRIX Store Order Sheet (Page ${page + 1}/${totalPages})</div>

        <div style="padding:10px 18px 6px;font-size:12px;line-height:1.7;">
          <b>Customer Info</b><br>
          Name: ${order.name}<br>
          Address: ${order.address}<br>
          Package Weight: ${order.weight}g<br>
          Shipping: ${methodName(order.shippingMethod)}
        </div>

        <table style="
          width:100%;border:1px solid #000;
          border-collapse:collapse;font-size:11px;
          margin-top:4px;table-layout:fixed;
        ">
          <thead><tr>
            <th style="border:1px solid #000;padding:5px;width:12%;">IMAGE</th>
            <th style="border:1px solid #000;padding:5px;width:18%;">SKU</th>
            <th style="border:1px solid #000;padding:5px;width:36%;">NAME</th>
            <th style="border:1px solid #000;padding:5px;width:10%;">QTY</th>
            <th style="border:1px solid #000;padding:5px;width:12%;">PRICE</th>
            <th style="border:1px solid #000;padding:5px;width:12%;">SUBTOTAL</th>
          </tr></thead>
          <tbody>
            ${chunk.map((p, i) => `
              <tr>
                <td style="border:1px solid #000;padding:5px;text-align:center;">
                  ${dataUrls[i]
                    ? `<img src="${dataUrls[i]}" style="max-width:36px;max-height:36px;">`
                    : `<div style="width:36px;height:36px;display:inline-block;border:1px solid #ccc;font-size:9px;line-height:36px;color:#999;">No Img</div>`}
                </td>
                <td style="border:1px solid #000;padding:5px;text-align:center;">${p.code}</td>
                <td style="border:1px solid #000;padding:5px;">${p.name}</td>
                <td style="border:1px solid #000;padding:5px;text-align:center;">${p.qty}</td>
                <td style="border:1px solid #000;padding:5px;text-align:right;">NT$${formatMoney(p.price)}</td>
                <td style="border:1px solid #000;padding:5px;text-align:right;">NT$${formatMoney(p.price * p.qty)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        ${page === totalPages - 1 ? `
          <div style="position:absolute;right:18px;bottom:70px;width:220px;font-size:13px;line-height:1.8;border-top:2px solid #000;padding-top:8px;">
            <div>Subtotal: NT$${formatMoney(subtotal)}</div>
            <div>Shipping: NT$${formatMoney(shipping)}</div>
            <div style="font-size:18px;font-weight:bold;color:#1e4f8a;">Total: NT$${formatMoney(total)}</div>
          </div>` : ""}

        <div style="position:absolute;bottom:20px;left:20px;font-size:12px;">
          Date: ${new Date().toLocaleDateString()}
        </div>
        <div style="position:absolute;bottom:18px;right:18px;">
          <img src="img/Matrix-icon-2.png" style="max-width:140px;">
        </div>
      `;

      document.body.appendChild(container);
      const canvas   = await html2canvas(container, { scale: 2 });
      const imgData  = canvas.toDataURL("image/png");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfH     = (imgProps.height * pageWidth) / imgProps.width;
      if (page > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pdfH);
      document.body.removeChild(container);
    }

    // ─── Download ───────────────────────────────────────────────
    const fileName = "MATRIX_STORE_Order.pdf";
    const pdfBlob = new Blob([pdf.output("arraybuffer")], { type: "application/pdf" });
    const blobUrl = URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
  }

  // ─── BOM PDF Export ────────────────────────────────────────────
  async function exportBomPDF(userName, selected) {
    const { jsPDF }    = window.jspdf;
    const pdf          = new jsPDF("p", "mm", "a4");
    const pageWidth    = pdf.internal.pageSize.getWidth();
    const itemsPerPage = 18;
    const totalPages   = Math.ceil(selected.length / itemsPerPage);

    function loadImg(src) {
      return new Promise(resolve => {
        const img = new Image();
        img.onload = () => {
          try {
            const c = document.createElement("canvas");
            c.width = img.width; c.height = img.height;
            c.getContext("2d").drawImage(img, 0, 0);
            resolve(c.toDataURL("image/png"));
          } catch { resolve(""); }
        };
        img.onerror = () => resolve("");
        img.src = src;
      });
    }

    for (let page = 0; page < totalPages; page++) {
      const chunk    = selected.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
      const dataUrls = await Promise.all(chunk.map(p => loadImg(`img/${p.code}.png`)));

      const container = document.createElement("div");
      container.style = `
        position:relative;
        width:210mm; min-height:297mm;
        padding:0; margin:0; background:#fff;
        font-family:"Microsoft JhengHei",sans-serif;
      `;

      container.innerHTML = `
        <div style="
          width:100%;background:#1e4f8a;color:#fff;
          text-align:center;padding:12px 0;
          font-size:18px;font-weight:bold;
        ">MATRIX Bill of Material (Page ${page + 1}/${totalPages})</div>
        <table style="
          width:100%;border:1px solid #000;
          border-collapse:collapse;font-size:12px;
          margin-top:8px;table-layout:fixed;
        ">
          <thead><tr>
            <th style="border:1px solid #000;padding:6px;width:15%;">IMAGE</th>
            <th style="border:1px solid #000;padding:6px;width:20%;">SKU</th>
            <th style="border:1px solid #000;padding:6px;width:50%;">NAME</th>
            <th style="border:1px solid #000;padding:6px;width:15%;">QTY</th>
          </tr></thead>
          <tbody>
            ${chunk.map((p, i) => `
              <tr>
                <td style="border:1px solid #000;padding:6px;text-align:center;">
                  ${dataUrls[i]
                    ? `<img src="${dataUrls[i]}" style="max-width:40px;max-height:40px;">`
                    : `<div style="width:40px;height:40px;display:inline-block;border:1px solid #ccc;font-size:9px;line-height:40px;color:#999;">No Img</div>`}
                </td>
                <td style="border:1px solid #000;padding:6px;text-align:center;">${p.code}</td>
                <td style="border:1px solid #000;padding:6px;">${p.name}</td>
                <td style="border:1px solid #000;padding:6px;text-align:center;">${p.qty}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
        <div style="position:absolute;bottom:20px;left:20px;font-size:12px;">
          Name: ${userName}<br>Date: ${new Date().toLocaleDateString()}
        </div>
        <div style="position:absolute;bottom:20px;right:20px;">
          <img src="img/Matrix-icon-2.png" style="max-width:160px;">
        </div>
      `;

      document.body.appendChild(container);
      const canvas   = await html2canvas(container, { scale: 2 });
      const imgData  = canvas.toDataURL("image/png");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfH     = (imgProps.height * pageWidth) / imgProps.width;
      if (page > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pdfH);
      document.body.removeChild(container);
    }

    pdf.save("MATRIX_BOM.pdf");
  }

  // ─── BOM image-buffer helpers (for DOCX / XLSX embedding) ──────
  async function fetchImageBuffer(url) {
    const res = await fetch(url);
    if (!res.ok) return null;
    return new Uint8Array(await res.arrayBuffer());
  }

  async function fetchImageBufferWithSize(url) {
    const res  = await fetch(url);
    const blob = await res.blob();
    const buf  = new Uint8Array(await blob.arrayBuffer());
    const bmp  = await createImageBitmap(blob);
    const w = bmp.width, h = bmp.height;
    bmp.close?.();
    return { buf, w, h };
  }

  // ─── BOM Word (DOCX) Export ─────────────────────────────────────
  async function exportBomDocx(userName, selected) {
    const docxGlobal = window.docx;
    if (!docxGlobal) {
      return alert("Word export library failed to load. Please check your internet connection and try again.");
    }
    const {
      Document, Packer, Paragraph, Table, TableRow, TableCell,
      ImageRun, TextRun, WidthType, HeadingLevel,
    } = docxGlobal;

    const buffers = await Promise.all(selected.map(p => fetchImageBuffer(`img/${p.code}.png`)));

    const rows = [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("IMAGE")] }),
          new TableCell({ children: [new Paragraph("SKU")] }),
          new TableCell({ children: [new Paragraph("NAME")] }),
          new TableCell({ children: [new Paragraph("QTY")] }),
        ],
      }),
      ...selected.map((p, i) => new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({
              children: buffers[i]
                ? [new ImageRun({ type: "png", data: buffers[i], transformation: { width: 40, height: 40 } })]
                : [new TextRun("No Img")],
            })],
          }),
          new TableCell({ children: [new Paragraph(p.code)] }),
          new TableCell({ children: [new Paragraph(p.name)] }),
          new TableCell({ children: [new Paragraph(p.qty.toString())] }),
        ],
      })),
    ];

    const table = new Table({ rows, width: { size: 100, type: WidthType.PERCENTAGE } });

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ text: "MATRIX Bill of Material", heading: HeadingLevel.HEADING_1 }),
          new Paragraph(`Name: ${userName}`),
          new Paragraph(`Date: ${new Date().toLocaleDateString()}`),
          table,
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "MATRIX_BOM.docx");
  }

  // ─── BOM Excel (XLSX) Export ────────────────────────────────────
  async function exportBomXlsx(userName, selected) {
    if (!window.ExcelJS || typeof saveAs !== "function") {
      return alert("Excel export library failed to load. Please check your internet connection and try again.");
    }

    const workbook = new ExcelJS.Workbook();
    const sheet    = workbook.addWorksheet("BOM");

    sheet.columns = [
      { header: "IMAGE", key: "image", width: 20 },
      { header: "SKU",   key: "sku",   width: 20 },
      { header: "NAME",  key: "name",  width: 50 },
      { header: "QTY",   key: "qty",   width: 10 },
    ];

    const MAX_W = 40, MAX_H = 40, PX_TO_PT = 0.75;

    for (let i = 0; i < selected.length; i++) {
      const p = selected[i];
      const { buf, w, h } = await fetchImageBufferWithSize(`img/${p.code}.png`);
      const imageId = workbook.addImage({ buffer: buf, extension: "png" });

      const scale = Math.min(MAX_W / w, MAX_H / h, 1);
      const drawW = Math.round(w * scale);
      const drawH = Math.round(h * scale);
      const rowIndex = i + 2;

      sheet.addRow({ sku: p.code, name: p.name, qty: p.qty });
      sheet.getRow(rowIndex).height = Math.max(drawH * PX_TO_PT + 4, 18);
      sheet.addImage(imageId, {
        tl:  { col: 0, row: rowIndex - 1 },
        ext: { width: drawW, height: drawH },
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer], { type: "application/octet-stream" }), "MATRIX_BOM.xlsx");
  }

  // ─── Routing: #item/<code> opens a product detail page, anything
  // else falls back to the last (or default) category. ──────────
  function handleHashRoute() {
    const m = location.hash.match(/^#item\/(.+)$/);
    if (m) {
      showProductDetail(decodeURIComponent(m[1]));
    } else {
      showSection(lastCategory, lastMobileAll);
      highlightSidebarFor(lastCategory);
    }
  }
  window.addEventListener("hashchange", handleHashRoute);

  // ─── Init ────────────────────────────────────────────────────
  handleHashRoute();
  updateCart();
});