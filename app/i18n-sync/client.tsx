"use client";

import { useState, useMemo, useCallback } from "react";
import { JsonEditor } from "@/components/features/JsonEditor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { useTranslation } from "@/contexts/LanguageContext";

import {
  ArrowRight,
  Plus,
  Minus,
  Check,
  RefreshCw,
  AlertCircle,
  Languages,
} from "lucide-react";
import { syncI18n, findMissingKeys, findExtraKeys } from "@/utils/i18n-logic";
import { isValidJson, beautifyJson } from "@/utils/json-utils";

export function I18nSyncClient() {
  const { t } = useTranslation();
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");
  const [result, setResult] = useState("");
  const [removeExtra, setRemoveExtra] = useState(false);
  const [sortAlphabetically, setSortAlphabetically] = useState(false);

  const sourceValid = useMemo(
    () => !source.trim() || isValidJson(source),
    [source],
  );
  const targetValid = useMemo(
    () => !target.trim() || isValidJson(target),
    [target],
  );
  const canSync = useMemo(
    () => source.trim() && target.trim() && sourceValid && targetValid,
    [source, target, sourceValid, targetValid],
  );

  // Calculate stats before sync
  const previewStats = useMemo(() => {
    if (!canSync) return null;

    try {
      const srcObj = JSON.parse(source);
      const tgtObj = JSON.parse(target);

      const missing = findMissingKeys(srcObj, tgtObj);
      const extra = findExtraKeys(srcObj, tgtObj);

      return { missing, extra };
    } catch {
      return null;
    }
  }, [source, target, canSync]);

  const handleSync = useCallback(() => {
    if (!canSync) return;

    try {
      const srcObj = JSON.parse(source);
      const tgtObj = JSON.parse(target);

      const syncResult = syncI18n(srcObj, tgtObj, {
        removeExtra,
        sortAlphabetically,
      });

      setResult(beautifyJson(JSON.stringify(syncResult.synced)));
      const removed = removeExtra
        ? t("i18nSync.removedKeys", { count: syncResult.removedKeys.length })
        : "";
      toast.success(
        t("i18nSync.syncComplete", {
          added: syncResult.addedKeys.length,
          removed,
        }),
      );
    } catch (error) {
      console.error("Sync error:", error);
      toast.error(t("i18nSync.syncFailed"));
    }
  }, [source, target, canSync, removeExtra, sortAlphabetically, t]);

  const handleClear = useCallback(() => {
    setSource("");
    setTarget("");
    setResult("");
    toast.info(t("i18nSync.clearedAll"));
  }, [t]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/5 border border-blue-200/50 dark:border-blue-800/50">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/25">
            <Languages className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
              {t("i18nSync.title")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("i18nSync.description")}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={handleClear}
          className="border-blue-300 hover:bg-blue-50 dark:border-blue-700 dark:hover:bg-blue-950"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          {t("i18nSync.clearAll")}
        </Button>
      </div>

      {/* Options */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            {t("i18nSync.syncOptions")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-6">
          <div className="flex items-center gap-2">
            <Switch
              id="remove-extra"
              checked={removeExtra}
              onCheckedChange={setRemoveExtra}
            />
            <label htmlFor="remove-extra" className="text-sm cursor-pointer">
              {t("i18nSync.removeExtra")}
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="sort-alpha"
              checked={sortAlphabetically}
              onCheckedChange={setSortAlphabetically}
            />
            <label htmlFor="sort-alpha" className="text-sm cursor-pointer">
              {t("i18nSync.sortAlpha")}
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Preview Stats */}
      {previewStats && (
        <Card className="bg-muted/50">
          <CardContent className="py-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4 text-green-500" />
                <span className="text-sm">
                  <strong>{previewStats.missing.length}</strong>{" "}
                  {t("i18nSync.keysToAdd")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Minus className="h-4 w-4 text-red-500" />
                <span className="text-sm">
                  <strong>{previewStats.extra.length}</strong>{" "}
                  {t("i18nSync.extraKeys")}
                  {!removeExtra && ` ${t("i18nSync.willKeep")}`}
                </span>
              </div>
            </div>
            {previewStats.missing.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-muted-foreground mb-1">
                  {t("i18nSync.missingKeys")}
                </p>
                <ScrollArea className="h-20">
                  <div className="flex flex-wrap gap-1">
                    {previewStats.missing.map((key) => (
                      <Badge key={key} variant="secondary" className="text-xs">
                        {key}
                      </Badge>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Editors Grid */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Source Editor */}
        <JsonEditor
          title={t("i18nSync.source")}
          value={source}
          onChange={setSource}
          placeholder={t("i18nSync.sourcePlaceholder")}
        />

        {/* Target Editor */}
        <JsonEditor
          title={t("i18nSync.target")}
          value={target}
          onChange={setTarget}
          placeholder={t("i18nSync.targetPlaceholder")}
        />

        {/* Result Editor */}
        <div className="relative">
          <JsonEditor
            title={t("i18nSync.result")}
            value={result}
            onChange={setResult}
            placeholder={t("i18nSync.resultPlaceholder")}
            readOnly
          />
          {result && (
            <div className="absolute top-4 right-4">
              <Badge variant="default" className="bg-green-500">
                <Check className="h-3 w-3 mr-1" />
                {t("i18nSync.synced")}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Sync Button */}
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={handleSync}
          disabled={!canSync}
          className="min-w-50"
        >
          <ArrowRight className="h-4 w-4 mr-2" />
          {t("i18nSync.syncButton")}
        </Button>
      </div>

      {/* Info */}
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="py-4">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-medium mb-1">{t("i18nSync.howItWorks")}</p>
              <ul className="list-disc list-inside space-y-1 text-blue-600 dark:text-blue-400">
                <li>{t("i18nSync.howItWorks1")}</li>
                <li>{t("i18nSync.howItWorks2")}</li>
                <li>{t("i18nSync.howItWorks3")}</li>
                <li>{t("i18nSync.howItWorks4")}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
