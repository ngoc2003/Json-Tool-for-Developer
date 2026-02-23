"use client";

import { useCallback, useMemo, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Upload, Download, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { isValidJson, beautifyJson, isValidXml } from "@/utils/json-utils";

interface JsonEditorProps {
  title?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  showStats?: boolean;
  className?: string;
  validationMode?: "json" | "xml" | "none";
}

export function JsonEditor({
  title = "",
  value,
  onChange,
  placeholder = "Paste your JSON here...",
  readOnly = false,
  showStats = true,
  className,
  validationMode = "json",
}: JsonEditorProps) {
  const [copied, setCopied] = useState(false);

  const isValid = useMemo(() => {
    if (!value.trim()) return true;
    if (validationMode === "none") return true;
    if (validationMode === "xml") return isValidXml(value);
    return isValidJson(value);
  }, [value, validationMode]);

  const stats = useMemo(() => {
    if (!value.trim() || !isValid) return null;
    if (validationMode !== "json") {
      // For XML or other modes, just return line count
      const lines = value.split("\n").length;
      return { keys: null, lines };
    }
    try {
      const obj = JSON.parse(value);
      const keyCount = countKeys(obj);
      const lines = value.split("\n").length;
      return { keys: keyCount, lines };
    } catch {
      return null;
    }
  }, [value, isValid, validationMode]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [value]);

  const handleFormat = useCallback(() => {
    if (validationMode === "json" && isValid && value.trim()) {
      onChange(beautifyJson(value));
    }
  }, [value, isValid, validationMode, onChange]);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          onChange(content);
        };
        reader.readAsText(file);
      }
    },
    [onChange],
  );

  const handleDownload = useCallback(() => {
    const blob = new Blob([value], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [value, title]);

  return (
    <Card className={cn("flex flex-col h-full", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">{title}</CardTitle>
            {value.trim() && (
              <Badge variant={isValid ? "default" : "destructive"}>
                {isValid ? "Valid" : "Invalid"}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {!readOnly && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  document.getElementById(`file-${title}`)?.click()
                }
              >
                <Upload className="h-4 w-4" />
              </Button>
            )}
            <input
              id={`file-${title}`}
              type="file"
              accept={validationMode === "xml" ? ".xml,.json" : ".json"}
              className="hidden"
              onChange={handleFileUpload}
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleDownload}
              disabled={!value.trim()}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleCopy}
              disabled={!value.trim()}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            {!readOnly && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleFormat}
                disabled={
                  validationMode !== "json" || !isValid || !value.trim()
                }
              >
                Format
              </Button>
            )}
          </div>
        </div>
        {showStats && stats && (
          <div className="flex gap-4 text-xs text-muted-foreground">
            {stats.keys !== null && <span>{stats.keys} keys</span>}
            <span>{stats.lines} lines</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <div className="relative h-full">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            readOnly={readOnly}
            className={cn(
              "h-full min-h-75 font-mono text-sm resize-none",
              !isValid &&
                value.trim() &&
                "border-destructive focus-visible:ring-destructive",
            )}
          />
          {!isValid && value.trim() && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1 text-destructive text-xs">
              <AlertCircle className="h-3 w-3" />
              <span>Invalid JSON</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function countKeys(obj: Record<string, unknown>): number {
  let count = 0;
  for (const key in obj) {
    count++;
    const value = obj[key];
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      count += countKeys(value as Record<string, unknown>);
    }
  }
  return count;
}
