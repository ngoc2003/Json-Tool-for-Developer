/**
 * i18n helper functions for flattening, unflattening, and comparing objects
 */

/**
 * Flatten a nested object into a single-level object with dot notation keys
 * Example: { a: { b: 1 } } => { 'a.b': 1 }
 */
export function flattenObject(
  obj: Record<string, unknown>,
  prefix: string = "",
  separator: string = ".",
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const key in obj) {
    const value = obj[key];
    const newKey = prefix ? `${prefix}${separator}${key}` : key;

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      Object.assign(
        result,
        flattenObject(value as Record<string, unknown>, newKey, separator),
      );
    } else {
      result[newKey] = String(value);
    }
  }

  return result;
}

/**
 * Unflatten a flat object with dot notation keys into a nested object
 * Example: { 'a.b': 1 } => { a: { b: 1 } }
 */
export function unflattenObject(
  obj: Record<string, string>,
  separator: string = ".",
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const flatKey in obj) {
    const keys = flatKey.split(separator);
    let current = result;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current)) {
        current[key] = {};
      }
      current = current[key] as Record<string, unknown>;
    }

    current[keys[keys.length - 1]] = obj[flatKey];
  }

  return result;
}

/**
 * Deep compare two objects and return differences
 */
export interface DiffResult {
  added: Record<string, unknown>; // Keys in obj2 but not in obj1
  removed: Record<string, unknown>; // Keys in obj1 but not in obj2
  changed: Record<string, { old: unknown; new: unknown }>; // Keys with different values
  unchanged: Record<string, unknown>; // Keys with same values
}

export function deepCompare(
  obj1: Record<string, unknown>,
  obj2: Record<string, unknown>,
): DiffResult {
  const flat1 = flattenObject(obj1);
  const flat2 = flattenObject(obj2);

  const allKeys = new Set([...Object.keys(flat1), ...Object.keys(flat2)]);

  const result: DiffResult = {
    added: {},
    removed: {},
    changed: {},
    unchanged: {},
  };

  for (const key of allKeys) {
    const inObj1 = key in flat1;
    const inObj2 = key in flat2;

    if (!inObj1 && inObj2) {
      result.added[key] = flat2[key];
    } else if (inObj1 && !inObj2) {
      result.removed[key] = flat1[key];
    } else if (flat1[key] !== flat2[key]) {
      result.changed[key] = { old: flat1[key], new: flat2[key] };
    } else {
      result.unchanged[key] = flat1[key];
    }
  }

  return result;
}

/**
 * Get statistics about the comparison
 */
export interface DiffStats {
  totalKeys: number;
  addedCount: number;
  removedCount: number;
  changedCount: number;
  unchangedCount: number;
}

export function getDiffStats(diff: DiffResult): DiffStats {
  return {
    totalKeys:
      Object.keys(diff.added).length +
      Object.keys(diff.removed).length +
      Object.keys(diff.changed).length +
      Object.keys(diff.unchanged).length,
    addedCount: Object.keys(diff.added).length,
    removedCount: Object.keys(diff.removed).length,
    changedCount: Object.keys(diff.changed).length,
    unchangedCount: Object.keys(diff.unchanged).length,
  };
}

/**
 * Convert flat object to CSV format
 */
export function flatToCSV(flat: Record<string, string>): string {
  const lines = ["key,value"];

  for (const key in flat) {
    const escapedValue = flat[key].replace(/"/g, '""');
    lines.push(`"${key}","${escapedValue}"`);
  }

  return lines.join("\n");
}

/**
 * Parse CSV to flat object
 */
export function csvToFlat(csv: string): Record<string, string> {
  const result: Record<string, string> = {};
  const lines = csv.split("\n");

  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple CSV parsing (assumes properly formatted)
    const match = line.match(/^"([^"]+)","(.*)"/);
    if (match) {
      result[match[1]] = match[2].replace(/""/g, '"');
    }
  }

  return result;
}
