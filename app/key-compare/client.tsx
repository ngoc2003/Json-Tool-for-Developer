"use client";

import { useState, useCallback } from "react";
import { JsonEditor } from "@/components/features/JsonEditor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  Search,
  RefreshCw,
  AlertTriangle,
  XCircle,
  Languages,
  Copy,
  Download,
} from "lucide-react";
import { useI18nCompare, CompareStatus } from "@/hooks/useI18nCompare";
import { isValidJson } from "@/utils/json-utils";
import { useTranslation } from "@/contexts/LanguageContext";

const statusConfig: Record<
  CompareStatus,
  { label: string; color: string; icon: typeof AlertTriangle }
> = {
  missing: {
    label: "MISSING",
    color: "bg-red-500/10 text-red-600 border-red-500/30",
    icon: XCircle,
  },
  untranslated: {
    label: "UNTRANSLATED",
    color: "bg-amber-500/10 text-amber-600 border-amber-500/30",
    icon: Languages,
  },
  mismatch: {
    label: "MISMATCH",
    color: "bg-purple-500/10 text-purple-600 border-purple-500/30",
    icon: AlertTriangle,
  },
};

export function KeyCompareClient() {
  const { t } = useTranslation();
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");
  const [showResults, setShowResults] = useState(false);

  const sourceValid = !source.trim() || isValidJson(source);
  const targetValid = !target.trim() || isValidJson(target);
  const canCompare =
    source.trim() && target.trim() && sourceValid && targetValid;

  const { results, stats, error } = useI18nCompare(
    showResults ? source : "",
    showResults ? target : "",
  );

  const handleCompare = useCallback(() => {
    setShowResults(true);
    toast.success(t("keyCompare.auditComplete"));
  }, [t]);

  const handleClear = useCallback(() => {
    setSource("");
    setTarget("");
    setShowResults(false);
    toast.info(t("keyCompare.clearedAll"));
  }, [t]);

  const handleCopyResults = useCallback(() => {
    const jsonOutput = JSON.stringify(results, null, 2);
    navigator.clipboard.writeText(jsonOutput);
    toast.success(t("keyCompare.resultsCopied"));
  }, [results, t]);

  const handleDownloadResults = useCallback(() => {
    const jsonOutput = JSON.stringify(results, null, 2);
    const blob = new Blob([jsonOutput], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "i18n-audit-results.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t("keyCompare.resultsDownloaded"));
  }, [results, t]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-rose-500/5 border border-rose-200/50 dark:border-rose-800/50">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 shadow-lg shadow-rose-500/25">
            <Search className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              {t("keyCompare.title")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("keyCompare.description")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleCompare}
            disabled={!canCompare}
            className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
          >
            <Search className="h-4 w-4 mr-2" />
            {t("common.audit")}
          </Button>
          <Button variant="outline" onClick={handleClear}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {t("common.clear")}
          </Button>
        </div>
      </div>

      {/* Input Editors */}
      <div className="grid grid-cols-2 gap-6">
        <JsonEditor
          title={t("keyCompare.source")}
          value={source}
          onChange={setSource}
          placeholder={t("keyCompare.sourcePlaceholder")}
        />
        <JsonEditor
          title={t("keyCompare.target")}
          value={target}
          onChange={setTarget}
          placeholder={t("keyCompare.targetPlaceholder")}
        />
      </div>

      <div className="flex justify-center gap-4">
        <Button size="lg" variant="outline" onClick={handleClear}>
          <RefreshCw className="h-4 w-4 mr-2" />
          {t("common.clear")}
        </Button>

        <Button size="lg" onClick={handleCompare} disabled={!canCompare}>
          <RefreshCw className="h-4 w-4 mr-2" />
          {t("common.audit")}
        </Button>
      </div>

      {showResults && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-rose-500" />
                {t("keyCompare.results")}
              </CardTitle>
              <div className="flex items-center gap-4">
                {/* Stats */}
                <div className="flex items-center gap-2">
                  {stats.missing > 0 && (
                    <Badge
                      variant="outline"
                      className={statusConfig.missing.color}
                    >
                      {stats.missing} {t("keyCompare.missing")}
                    </Badge>
                  )}
                  {stats.untranslated > 0 && (
                    <Badge
                      variant="outline"
                      className={statusConfig.untranslated.color}
                    >
                      {stats.untranslated} {t("keyCompare.untranslated")}
                    </Badge>
                  )}
                  {stats.mismatch > 0 && (
                    <Badge
                      variant="outline"
                      className={statusConfig.mismatch.color}
                    >
                      {stats.mismatch} {t("keyCompare.mismatch")}
                    </Badge>
                  )}
                  {stats.total === 0 && (
                    <Badge
                      variant="outline"
                      className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                    >
                      {t("keyCompare.allGood")}
                    </Badge>
                  )}
                </div>
                {/* Actions */}
                {results.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyResults}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      {t("common.copy")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadResults}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      {t("common.download")}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-600">
                {error}
              </div>
            ) : results.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <div className="text-4xl mb-2">✅</div>
                <p>{t("keyCompare.noIssues")}</p>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <pre className="p-4 bg-muted/50 rounded-lg text-sm font-mono overflow-x-auto">
                  <code>{JSON.stringify(results, null, 2)}</code>
                </pre>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
