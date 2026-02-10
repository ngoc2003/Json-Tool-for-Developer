/**
 * JSON utility functions for validation, formatting, and transformation
 */

/**
 * Check if a string is valid JSON
 */
export function isValidJson(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Parse JSON safely with error handling
 */
export function safeJsonParse<T = unknown>(
  str: string,
): { success: true; data: T } | { success: false; error: string } {
  try {
    const data = JSON.parse(str) as T;
    return { success: true, data };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Invalid JSON",
    };
  }
}

/**
 * Minify JSON string (remove whitespace)
 */
export function minifyJson(json: string): string {
  try {
    return JSON.stringify(JSON.parse(json));
  } catch {
    return json;
  }
}

/**
 * Beautify/format JSON string with indentation
 */
export function beautifyJson(json: string, indent: number = 2): string {
  try {
    return JSON.stringify(JSON.parse(json), null, indent);
  } catch {
    return json;
  }
}

/**
 * Sort object keys alphabetically (recursive)
 */
export function sortObjectKeys<T extends Record<string, unknown>>(obj: T): T {
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
    return obj;
  }

  const sorted = {} as T;
  const keys = Object.keys(obj).sort();

  for (const key of keys) {
    const value = obj[key];
    sorted[key as keyof T] = (
      typeof value === "object" && value !== null && !Array.isArray(value)
        ? sortObjectKeys(value as Record<string, unknown>)
        : value
    ) as T[keyof T];
  }

  return sorted;
}

/**
 * Escape special characters in JSON string values
 */
export function escapeJsonString(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t");
}

/**
 * Unescape special characters in JSON string values
 */
export function unescapeJsonString(str: string): string {
  return str
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\");
}

/**
 * Count keys in a JSON object (recursive)
 */
export function countKeys(obj: Record<string, unknown>): number {
  let count = 0;

  for (const key in obj) {
    count++;
    const value = obj[key];
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      count += countKeys(value as Record<string, unknown>);
    }
  }

  return count;
}

/**
 * Get all key paths from a nested object
 */
export function getKeyPaths(
  obj: Record<string, unknown>,
  prefix: string = "",
): string[] {
  const paths: string[] = [];

  for (const key in obj) {
    const path = prefix ? `${prefix}.${key}` : key;
    paths.push(path);

    const value = obj[key];
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      paths.push(...getKeyPaths(value as Record<string, unknown>, path));
    }
  }

  return paths;
}
