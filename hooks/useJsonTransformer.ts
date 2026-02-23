"use client";

import { useState, useCallback, useMemo } from "react";
import {
  isValidJson,
  minifyJson,
  beautifyJson,
  sortObjectKeys,
  escapeJsonString,
  unescapeJsonString,
  jsonToXml,
  xmlToJson,
  isValidXml,
} from "@/utils/json-utils";
import { flattenObject, unflattenObject } from "@/utils/i18n-helper";
import type { TransformResult, TransformType } from "@/types";

interface UseJsonTransformerReturn {
  input: string;
  setInput: (value: string) => void;
  output: string;
  isValid: boolean;
  error: string | null;
  transform: (type: TransformType) => TransformResult;
  toMinify: () => TransformResult;
  toBeautify: (indent?: number) => TransformResult;
  toFlatten: () => TransformResult;
  toUnflatten: () => TransformResult;
  toSortKeys: () => TransformResult;
  toEscape: () => TransformResult;
  toUnescape: () => TransformResult;
  toTypeScript: () => TransformResult;
  toJsonToXml: () => TransformResult;
  toXmlToJson: () => TransformResult;
}

/**
 * Custom hook for JSON transformations
 */
export function useJsonTransformer(): UseJsonTransformerReturn {
  const [input, setInput] = useState<string>("");

  const isValid = useMemo(() => isValidJson(input), [input]);
  const error = useMemo(() => {
    if (!input.trim()) return null;
    try {
      JSON.parse(input);
      return null;
    } catch (e) {
      return e instanceof Error ? e.message : "Invalid JSON";
    }
  }, [input]);

  // Minify JSON
  const toMinify = useCallback((): TransformResult => {
    if (!isValid) {
      return { output: "", success: false, error: error || "Invalid JSON" };
    }
    return { output: minifyJson(input), success: true };
  }, [input, isValid, error]);

  // Beautify JSON
  const toBeautify = useCallback(
    (indent: number = 2): TransformResult => {
      if (!isValid) {
        return { output: "", success: false, error: error || "Invalid JSON" };
      }
      return { output: beautifyJson(input, indent), success: true };
    },
    [input, isValid, error],
  );

  // Flatten nested object
  const toFlatten = useCallback((): TransformResult => {
    if (!isValid) {
      return { output: "", success: false, error: error || "Invalid JSON" };
    }
    try {
      const obj = JSON.parse(input);
      const flat = flattenObject(obj);
      return { output: JSON.stringify(flat, null, 2), success: true };
    } catch (e) {
      return {
        output: "",
        success: false,
        error: e instanceof Error ? e.message : "Error flattening",
      };
    }
  }, [input, isValid, error]);

  // Unflatten flat object
  const toUnflatten = useCallback((): TransformResult => {
    if (!isValid) {
      return { output: "", success: false, error: error || "Invalid JSON" };
    }
    try {
      const obj = JSON.parse(input);
      const nested = unflattenObject(obj);
      return { output: JSON.stringify(nested, null, 2), success: true };
    } catch (e) {
      return {
        output: "",
        success: false,
        error: e instanceof Error ? e.message : "Error unflattening",
      };
    }
  }, [input, isValid, error]);

  // Sort object keys
  const toSortKeys = useCallback((): TransformResult => {
    if (!isValid) {
      return { output: "", success: false, error: error || "Invalid JSON" };
    }
    try {
      const obj = JSON.parse(input);
      const sorted = sortObjectKeys(obj);
      return { output: JSON.stringify(sorted, null, 2), success: true };
    } catch (e) {
      return {
        output: "",
        success: false,
        error: e instanceof Error ? e.message : "Error sorting",
      };
    }
  }, [input, isValid, error]);

  // Escape strings
  const toEscape = useCallback((): TransformResult => {
    return { output: escapeJsonString(input), success: true };
  }, [input]);

  // Unescape strings
  const toUnescape = useCallback((): TransformResult => {
    return { output: unescapeJsonString(input), success: true };
  }, [input]);

  // Convert to TypeScript interface
  const toTypeScript = useCallback((): TransformResult => {
    if (!isValid) {
      return { output: "", success: false, error: error || "Invalid JSON" };
    }
    try {
      const obj = JSON.parse(input);
      const ts = jsonToTypeScript(obj, "Root");
      return { output: ts, success: true };
    } catch (e) {
      return {
        output: "",
        success: false,
        error: e instanceof Error ? e.message : "Error converting",
      };
    }
  }, [input, isValid, error]);

  // Convert JSON to XML
  const toJsonToXml = useCallback((): TransformResult => {
    if (!isValid) {
      return { output: "", success: false, error: error || "Invalid JSON" };
    }
    try {
      const xml = jsonToXml(input);
      return { output: xml, success: true };
    } catch (e) {
      return {
        output: "",
        success: false,
        error: e instanceof Error ? e.message : "Error converting to XML",
      };
    }
  }, [input, isValid, error]);

  // Convert XML to JSON
  const toXmlToJson = useCallback((): TransformResult => {
    const isXmlValid = isValidXml(input);
    if (!isXmlValid && input.trim()) {
      return { output: "", success: false, error: "Invalid XML" };
    }
    if (!input.trim()) {
      return { output: "", success: false, error: "No XML input provided" };
    }
    try {
      const json = xmlToJson(input);
      return { output: json, success: true };
    } catch (e) {
      return {
        output: "",
        success: false,
        error: e instanceof Error ? e.message : "Error converting to JSON",
      };
    }
  }, [input]);

  // Generic transform function
  const transform = useCallback(
    (type: TransformType): TransformResult => {
      switch (type) {
        case "minify":
          return toMinify();
        case "beautify":
          return toBeautify();
        case "flatten":
          return toFlatten();
        case "unflatten":
          return toUnflatten();
        case "sort-keys":
          return toSortKeys();
        case "escape":
          return toEscape();
        case "unescape":
          return toUnescape();
        case "to-typescript":
          return toTypeScript();
        case "json-to-xml":
          return toJsonToXml();
        case "xml-to-json":
          return toXmlToJson();
        default:
          return {
            output: "",
            success: false,
            error: "Unknown transform type",
          };
      }
    },
    [
      toMinify,
      toBeautify,
      toFlatten,
      toUnflatten,
      toSortKeys,
      toEscape,
      toUnescape,
      toTypeScript,
      toJsonToXml,
      toXmlToJson,
    ],
  );

  return {
    input,
    setInput,
    output: isValid ? beautifyJson(input) : "",
    isValid,
    error,
    transform,
    toMinify,
    toBeautify,
    toFlatten,
    toUnflatten,
    toSortKeys,
    toEscape,
    toUnescape,
    toTypeScript,
    toJsonToXml,
    toXmlToJson,
  };
}

