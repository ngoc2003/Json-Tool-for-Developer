"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Languages,
  ArrowLeftRight,
  FileJson2,
  GitCompare,
  Home,
  Sparkles,
  Search,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "@/contexts/LanguageContext";

const navigation = [
  {
    nameKey: "sidebar.dashboard",
    href: "/",
    icon: Home,
    color: "from-violet-500 to-purple-500",
    bgColor: "bg-violet-500/10",
    textColor: "text-violet-600 dark:text-violet-400",
  },
  {
    nameKey: "sidebar.i18nSync",
    href: "/i18n-sync",
    icon: Languages,
    descriptionKey: "sidebar.i18nSyncDesc",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-600 dark:text-blue-400",
  },
  {
    nameKey: "sidebar.transform",
    href: "/transform",
    icon: ArrowLeftRight,
    descriptionKey: "sidebar.transformDesc",
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    nameKey: "sidebar.diffViewer",
    href: "/diff-viewer",
    icon: GitCompare,
    descriptionKey: "sidebar.diffViewerDesc",
    color: "from-orange-500 to-amber-500",
    bgColor: "bg-orange-500/10",
    textColor: "text-orange-600 dark:text-orange-400",
  },
  {
    nameKey: "sidebar.keyCompare",
    href: "/key-compare",
    icon: Search,
    descriptionKey: "sidebar.keyCompareDesc",
    color: "from-rose-500 to-pink-500",
    bgColor: "bg-rose-500/10",
    textColor: "text-rose-600 dark:text-rose-400",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <aside className="w-64 border-r border-white/10 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col h-screen">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-shadow">
            <FileJson2 className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-white">JSON DevTool</span>
            <span className="text-[10px] text-slate-400 -mt-1">
              & i18n Manager
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-6">
        <nav className="px-3 space-y-2">
          <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            {t("sidebar.tools")}
          </p>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.nameKey}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                    : "text-slate-300 hover:text-white hover:bg-white/5",
                )}
              >
                <div
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    isActive ? "bg-white/20" : item.bgColor,
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-4 w-4",
                      isActive ? "text-white" : item.textColor,
                    )}
                  />
                </div>
                <div className="flex flex-col">
                  <span>{t(item.nameKey)}</span>
                  {item.descriptionKey && (
                    <span
                      className={cn(
                        "text-xs font-normal",
                        isActive ? "text-white/70" : "text-slate-500",
                      )}
                    >
                      {t(item.descriptionKey)}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Pro Badge */}
      <div className="px-3 pb-4">
        <div className="p-4 rounded-xl bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-violet-400" />
            <span className="text-sm font-semibold text-white">
              Free & Open Source
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {t("sidebar.proBadgeDescription")}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 text-xs text-slate-500">
        <p>Made with ❤️ for developers</p>
        <p className="text-slate-600">v1.0.0</p>
      </div>
    </aside>
  );
}
