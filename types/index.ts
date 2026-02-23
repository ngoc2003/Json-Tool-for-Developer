/**
 * TypeScript types and interfaces for the JSON DevTool
 */

// JSON Types
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonObject
  | JsonArray;
export interface JsonObject {
  [key: string]: JsonValue;
}
export type JsonArray = JsonValue[];

// Editor State
export interface EditorState {
  content: string;
  isValid: boolean;
  error?: string;
}

// i18n Sync Types
export interface I18nSyncState {
  source: EditorState;
  target: EditorState;
  result?: EditorState;
}

export interface SyncStats {
  added: number;
  removed: number;
  matched: number;
  total: number;
}

// Transform Types
export type TransformType =
  | "minify"
  | "beautify"
  | "flatten"
  | "unflatten"
  | "sort-keys"
  | "escape"
  | "unescape"
  | "to-typescript"
  | "json-to-xml"
  | "xml-to-json";

export interface TransformResult {
  output: string;
  success: boolean;
  error?: string;
}

// Diff Types
export interface DiffLine {
  type: "added" | "removed" | "unchanged";
  content: string;
  lineNumber: number;
}

export interface DiffViewerState {
  left: EditorState;
  right: EditorState;
  diff: DiffLine[];
}

// Settings Types
export interface AppSettings {
  theme: "light" | "dark" | "system";
  indent: 2 | 4;
  language: "en" | "vi";
}

// File Types
export interface FileInfo {
  name: string;
  size: number;
  lastModified: number;
}
