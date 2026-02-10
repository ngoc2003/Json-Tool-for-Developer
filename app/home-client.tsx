"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Languages,
  ArrowLeftRight,
  GitCompare,
  FileJson2,
  Zap,
  Globe,
  Sparkles,
  Search,
} from "lucide-react";
import { useTranslation } from "@/contexts/LanguageContext";

const features = [
  {
    titleKey: "features.i18nSync.title",
    descriptionKey: "features.i18nSync.description",
    icon: Languages,
    href: "/i18n-sync",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-500/10 to-cyan-500/10",
    shadowColor: "shadow-blue-500/20",
    iconBg: "bg-gradient-to-br from-blue-500 to-cyan-500",
  },
  {
    titleKey: "features.transform.title",
    descriptionKey: "features.transform.description",
    icon: ArrowLeftRight,
    href: "/transform",
    gradient: "from-emerald-500 to-teal-500",
    bgGradient: "from-emerald-500/10 to-teal-500/10",
    shadowColor: "shadow-emerald-500/20",
    iconBg: "bg-gradient-to-br from-emerald-500 to-teal-500",
  },
  {
    titleKey: "features.diffViewer.title",
    descriptionKey: "features.diffViewer.description",
    icon: GitCompare,
    href: "/diff-viewer",
    gradient: "from-orange-500 to-amber-500",
    bgGradient: "from-orange-500/10 to-amber-500/10",
    shadowColor: "shadow-orange-500/20",
    iconBg: "bg-gradient-to-br from-orange-500 to-amber-500",
  },
  {
    titleKey: "features.keyCompare.title",
    descriptionKey: "features.keyCompare.description",
    icon: Search,
    href: "/key-compare",
    gradient: "from-rose-500 to-pink-500",
    bgGradient: "from-rose-500/10 to-pink-500/10",
    shadowColor: "shadow-rose-500/20",
    iconBg: "bg-gradient-to-br from-rose-500 to-pink-500",
  },
];

const highlights = [
  {
    titleKey: "highlights.fast.title",
    descriptionKey: "highlights.fast.description",
    icon: Zap,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    titleKey: "highlights.i18n.title",
    descriptionKey: "highlights.i18n.description",
    icon: Globe,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    titleKey: "highlights.devFriendly.title",
    descriptionKey: "highlights.devFriendly.description",
    icon: FileJson2,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
];

export function HomeClient() {
  const { t } = useTranslation();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 blur-xl opacity-50 animate-pulse" />
            <div className="relative p-4 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl shadow-2xl shadow-violet-500/30">
              <FileJson2 className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
              {t("dashboard.freeOpenSource")}
            </span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-violet-800 to-purple-900 dark:from-white dark:via-violet-200 dark:to-purple-200 bg-clip-text text-transparent">
            {t("dashboard.heroTitle")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("dashboard.heroSubtitle")}
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => {
          const title = t(feature.titleKey);
          return (
            <Card
              key={feature.titleKey}
              className={`group relative overflow-hidden hover:shadow-xl ${feature.shadowColor} transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br ${feature.bgGradient}`}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-xl ${feature.iconBg} shadow-lg`}
                  >
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-lg">{title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-sm">
                  {t(feature.descriptionKey)}
                </CardDescription>
                <Link
                  href={feature.href}
                  className={`flex items-center justify-center w-full h-10 px-4 py-2 rounded-md text-sm font-medium text-white bg-gradient-to-r ${feature.gradient} hover:opacity-90 border-0 shadow-lg transition-opacity`}
                >
                  {t("dashboard.openFeature", { feature: title })}
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Highlights */}
      <section className="py-8">
        <h2 className="text-2xl font-semibold text-center mb-6 bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
          {t("dashboard.whyJsonDevtool")}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {highlights.map((highlight) => (
            <div
              key={highlight.titleKey}
              className="flex items-start gap-4 p-5 rounded-xl bg-card border hover:shadow-md transition-shadow"
            >
              <div className={`p-2.5 rounded-xl ${highlight.bgColor}`}>
                <highlight.icon className={`h-5 w-5 ${highlight.color}`} />
              </div>
              <div>
                <h3 className="font-semibold">{t(highlight.titleKey)}</h3>
                <p className="text-sm text-muted-foreground">
                  {t(highlight.descriptionKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Start */}
      <section className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          {t("dashboard.quickStart")}
        </h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">
              {t("dashboard.quickStart1Title")}
            </strong>{" "}
            {t("dashboard.quickStart1Desc")}
          </p>
          <p>
            <strong className="text-foreground">
              {t("dashboard.quickStart2Title")}
            </strong>{" "}
            {t("dashboard.quickStart2Desc")}
          </p>
          <p>
            <strong className="text-foreground">
              {t("dashboard.quickStart3Title")}
            </strong>{" "}
            {t("dashboard.quickStart3Desc")}
          </p>
        </div>
      </section>
    </div>
  );
}
