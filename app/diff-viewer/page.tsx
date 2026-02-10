import { Metadata } from "next";
import { DiffViewerClient } from "./client";

export const metadata: Metadata = {
  title: "JSON Diff Viewer - Compare JSON Files Visually",
  description:
    "Free online JSON diff viewer. Compare two JSON files side by side with visual highlighting. See additions, deletions, and changes at a glance.",
  keywords: [
    "JSON diff",
    "JSON compare",
    "compare JSON files",
    "JSON diff viewer",
    "visual JSON comparison",
    "JSON difference",
    "compare objects",
    "JSON comparison tool",
  ],
  openGraph: {
    title: "JSON Diff Viewer - Compare JSON Files Visually",
    description:
      "Compare two JSON files side by side with visual highlighting of differences.",
  },
};

export default function DiffViewerPage() {
  return <DiffViewerClient />;
}
