"use client";

import { useState, useCallback, useMemo } from "react";
import { JsonEditor } from "@/components/features/JsonEditor";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/contexts/LanguageContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeftRight,
  Minimize2,
  Maximize2,
  ListTree,
  ListCollapse,
  ArrowDownAZ,
  Code,
  Quote,
  RefreshCw,
  Copy,
  Check,
} from "lucide-react";
import { useJsonTransformer } from "@/hooks/useJsonTransformer";
import { toast } from "sonner";

type TransformId =
  | "beautify"
  | "minify"
  | "flatten"
  | "unflatten"
  | "sort-keys"
  | "to-typescript"
  | "escape"
  | "unescape";

export function TransformClient() {
  const { t } = useTranslation();
  const { input, setInput, isValid, error, transform } = useJsonTransformer();
  const [output, setOutput] = useState("");
  const [activeTransform, setActiveTransform] = useState<TransformId | null>(
    null,
  );
  const [copied, setCopied] = useState(false);

  const transformations = useMemo(
    () => [
      {
        id: "beautify" as const,
        name: t("transform.beautify"),
        description: t("transform.beautifyDesc"),
        icon: Maximize2,
      },
      {
        id: "minify" as const,
        name: t("transform.minify"),
        description: t("transform.minifyDesc"),
        icon: Minimize2,
      },
      {
        id: "flatten" as const,
        name: t("transform.flatten"),
        description: t("transform.flattenDesc"),
        icon: ListCollapse,
      },
      {
        id: "unflatten" as const,
        name: t("transform.unflatten"),
        description: t("transform.unflattenDesc"),
        icon: ListTree,
      },
      {
        id: "sort-keys" as const,
        name: t("transform.sortKeys"),
        description: t("transform.sortKeysDesc"),
        icon: ArrowDownAZ,
      },
      {
        id: "to-typescript" as const,
        name: t("transform.toTypeScript"),
        description: t("transform.toTypeScriptDesc"),
        icon: Code,
      },
      {
        id: "escape" as const,
        name: t("transform.escape"),
        description: t("transform.escapeDesc"),
        icon: Quote,
      },
      {
        id: "unescape" as const,
        name: t("transform.unescape"),
        description: t("transform.unescapeDesc"),
        icon: Quote,
      },
    ],
    [t],
  );

  const handleTransform = useCallback(
    (type: TransformId) => {
      const result = transform(type);
      if (result.success) {
        setOutput(result.output);
        setActiveTransform(type);
        const transformName =
          transformations.find((tr) => tr.id === type)?.name ?? type;
        toast.success(t("transform.appliedSuccess", { name: transformName }));
      } else {
        setOutput(`Error: ${result.error}`);
        setActiveTransform(null);
        toast.error(
          t("transform.transformFailed", {
            error: result.error ?? "Unknown error",
          }),
        );
      }
    },
    [transform, transformations, t],
  );

  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
    setActiveTransform(null);
    toast.info(t("transform.clearedAll"));
  }, [setInput, t]);

  const handleCopy = useCallback(async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success(t("transform.copiedToClipboard"));
    }
  }, [output, t]);

  const handleSwap = useCallback(() => {
    const temp = input;
    setInput(output);
    setOutput(temp);
    setActiveTransform(null);
    toast.success(t("transform.swapped"));
  }, [input, output, setInput, t]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/5 border border-emerald-200/50 dark:border-emerald-800/50">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25">
            <ArrowLeftRight className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              {t("transform.title")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("transform.description")}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleSwap}
            disabled={!output}
            className="border-emerald-300 hover:bg-emerald-50 dark:border-emerald-700 dark:hover:bg-emerald-950"
          >
            <ArrowLeftRight className="h-4 w-4 mr-2" />
            {t("transform.swap")}
          </Button>
          <Button
            variant="outline"
            onClick={handleClear}
            className="border-emerald-300 hover:bg-emerald-50 dark:border-emerald-700 dark:hover:bg-emerald-950"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {t("transform.clear")}
          </Button>
        </div>
      </div>

      {/* Transformation Buttons */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            {t("transform.transformations")}
          </CardTitle>
          <CardDescription>{t("transform.selectTransform")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
            {transformations.map((tr) => (
              <Button
                key={tr.id}
                variant={activeTransform === tr.id ? "default" : "outline"}
                className="h-auto flex-col py-3 px-2"
                onClick={() => handleTransform(tr.id)}
                disabled={
                  !isValid && tr.id !== "escape" && tr.id !== "unescape"
                }
              >
                <tr.icon className="h-4 w-4 mb-1" />
                <span className="text-xs font-medium">{tr.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Editors */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Input */}
        <JsonEditor
          title={t("transform.input")}
          value={input}
          onChange={setInput}
          placeholder={t("transform.inputPlaceholder")}
        />

        {/* Output */}
        <Card className="flex flex-col h-full">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">
                  {t("transform.output")}
                </CardTitle>
                {activeTransform && (
                  <Badge variant="secondary">
                    {
                      transformations.find((tr) => tr.id === activeTransform)
                        ?.name
                    }
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleCopy}
                disabled={!output}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <Tabs defaultValue="formatted" className="h-full flex flex-col">
              <TabsList className="mb-2">
                <TabsTrigger value="formatted">
                  {t("transform.formatted")}
                </TabsTrigger>
                <TabsTrigger value="raw">{t("transform.raw")}</TabsTrigger>
              </TabsList>
              <TabsContent value="formatted" className="flex-1 m-0">
                <pre className="h-full min-h-75 p-4 rounded-md bg-muted font-mono text-sm overflow-auto whitespace-pre-wrap wrap-break-word">
                  {output || t("transform.outputPlaceholder")}
                </pre>
              </TabsContent>
              <TabsContent value="raw" className="flex-1 m-0">
                <pre className="h-full min-h-75 p-4 rounded-md bg-muted font-mono text-sm overflow-auto">
                  {output || t("transform.outputPlaceholder")}
                </pre>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Validation Error */}
      {error && input.trim() && (
        <Card className="bg-destructive/10 border-destructive/20">
          <CardContent className="py-3">
            <p className="text-sm text-destructive">
              <strong>{t("transform.jsonError")}</strong> {error}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Help */}
      <Card className="bg-muted/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">
            {t("transform.transformGuide")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-muted-foreground">
            <div>
              <p className="font-medium text-foreground">
                {t("transform.guideBeautifyMinify")}
              </p>
              <p>{t("transform.guideBeautifyMinifyDesc")}</p>
            </div>
            <div>
              <p className="font-medium text-foreground">
                {t("transform.guideFlattenUnflatten")}
              </p>
              <p>{t("transform.guideFlattenUnflattenDesc")}</p>
            </div>
            <div>
              <p className="font-medium text-foreground">
                {t("transform.guideSortKeys")}
              </p>
              <p>{t("transform.guideSortKeysDesc")}</p>
            </div>
            <div>
              <p className="font-medium text-foreground">
                {t("transform.guideTypeScript")}
              </p>
              <p>{t("transform.guideTypeScriptDesc")}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
