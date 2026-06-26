/**
 * Copyright IBM Corp. 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

/**
 * Converts pre-resolved hex values in theme JSON files to DTCG alias references.
 *
 * For each token with a $value like { colorSpace: 'srgb', hex: '#0f62fe' },
 * looks up the hex in colors.json and replaces $value with '{blue.60}'.
 *
 * Alpha/rgba tokens and custom hex values not in colors.json are left as-is.
 *
 * Usage: babel-node tasks/convert-themes-to-aliases.js
 */

const fs = require('fs-extra');
const path = require('path');

const DTCG_DIR = path.resolve(__dirname, '../src/dtcg');
const COLORS_PATH = path.join(DTCG_DIR, 'colors.json');

const THEME_FILES = ['white.json', 'g10.json', 'g90.json', 'g100.json'].map(
  (f) => path.join(DTCG_DIR, f)
);

const COMPONENT_FILES = fs
  .readdirSync(path.join(DTCG_DIR, 'components'))
  .filter((f) => f.endsWith('.json'))
  .map((f) => path.join(DTCG_DIR, 'components', f));

/**
 * Build a reverse map: hex string → DTCG token path
 * e.g. '#0f62fe' → 'blue.60'
 */
function buildHexToPathMap(colorsJSON) {
  const map = {};

  function flatten(obj, prefix) {
    for (const [k, v] of Object.entries(obj)) {
      if (k.startsWith('$')) continue;
      const p = prefix ? `${prefix}.${k}` : k;
      if (v && typeof v === 'object' && v.$value !== undefined) {
        const hex = v.$value.hex;
        if (hex && !map[hex]) {
          // First match wins — keeps the most specific alias
          map[hex] = p;
        }
      } else if (v && typeof v === 'object') {
        flatten(v, p);
      }
    }
  }

  flatten(colorsJSON, '');
  return map;
}

/**
 * Recursively convert $value objects in a token tree to alias references.
 */
function convertToAliases(obj, hexToPath) {
  if (!obj || typeof obj !== 'object') return obj;

  const result = {};

  for (const [key, value] of Object.entries(obj)) {
    if (key === '$value' && value && typeof value === 'object') {
      // Only convert solid colors (those with hex) — leave alpha/rgba as-is
      if (value.colorSpace === 'srgb' && value.hex && hexToPath[value.hex]) {
        result[key] = `{${hexToPath[value.hex]}}`;
      } else {
        result[key] = value;
      }
    } else if (key === '$extensions' && value && value['carbon.themes']) {
      // Convert per-theme values in component tokens
      const convertedThemes = {};
      for (const [theme, themeValue] of Object.entries(
        value['carbon.themes']
      )) {
        if (typeof themeValue === 'string' && hexToPath[themeValue]) {
          convertedThemes[theme] = `{${hexToPath[themeValue]}}`;
        } else {
          convertedThemes[theme] = themeValue;
        }
      }
      result[key] = { ...value, 'carbon.themes': convertedThemes };
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      result[key] = convertToAliases(value, hexToPath);
    } else {
      result[key] = value;
    }
  }

  return result;
}

function main() {
  const colorsJSON = JSON.parse(fs.readFileSync(COLORS_PATH, 'utf8'));
  const hexToPath = buildHexToPathMap(colorsJSON);

  const allFiles = [...THEME_FILES, ...COMPONENT_FILES];

  for (const filePath of allFiles) {
    const original = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const converted = convertToAliases(original, hexToPath);
    fs.writeFileSync(filePath, JSON.stringify(converted, null, 2) + '\n');
    console.log(`✅ Converted ${path.relative(process.cwd(), filePath)}`);
  }

  console.log('\nDone! Theme JSON files now use alias references.');
}

main();
