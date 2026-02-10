/**
 * i18n synchronization logic for comparing and syncing translation files
 */

export interface SyncResult {
  /** Synchronized target object with all keys from source */
  synced: Record<string, unknown>;
  /** Keys that were added from source */
  addedKeys: string[];
  /** Keys that were removed from target (if removeExtra is true) */
  removedKeys: string[];
  /** Keys that exist in both */
  matchedKeys: string[];
}

export interface SyncOptions {
  /** Whether to remove keys that exist in target but not in source */
  removeExtra?: boolean;
  /** Whether to sort keys alphabetically instead of following source order */
  sortAlphabetically?: boolean;
}

/**
 * Synchronize i18n translation files
 *
 * This function:
 * - Adds missing keys from source to target (with source values as placeholders)
 * - Preserves existing target values
 * - Optionally removes extra keys not in source
 * - Orders keys to match source structure
 *
 * @param source - The source/reference translation object
 * @param target - The target translation object to sync
 * @param options - Sync options
 * @returns SyncResult with synced object and change details
 */
export function syncI18n(
  source: Record<string, unknown>,
  target: Record<string, unknown>,
  options: SyncOptions = {},
): SyncResult {
  const { removeExtra = false, sortAlphabetically = false } = options;

  const addedKeys: string[] = [];
  const removedKeys: string[] = [];
  const matchedKeys: string[] = [];

  function syncRecursive(
    src: Record<string, unknown>,
    tgt: Record<string, unknown>,
    path: string = "",
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    // Get keys in the correct order
    const sourceKeys = Object.keys(src);
    const targetKeys = Object.keys(tgt);

    // Track which target keys are not in source
    const extraKeys = targetKeys.filter((k) => !sourceKeys.includes(k));

    // Process keys in source order
    const orderedKeys = sortAlphabetically
      ? [...sourceKeys].sort()
      : sourceKeys;

    for (const key of orderedKeys) {
      const currentPath = path ? `${path}.${key}` : key;
      const sourceValue = src[key];
      const targetValue = tgt[key];

      if (
        typeof sourceValue === "object" &&
        sourceValue !== null &&
        !Array.isArray(sourceValue)
      ) {
        // Nested object - recurse
        const targetObj =
          typeof targetValue === "object" &&
          targetValue !== null &&
          !Array.isArray(targetValue)
            ? (targetValue as Record<string, unknown>)
            : {};

        result[key] = syncRecursive(
          sourceValue as Record<string, unknown>,
          targetObj,
          currentPath,
        );
      } else {
        // Leaf value
        if (key in tgt) {
          // Key exists in target - keep target value
          result[key] = targetValue;
          matchedKeys.push(currentPath);
        } else {
          // Key missing in target - add from source
          result[key] = sourceValue;
          addedKeys.push(currentPath);
        }
      }
    }

    // Handle extra keys (only if not removing them)
    if (!removeExtra) {
      for (const key of extraKeys) {
        result[key] = tgt[key];
      }
    } else {
      for (const key of extraKeys) {
        const currentPath = path ? `${path}.${key}` : key;
        removedKeys.push(currentPath);
      }
    }

    return result;
  }

  const synced = syncRecursive(source, target);

  return {
    synced,
    addedKeys,
    removedKeys,
    matchedKeys,
  };
}

/**
 * Find keys that are in source but not in target
 */
export function findMissingKeys(
  source: Record<string, unknown>,
  target: Record<string, unknown>,
  path: string = "",
): string[] {
  const missing: string[] = [];

  for (const key in source) {
    const currentPath = path ? `${path}.${key}` : key;
    const sourceValue = source[key];
    const targetValue = target[key];

    if (!(key in target)) {
      missing.push(currentPath);
    } else if (
      typeof sourceValue === "object" &&
      sourceValue !== null &&
      !Array.isArray(sourceValue)
    ) {
      if (
        typeof targetValue === "object" &&
        targetValue !== null &&
        !Array.isArray(targetValue)
      ) {
        missing.push(
          ...findMissingKeys(
            sourceValue as Record<string, unknown>,
            targetValue as Record<string, unknown>,
            currentPath,
          ),
        );
      }
    }
  }

  return missing;
}

/**
 * Find keys that are in target but not in source (extra keys)
 */
export function findExtraKeys(
  source: Record<string, unknown>,
  target: Record<string, unknown>,
  path: string = "",
): string[] {
  const extra: string[] = [];

  for (const key in target) {
    const currentPath = path ? `${path}.${key}` : key;
    const sourceValue = source[key];
    const targetValue = target[key];

    if (!(key in source)) {
      extra.push(currentPath);
    } else if (
      typeof targetValue === "object" &&
      targetValue !== null &&
      !Array.isArray(targetValue)
    ) {
      if (
        typeof sourceValue === "object" &&
        sourceValue !== null &&
        !Array.isArray(sourceValue)
      ) {
        extra.push(
          ...findExtraKeys(
            sourceValue as Record<string, unknown>,
            targetValue as Record<string, unknown>,
            currentPath,
          ),
        );
      }
    }
  }

  return extra;
}
