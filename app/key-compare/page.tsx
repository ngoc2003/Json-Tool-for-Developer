import type { Metadata } from "next";
import { KeyCompareClient } from "./client";

export const metadata: Metadata = {
  title: "Key Compare & Deep Audit",
  description:
    "Compare i18n translation files to find missing keys, untranslated values, and placeholder mismatches",
  keywords: [
    "i18n compare",
    "translation audit",
    "missing keys",
    "placeholder check",
    "localization",
  ],
};

export default function KeyComparePage() {
  return <KeyCompareClient />;
}
