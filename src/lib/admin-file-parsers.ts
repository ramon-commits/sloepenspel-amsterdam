import * as ts from "typescript";
import { parsePath, getAtPath, setAtPath, type PathPart } from "./admin-path";

/**
 * File parsers for the Endless Minds Site Admin.
 *
 * Each parser exposes a uniform pair of operations:
 *   readField(source, locator)  → returns the current value at the path
 *   writeField(source, locator, newValue) → returns the new file source
 *
 * The admin server is the only place that knows how to mutate a file.
 * Everything else operates on plain JS values via the schema.
 */

// ─────────────────────────────────────────────────────────────────────
// Common types
// ─────────────────────────────────────────────────────────────────────

export type FileType = "json" | "ts-object" | "markdown-frontmatter";

export type FieldLocator = {
  /** Whole-file path inside the repo, e.g. "content/services.json". */
  file: string;
  /** Required for ts-object parsers — the named export to mutate. */
  exportName?: string;
  /** Path inside the parsed data, e.g. "hero.headline" or "items[2].title". */
  path: string;
};

export type ReadResult =
  | { ok: true; value: unknown }
  | { ok: false; error: string };

export type WriteResult =
  | { ok: true; source: string }
  | { ok: false; error: string };

// ─────────────────────────────────────────────────────────────────────
// JSON parser
// ─────────────────────────────────────────────────────────────────────

function parseJson(source: string): unknown {
  return JSON.parse(source);
}

function stringifyJson(value: unknown): string {
  // 2-space indent matches the existing /content/*.json files.
  return JSON.stringify(value, null, 2) + "\n";
}

