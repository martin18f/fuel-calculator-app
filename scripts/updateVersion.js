// scripts/updateVersion.js

const fs = require('fs');
const path = require('path');

// 1) Načítame package.json
const packageJsonPath = path.resolve(__dirname, '..', 'package.json');
const packageData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// 2) Zvýšime verziu o 0.0.1
// Ak je v package.json "version": "1.0.5", urobíme z toho "1.0.6"
const versionParts = packageData.version.split('.');
versionParts[2] = parseInt(versionParts[2]) + 1;   // meníme patch verziu
packageData.version = versionParts.join('.');

// 3) Build date (aktuálny dátum/čas)
const now = new Date();
const buildDate = now.toISOString().substring(0, 10); 
// Napr. "2025-02-16". Môžeš pridať aj čas, ak chceš:
// const buildDate = now.toLocaleString('sk-SK'); // "16. 2. 2025 14:35:12"

// 4) Zapíš späť do package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageData, null, 2), 'utf8');

// 5) Vygeneruj versions.js (alebo .ts) 
const versionsJsPath = path.resolve(__dirname, '..', 'src', 'versions.js');

const versionsJsContent = `
// AUTOGENEROVANÝ SÚBOR (scripts/updateVersion.js)

// Hodnoty slúžia na zobrazenie vo footeri.
export const APP_VERSION = "${packageData.version}";
export const BUILD_DATE = "${buildDate}";
`;

fs.writeFileSync(versionsJsPath, versionsJsContent, 'utf8');

console.log(`\n>>> Version updated to ${packageData.version}. BUILD_DATE = ${buildDate}\n`);
