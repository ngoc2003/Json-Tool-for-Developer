import { Metadata } from "next";
import { TransformClient } from "./client";

export const metadata: Metadata = {
  title: "JSON Transform - Format, Minify, Convert JSON & XML",
  description:
    "Free online JSON transformer. Minify, beautify, flatten, unflatten JSON. Convert JSON to TypeScript interfaces. Convert between JSON and XML formats. Sort object keys and escape/unescape strings.",
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
    "JSON to XML",
    "XML to JSON",
    "XML converter",
    "XML formatter",
  ],
  openGraph: {
    title: "JSON Transform - Format, Minify, Convert JSON & XML",
    description:
      "Free online JSON transformer with multiple operations: format, minify, flatten, TypeScript conversion, XML conversion, and more.",
  },
};

export default function TransformPage() {
  return <TransformClient />;
}
