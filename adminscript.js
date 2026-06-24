document.addEventListener("DOMContentLoaded", () => {
  const connectBtn      = document.getElementById("connect-btn");
  const connectStatus   = document.getElementById("connect-status");
  const searchInput     = document.getElementById("search-input");
  const categoryFilter  = document.getElementById("category-filter");
  const sortSelect      = document.getElementById("sort-select");
  const addBtn          = document.getElementById("add-btn");
  const tbody           = document.getElementById("product-table-body");
  const unsupportedBox  = document.getElementById("unsupported-banner");
  const resultCount     = document.getElementById("result-count");
  const toastContainer  = document.getElementById("toast-container");
  const lightboxOverlay = document.getElementById("lightbox-overlay");
  const lightboxImg     = document.getElementById("lightbox-img");

  const formatMoney = n => Number(n || 0).toLocaleString("en-US");

  let rootHandle, productsFileHandle, categoriesFileHandle, imgDirHandle;
  let products = [];
  let categories = [];

  // ─── Toast notifications ───────────────────────────────────────
  function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.classList.add("toast-out"), 2200);
    setTimeout(() => toast.remove(), 2600);
  }

  // ─── Image lightbox (click any thumbnail to enlarge) ───────────
  function openLightbox(src) {
    lightboxImg.src = src;
    lightboxOverlay.hidden = false;
  }
  lightboxOverlay.addEventListener("click", () => { lightboxOverlay.hidden = true; });

  // ─── Feature detection ─────────────────────────────────────────
  if (!window.showDirectoryPicker) {
    unsupportedBox.hidden = false;
    connectBtn.disabled = true;
    connectBtn.title = "This browser doesn't support the File System Access API";
  }

  // ─── Connect / load ─────────────────────────────────────────────
  connectBtn.addEventListener("click", async () => {
    const originalLabel = connectBtn.textContent;
    connectBtn.disabled = true;
    connectBtn.textContent = "Connecting…";
    try {
      rootHandle = await window.showDirectoryPicker({ mode: "readwrite" });
      productsFileHandle   = await rootHandle.getFileHandle("products.json", { create: false });
      categoriesFileHandle = await rootHandle.getFileHandle("categories.json", { create: false });
      imgDirHandle          = await rootHandle.getDirectoryHandle("img", { create: false });

      await loadData();
      populateCategoryFilter();

      connectStatus.textContent = `Connected: ${rootHandle.name}`;
      connectBtn.textContent = "Reconnect";
      searchInput.disabled = false;
      categoryFilter.disabled = false;
      sortSelect.disabled = false;
      addBtn.disabled = false;
      applyFilters();
      showToast(`Connected — ${products.length} parts loaded.`);
    } catch (err) {
      connectBtn.textContent = originalLabel;
      if (err.name !== "AbortError") {
        showToast("Failed to connect folder: " + err.message, "error");
      }
    } finally {
      connectBtn.disabled = false;
    }
  });

  async function loadData() {
    const [productsFile, categoriesFile] = await Promise.all([
      productsFileHandle.getFile(),
      categoriesFileHandle.getFile(),
    ]);
    products = JSON.parse(await productsFile.text());
    categories = JSON.parse(await categoriesFile.text());
  }

  async function persistProducts() {
    const writable = await productsFileHandle.createWritable();
    await writable.write(JSON.stringify(products, null, 2));
    await writable.close();
  }

  function populateCategoryFilter() {
    categoryFilter.innerHTML = `<option value="">All Categories</option>`;
    categories.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.name;
      opt.textContent = c.name;
      categoryFilter.appendChild(opt);
    });
  }

  // ─── Filtering / sorting / table rendering ─────────────────────
  searchInput.addEventListener("input", applyFilters);
  categoryFilter.addEventListener("change", applyFilters);
  sortSelect.addEventListener("change", applyFilters);

  function applyFilters() {
    renderTable(searchInput.value, categoryFilter.value, sortSelect.value);
  }

  function renderTable(filterText, categoryValue, sortValue) {
    const q = (filterText || "").trim().toLowerCase();
    tbody.innerHTML = "";

    let filtered = products.filter(p => {
      if (categoryValue && p.category !== categoryValue) return false;
      if (!q) return true;
      return (
        p.code.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });

    filtered = sortProducts(filtered, sortValue);

    resultCount.textContent = `Showing ${filtered.length} of ${products.length} parts`;

    filtered.forEach(p => {
      const tr = document.createElement("tr");

      const imgTd = document.createElement("td");
      const imgSrc = `img/${p.code}.png`;
      const img = document.createElement("img");
      img.src = imgSrc;
      img.alt = p.code;
      img.className = "admin-thumb";
      img.title = "Click to enlarge";
      img.onerror = function () { this.style.visibility = "hidden"; };
      img.addEventListener("click", () => openLightbox(imgSrc));
      imgTd.appendChild(img);

      const codeTd = document.createElement("td");
      codeTd.textContent = p.code;
      codeTd.className = "mono";

      const nameTd = document.createElement("td");
      nameTd.textContent = p.name;

      const catTd = document.createElement("td");
      catTd.textContent = p.subCategory ? `${p.category} / ${p.subCategory}` : p.category;

      const priceTd = document.createElement("td");
      priceTd.textContent = p.price === 0 ? "Price on request" : `NT$${formatMoney(p.price)}`;

      const moqTd = document.createElement("td");
      moqTd.textContent = p.moq;

      const eolTd = document.createElement("td");
      eolTd.textContent = p.eol ? "EOL" : "";

      const actionsTd = document.createElement("td");
      actionsTd.className = "actions-cell";

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.className = "row-btn";
      editBtn.type = "button";
      editBtn.addEventListener("click", () => openProductForm(p));

      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.className = "row-btn danger";
      delBtn.type = "button";
      delBtn.addEventListener("click", () => deleteProduct(p.code));

      actionsTd.appendChild(editBtn);
      actionsTd.appendChild(delBtn);

      tr.append(imgTd, codeTd, nameTd, catTd, priceTd, moqTd, eolTd, actionsTd);
      tbody.appendChild(tr);
    });
  }

  function sortProducts(list, sortValue) {
    const sorted = [...list];
    switch (sortValue) {
      case "code":
        sorted.sort((a, b) => a.code.localeCompare(b.code));
        break;
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "category":
      default:
        sorted.sort((a, b) => {
          const catCompare = a.category.localeCompare(b.category);
          if (catCompare !== 0) return catCompare;
          return (a.subCategory || "").localeCompare(b.subCategory || "");
        });
    }
    return sorted;
  }

  // ─── Add / edit form ────────────────────────────────────────────
  addBtn.addEventListener("click", () => openProductForm(null));

  function openProductForm(existing) {
    const isEdit = !!existing;
    const specsEntries = existing && existing.specs ? Object.entries(existing.specs) : [];
    const currentImgSrc = isEdit ? `img/${existing.code}.png` : "";

    const overlay = document.createElement("div");
    overlay.className = "admin-modal-overlay";
    overlay.innerHTML = `
      <div class="admin-modal">
        <h2>${isEdit ? "Edit Part" : "Add New Part"}</h2>
        <form id="product-form">
          <div class="form-row">
            <label>Code</label>
            <div class="field-hint">Unique part number. Used as the image/file name, so it can't be changed once created.</div>
            <input name="code" type="text" value="${existing ? existing.code : ""}" ${isEdit ? "disabled" : ""} required>
          </div>
          <div class="form-row">
            <label>Name</label>
            <input name="name" type="text" value="${existing ? existing.name : ""}" required>
          </div>
          <div class="form-row">
            <label>Category</label>
            <select name="category" required></select>
          </div>
          <div class="form-row" id="subcategory-row" hidden>
            <label>Subcategory</label>
            <select name="subCategory"></select>
          </div>
          <div class="form-row">
            <label>Price (NT$)</label>
            <div class="field-hint">Enter 0 to show "Price on request" instead of a price.</div>
            <input name="price" type="number" min="0" step="1" value="${existing ? existing.price : 0}" required>
          </div>
          <div class="form-row">
            <label>Weight (grams)</label>
            <div class="field-hint">Used to calculate shipping cost at checkout.</div>
            <input name="weight" type="number" min="0" step="1" value="${existing ? existing.weight : 200}" required>
          </div>
          <div class="form-row">
            <label>Minimum Order Quantity (MOQ)</label>
            <div class="field-hint">Customers can only order in multiples of this amount (e.g. screws sold in bags of 100).</div>
            <input name="moq" type="number" min="1" step="1" value="${existing && existing.moq ? existing.moq : 1}">
          </div>
          <div class="form-row checkbox-row">
            <label><input name="eol" type="checkbox" ${existing && existing.eol ? "checked" : ""}> End of Life (EOL)</label>
            <div class="field-hint">Shows the part as discontinued/greyed out in the storefront.</div>
          </div>
          <div class="form-row">
            <label>Description</label>
            <div class="field-hint">Shown on the part's detail page, above the specs table.</div>
            <textarea name="description" rows="3">${existing && existing.description ? existing.description : ""}</textarea>
          </div>
          <div class="form-row">
            <label>Main Image</label>
            <div class="field-hint">PNG only. Shown everywhere — product grid, cart, detail page, exports. Click the preview to enlarge. Written to disk immediately when selected.</div>
            <img id="image-preview" class="image-preview" src="${currentImgSrc}" alt="" ${currentImgSrc ? "" : "hidden"}>
            <input id="main-image-input" type="file" accept="image/png">
          </div>
          <div class="form-row">
            <label>Additional Photos</label>
            <div class="field-hint">Shown in the photo gallery on the part's detail page. Use "Set as Main" to swap one of these into the main image slot above. Removing a photo here only removes it from the gallery — it does not delete the file.</div>
            <div id="photo-list"></div>
            <input id="add-photo-input" type="file" accept="image/png" multiple>
          </div>
          <div class="form-row">
            <label>Specs</label>
            <div class="field-hint">Shown as a table on the part's detail page (e.g. Material → Aluminum).</div>
            <div id="specs-rows"></div>
            <button type="button" id="add-spec-row" class="secondary-btn">+ Add Spec Row</button>
          </div>
          <div id="form-error" class="form-error"></div>
          <div class="form-actions">
            <button type="button" id="form-cancel" class="secondary-btn">Cancel</button>
            <button type="submit" class="primary-btn">Save</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(overlay);

    const form = overlay.querySelector("#product-form");
    const categorySelect = form.querySelector("select[name=category]");
    const subRow = overlay.querySelector("#subcategory-row");
    const subSelect = form.querySelector("select[name=subCategory]");
    const specsRows = overlay.querySelector("#specs-rows");
    const errorBox = overlay.querySelector("#form-error");
    const imagePreview = overlay.querySelector("#image-preview");
    const mainImageInput = overlay.querySelector("#main-image-input");
    const addPhotoInput = overlay.querySelector("#add-photo-input");
    const photoListEl = overlay.querySelector("#photo-list");
    const codeInput = form.querySelector("input[name=code]");

    let pendingPhotos = existing && existing.photos ? [...existing.photos] : [];

    function getCurrentCode() {
      return codeInput.value.trim();
    }

    async function writeImageFile(filename, file) {
      const handle = await imgDirHandle.getFileHandle(filename, { create: true });
      const writable = await handle.createWritable();
      await writable.write(file);
      await writable.close();
    }

    async function readImageFile(filename) {
      const handle = await imgDirHandle.getFileHandle(filename, { create: false });
      return handle.getFile();
    }

    function nextPhotoFilename(code) {
      let n = 2;
      while (pendingPhotos.includes(`${code}-${n}.png`)) n++;
      return `${code}-${n}.png`;
    }

    imagePreview.addEventListener("click", () => {
      if (imagePreview.src) openLightbox(imagePreview.src);
    });
    imagePreview.onerror = function () { this.hidden = true; };

    mainImageInput.addEventListener("change", async () => {
      const file = mainImageInput.files[0];
      if (!file) return;
      const code = getCurrentCode();
      if (!code) { showToast("Enter a Code first", "error"); mainImageInput.value = ""; return; }
      if (file.type !== "image/png") { showToast("Image must be a PNG file", "error"); mainImageInput.value = ""; return; }
      try {
        await writeImageFile(`${code}.png`, file);
        imagePreview.src = URL.createObjectURL(file);
        imagePreview.hidden = false;
        showToast("Main image updated.");
      } catch (err) {
        showToast("Failed to write image: " + err.message, "error");
      }
      mainImageInput.value = "";
    });

    addPhotoInput.addEventListener("change", async () => {
      const code = getCurrentCode();
      if (!code) { showToast("Enter a Code first", "error"); addPhotoInput.value = ""; return; }
      for (const file of Array.from(addPhotoInput.files)) {
        if (file.type !== "image/png") { showToast(`${file.name} is not a PNG, skipped`, "error"); continue; }
        const filename = nextPhotoFilename(code);
        try {
          await writeImageFile(filename, file);
          pendingPhotos.push(filename);
        } catch (err) {
          showToast("Failed to write image: " + err.message, "error");
        }
      }
      addPhotoInput.value = "";
      renderPhotoList();
    });

    async function setAsMain(filename) {
      const code = getCurrentCode();
      if (!code) { showToast("Enter a Code first", "error"); return; }
      try {
        let mainFile = null;
        try { mainFile = await readImageFile(`${code}.png`); } catch { /* no existing main image yet */ }
        const photoFile = await readImageFile(filename);
        if (mainFile) await writeImageFile(filename, mainFile);
        await writeImageFile(`${code}.png`, photoFile);
        imagePreview.src = URL.createObjectURL(photoFile);
        imagePreview.hidden = false;
        showToast(`${filename} is now the main image.`);
      } catch (err) {
        showToast("Failed to set main image: " + err.message, "error");
      }
    }

    function renderPhotoList() {
      photoListEl.innerHTML = "";
      if (!pendingPhotos.length) {
        photoListEl.innerHTML = `<div class="field-hint">No additional photos yet.</div>`;
        return;
      }
      pendingPhotos.forEach((filename, idx) => {
        const row = document.createElement("div");
        row.className = "photo-row";

        const img = document.createElement("img");
        img.src = `img/${filename}`;
        img.alt = filename;
        img.className = "image-preview small";
        img.onerror = function () { this.style.visibility = "hidden"; };
        img.addEventListener("click", () => openLightbox(img.src));

        const nameSpan = document.createElement("span");
        nameSpan.className = "photo-filename mono";
        nameSpan.textContent = filename;

        const mainBtn = document.createElement("button");
        mainBtn.type = "button";
        mainBtn.className = "secondary-btn";
        mainBtn.textContent = "Set as Main";
        mainBtn.addEventListener("click", () => setAsMain(filename));

        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "row-btn danger";
        removeBtn.textContent = "Remove";
        removeBtn.addEventListener("click", () => {
          pendingPhotos.splice(idx, 1);
          renderPhotoList();
        });

        row.append(img, nameSpan, mainBtn, removeBtn);
        photoListEl.appendChild(row);
      });
    }
    renderPhotoList();

    categories.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.name;
      opt.textContent = c.name;
      categorySelect.appendChild(opt);
    });

    function refreshSubCategory(selectedSubValue) {
      const cat = categories.find(c => c.name === categorySelect.value);
      subSelect.innerHTML = "";
      if (cat && cat.sub && cat.sub.length) {
        subRow.hidden = false;
        cat.sub.forEach(sub => {
          const opt = document.createElement("option");
          opt.value = sub;
          opt.textContent = sub;
          subSelect.appendChild(opt);
        });
        if (selectedSubValue) subSelect.value = selectedSubValue;
      } else {
        subRow.hidden = true;
      }
    }

    if (existing) categorySelect.value = existing.category;
    refreshSubCategory(existing ? existing.subCategory : null);
    categorySelect.addEventListener("change", () => refreshSubCategory(null));

    function addSpecRow(label, value) {
      const row = document.createElement("div");
      row.className = "spec-row";
      row.innerHTML = `
        <input type="text" class="spec-label" placeholder="Label (e.g. Material)" value="${label || ""}">
        <input type="text" class="spec-value" placeholder="Value (e.g. Aluminum)" value="${value || ""}">
        <button type="button" class="row-btn danger spec-remove">Remove</button>
      `;
      row.querySelector(".spec-remove").addEventListener("click", () => row.remove());
      specsRows.appendChild(row);
    }
    specsEntries.forEach(([label, value]) => addSpecRow(label, value));
    overlay.querySelector("#add-spec-row").addEventListener("click", () => addSpecRow("", ""));

    overlay.querySelector("#form-cancel").addEventListener("click", () => overlay.remove());
    overlay.addEventListener("click", e => { if (e.target === overlay) overlay.remove(); });

    form.addEventListener("submit", async e => {
      e.preventDefault();
      errorBox.textContent = "";

      const fd = new FormData(form);
      const code = isEdit ? existing.code : fd.get("code").trim();
      const name = fd.get("name").trim();
      const category = fd.get("category");
      const subCategory = subRow.hidden ? undefined : fd.get("subCategory");
      const price = Number(fd.get("price"));
      const weight = Number(fd.get("weight"));
      const moq = Number(fd.get("moq")) || 1;
      const eol = fd.get("eol") === "on";
      const description = fd.get("description").trim();

      const error = validateProduct({ code, name, price, weight }, isEdit);
      if (error) { errorBox.textContent = error; return; }

      const specs = {};
      let specsError = "";
      specsRows.querySelectorAll(".spec-row").forEach(row => {
        const label = row.querySelector(".spec-label").value.trim();
        const value = row.querySelector(".spec-value").value.trim();
        if (!label && !value) return;
        if (label && !value) { specsError = `Spec "${label}" is missing a value`; return; }
        specs[label] = value;
      });
      if (specsError) { errorBox.textContent = specsError; return; }

      const saveBtn = form.querySelector("button[type=submit]");
      saveBtn.disabled = true;
      saveBtn.textContent = "Saving…";

      const product = { code, name, category, price, weight, moq };
      if (subCategory) product.subCategory = subCategory;
      if (eol) product.eol = true;
      if (description) product.description = description;
      if (Object.keys(specs).length) product.specs = specs;
      if (pendingPhotos.length) product.photos = pendingPhotos;

      if (isEdit) {
        const idx = products.findIndex(p => p.code === code);
        products[idx] = product;
      } else {
        products.push(product);
      }

      try {
        await persistProducts();
      } catch (err) {
        errorBox.textContent = "Failed to write products.json: " + err.message;
        saveBtn.disabled = false;
        saveBtn.textContent = "Save";
        return;
      }

      overlay.remove();
      applyFilters();
      showToast(isEdit ? `${code} saved.` : `${code} added.`);
    });
  }

  function validateProduct({ code, name, price, weight }, isEdit) {
    if (!code) return "Code is required";
    if (/[\\/:*?"<>|]/.test(code)) return "Code cannot contain \\ / : * ? \" < > |";
    if (!isEdit && products.some(p => p.code === code)) return `Code ${code} already exists`;
    if (!name) return "Name is required";
    if (isNaN(price) || price < 0) return "Price must be a number ≥ 0";
    if (isNaN(weight) || weight < 0) return "Weight must be a number ≥ 0";
    return "";
  }

  // ─── Delete ─────────────────────────────────────────────────────
  async function deleteProduct(code) {
    if (!confirm(`Delete ${code}? (its image file will not be deleted)`)) return;
    products = products.filter(p => p.code !== code);
    try {
      await persistProducts();
    } catch (err) {
      showToast("Failed to write products.json: " + err.message, "error");
      return;
    }
    applyFilters();
    showToast(`${code} deleted.`);
  }
});
