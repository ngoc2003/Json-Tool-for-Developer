"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useSyncExternalStore,
  ReactNode,
} from "react";
import en from "@/locales/en.json";
import vi from "@/locales/vi.json";

export type Locale = "en" | "vi";

type TranslationValue = string | Record<string, unknown>;
type Translations = Record<
  string,
  TranslationValue | Record<string, TranslationValue>
>;

const translations: Record<Locale, Translations> = {
  en: en as Translations,
  vi: vi as Translations,
};

export const localeNames: Record<Locale, string> = {
  en: "English",
  vi: "Tiếng Việt",
};

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

/**
 * Get nested value from object using dot notation
 */
function getNestedValue(obj: Translations, path: string): string | undefined {
  const keys = path.split(".");
  let current: unknown = obj;

  for (const key of keys) {
    if (
      current &&
      typeof current === "object" &&
      key in (current as Record<string, unknown>)
    ) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }

  return typeof current === "string" ? current : undefined;
}

/**
 * Replace placeholders like {{name}} with values
 */
function interpolate(
  template: string,
  params?: Record<string, string | number>,
): string {
  if (!params) return template;

  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return params[key] !== undefined ? String(params[key]) : `{{${key}}}`;
  });
}

// Subscribe function for useSyncExternalStore (no-op since we don't need external updates)
const emptySubscribe = () => () => {};

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Use useSyncExternalStore to safely detect client-side hydration
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === "undefined") return "en";
    const savedLocale = localStorage.getItem("locale") as Locale | null;
    return savedLocale === "en" || savedLocale === "vi" ? savedLocale : "en";
  });

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
    document.documentElement.lang = newLocale;
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const value = getNestedValue(translations[locale], key);
      if (value === undefined) {
        console.warn(`Translation missing: ${key}`);
        return key;
      }
      return interpolate(value, params);
    },
    [locale],
  );

  // Prevent hydration mismatch - use "en" on server
  const effectiveLocale = isClient ? locale : "en";

  return (
    <LanguageContext.Provider value={{ locale: effectiveLocale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
