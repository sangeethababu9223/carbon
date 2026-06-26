/**
 * Copyright IBM Corp. 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

/**
 * Generates src/dtcg/colors.json from @carbon/colors exports.
 *
 * The output is a DTCG-format JSON file where each primitive color is a token:
 *
 *   blue.60       → { "$value": "#0f62fe", "$type": "color" }
 *   blue.60-hover → { "$value": "#0050e6", "$type": "color" }
 *   cool-gray.10  → { "$value": "#f2f4f8", "$type": "color" }
 *
 * These tokens are used as aliases in the theme JSON files:
 *   "background-brand": { "$value": "{blue.60}" }
 */

const fs = require('fs-extra');
const path = require('path');
// Parse hex color exports directly from the TypeScript source
// rather than importing it (avoids TS compilation issues with `export type`)
const COLORS_SRC = path.resolve(__dirname, '../../colors/src/colors.ts');

function parseColorsFromSource() {
  const src = fs.readFileSync(COLORS_SRC, 'utf8');
  const result = {};
  // Match: export const <name> = '#<hex>';
  const re = /^export const (\w+) = '(#[0-9a-fA-F]{6})';/gm;
  let match;
  while ((match = re.exec(src)) !== null) {
    result[match[1]] = match[2];
  }
  return result;
}

const colors = parseColorsFromSource();

const OUT_PATH = path.resolve(__dirname, '../src/dtcg/colors.json');

/**
 * Convert a camelCase color export name to a DTCG token path.
 *
 * Rules:
 *   blue60        → { group: 'blue',      name: '60' }
 *   blue60Hover   → { group: 'blue',      name: '60-hover' }
 *   coolGray10    → { group: 'cool-gray', name: '10' }
 *   coolGray10Hover → { group: 'cool-gray', name: '10-hover' }
 *   black         → { group: null,        name: 'black' }
 *   blackHover    → { group: null,        name: 'black-hover' }
 *   black100      → { group: null,        name: 'black' }  (alias, skip)
 *   white0        → { group: null,        name: 'white' }  (alias, skip)
 *
 * Returns null for tokens that should be skipped (object groupings, aliases).
 */
function parseColorName(exportName) {
  // Skip object groupings (yellow, yellowHover, colors, hoverColors etc.)
  // These are handled by their individual named exports.
  // Note: black, white, blackHover, whiteHover are hex strings so we keep them.
  if (
    exportName === 'colors' ||
    exportName === 'hoverColors' ||
    /^(yellow|orange|red|magenta|purple|blue|cyan|teal|green|coolGray|gray|warmGray)(Hover)?$/.test(
      exportName
    )
  ) {
    return null;
  }

  // Skip aliases like black100, white0 (they point to the same value as black/white)
  if (exportName === 'black100' || exportName === 'white0') {
    return null;
  }

  const isHover = exportName.endsWith('Hover');
  const base = isHover ? exportName.slice(0, -5) : exportName;

  // Match: colorName + optional shade number e.g. blue60, coolGray10, warmGray100
  const match = base.match(
    /^(yellow|orange|red|magenta|purple|blue|cyan|teal|green|coolGray|gray|warmGray|black|white)(\d+)?$/
  );

  if (!match) {
    return null;
  }

  const [, colorName, shade] = match;

  // Convert camelCase color names to kebab-case
  const group = colorName.replace(/([A-Z])/g, '-$1').toLowerCase();

  if (shade) {
    // e.g. blue60 → group: 'blue', name: '60'
    // e.g. blue60Hover → group: 'blue', name: '60-hover'
    return {
      group,
      name: isHover ? `${shade}-hover` : shade,
    };
  } else {
    // e.g. black → group: null, name: 'black'
    // e.g. blackHover → group: null, name: 'black-hover'
    // e.g. whiteHover → group: null, name: 'white-hover'
    return {
      group: null,
      name: isHover ? `${group}-hover` : group,
    };
  }
}

function hexToComponents(hex) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  return [
    Math.round(r * 1000000) / 1000000,
    Math.round(g * 1000000) / 1000000,
    Math.round(b * 1000000) / 1000000,
  ];
}

function buildDTCGColors() {
  const dtcg = {
    $schema: 'https://tr.designtokens.org/format/',
    $description:
      'IBM Carbon primitive color tokens — generated from @carbon/colors. DO NOT EDIT.',
  };

  for (const [exportName, value] of Object.entries(colors)) {
    // Only process hex string values
    if (typeof value !== 'string' || !value.startsWith('#')) {
      continue;
    }

    const parsed = parseColorName(exportName);
    if (!parsed) continue;

    const { group, name } = parsed;
    const components = hexToComponents(value);

    const tokenDef = {
      $type: 'color',
      $value: {
        colorSpace: 'srgb',
        components,
        hex: value,
      },
    };

    if (group) {
      // Nested under color group e.g. blue.60
      if (!dtcg[group]) {
        dtcg[group] = {};
      }
      dtcg[group][name] = tokenDef;
    } else {
      // Top-level e.g. black, white, black-hover
      dtcg[name] = tokenDef;
    }
  }

  fs.ensureDirSync(path.dirname(OUT_PATH));
  fs.writeFileSync(OUT_PATH, JSON.stringify(dtcg, null, 2) + '\n');
  console.log(`✅ Generated ${OUT_PATH}`);
}

buildDTCGColors();
