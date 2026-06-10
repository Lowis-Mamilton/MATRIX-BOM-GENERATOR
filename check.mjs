import fs from "fs";
import path from "path";

const imgDir = "img";
const imgFiles = fs.readdirSync(imgDir);
const imgFilesLower = new Set(imgFiles.map(f => f.toLowerCase()));

function extractBlock(src, marker) {
  const start = src.indexOf(marker);
  const arrStart = src.indexOf("[", start);
  let depth = 0, i = arrStart, end = -1;
  for (; i < src.length; i++) {
    if (src[i] === "[") depth++;
    else if (src[i] === "]") { depth--; if (depth === 0) { end = i; break; } }
  }
  return src.slice(arrStart, end + 1);
}

function extractProducts(arrText) {
  // extract each top-level object literal { ... }
  const objs = [];
  let depth = 0, startIdx = -1;
  for (let i = 0; i < arrText.length; i++) {
    const ch = arrText[i];
    if (ch === "{") { if (depth === 0) startIdx = i; depth++; }
    else if (ch === "}") { depth--; if (depth === 0) objs.push(arrText.slice(startIdx, i + 1)); }
  }
  return objs.map(o => {
    const code = o.match(/code:\s*"([^"]+)"/)?.[1];
    const category = o.match(/category:\s*"([^"]+)"/)?.[1];
    const subCategory = o.match(/subCategory:\s*"([^"]+)"/)?.[1];
    return { code, category, subCategory, raw: o };
  });
}

for (const file of ["script.js", "shopscript.js"]) {
  console.log(`\n=== ${file} ===`);
  const src = fs.readFileSync(file, "utf8");
  const productArr = extractBlock(src, "const productData = [");
  const products = extractProducts(productArr);
  const codes = products.map(p => p.code);
  console.log("Total products:", codes.length);

  // duplicates
  const seen = new Map();
  for (const c of codes) seen.set(c, (seen.get(c) || 0) + 1);
  const dups = [...seen.entries()].filter(([, n]) => n > 1);
  console.log("Duplicate codes:", dups.length ? dups : "none");

  // missing images
  const missingExact = codes.filter(c => !imgFiles.includes(`${c}.png`));
  console.log("Missing 'CODE.png' file:", missingExact.length ? missingExact : "none");

  // categoryConfig
  const catArr = extractBlock(src, "const categoryConfig = [");
  const catObjs = [...catArr.matchAll(/\{\s*name:\s*"([^"]+)"(?:\s*,\s*sub:\s*(\[[^\]]*\]))?\s*\}/g)];
  const catNames = new Set();
  const subNames = new Set();
  for (const m of catObjs) {
    catNames.add(m[1]);
    if (m[2]) {
      const subs = [...m[2].matchAll(/"([^"]+)"/g)].map(s => s[1]);
      subs.forEach(s => subNames.add(s));
    }
  }

  // products whose category isn't in categoryConfig (orphans, never shown)
  const orphanCategory = products.filter(p => !catNames.has(p.category)).map(p => `${p.code} (category=${p.category})`);
  console.log("Products with category not in categoryConfig (unreachable):", orphanCategory.length ? orphanCategory : "none");

  // products with subCategory not declared under their category's sub list
  const orphanSub = products.filter(p => p.subCategory && !subNames.has(p.subCategory)).map(p => `${p.code} (subCategory=${p.subCategory})`);
  console.log("Products with subCategory not in any categoryConfig.sub (unreachable):", orphanSub.length ? orphanSub : "none");

  // categories declared with sub, but products under that category use plain 'category' filter too (since isSub filters by subCategory only)
  const catsWithSub = new Set();
  for (const m of catObjs) if (m[2]) catsWithSub.add(m[1]);
  const productsInSubCatWithoutSubCategory = products.filter(p => catsWithSub.has(p.category) && !p.subCategory).map(p => `${p.code} (category=${p.category}, no subCategory)`);
  console.log("Products in a sub-categorized category but missing subCategory (unreachable):", productsInSubCatWithoutSubCategory.length ? productsInSubCatWithoutSubCategory : "none");
}
