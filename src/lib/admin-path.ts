/**
 * Path utilities for the Endless Minds Site Admin.
 *
 * A path is a string like "hero.headline" or "howItWorks[2].body".
 * Used everywhere to address a specific value inside a content file.
 */

export type PathPart = string | number;

/**
 * Parse a path string into ordered parts.
 *
 * Examples:
 *   "hero.headline"          → ["hero", "headline"]
 *   "howItWorks[2].body"     → ["howItWorks", 2, "body"]
 *   "items[0]"               → ["items", 0]
 *   ""                       → []
 */
export function parsePath(path: string): PathPart[] {
  if (!path) return [];
  const parts: PathPart[] = [];
  let buf = "";

  for (let i = 0; i < path.length; i++) {
    const c = path[i];
    if (c === ".") {
      if (buf) {
        parts.push(buf);
        buf = "";
      }
      continue;
    }
    if (c === "[") {
      if (buf) {
        parts.push(buf);
        buf = "";
      }
      let num = "";
      i++;
      while (i < path.length && path[i] !== "]") {
        num += path[i];
        i++;
      }
      const n = Number(num);
      if (!Number.isFinite(n)) {
        throw new Error(`Invalid numeric index in path: "${num}"`);
      }
      parts.push(n);
      continue;
    }
    buf += c;
  }
  if (buf) parts.push(buf);
  return parts;
}

/**
 * Format path parts back into a string.
 * Inverse of parsePath.
 */
export function formatPath(parts: PathPart[]): string {
  let out = "";
  for (const p of parts) {
    if (typeof p === "number") {
      out += `[${p}]`;
    } else {
      out += out ? `.${p}` : p;
    }
  }
  return out;
}

/**
 * Read the value at `path` from `obj`. Returns undefined if any segment is
 * missing (does not throw — caller decides if that is an error).
 */
export function getAtPath(obj: unknown, path: string | PathPart[]): unknown {
  const parts = typeof path === "string" ? parsePath(path) : path;
  let current: unknown = obj;
  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    if (typeof part === "number") {
      if (!Array.isArray(current)) return undefined;
      current = current[part];
    } else {
      if (typeof current !== "object") return undefined;
      current = (current as Record<string, unknown>)[part];
    }
  }
  return current;
}

/**
 * Set the value at `path` inside `obj`, mutating it in place.
 * Throws if the path traverses a missing or wrong-typed intermediate node.
 */
export function setAtPath(
  obj: unknown,
  path: string | PathPart[],
  value: unknown,
): void {
  const parts = typeof path === "string" ? parsePath(path) : path;
  if (parts.length === 0) {
    throw new Error("setAtPath requires a non-empty path");
  }
  let current: unknown = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (current === null || current === undefined) {
      throw new Error(`Path traversal hit null at "${parts.slice(0, i).join(".")}"`);
    }
    if (typeof part === "number") {
      if (!Array.isArray(current)) {
        throw new Error(`Expected array at "${formatPath(parts.slice(0, i))}"`);
      }
      current = current[part];
    } else {
      if (typeof current !== "object") {
        throw new Error(`Expected object at "${formatPath(parts.slice(0, i))}"`);
      }
      current = (current as Record<string, unknown>)[part];
    }
  }
  const last = parts[parts.length - 1];
  if (typeof last === "number") {
    if (!Array.isArray(current)) {
      throw new Error(
        `Expected array at parent of "${formatPath(parts)}"`,
      );
    }
    current[last] = value;
  } else {
    if (current === null || typeof current !== "object") {
      throw new Error(`Expected object at parent of "${formatPath(parts)}"`);
    }
    (current as Record<string, unknown>)[last] = value;
  }
}

/**
 * Count the number of words in a string. Used for max-words validation in
 * the admin UI.
 */
export function countWords(value: string): number {
  if (!value) return 0;
  return value.trim().split(/\s+/).filter(Boolean).length;
}