export function readJsonField(source: string, path: string): ReadResult {
  try {
    const data = parseJson(source);
    return { ok: true, value: getAtPath(data, path) };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export function writeJsonField(
  source: string,
  path: string,
  newValue: unknown,
): WriteResult {
  try {
    const data = parseJson(source) as Record<string, unknown> | unknown[];
    setAtPath(data, path, newValue);
    return { ok: true, source: stringifyJson(data) };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

// ─────────────────────────────────────────────────────────────────────
// TypeScript object parser
//
// Operates on a single named export like `export const homePage = { … }`.
// Reads use a runtime evaluator (object literal → plain JS); writes
// surgically replace the source range of a literal node so we never
// reformat the surrounding code.
// ─────────────────────────────────────────────────────────────────────

type FoundExport = {
  initializer: ts.Expression;
  sourceFile: ts.SourceFile;
};

function findNamedExport(
  source: string,
  exportName: string,
): FoundExport | null {
  const sourceFile = ts.createSourceFile(
    "_admin.ts",
    source,
    ts.ScriptTarget.Latest,
    true,
  );

  let initializer: ts.Expression | undefined;
  for (const stmt of sourceFile.statements) {
    if (!ts.isVariableStatement(stmt)) continue;
    if (
      !stmt.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      continue;
    }
    for (const decl of stmt.declarationList.declarations) {
      if (
        ts.isIdentifier(decl.name) &&
        decl.name.text === exportName &&
        decl.initializer
      ) {
        initializer = decl.initializer;
        break;
      }
    }
    if (initializer) break;
  }
  if (!initializer) return null;
  return { initializer, sourceFile };
}

/**
 * Walk a parsed AST node along a path and return the leaf node.
 * Returns null if any step fails.
 */
function navigateAst(node: ts.Node, parts: PathPart[]): ts.Node | null {
  let current: ts.Node = node;
  for (const part of parts) {
    if (typeof part === "number") {
      if (!ts.isArrayLiteralExpression(current)) return null;
      const el = current.elements[part];
      if (!el) return null;
      current = el;
    } else {
      if (!ts.isObjectLiteralExpression(current)) return null;
      const prop = current.properties.find((p) => {
        if (!ts.isPropertyAssignment(p)) return false;
        const name = p.name;
        if (ts.isIdentifier(name)) return name.text === part;
        if (ts.isStringLiteral(name)) return name.text === part;
        return false;
      });
      if (!prop || !ts.isPropertyAssignment(prop)) return null;
      current = prop.initializer;
    }
  }
  return current;
}

/**
 * Convert a TypeScript literal AST node into a plain JS value.
 * Supports: string / no-substitution template / numeric / boolean /
 * null / array literal / object literal (recursive).
 */
function astToValue(node: ts.Node): unknown {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (node.kind === ts.SyntaxKind.NullKeyword) return null;
  if (ts.isArrayLiteralExpression(node)) {
    return node.elements.map(astToValue);
  }
  if (ts.isObjectLiteralExpression(node)) {
    const out: Record<string, unknown> = {};
    for (const p of node.properties) {
      if (!ts.isPropertyAssignment(p)) continue;
      const key = ts.isIdentifier(p.name)
        ? p.name.text
        : ts.isStringLiteral(p.name)
          ? p.name.text
          : null;
      if (!key) continue;
      out[key] = astToValue(p.initializer);
    }
    return out;
  }
  // Anything else (template expressions, function calls, …) we leave as
  // undefined — admin only supports plain literal content.
  return undefined;
}

export function readTsObjectField(
  source: string,
  exportName: string,
  path: string,
): ReadResult {
  const found = findNamedExport(source, exportName);
  if (!found) {
    return { ok: false, error: `Export "${exportName}" not found in file` };
  }
  const parts = parsePath(path);
  const node = parts.length === 0
    ? found.initializer
    : navigateAst(found.initializer, parts);
  if (!node) {
    return { ok: false, error: `Path "${path}" not found in ${exportName}` };
  }
  return { ok: true, value: astToValue(node) };
}

/**
 * Read the entire exported object as a plain JS value. Useful for
 * rendering arrays / collections of items in the admin.
 */
export function readTsObjectExport(
  source: string,
  exportName: string,
): ReadResult {
  return readTsObjectField(source, exportName, "");
}

/**
 * Replace a string-valued leaf inside a TS object literal export.
 *
 * Implementation: locate the literal node, then string-splice the new
 * (JSON-encoded) value into the exact source range. This preserves all
 * surrounding formatting, comments, indentation, and key order.
 */
export function writeTsObjectField(
  source: string,
  exportName: string,
  path: string,
  newValue: string,
): WriteResult {
  const found = findNamedExport(source, exportName);
  if (!found) {
    return { ok: false, error: `Export "${exportName}" not found in file` };
  }
  const parts = parsePath(path);
  if (parts.length === 0) {
    return { ok: false, error: "Cannot replace whole export via writeTsObjectField" };
  }
  const node = navigateAst(found.initializer, parts);
  if (!node) {
    return { ok: false, error: `Path "${path}" not found in ${exportName}` };
  }
  if (
    !ts.isStringLiteral(node) &&
    !ts.isNoSubstitutionTemplateLiteral(node)
  ) {
    return {
      ok: false,
      error: `Path "${path}" is not a string literal (got ${ts.SyntaxKind[node.kind]})`,
    };
  }
  const start = node.getStart(found.sourceFile);
  const end = node.getEnd();
  // JSON.stringify gives us proper escaping + double-quote wrapping.
  const replacement = JSON.stringify(newValue);
  return {
    ok: true,
    source: source.substring(0, start) + replacement + source.substring(end),
  };
}

// ─────────────────────────────────────────────────────────────────────
// JS value → TS source serialiser
//
// Used by writeTsObjectValue to replace whole arrays / objects in a TS
// content file. Matches the prevailing project style:
//   • 2-space indent
//   • unquoted keys when valid identifier
//   • double-quoted strings
//   • trailing commas on multi-line lists/objects
// ─────────────────────────────────────────────────────────────────────

const VALID_IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/u;

function isValidIdentifier(key: string): boolean {
  return VALID_IDENTIFIER.test(key);
}

function serializeJsToTs(value: unknown, indentLevel: number): string {
  const indent = "  ".repeat(indentLevel);
  const childIndent = "  ".repeat(indentLevel + 1);

  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const items = value.map((v) => `${childIndent}${serializeJsToTs(v, indentLevel + 1)}`);
    return `[\n${items.join(",\n")},\n${indent}]`;
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return "{}";
    const lines = entries.map(([k, v]) => {
      const keyStr = isValidIdentifier(k) ? k : JSON.stringify(k);
      return `${childIndent}${keyStr}: ${serializeJsToTs(v, indentLevel + 1)}`;
    });
    return `{\n${lines.join(",\n")},\n${indent}}`;
  }

  return JSON.stringify(value);
}

/**
 * Detect the indent level of the AST node by looking at the column its
 * starting line begins with. Defaults to 2 (typical for our pages file).
 */
function detectIndentLevel(source: string, nodeStart: number): number {
  // Walk back from nodeStart to the line start.
  let i = nodeStart;
  while (i > 0 && source[i - 1] !== "\n") i--;
  let level = 0;
  while (i < source.length && (source[i] === " " || source[i] === "\t")) {
    if (source[i] === " ") level += 0.5; // 2-space indent → 0.5 per char
    else level++; // tab counts as one level
    i++;
  }
  return Math.max(0, Math.round(level));
}

/**
 * Replace any literal value at `path` inside a TS object export.
 * Strings, numbers, booleans, arrays, and plain objects are all
 * supported. The serialiser matches the project's existing format
 * (2-space indent, trailing commas, unquoted identifier keys).
 */
export function writeTsObjectValue(
  source: string,
  exportName: string,
  path: string,
  newValue: unknown,
): WriteResult {
  const found = findNamedExport(source, exportName);
  if (!found) {
    return { ok: false, error: `Export "${exportName}" not found in file` };
  }
  const parts = parsePath(path);
  if (parts.length === 0) {
    return {
      ok: false,
      error: "writeTsObjectValue cannot replace whole exports yet",
    };
  }
  const node = navigateAst(found.initializer, parts);
  if (!node) {
    return { ok: false, error: `Path "${path}" not found in ${exportName}` };
  }

  const start = node.getStart(found.sourceFile);
  const end = node.getEnd();
  const indentLevel = detectIndentLevel(source, start);
  const replacement = serializeJsToTs(newValue, indentLevel);

  return {
    ok: true,
    source: source.substring(0, start) + replacement + source.substring(end),
  };
}

// ─────────────────────────────────────────────────────────────────────
// Markdown frontmatter (read-only stub for stap 2)
//
// We leave write support to a later step where it will be exercised by
// real flows. Reading lets us at least display existing markdown content.
// ─────────────────────────────────────────────────────────────────────

const FRONTMATTER_RE = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/;

export function readMarkdownBody(source: string): ReadResult {
  const match = source.match(FRONTMATTER_RE);
  if (!match) return { ok: true, value: source };
  return { ok: true, value: match[2] };
}

// ─────────────────────────────────────────────────────────────────────
// Top-level dispatcher
// ─────────────────────────────────────────────────────────────────────

export function readField(
  fileType: FileType,
  source: string,
  locator: FieldLocator,
): ReadResult {
  if (fileType === "json") return readJsonField(source, locator.path);
  if (fileType === "ts-object") {
    if (!locator.exportName) {
      return { ok: false, error: "ts-object reads require an exportName" };
    }
    return readTsObjectField(source, locator.exportName, locator.path);
  }
  if (fileType === "markdown-frontmatter") {
    return readMarkdownBody(source);
  }
  return { ok: false, error: `Unknown file type: ${fileType as string}` };
}

export function writeField(
  fileType: FileType,
  source: string,
  locator: FieldLocator,
  newValue: unknown,
): WriteResult {
  if (fileType === "json") {
    return writeJsonField(source, locator.path, newValue);
  }
  if (fileType === "ts-object") {
    if (!locator.exportName) {
      return { ok: false, error: "ts-object writes require an exportName" };
    }
    // Strings → use writeTsObjectField (fast path, only touches the literal).
    // Anything else (array / object / number / boolean) → writeTsObjectValue
    // serialises the new value into TS source matching the file's style.
    if (typeof newValue === "string") {
      return writeTsObjectField(
        source,
        locator.exportName,
        locator.path,
        newValue,
      );
    }
    return writeTsObjectValue(
      source,
      locator.exportName,
      locator.path,
      newValue,
    );
  }
  if (fileType === "markdown-frontmatter") {
    return {
      ok: false,
      error: "Markdown writes are not implemented yet",
    };
  }
  return { ok: false, error: `Unknown file type: ${fileType as string}` };
}
