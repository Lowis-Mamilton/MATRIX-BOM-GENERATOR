import fs from "fs";
import path from "path";

const imgDir = "img";
const imgFiles = fs.readdirSync(imgDir);
const imgFilesLower = new Set(imgFiles.map(f => f.toLowerCase()));

function extractProductData(file) {
  const src = fs.readFileSync(file, "utf8");
  const start = src.indexOf("const productData = [");
  const arrStart = src.indexOf("[", start);
  // find matching closing bracket
  let depth = 0, i = arrStart, end = -1;
  for (; i < src.length; i++) {
    if (src[i] === "[") depth++;
    else if (src[i] === "]") { depth--; if (depth === 0) { end = i; break; } }
  }
  const arrText = src.slice(arrStart, end + 1);
  // extract code values
  const codes = [...arrText.matchAll(/code:\s*"([^"]+)"/g)].map(m => m[1]);
  return codes;
}

for (const file of ["script.js", "shopscript.js"]) {
  console.log(`\n=== ${file} ===`);
  const codes = extractProductData(file);
  console.log("Total products:", codes.length);

  // duplicates
  const seen = new Map();
  for (const c of codes) seen.set(c, (seen.get(c) || 0) + 1);
  const dups = [...seen.entries()].filter(([, n]) => n > 1);
  if (dups.length) {
    console.log("Duplicate codes:", dups);
  } else {
    console.log("No duplicate codes.");
  }

  // missing images (case-sensitive exact match)
  const missingExact = codes.filter(c => !imgFiles.includes(`${c}.png`));
  console.log("Missing exact 'CODE.png' file:", missingExact);

  // case-insensitive check for those missing exact
  const missingCaseInsensitive = missingExact.filter(c => !imgFilesLower.has(`${c}.png`.toLowerCase()));
  console.log("Truly missing (case-insensitive too):", missingCaseInsensitive);

  const caseMismatch = missingExact.filter(c => imgFilesLower.has(`${c}.png`.toLowerCase()));
  console.log("Case-mismatch only (works on Windows, breaks on case-sensitive hosting):", caseMismatch);
}
