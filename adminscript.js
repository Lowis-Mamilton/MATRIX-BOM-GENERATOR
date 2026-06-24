document.addEventListener("DOMContentLoaded", () => {
  const connectBtn     = document.getElementById("connect-btn");
  const connectStatus  = document.getElementById("connect-status");
  const searchInput    = document.getElementById("search-input");
  const addBtn         = document.getElementById("add-btn");
  const tbody          = document.getElementById("product-table-body");
  const unsupportedBox = document.getElementById("unsupported-banner");

  const formatMoney = n => Number(n || 0).toLocaleString("en-US");

  let rootHandle, productsFileHandle, categoriesFileHandle, imgDirHandle;
  let products = [];
  let categories = [];

  // ─── Feature detection ─────────────────────────────────────────
  if (!window.showDirectoryPicker) {
    unsupportedBox.hidden = false;
    connectBtn.disabled = true;
    connectBtn.title = "This browser doesn't support the File System Access API";
  }

  // ─── Connect / load ─────────────────────────────────────────────
  connectBtn.addEventListener("click", async () => {
    try {
      rootHandle = await window.showDirectoryPicker({ mode: "readwrite" });
      productsFileHandle   = await rootHandle.getFileHandle("products.json", { create: false });
      categoriesFileHandle  = await rootHandle.getFileHandle("categories.json", { create: false });
      imgDirHandle          = await rootHandle.getDirectoryHandle("img", { create: false });

      await loadData();

      connectStatus.textContent = `Connected: ${rootHandle.name}`;
      connectBtn.textContent = "Reconnect";
      searchInput.disabled = false;
      addBtn.disabled = false;
      renderTable(searchInput.value);
    } catch (err) {
      if (err.name !== "AbortError") {
        alert("Failed to connect folder: " + err.message);
      }
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

  // ─── Table rendering ────────────────────────────────────────────
  searchInput.addEventListener("input", () => renderTable(searchInput.value));

  function renderTable(filterText) {
    const q = (filterText || "").trim().toLowerCase();
    tbody.innerHTML = "";

    const filtered = products.filter(p => {
      if (!q) return true;
      return (
        p.code.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });

    filtered.forEach(p => {
      const tr = document.createElement("tr");

      const imgTd = document.createElement("td");
      const img = document.createElement("img");
      img.src = `img/${p.code}.png`;
      img.alt = p.code;
      img.className = "admin-thumb";
      img.onerror = function () { this.style.visibility = "hidden"; };
      imgTd.appendChild(img);

      const codeTd = document.createElement("td");
      codeTd.textContent = p.code;
      codeTd.className = "mono";

      const nameTd = document.createElement("td");
      nameTd.textContent = p.name;

      const catTd = document.createElement("td");
      catTd.textContent = p.subCategory ? `${p.category} / ${p.subCategory}` : p.category;

      const priceTd = document.createElement("td");
      priceTd.textContent = p.price === 0 ? "詢價" : `NT$${formatMoney(p.price)}`;

      const moqTd = document.createElement("td");
      moqTd.textContent = p.moq;

      const eolTd = document.createElement("td");
      eolTd.textContent = p.eol ? "EOL" : "";

      const actionsTd = document.createElement("td");
      actionsTd.className = "actions-cell";

      const editBtn = document.createElement("button");
      editBtn.textContent = "編輯";
      editBtn.className = "row-btn";
      editBtn.type = "button";
      editBtn.addEventListener("click", () => openProductForm(p));

      const delBtn = document.createElement("button");
      delBtn.textContent = "刪除";
      delBtn.className = "row-btn danger";
      delBtn.type = "button";
      delBtn.addEventListener("click", () => deleteProduct(p.code));

      actionsTd.appendChild(editBtn);
      actionsTd.appendChild(delBtn);

      tr.append(imgTd, codeTd, nameTd, catTd, priceTd, moqTd, eolTd, actionsTd);
      tbody.appendChild(tr);
    });
  }

  // ─── Add / edit form ────────────────────────────────────────────
  addBtn.addEventListener("click", () => openProductForm(null));

  function openProductForm(existing) {
    const isEdit = !!existing;
    const specsEntries = existing && existing.specs ? Object.entries(existing.specs) : [];

    const overlay = document.createElement("div");
    overlay.className = "admin-modal-overlay";
    overlay.innerHTML = `
      <div class="admin-modal">
        <h2>${isEdit ? "編輯零件" : "新增零件"}</h2>
        <form id="product-form">
          <div class="form-row">
            <label>編號 (code)</label>
            <input name="code" type="text" value="${existing ? existing.code : ""}" ${isEdit ? "disabled" : ""} required>
          </div>
          <div class="form-row">
            <label>名稱 (name)</label>
            <input name="name" type="text" value="${existing ? existing.name : ""}" required>
          </div>
          <div class="form-row">
            <label>分類 (category)</label>
            <select name="category" required></select>
          </div>
          <div class="form-row" id="subcategory-row" hidden>
            <label>子分類 (subCategory)</label>
            <select name="subCategory"></select>
          </div>
          <div class="form-row">
            <label>價格 (price)</label>
            <input name="price" type="number" min="0" step="1" value="${existing ? existing.price : 0}" required>
          </div>
          <div class="form-row">
            <label>重量 (weight, g)</label>
            <input name="weight" type="number" min="0" step="1" value="${existing ? existing.weight : 200}" required>
          </div>
          <div class="form-row">
            <label>最低訂購量 (moq)</label>
            <input name="moq" type="number" min="1" step="1" value="${existing && existing.moq ? existing.moq : 1}">
          </div>
          <div class="form-row checkbox-row">
            <label><input name="eol" type="checkbox" ${existing && existing.eol ? "checked" : ""}> 已停產 (EOL)</label>
          </div>
          <div class="form-row">
            <label>說明 (description)</label>
            <textarea name="description" rows="3">${existing && existing.description ? existing.description : ""}</textarea>
          </div>
          <div class="form-row">
            <label>圖片 (PNG，留空則不變更)</label>
            <input name="image" type="file" accept="image/png">
          </div>
          <div class="form-row">
            <label>規格 (specs)</label>
            <div id="specs-rows"></div>
            <button type="button" id="add-spec-row" class="secondary-btn">+ 新增規格欄</button>
          </div>
          <div id="form-error" class="form-error"></div>
          <div class="form-actions">
            <button type="button" id="form-cancel" class="secondary-btn">取消</button>
            <button type="submit" class="primary-btn">儲存</button>
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
        <input type="text" class="spec-label" placeholder="標籤" value="${label || ""}">
        <input type="text" class="spec-value" placeholder="內容" value="${value || ""}">
        <button type="button" class="row-btn danger spec-remove">移除</button>
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
      const imageFile = fd.get("image");

      const error = validateProduct({ code, name, price, weight }, isEdit);
      if (error) { errorBox.textContent = error; return; }

      const specs = {};
      let specsError = "";
      specsRows.querySelectorAll(".spec-row").forEach(row => {
        const label = row.querySelector(".spec-label").value.trim();
        const value = row.querySelector(".spec-value").value.trim();
        if (!label && !value) return;
        if (label && !value) { specsError = `規格「${label}」缺少內容`; return; }
        specs[label] = value;
      });
      if (specsError) { errorBox.textContent = specsError; return; }

      if (imageFile && imageFile.size > 0) {
        if (imageFile.type !== "image/png") {
          errorBox.textContent = "圖片必須是 PNG 格式";
          return;
        }
        try {
          const imgFileHandle = await imgDirHandle.getFileHandle(`${code}.png`, { create: true });
          const writable = await imgFileHandle.createWritable();
          await writable.write(imageFile);
          await writable.close();
        } catch (err) {
          errorBox.textContent = "寫入圖片失敗：" + err.message;
          return;
        }
      }

      const product = { code, name, category, price, weight, moq };
      if (subCategory) product.subCategory = subCategory;
      if (eol) product.eol = true;
      if (description) product.description = description;
      if (Object.keys(specs).length) product.specs = specs;
      if (existing && existing.photos) product.photos = existing.photos;

      if (isEdit) {
        const idx = products.findIndex(p => p.code === code);
        products[idx] = product;
      } else {
        products.push(product);
      }

      try {
        await persistProducts();
      } catch (err) {
        errorBox.textContent = "寫入 products.json 失敗：" + err.message;
        return;
      }

      overlay.remove();
      renderTable(searchInput.value);
    });
  }

  function validateProduct({ code, name, price, weight }, isEdit) {
    if (!code) return "請填寫編號";
    if (/[\\/:*?"<>|]/.test(code)) return "編號不可包含 \\ / : * ? \" < > |";
    if (!isEdit && products.some(p => p.code === code)) return `編號 ${code} 已存在`;
    if (!name) return "請填寫名稱";
    if (isNaN(price) || price < 0) return "價格必須是不小於 0 的數字";
    if (isNaN(weight) || weight < 0) return "重量必須是不小於 0 的數字";
    return "";
  }

  // ─── Delete ─────────────────────────────────────────────────────
  async function deleteProduct(code) {
    if (!confirm(`確定要刪除 ${code} 嗎？（圖片檔不會被刪除）`)) return;
    products = products.filter(p => p.code !== code);
    try {
      await persistProducts();
    } catch (err) {
      alert("寫入 products.json 失敗：" + err.message);
      return;
    }
    renderTable(searchInput.value);
  }
});
