"use client";

import { Moon, Sun, Github, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback, useSyncExternalStore } from "react";
import {
  useTranslation,
  localeNames,
  Locale,
} from "@/contexts/LanguageContext";

function getThemeSnapshot(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function subscribeToTheme(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

export function Header() {
  const { t, locale, setLocale } = useTranslation();
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    () => "light",
  );

  const toggleTheme = useCallback(() => {
    const newTheme = theme === "light" ? "dark" : "light";
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", newTheme);
  }, [theme]);

  return (
    <header className="h-16 border-b border-border/50 bg-gradient-to-r from-background via-background to-violet-50/50 dark:to-violet-950/20 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 animate-pulse" />
          <h1 className="text-lg font-semibold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            {t("header.title")}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Language Selector */}
        <Select
          value={locale}
          onValueChange={(value) => setLocale(value as Locale)}
        >
          <SelectTrigger className="h-9 bg-transparent border-border/50 hover:bg-violet-100 dark:hover:bg-violet-900/30">
            <Languages className="h-4 w-4 mr-2 text-violet-600 dark:text-violet-400" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(localeNames) as Locale[]).map((key) => (
              <SelectItem key={key} value={key}>
                {localeNames[key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={t("header.toggleTheme")}
              className="hover:bg-violet-100 dark:hover:bg-violet-900/30"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4 text-violet-600" />
              ) : (
                <Sun className="h-4 w-4 text-amber-400" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("header.toggleTheme")}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("header.github")}
              >
                <Github className="h-4 w-4" />
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("header.github")}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
