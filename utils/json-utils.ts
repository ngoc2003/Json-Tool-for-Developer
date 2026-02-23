/**
 * JSON utility functions for validation, formatting, and transformation
 */

import { XMLParser, XMLBuilder } from "fast-xml-parser";

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
 * Check if a string is valid XML
 */
export function isValidXml(str: string): boolean {
  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      allowBooleanAttributes: true,
    });
    parser.parse(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Convert JSON to XML
 */
export function jsonToXml(json: string): string {
  try {
    const obj = JSON.parse(json);
    const builder = new XMLBuilder({
      ignoreAttributes: false,
      format: true,
      indentBy: "  ",
      suppressEmptyNode: true,
    });
    return builder.build(obj);
  } catch (error) {
    throw new Error(
      `JSON to XML conversion failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Convert XML to JSON
 */
export function xmlToJson(xml: string): string {
  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      allowBooleanAttributes: true,
      parseTagValue: true,
      parseAttributeValue: true,
      trimValues: true,
    });
    const obj = parser.parse(xml);
    return JSON.stringify(obj, null, 2);
  } catch (error) {
    throw new Error(
      `XML to JSON conversion failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
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
