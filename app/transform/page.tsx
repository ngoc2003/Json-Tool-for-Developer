import { Metadata } from "next";
import { TransformClient } from "./client";

export const metadata: Metadata = {
  title: "JSON Transform - Format, Minify, Convert JSON",
  description:
    "Free online JSON transformer. Minify, beautify, flatten, unflatten JSON. Convert JSON to TypeScript interfaces. Sort object keys and escape/unescape strings.",
  keywords: [
    "JSON formatter",
    "JSON minify",
    "JSON beautify",
    "flatten JSON",
    "unflatten JSON",
    "JSON to TypeScript",
    "JSON transformer",
    "JSON converter",
    "sort JSON keys",
    "escape JSON",
  ],
  openGraph: {
    title: "JSON Transform - Format, Minify, Convert JSON",
    description:
      "Free online JSON transformer with multiple operations: format, minify, flatten, TypeScript conversion, and more.",
  },
};

export default function TransformPage() {
  return <TransformClient />;
}
