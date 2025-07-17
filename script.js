// script.js

document.addEventListener('DOMContentLoaded', () => {
  // 主分類與子分類設定
  const categoryConfig = [
    { name: "CONTROLLER" },
    { name: "MOTOR CONTROLLER" },
    { name: "JOY STICK" },
    { name: "BATTERY" },
    { name: "SENSOR", sub: ["ANALOG", "DIGITAL", "IIC", "UART"] },
    { name: "MOTOR",   sub: ["SERVO", "TT", "DC"] },
    { name: "BRACKET & ACCESSORY" },
    { name: "L SHAPED BEAM" },
    { name: "C SHAPED BEAM" },
    { name: "FLAT BEAM" },
    { name: "BEAM JOINER" },
    { name: "GUSSET PLATE" },
    { name: "SPECIAL PLATE" },
    { name: "FLANGED PLATE" },
    { name: "D SHAFT" },
    { name: "JOINER & COLLAR" },
    { name: "HUB" },
    { name: "BEARING TUBE" },
    { name: "GEAR" },
    { name: "CHAIN KIT" },
    { name: "SYNCHRONOUS WHEEL" },
    { name: "LINEAR SLIDE" },
    { name: "LEADSCREW" },
    { name: "WHEEL" },
    { name: "SCREW" }
  ];

  // 產品資料：category 主分類，subCategory 子分類（需時才用）
  const productData = [
    // CONTROLLER
    { code: "MMJ-000",       name: "MATRIX Micro Junior Controller", category: "CONTROLLER" },
    { code: "MM-000 V2",     name: "MATRIX Micro Controller V2",     category: "CONTROLLER" },
    { code: "MR-000 V2-4",   name: "MATRIX Mini Controller V2.4",    category: "CONTROLLER" },
    { code: "MA-000",        name: "MATRIX Mini R4 Controller",      category: "CONTROLLER" },
    { code: "KNR-MBS0214",   name: "KNRm Controller",                category: "CONTROLLER" },

    // MOTOR CONTROLLER
    { code: "NEW14-0003",    name: "MATRIX Motor Controller - 12V",  category: "MOTOR CONTROLLER" },
    { code: "14-0003",       name: "MATRIX Motor Controller - 9V",   category: "MOTOR CONTROLLER" },

    // JOY STICK
    { code: "MJ2",           name: "MATRIX JOYSTICK II",             category: "JOY STICK" },

    // BATTERY
    { code: "18650-HD",   name: "18650x2 Battery Box",          category: "BATTERY" },
    { code: "5521DC-06V2",   name: "6 Cell AA Battery Box",         category: "BATTERY" },
    { code: "14-0004",       name: "Battery 9.6V SC2400mAH",         category: "BATTERY" },

    // SENSOR → ANALOG
    { code: "MS-003V2",      name: "MATRIX Grayscale Sensor V2",     category: "SENSOR", subCategory: "ANALOG" },
    { code: "MS-003V3",      name: "MATRIX Grayscale Sensor V3",     category: "SENSOR", subCategory: "ANALOG" },
    { code: "MS-013",        name: "MATRIX Potentiometer Sensor",    category: "SENSOR", subCategory: "ANALOG" },
    { code: "MS-014",        name: "MATRIX Water Level Sensor",      category: "SENSOR", subCategory: "ANALOG" },

    // SENSOR → DIGITAL
    { code: "MS-004V2",      name: "MATRIX Miniature Switch V2",     category: "SENSOR", subCategory: "DIGITAL" },
    { code: "MS-004V3",      name: "MATRIX Miniature Switch V3",     category: "SENSOR", subCategory: "DIGITAL" },
    { code: "MS-001",        name: "MATRIX Motion Sensor",           category: "SENSOR", subCategory: "DIGITAL" },
    { code: "MS-012",        name: "MATRIX PIR Motion Sensor",       category: "SENSOR", subCategory: "DIGITAL" },

    // SENSOR → IIC
    { code: "MS-002V2",      name: "MATRIX Color Sensor V2",         category: "SENSOR", subCategory: "IIC" },
    { code: "MS-002V3",      name: "MATRIX Color Sensor V3",         category: "SENSOR", subCategory: "IIC" },
    { code: "MS-009V2",      name: "MATRIX Laser Sensor V2",         category: "SENSOR", subCategory: "IIC" },
    { code: "MS-017",        name: "MATRIX Gesture Sensor",          category: "SENSOR", subCategory: "IIC" },
    { code: "BNO055",        name: "BNO055 Absolute Orientation IMU", category: "SENSOR", subCategory: "IIC" },

    // SENSOR → UART
    { code: "MS-010",        name: "M-Vision AI Cam",                category: "SENSOR", subCategory: "UART" },

    // MOTOR → SERVO
    { code: "MMRC-MG90S",    name: "MATRIX Micro Servo (metal gear)",  category: "MOTOR", subCategory: "SERVO" },
    { code: "MRC-MG15-180",  name: "MATRIX RC Servo (metal gear)",    category: "MOTOR", subCategory: "SERVO" },
    { code: "MRC-MG25-180",  name: "MATRIX RC Servo (metal gear)",    category: "MOTOR", subCategory: "SERVO" },
    { code: "MRC-MG17-335",  name: "MATRIX RC Servo (metal gear)",    category: "MOTOR", subCategory: "SERVO" },
    { code: "MRC-MG360S",    name: "MATRIX RC Servo (metal gear)",    category: "MOTOR", subCategory: "SERVO" },
    { code: "MRC-MG996",     name: "MATRIX RC Servo (metal gear)",    category: "MOTOR", subCategory: "SERVO" },
    { code: "MRC-MG6225-PDI",name: "MATRIX RC Servo (metal gear)",    category: "MOTOR", subCategory: "SERVO" },

    // MOTOR → TT
    { code: "METB-SG001",    name: "MATRIX TB Encoder Medium Motor",  category: "MOTOR", subCategory: "TT" },
    { code: "METT-MG001",    name: "MATRIX TT Encoder Motor",         category: "MOTOR", subCategory: "TT" },
    { code: "MTT-MG001",     name: "MATRIX TT Motor",                 category: "MOTOR", subCategory: "TT" },
    { code: "MTT-SG001",     name: "MATRIX TT Motor",                 category: "MOTOR", subCategory: "TT" },

    // MOTOR → DC
    { code: "14-0001",       name: "MATRIX 9V DC HS Motor",           category: "MOTOR", subCategory: "DC" },
    { code: "14-0009",       name: "MATRIX 9V DC HT Motor",           category: "MOTOR", subCategory: "DC" },
    { code: "14-0011",       name: "MATRIX Motor w/ Anderson Powerpole", category: "MOTOR", subCategory: "DC" },
    { code: "14-0015",       name: "MATRIX Motor w/ 6mm D Shaft",     category: "MOTOR", subCategory: "DC" },

    // BRACKET & ACCESSORY
    {code:"07-0001", name:"Micro Servo Bracket", category:"BRACKET & ACCESSORY"},
    {code:"07-0002", name:"Servo Bracket", category:"BRACKET & ACCESSORY"},
    {code:"07-0009", name:"RC Servo Bracket", category:"BRACKET & ACCESSORY"},
    {code:"07-0005", name:"DC Motor Double Flanged Bracket - 5 x 7 Hole", category:"BRACKET & ACCESSORY"},
    {code:"07-0010", name:"DC Motor Hub Bracket", category:"BRACKET & ACCESSORY"},
    {code:"07-2331", name:"DC Motor Double Flanged Bracket - 23 x 31 Hole", category:"BRACKET & ACCESSORY"},
    {code:"07-AM3103", name:"DC Motor Double Flanged Bracket – am3103", category:"BRACKET & ACCESSORY"},
    {code:"07-AM3637", name:"DC Motor Double Flanged Bracket – am3637", category:"BRACKET & ACCESSORY"},
    {code:"07-0004", name:"Servo Bearing Beam - 5 Hole", category:"BRACKET & ACCESSORY"},
    {code:"07-0006", name:"Servo Horn Wheel Brace - Short", category:"BRACKET & ACCESSORY"},
    {code:"07-0007", name:"Servo Horn Wheel Brace - Long", category:"BRACKET & ACCESSORY"},
    {code:"07-0008", name:"TT Motor Bracket (Set of Left and Right)", category:"BRACKET & ACCESSORY"},
    {code:"13-0012", name:"Micro Servo Horn Wheel", category:"BRACKET & ACCESSORY"},
    {code:"13-0002", name:"RC Servo Horn Wheel", category:"BRACKET & ACCESSORY"},

    // L SHAPED BEAM
    {code:"01-0003", name:"L Shaped Beam - 3 Hole", category:"L SHAPED BEAM"},
    {code:"01-0005", name:"L Shaped Beam - 5 Hole", category:"L SHAPED BEAM"},
    {code:"01-0007", name:"L Shaped Beam - 7 Hole", category:"L SHAPED BEAM"},
    {code:"01-0009", name:"L Shaped Beam - 9 Hole", category:"L SHAPED BEAM"},
    {code:"01-0021", name:"L Shaped Beam - 21 Hole", category:"L SHAPED BEAM"},
    {code:"01-0029", name:"L Shaped Beam - 29 Hole", category:"L SHAPED BEAM"},
    {code:"01-0037", name:"L Shaped Beam - 37 Hole", category:"L SHAPED BEAM"},
    {code:"01-0313", name:"L Shaped Beam XL - 13 Hole", category:"L SHAPED BEAM"},
    {code:"01-0317", name:"L Shaped Beam XL - 17 Hole", category:"L SHAPED BEAM"},
    {code:"01-0321", name:"L Shaped Beam XL - 21 Hole", category:"L SHAPED BEAM"},
    {code:"01-0329", name:"L Shaped Beam XL - 29 Hole", category:"L SHAPED BEAM"},
    {code:"01-0337", name:"L Shaped Beam XL - 37 Hole", category:"L SHAPED BEAM"},
    {code:"01-0349", name:"L Shaped Beam XL - 49 Hole", category:"L SHAPED BEAM"},

    // FLAT BEAM
    {code:"02-0003", name:"Flat Beam - 3 Hole", category:"FLAT BEAM"},
    {code:"02-0005", name:"Flat Beam - 5 Hole", category:"FLAT BEAM"},
    {code:"02-0007", name:"Flat Beam - 7 Hole", category:"FLAT BEAM"},
    {code:"02-0009", name:"Flat Beam - 9 Hole", category:"FLAT BEAM"},
    {code:"02-0011", name:"Flat Beam - 11 Hole", category:"FLAT BEAM"},

    // GUSSET PLATE
    {code:"04-0303", name:"Gusset Plate 3 x 3 Hole", category:"GUSSET PLATE"},
    {code:"04-0305", name:"Gusset Plate 3 x 5 Hole", category:"GUSSET PLATE"},
    {code:"04-0307", name:"Gusset Plate 3 x 7 Hole", category:"GUSSET PLATE"},
    {code:"04-0309", name:"Gusset Plate 3 x 9 Hole", category:"GUSSET PLATE"},
    {code:"04-0505", name:"Gusset Plate 5 x 5 Hole", category:"GUSSET PLATE"},

    // C SHAPED BEAM
    {code:"06-0005", name:"C Shaped Beam - 5 Hole", category:"C SHAPED BEAM"},
    {code:"06-0009", name:"C Shaped Beam - 9 Hole", category:"C SHAPED BEAM"},
    {code:"06-0013", name:"C Shaped Beam - 13 Hole", category:"C SHAPED BEAM"},
    {code:"06-0017", name:"C Shaped Beam - 17 Hole", category:"C SHAPED BEAM"},
    {code:"06-0021", name:"C Shaped Beam - 21 Hole", category:"C SHAPED BEAM"},
    {code:"06-0029", name:"C Shaped Beam - 29 Hole", category:"C SHAPED BEAM"},
    {code:"06-0037", name:"C Shaped Beam - 37 Hole", category:"C SHAPED BEAM"},
    {code:"06-0049", name:"C Shaped Beam - 49 Hole", category:"C SHAPED BEAM"},
    {code:"06-0339", name:"C Shaped Beam XL - 39 Hole", category:"C SHAPED BEAM"},
    {code:"06-0347", name:"C Shaped Beam XL - 47 Hole", category:"C SHAPED BEAM"},
    {code:"06-2232", name:"C Shaped Beam XL2 - 232mm", category:"C SHAPED BEAM"},
    {code:"06-2296", name:"C Shaped Beam XL2 - 296mm", category:"C SHAPED BEAM"},
    {code:"06-2424", name:"C Shaped Beam XL2 - 424mm", category:"C SHAPED BEAM"},
    {code:"06-2216", name:"C Shaped Beam XL2 - 216mm", category:"C SHAPED BEAM"},
    {code:"06-2312", name:"C Shaped Beam XL2 - 312mm", category:"C SHAPED BEAM"},
    {code:"06-2408", name:"C Shaped Beam XL2 - 408mm", category:"C SHAPED BEAM"},

    // BEAM JOINER
    {code:"03-0001", name:"Beam Joiner - 1D Straight", category:"BEAM JOINER"},
    {code:"03-0002", name:"Beam Joiner - 2D Right Angle", category:"BEAM JOINER"},
    {code:"03-0003", name:"Beam Joiner - 3D Right Angle", category:"BEAM JOINER"},

    // SPECIAL PLATE
    {code:"17-0709", name:"Triangle Plate 6-8-10 Hole", category:"SPECIAL PLATE"},

    // FLANGED PLATE
    {code:"05-0303", name:"Flanged Plate 3 x 3 Hole", category:"FLANGED PLATE"},
    {code:"05-0305", name:"Flanged Plate 3 x 5 Hole", category:"FLANGED PLATE"},
    {code:"05-0307", name:"Flanged Plate 3 x 7 Hole", category:"FLANGED PLATE"},
    {code:"05-0309", name:"Flanged Plate 3 x 9 Hole", category:"FLANGED PLATE"},

    // D SHAFT
    {code:"10-0028", name:"4mm D Shaft - 28mm", category:"D SHAFT"},
    {code:"10-0052", name:"4mm D Shaft - 52mm", category:"D SHAFT"},
    {code:"10-0080", name:"4mm D Shaft - 80mm", category:"D SHAFT"},
    {code:"10-0132", name:"4mm D Shaft - 132mm", category:"D SHAFT"},
    {code:"10-0160", name:"4mm D Shaft - 160mm", category:"D SHAFT"},
    {code:"10-0164", name:"4mm D Shaft - 164mm", category:"D SHAFT"},
    {code:"10-0280", name:"4mm D Shaft - 280mm", category:"D SHAFT"},
    {code:"10-6030", name:"6mm D Shaft - 30mm", category:"D SHAFT"},
    {code:"10-6050", name:"6mm D Shaft - 50mm", category:"D SHAFT"},
    {code:"10-6080", name:"6mm D Shaft - 80mm", category:"D SHAFT"},
    {code:"10-6160", name:"6mm D Shaft - 160mm", category:"D SHAFT"},
    {code:"10-6300", name:"6mm D Shaft - 300mm", category:"D SHAFT"},

    // JOINER & COLLAR
    {code:"08-0019", name:"4mm Axle Collar with M4 set screw", category:"JOINER & COLLAR"},
    {code:"08-0021", name:"4mm to 4mm Coupling with M4 set screw", category:"JOINER & COLLAR"},
    {code:"08-0020", name:"4mm to 6mm Adaptor with M4 set screw", category:"JOINER & COLLAR"},
    {code:"08-0031", name:"4mm to TT Adapter with M4 set screw", category:"JOINER & COLLAR"},
    {code:"08-0032", name:"6mm Axle Collar with M4 set screw", category:"JOINER & COLLAR"},
    {code:"08-0033", name:"6mm to 6mm Coupling with M4 set screw", category:"JOINER & COLLAR"},
    {code:"09-0004", name:"4mm Joiner Block with M3 set screw", category:"JOINER & COLLAR"},

    // HUB
    {code:"08-0007", name:"4mm Hub with M4 set screw", category:"HUB"},
    {code:"08-0008", name:"6mm Hub with M4 set screw", category:"HUB"},

    // BEARING TUBE
    {code:"08-0015", name:"4mm Bearing Tube - 15mm", category:"BEARING TUBE"},
    {code:"08-0030", name:"4mm Bearing Tube - 30mm", category:"BEARING TUBE"},
    {code:"08-0018", name:"6mm Bearing Tube - 15mm", category:"BEARING TUBE"},
    {code:"08-0017", name:"6mm Bearing Tube - 30mm", category:"BEARING TUBE"},

    // GEAR
    {code:"12-0024", name:"Gear - 24 Tooth with M4 set screw", category:"GEAR"},
    {code:"12-0040", name:"Gear - 40 Tooth with M4 set screw", category:"GEAR"},
    {code:"12-0056", name:"Gear - 56 Tooth with M4 set screw", category:"GEAR"},
    {code:"13-0024", name:"Metal Gear - 24 Tooth", category:"GEAR"},
    {code:"13-0040", name:"Metal Gear - 40 Tooth", category:"GEAR"},
    {code:"13-0056", name:"Metal Gear - 56 Tooth", category:"GEAR"},

    // CHAIN KIT
    {code:"25-1X240", name:"Roller Chain 25 x 240 Link", category:"CHAIN KIT"},
    {code:"25-1X480", name:"Roller Chain 25 x 480 Link", category:"CHAIN KIT"},
    {code:"A025016", name:"25A Chain Gear - 16 Tooth", category:"CHAIN KIT"},
    {code:"A025024", name:"25A Chain Gear - 24 Tooth", category:"CHAIN KIT"},
    {code:"A025032", name:"25A Chain Gear - 32 Tooth", category:"CHAIN KIT"},

    // SYNCHRONOUS WHEEL
    {code:"2GT-20T", name:"2GT Synchronous Wheel - 20 Tooth", category:"SYNCHRONOUS WHEEL"},
    {code:"2GT-36T", name:"2GT Synchronous Wheel - 36 Tooth", category:"SYNCHRONOUS WHEEL"},
    {code:"2GT-48T", name:"2GT Synchronous Wheel - 48 Tooth", category:"SYNCHRONOUS WHEEL"},
    {code:"2GT-172-6", name:"2GT Synchronous Belt - 172 x 6mm", category:"SYNCHRONOUS WHEEL"},
    {code:"2GT-852-6", name:"2GT Synchronous Belt - 852 x 6mm", category:"SYNCHRONOUS WHEEL"},

    // LINEAR SLIDE
    {code:"12-0002", name:"Linear Slide - 3 Hole", category:"LINEAR SLIDE"},
    {code:"MGN09H", name:"HIWIN Miniature Guides MGN HIRES Series", category:"LINEAR SLIDE"},
    {code:"MGN15H", name:"HIWIN Miniature Guides MGN HIRES Series", category:"LINEAR SLIDE"},

    // LEADSCREW
    {code:"18-0128", name:"Leadscrew - 128mm", category:"LEADSCREW"},
    {code:"18-0256", name:"Leadscrew - 256mm", category:"LEADSCREW"},
    {code:"18-0001", name:"Leadscrew Block", category:"LEADSCREW"},

    // WHEEL
    {code:"13-0003", name:"Caster Wheel - 48mm", category:"WHEEL"},
    {code:"13-0001", name:"Wheel - 96mm with M3 set screw", category:"WHEEL"},
    {code:"13-0009", name:"Wide Wheel - 79mm", category:"WHEEL"},
    {code:"13-0008", name:"Single Omni Wheel - 94mm", category:"WHEEL"},
    {code:"16-0001", name:"4mm Double Omni Wheel - 94mm", category:"WHEEL"},
    {code:"16-0002", name:"6mm Double Omni Wheel - 94mm", category:"WHEEL"},
    {code:"13-0013", name:"6mm Mecanum Wheel - 100mm", category:"WHEEL"},
    {code:"13-0014", name:"6mm Mecanum Wheel - 203mm", category:"WHEEL"},
    {code:"13-0015", name:"6mm Plastic Mecanum Wheel - 100mm", category:"WHEEL"},
    {code:"TT-TIRE_OR", name:"MATRIX TT Wheel (Off-Road)", category:"WHEEL"},
    {code:"TT-TIRE_B", name:"MATRIX TT Wheel (Blue Rim)", category:"WHEEL"},

    // SCREW
    {code:"11-3104", name:"M3 Button Head Screw - 4mm", category:"SCREW"},
    {code:"11-3106", name:"M3 Button Head Screw - 6mm", category:"SCREW"},
    {code:"11-3204", name:"M3 Flat Point set screw - 4.5mm", category:"SCREW"},
    {code:"11-3404", name:"M4 Flat Point set screw - 4mm", category:"SCREW"},
    {code:"11-3608", name:"M3 Cylinder Head Screw - 8mm", category:"SCREW"},
    {code:"11-4108", name:"M4 Button Head Screw - 8mm", category:"SCREW"},
    {code:"11-4112", name:"M4 Button Head Screw - 12mm", category:"SCREW"},
    {code:"11-4116", name:"M4 Button Head Screw - 16mm", category:"SCREW"},
    {code:"11-4120", name:"M4 Button Head Screw - 20mm", category:"SCREW"},
    {code:"11-4124", name:"M4 Button Head Screw - 24mm", category:"SCREW"},
    {code:"11-4140", name:"M4 Button Head Screw - 40mm", category:"SCREW"},
    {code:"11-4604", name:"M4 Cylinder Head Screw - 4mm", category:"SCREW"},
    {code:"11-4501", name:"M4 Hex Nut", category:"SCREW"},
    {code:"11-4502", name:"M4 Hex Nut with Tooth Washer", category:"SCREW"},
    {code:"11-4503", name:"M4 Hex Nut with Nylon Lock", category:"SCREW"},
    {code:"13-0005", name:"Spacer - 4mm", category:"SCREW"},
    {code:"13-0004", name:"Spacer - 8mm", category:"SCREW"}
];

  productData.forEach(p => p.qty = p.qty || 0);

  const sidebar = document.getElementById('sidebar-menu');
  const content = document.getElementById('content-area');

  categoryConfig.forEach(cat => {
    const li = document.createElement('li');
    const a  = document.createElement('a');
    a.textContent = cat.name;
    a.dataset.cat = cat.name;
    li.appendChild(a);
    if (cat.sub) {
      const ul = document.createElement('ul');
      cat.sub.forEach(sub => {
        const subLi = document.createElement('li');
        const subA  = document.createElement('a');
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

  sidebar.addEventListener('click', e => {
    if (e.target.tagName !== 'A') return;
    sidebar.querySelectorAll('li').forEach(li => li.classList.remove('active'));
    e.target.parentNode.classList.add('active');
    const parent = e.target.dataset.cat;
    const sub    = e.target.dataset.sub;
    showSection(sub || parent);
  });

  function showSection(key) {
    content.innerHTML = '';
    const isSub = categoryConfig.some(c => c.sub && c.sub.includes(key));
    const items = isSub
      ? productData.filter(p => p.subCategory === key)
      : productData.filter(p => p.category === key);

    const section = document.createElement('div');
    section.className = 'product-section';
    section.innerHTML = `<h2>${key}</h2><div class="product-grid"></div>`;
    const grid = section.querySelector('.product-grid');

    items.forEach(p => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="img/${p.code}.png" alt="${p.code}">
        <div class="product-code">${p.code}</div>
        <div class="product-name">${p.name}</div>
        <div class="quantity-control">
          <button class="minus">−</button>
          <input type="number" min="0" value="${p.qty}">
          <button class="plus">＋</button>
        </div>
      `;
      grid.appendChild(card);

      const input = card.querySelector('input');
      input.addEventListener('input', () => {
        let v = Math.floor(Number(input.value));
        if (isNaN(v) || v < 0) v = 0;
        input.value = v;
        p.qty = v;
      });
      card.querySelector('.minus').onclick = () => {
        p.qty = Math.max(0, p.qty - 1);
        input.value = p.qty;
      };
      card.querySelector('.plus').onclick = () => {
        p.qty++;
        input.value = p.qty;
      };
    });

    content.appendChild(section);
  }

  const first = categoryConfig.find(c => !c.sub).name;
  showSection(first);
  document.querySelector(`nav.sidebar li > a[data-cat="${first}"]`)
          .parentNode.classList.add('active');

  function showExportModal(cb) {
    const m = document.createElement('div');
    m.style = `
      position:fixed;top:0;left:0;width:100%;height:100%;
      background:rgba(0,0,0,0.4);display:flex;
      justify-content:center;align-items:center;z-index:1000;
    `;
    m.innerHTML = `
      <div style="background:#fff;padding:20px;border-radius:8px;min-width:300px;">
        <h3>Export BOM</h3>
        <label>NAME: <input id="export-name" style="width:100%"></label><br><br>
        <label>FORMAT: 
          <select id="export-format" style="width:100%">
            <option value="pdf">PDF</option>
            <option value="docx">Word (docx)</option>
            <option value="xlsx">Excel (xlsx)</option>
          </select>
        </label><br><br>
        <button id="export-cancel">CANCEL</button>
        <button id="export-ok">CHECK</button>
      </div>`;
    document.body.appendChild(m);
    m.querySelector('#export-cancel').onclick = () => m.remove();
    m.querySelector('#export-ok').onclick = () => {
      const name = m.querySelector('#export-name').value.trim();
      const fmt  = m.querySelector('#export-format').value;
      m.remove();
      if (name) cb(name, fmt);
    };
  }

  document.querySelector('.export-btn').addEventListener('click', () => {
    showExportModal((userName, format) => {
      const sel = productData.filter(p => p.qty > 0);
      if (!sel.length) return alert("Didn't select any part yet.");
      if (format === 'pdf')  exportPDF(userName, sel);
      if (format === 'docx') exportDocx(userName, sel);
      if (format === 'xlsx') exportXlsx(userName, sel);
    });
  });

  async function exportPDF(userName, selected) {
    const container = document.createElement('div');
    container.style = `
      position:relative;width:210mm;min-height:297mm;
      padding:0;margin:0;font-family:"Microsoft JhengHei",sans-serif;
    `;
    container.innerHTML = `
      <div style="width:100%;background:#1e4f8a;color:#fff;
        text-align:center;padding:12px 0;font-size:18px;font-weight:bold;">
        MATRIX Bill of Material
      </div>
      <table style="width:100%;border:1px solid #000;
        border-collapse:collapse;font-size:12px;margin-top:8px;">
        <thead><tr>
          <th style="border:1px solid #000;padding:6px;width:15%;">IMAGE</th>
          <th style="border:1px solid #000;padding:6px;width:20%;">SKU</th>
          <th style="border:1px solid #000;padding:6px;width:50%;">NAME</th>
          <th style="border:1px solid #000;padding:6px;width:15%;">QTY</th>
        </tr></thead>
        <tbody>
          ${selected.map(p => `
            <tr>
              <td style="border:1px solid #000;padding:6px;text-align:center;">
                <img src="img/${p.code}.png" style="max-width:40px;max-height:40px;">
              </td>
              <td style="border:1px solid #000;padding:6px;text-align:center;">
                ${p.code}
              </td>
              <td style="border:1px solid #000;padding:6px;">
                ${p.name}
              </td>
              <td style="border:1px solid #000;padding:6px;text-align:center;">
                ${p.qty}
              </td>
            </tr>`
          ).join('')}
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
    const canvas = await html2canvas(container, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = (canvas.height * pdfW) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);
    pdf.save('MATRIX_BOM.pdf');
    document.body.removeChild(container);
  }

  async function fetchImageBuffer(url) {
    const res = await fetch(url);
    const buf = await res.arrayBuffer();
    return new Uint8Array(buf);
  }

  async function exportDocx(userName, selected) {
    const docxGlobal = window.docx;
    if (!docxGlobal) return alert('did not load word export lib, please make sure you inlude index.iife.js');
    const {
      Document, Packer, Paragraph,
      Table, TableRow, TableCell,
      ImageRun, WidthType, HeadingLevel
    } = docxGlobal;

    const buffers = await Promise.all(
      selected.map(p => fetchImageBuffer(`img/${p.code}.png`))
    );

    const rows = [
      new TableRow({
        children: [
          new TableCell({ children: [ new Paragraph('IMAGE') ] }),
          new TableCell({ children: [ new Paragraph('SKU') ] }),
          new TableCell({ children: [ new Paragraph('NAME') ] }),
          new TableCell({ children: [ new Paragraph('QTY') ] }),
        ]
      }),
      ...selected.map((p, i) => new TableRow({
        children: [
          new TableCell({ children: [
            new Paragraph({
              children: [
                new ImageRun({
                  data: buffers[i],
                  transformation: { width: 40, height: 40 }
                })
              ]
            })
          ]}),
          new TableCell({ children: [ new Paragraph(p.code) ] }),
          new TableCell({ children: [ new Paragraph(p.name) ] }),
          new TableCell({ children: [ new Paragraph(p.qty.toString()) ] }),
        ]
      }))
    ];

    const table = new Table({
      rows,
      width: { size: 100, type: WidthType.PERCENTAGE }
    });

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ text: 'MATRIX Bill of Material', heading: HeadingLevel.HEADING_1 }),
          new Paragraph(`Name: ${userName}`),
          new Paragraph(`Date: ${new Date().toLocaleDateString()}`),
          table
        ]
      }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, 'MATRIX_BOM.docx');
  }


  async function exportXlsx(userName, selected) {
    if (!window.ExcelJS || typeof saveAs !== 'function') {
      return alert('請確認已載入 exceljs.min.js 與 FileSaver.js');
    }
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('BOM');

    sheet.columns = [
      { header: 'IMAGE', key: 'image', width: 15 },
      { header: 'SKU',   key: 'sku',   width: 20 },
      { header: 'NAME',  key: 'name',  width: 50 },
      { header: 'QTY',   key: 'qty',   width: 10 },
    ];

    for (let i = 0; i < selected.length; i++) {
      const p = selected[i];
      const buf = await fetchImageBuffer(`img/${p.code}.png`);
      const imageId = workbook.addImage({ buffer: buf, extension: 'png' });
      const rowIndex = i + 2;

      sheet.addRow({ sku: p.code, name: p.name, qty: p.qty });
      sheet.addImage(imageId, {
        tl: { col: 0, row: rowIndex - 1 },
        ext: { width: 40, height: 40 }
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'MATRIX_BOM.xlsx');
  }

});
