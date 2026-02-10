import { Metadata } from "next";
import { HomeClient } from "./home-client";

export const metadata: Metadata = {
  title: {
    absolute:
      "JSON DevTool & i18n Manager - Online JSON Editor and Translation Sync Tool",
  },
  description:
    "JSON DevTool & i18n Manager - Your all-in-one toolkit for JSON manipulation and translation file synchronization.",
};

export default function HomePage() {
  return <HomeClient />;
}
