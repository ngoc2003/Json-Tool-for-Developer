"use client";

import { useState, useMemo, useCallback } from "react";
import { JsonEditor } from "@/components/features/JsonEditor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useTranslation } from "@/contexts/LanguageContext";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GitCompare,
  Plus,
  Minus,
  Edit3,
  Equal,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { deepCompare, getDiffStats } from "@/utils/i18n-helper";
import { isValidJson } from "@/utils/json-utils";
import { cn } from "@/lib/utils";

export function DiffViewerClient() {
  const { t } = useTranslation();
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [showCompare, setShowCompare] = useState(false);

  const leftValid = useMemo(() => !left.trim() || isValidJson(left), [left]);
  const rightValid = useMemo(
    () => !right.trim() || isValidJson(right),
    [right],
  );
  const canCompare = useMemo(
    () => left.trim() && right.trim() && leftValid && rightValid,
    [left, right, leftValid, rightValid],
  );

  const diffResult = useMemo(() => {
    if (!showCompare || !canCompare) return null;

    try {
      const leftObj = JSON.parse(left);
      const rightObj = JSON.parse(right);
      return deepCompare(leftObj, rightObj);
    } catch {
      return null;
    }
  }, [left, right, showCompare, canCompare]);

  const stats = useMemo(() => {
    if (!diffResult) return null;
    return getDiffStats(diffResult);
  }, [diffResult]);

  const handleCompare = useCallback(() => {
    setShowCompare(true);
    toast.success(t("diffViewer.compareComplete"));
  }, [t]);

  const handleClear = useCallback(() => {
    setLeft("");
    setRight("");
    setShowCompare(false);
    toast.info(t("diffViewer.clearedAll"));
  }, [t]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/5 border border-orange-200/50 dark:border-orange-800/50">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-500/25">
            <GitCompare className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-400 dark:to-amber-400 bg-clip-text text-transparent">
              {t("diffViewer.title")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("diffViewer.description")}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={handleClear}
          className="border-orange-300 hover:bg-orange-50 dark:border-orange-700 dark:hover:bg-orange-950"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          {t("diffViewer.clearAll")}
        </Button>
      </div>

      {/* Editors */}
      <div className="grid lg:grid-cols-2 gap-4">
        <JsonEditor
          title={t("diffViewer.left")}
          value={left}
          onChange={(v) => {
            setLeft(v);
            setShowCompare(false);
          }}
          placeholder={t("diffViewer.leftPlaceholder")}
        />
        <JsonEditor
          title={t("diffViewer.right")}
          value={right}
          onChange={(v) => {
            setRight(v);
            setShowCompare(false);
          }}
          placeholder={t("diffViewer.rightPlaceholder")}
        />
      </div>

      {/* Compare Button */}
      <div className="flex justify-center">
        <Button size="lg" onClick={handleCompare} disabled={!canCompare}>
          <GitCompare className="h-4 w-4 mr-2" />
          {t("diffViewer.compareButton")}
        </Button>
      </div>

      {/* Stats Summary */}
      {stats && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-green-500/10">
                  <Plus className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.addedCount}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("diffViewer.added")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-red-500/10">
                  <Minus className="h-4 w-4 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.removedCount}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("diffViewer.removed")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-yellow-500/10">
                  <Edit3 className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats.changedCount}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("diffViewer.changed")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-gray-500/10">
                  <Equal className="h-4 w-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-600">
                    {stats.unchangedCount}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("diffViewer.unchanged")}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Diff Details */}
      {diffResult && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {t("diffViewer.differenceDetails")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">{t("diffViewer.all")}</TabsTrigger>
                <TabsTrigger value="added" className="text-green-600">
                  {t("diffViewer.added")} (
                  {Object.keys(diffResult.added).length})
                </TabsTrigger>
                <TabsTrigger value="removed" className="text-red-600">
                  {t("diffViewer.removed")} (
                  {Object.keys(diffResult.removed).length})
                </TabsTrigger>
                <TabsTrigger value="changed" className="text-yellow-600">
                  {t("diffViewer.changed")} (
                  {Object.keys(diffResult.changed).length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <ScrollArea className="h-100">
                  <div className="space-y-1 font-mono text-sm">
                    {/* Added */}
                    {Object.entries(diffResult.added).map(([key, value]) => (
                      <DiffLine
                        key={`add-${key}`}
                        type="added"
                        keyName={key}
                        value={String(value)}
                      />
                    ))}
                    {/* Removed */}
                    {Object.entries(diffResult.removed).map(([key, value]) => (
                      <DiffLine
                        key={`rem-${key}`}
                        type="removed"
                        keyName={key}
                        value={String(value)}
                      />
                    ))}
                    {/* Changed */}
                    {Object.entries(diffResult.changed).map(
                      ([key, { old, new: newVal }]) => (
                        <DiffLine
                          key={`chg-${key}`}
                          type="changed"
                          keyName={key}
                          oldValue={String(old)}
                          value={String(newVal)}
                        />
                      ),
                    )}
                    {/* Unchanged */}
                    {Object.entries(diffResult.unchanged).map(
                      ([key, value]) => (
                        <DiffLine
                          key={`unc-${key}`}
                          type="unchanged"
                          keyName={key}
                          value={String(value)}
                        />
                      ),
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="added" className="mt-4">
                <ScrollArea className="h-100">
                  <div className="space-y-1 font-mono text-sm">
                    {Object.entries(diffResult.added).map(([key, value]) => (
                      <DiffLine
                        key={key}
                        type="added"
                        keyName={key}
                        value={String(value)}
                      />
                    ))}
                    {Object.keys(diffResult.added).length === 0 && (
                      <p className="text-muted-foreground text-center py-4">
                        {t("diffViewer.noAdditions")}
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="removed" className="mt-4">
                <ScrollArea className="h-100">
                  <div className="space-y-1 font-mono text-sm">
                    {Object.entries(diffResult.removed).map(([key, value]) => (
                      <DiffLine
                        key={key}
                        type="removed"
                        keyName={key}
                        value={String(value)}
                      />
                    ))}
                    {Object.keys(diffResult.removed).length === 0 && (
                      <p className="text-muted-foreground text-center py-4">
                        {t("diffViewer.noRemovals")}
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="changed" className="mt-4">
                <ScrollArea className="h-100">
                  <div className="space-y-1 font-mono text-sm">
                    {Object.entries(diffResult.changed).map(
                      ([key, { old, new: newVal }]) => (
                        <DiffLine
                          key={key}
                          type="changed"
                          keyName={key}
                          oldValue={String(old)}
                          value={String(newVal)}
                        />
                      ),
                    )}
                    {Object.keys(diffResult.changed).length === 0 && (
                      <p className="text-muted-foreground text-center py-4">
                        {t("diffViewer.noChanges")}
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface DiffLineProps {
  type: "added" | "removed" | "changed" | "unchanged";
  keyName: string;
  value: string;
  oldValue?: string;
}

function DiffLine({ type, keyName, value, oldValue }: DiffLineProps) {
  const colors = {
    added:
      "bg-green-500/10 border-l-green-500 text-green-700 dark:text-green-400",
    removed: "bg-red-500/10 border-l-red-500 text-red-700 dark:text-red-400",
    changed:
      "bg-yellow-500/10 border-l-yellow-500 text-yellow-700 dark:text-yellow-400",
    unchanged: "bg-muted/50 border-l-muted-foreground/30 text-muted-foreground",
  };

  const icons = {
    added: <Plus className="h-3 w-3" />,
    removed: <Minus className="h-3 w-3" />,
    changed: <Edit3 className="h-3 w-3" />,
    unchanged: <Equal className="h-3 w-3" />,
  };

  return (
    <div
      className={cn(
        "px-3 py-1.5 border-l-4 rounded-r flex items-start gap-2",
        colors[type],
      )}
    >
      <span className="mt-0.5">{icons[type]}</span>
      <div className="flex-1 min-w-0">
        <span className="font-medium">{keyName}</span>
        {type === "changed" ? (
          <div className="flex items-center gap-2 mt-0.5">
            <span className="line-through opacity-60">{oldValue}</span>
            <ArrowRight className="h-3 w-3" />
            <span>{value}</span>
          </div>
        ) : (
          <span className="ml-2 opacity-80">: {value}</span>
        )}
      </div>
    </div>
  );
}
