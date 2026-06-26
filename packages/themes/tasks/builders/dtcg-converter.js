/**
 * Copyright IBM Corp. 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const fs = require('fs');
const path = require('path');

// Lazy-loaded colors DTCG JSON for alias resolution
let _colorTokens = null;

/**
 * Load and cache the colors DTCG JSON.
 * Returns a flat map of { 'blue.60': '#0f62fe', 'cool-gray.10': '#f2f4f8', ... }
 */
function getColorTokens() {
  if (_colorTokens) return _colorTokens;

  const colorsPath = path.resolve(__dirname, '../../src/dtcg/colors.json');
  const colorsJSON = JSON.parse(fs.readFileSync(colorsPath, 'utf8'));

  _colorTokens = {};

  function flattenColors(obj, prefix = '') {
    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith('$')) continue;
      const tokenPath = prefix ? `${prefix}.${key}` : key;
      if (value && typeof value === 'object' && value.$value !== undefined) {
        // Leaf token — resolve its value
        _colorTokens[tokenPath] = resolveDTCGColorValueRaw(value.$value);
      } else if (value && typeof value === 'object') {
        flattenColors(value, tokenPath);
      }
    }
  }

  flattenColors(colorsJSON);
  return _colorTokens;
}

/**
 * Resolve a raw DTCG color $value object (no alias resolution).
 * Used internally when building the color token map.
 */
function resolveDTCGColorValueRaw(dtcgValue) {
  if (
    dtcgValue === null ||
    typeof dtcgValue !== 'object' ||
    dtcgValue.colorSpace !== 'srgb' ||
    !Array.isArray(dtcgValue.components)
  ) {
    return dtcgValue;
  }

  if (typeof dtcgValue.hex === 'string') {
    return dtcgValue.hex;
  }

  const [r, g, b] = dtcgValue.components.map((c) => Math.round(c * 255));
  const alpha = dtcgValue.alpha !== undefined ? dtcgValue.alpha : 1;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Resolve a DTCG color $value to a CSS string.
 *
 * Handles three shapes:
 *   • '{blue.60}'                        → alias  → look up in colors.json
 *   • { colorSpace, components, hex }   → solid color  → use hex directly
 *   • { colorSpace, components, alpha } → alpha color  → rgba(r, g, b, alpha)
 *
 * @param {*} dtcgValue - The raw $value from a DTCG token
 * @returns {string|*} A CSS color string, or the original value unchanged.
 */
function resolveDTCGColorValue(dtcgValue) {
  // Handle alias references: '{blue.60}' → '#0f62fe'
  if (typeof dtcgValue === 'string') {
    const aliasMatch = dtcgValue.match(/^\{(.+)\}$/);
    if (aliasMatch) {
      const tokenPath = aliasMatch[1];
      const colorTokens = getColorTokens();
      const resolved = colorTokens[tokenPath];
      if (resolved === undefined) {
        throw new Error(
          `DTCG alias '{${tokenPath}}' could not be resolved. ` +
            `Check that '${tokenPath}' exists in src/dtcg/colors.json.`
        );
      }
      return resolved;
    }
    return dtcgValue;
  }

  return resolveDTCGColorValueRaw(dtcgValue);
}

/**
 * Convert DTCG format tokens to flat theme object
 * @param {Object} dtcgTokens - DTCG format token object
 * @returns {Object} Flat token map
 */
function convertDTCGToTheme(dtcgTokens) {
  const theme = {};

  // Extract color-scheme from top-level $extensions (DTCG metadata)
  const extensions = dtcgTokens.$extensions;
  if (extensions && extensions['com.ibm.carbon']) {
    const carbonExt = extensions['com.ibm.carbon'];
    if (carbonExt['color-scheme']) {
      theme['color-scheme'] = carbonExt['color-scheme'];
    }
  }

  function traverse(obj, path = []) {
    for (const [key, value] of Object.entries(obj)) {
      // Skip DTCG metadata keys
      if (key.startsWith('$')) {
        continue;
      }

      if (value && typeof value === 'object') {
        // Build token name from path.
        // Skip 'color' prefix EXCEPT for 'scheme' which should be 'color-scheme'
        let tokenPath = path;
        if (path[0] === 'color' && key !== 'scheme') {
          tokenPath = path.slice(1);
        }

        // Join all path segments and the current key with dashes.
        // The JS token metadata (v11TokenGroup.ts) is the naming authority:
        // it uses dashes before numbers, e.g. "layer-01", "field-hover-01",
        // "layer-accent-active-01". Pure-number keys ("01") in the JSON
        // become segments in the path and are joined the same way.
        const tokenPath2 = [...tokenPath, key];

        // If this node has a $value, register it as a token
        if (value.$value !== undefined) {
          theme[tokenPath2.join('-')] = resolveDTCGColorValue(value.$value);
        }

        // Also recurse into any non-$ children (a node can be both a token
        // and a group when nested themes use parent keys as token names too)
        const hasChildren = Object.keys(value).some((k) => !k.startsWith('$'));
        if (hasChildren) {
          traverse(value, tokenPath2);
        }
      }
    }
  }

  traverse(dtcgTokens);
  return theme;
}

/**
 * Convert DTCG component tokens to theme-specific format
 * @param {Object} dtcgTokens - DTCG component tokens
 * @returns {Object} Component tokens by theme
 */
function convertDTCGComponentTokens(dtcgTokens) {
  const componentTokens = {};

  function traverse(obj, path = []) {
    for (const [key, value] of Object.entries(obj)) {
      // Skip DTCG metadata keys except $extensions
      if (key.startsWith('$') && key !== '$extensions') {
        continue;
      }

      // If this has theme-specific values in extensions
      if (
        value &&
        typeof value === 'object' &&
        value.$extensions &&
        value.$extensions['carbon.themes']
      ) {
        const tokenName = [...path, key].join('-');
        // Resolve any alias references in per-theme values
        const rawThemeValues = value.$extensions['carbon.themes'];
        const resolvedThemeValues = {};
        for (const [theme, themeValue] of Object.entries(rawThemeValues)) {
          resolvedThemeValues[theme] = resolveDTCGColorValue(themeValue);
        }
        componentTokens[tokenName] = resolvedThemeValues;
      } else if (value && typeof value === 'object' && !key.startsWith('$')) {
        // Recurse into nested groups
        traverse(value, [...path, key]);
      }
    }
  }

  traverse(dtcgTokens);
  return componentTokens;
}

/**
 * Convert camelCase to kebab-case
 * @param {string} str
 * @returns {string}
 */
function camelToKebab(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Normalize theme names to match Carbon's SCSS naming convention for component tokens
 * This ensures compatibility with @carbon/styles which expects specific theme key names
 * @param {string} themeName - Theme name from DTCG (e.g., "white", "g10", "g90", "g100")
 * @returns {string} Normalized theme name (e.g., "white-theme", "g-10", "g-90", "g-100")
 */
function normalizeComponentThemeName(themeName) {
  // Convert "white" to "white-theme" to match existing convention
  if (themeName === 'white') {
    return 'white-theme';
  }

  // Convert "g10", "g90", "g100" to "g-10", "g-90", "g-100"
  // This matches the format expected by @carbon/styles component token lookups
  if (/^g\d+$/.test(themeName)) {
    return themeName.replace(/^g(\d+)$/, 'g-$1');
  }

  // For any other theme names, apply camelToKebab
  return camelToKebab(themeName);
}

module.exports = {
  resolveDTCGColorValue,
  convertDTCGToTheme,
  convertDTCGComponentTokens,
  camelToKebab,
  normalizeComponentThemeName,
};
