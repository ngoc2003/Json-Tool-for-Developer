import { Metadata } from "next";
import { I18nSyncClient } from "./client";

export const metadata: Metadata = {
  title: "i18n Sync - Synchronize Translation Files",
  description:
    "Synchronize your i18n translation files. Add missing keys, remove extra keys, and maintain consistent key ordering across all your locale files. Free online tool for developers.",
  keywords: [
    "i18n sync",
    "translation sync",
    "localization tool",
    "locale file sync",
    "missing translation keys",
    "i18n manager",
    "translation file comparison",
    "JSON translation",
  ],
  openGraph: {
    title: "i18n Sync - Synchronize Translation Files",
    description:
      "Free tool to synchronize i18n translation files. Add missing keys and maintain consistent structure.",
  },
};

export default function I18nSyncPage() {
  return <I18nSyncClient />;
}
