import { useMemo } from "react";
import { flattenObject } from "@/utils/i18n-helper";

export type CompareStatus = "missing" | "untranslated" | "mismatch";

export interface CompareResult {
  key: string;
  status: CompareStatus;
  sourceVal: string;
  targetVal: string;
  placeholders?: {
    source: string[];
    target: string[];
  };
}

export interface CompareStats {
  total: number;
  missing: number;
  untranslated: number;
  mismatch: number;
}

/**
 * Extract placeholders like {{name}}, {count}, %s, %d from a string
 */
function extractPlaceholders(str: string): string[] {
  const patterns = [
    /\{\{(\w+)\}\}/g, // {{name}}
    /\{(\w+)\}/g, // {name}
    /%[sd]/g, // %s, %d
    /%\d*\$?[sd]/g, // %1$s, %2$d
  ];

  const placeholders: string[] = [];
  for (const pattern of patterns) {
    const matches = str.match(pattern);
    if (matches) {
      placeholders.push(...matches);
    }
  }
  return [...new Set(placeholders)].sort();
}

/**
 * Check if two arrays of placeholders match
 */
function placeholdersMatch(source: string[], target: string[]): boolean {
  if (source.length !== target.length) return false;
  return source.every((p, i) => p === target[i]);
}

/**
 * Hook to compare two i18n JSON objects and find issues
 * - Missing keys: keys in source but not in target
 * - Untranslated: keys exist in both but values are identical (not translated)
 * - Mismatch: placeholders differ between source and target
 */
export function useI18nCompare(
  sourceJson: string,
  targetJson: string,
): {
  results: CompareResult[];
  stats: CompareStats;
  error: string | null;
} {
  return useMemo(() => {
    const emptyStats: CompareStats = {
      total: 0,
      missing: 0,
      untranslated: 0,
      mismatch: 0,
    };

    if (!sourceJson.trim() || !targetJson.trim()) {
      return { results: [], stats: emptyStats, error: null };
    }

    try {
      const source = JSON.parse(sourceJson);
      const target = JSON.parse(targetJson);

      const flatSource = flattenObject(source);
      const flatTarget = flattenObject(target);

      const results: CompareResult[] = [];

      // Check all source keys
      for (const key in flatSource) {
        const sourceVal = flatSource[key];
        const targetVal = flatTarget[key];

        // Missing key
        if (!(key in flatTarget)) {
          results.push({
            key,
            status: "missing",
            sourceVal,
            targetVal: "",
          });
          continue;
        }

        // Check placeholders
        const sourcePlaceholders = extractPlaceholders(sourceVal);
        const targetPlaceholders = extractPlaceholders(targetVal);

        if (
          sourcePlaceholders.length > 0 &&
          !placeholdersMatch(sourcePlaceholders, targetPlaceholders)
        ) {
          results.push({
            key,
            status: "mismatch",
            sourceVal,
            targetVal,
            placeholders: {
              source: sourcePlaceholders,
              target: targetPlaceholders,
            },
          });
          continue;
        }

        // Untranslated (same value)
        if (sourceVal === targetVal && sourceVal.trim() !== "") {
          results.push({
            key,
            status: "untranslated",
            sourceVal,
            targetVal,
          });
        }
      }

      // Sort by status priority: missing > mismatch > untranslated
      const statusOrder: Record<CompareStatus, number> = {
        missing: 0,
        mismatch: 1,
        untranslated: 2,
      };
      results.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

      const stats: CompareStats = {
        total: results.length,
        missing: results.filter((r) => r.status === "missing").length,
        untranslated: results.filter((r) => r.status === "untranslated").length,
        mismatch: results.filter((r) => r.status === "mismatch").length,
      };

      return { results, stats, error: null };
    } catch (e) {
      return {
        results: [],
        stats: emptyStats,
        error: e instanceof Error ? e.message : "Invalid JSON",
      };
    }
  }, [sourceJson, targetJson]);
}