/**
 * Convert JSON object to TypeScript interface
 */
function jsonToTypeScript(
  obj: unknown,
  name: string = "Root",
  indent: number = 0,
): string {
  const spaces = "  ".repeat(indent);

  if (obj === null) return "null";
  if (typeof obj === "undefined") return "undefined";
  if (typeof obj === "string") return "string";
  if (typeof obj === "number") return "number";
  if (typeof obj === "boolean") return "boolean";

  if (Array.isArray(obj)) {
    if (obj.length === 0) return "unknown[]";
    const itemType = jsonToTypeScript(obj[0], name, indent);
    return `${itemType}[]`;
  }

  if (typeof obj === "object") {
    const entries = Object.entries(obj);
    if (entries.length === 0) return "Record<string, unknown>";

    const interfaces: string[] = [];
    const props = entries.map(([key, value]) => {
      const safeName = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key) ? key : `"${key}"`;

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        const nestedName = key.charAt(0).toUpperCase() + key.slice(1);
        interfaces.push(jsonToTypeScript(value, nestedName, 0));
        return `${spaces}  ${safeName}: ${nestedName};`;
      }

      const type = jsonToTypeScript(value, key, indent + 1);
      return `${spaces}  ${safeName}: ${type};`;
    });

    const mainInterface = `${spaces}interface ${name} {\n${props.join("\n")}\n${spaces}}`;

    if (indent === 0 && interfaces.length > 0) {
      return [...interfaces, mainInterface].join("\n\n");
    }

    return mainInterface;
  }

  return "unknown";
}
