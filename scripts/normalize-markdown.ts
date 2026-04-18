#!/usr/bin/env bun

import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const MAX_WIDTH = 80;
const INDENT = "  ";
const CONTENT_WIDTH = MAX_WIDTH - INDENT.length;
const TARGET = "description: >";
const SKIP_DIRS = new Set([".git", "node_modules", "dist", "build", ".turbo"]);

function listMarkdownFiles(dir: string): string[] {
  const found: string[] = [];

  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const abs = join(dir, entry);
    const stat = statSync(abs);

    if (stat.isDirectory()) {
      found.push(...listMarkdownFiles(abs));
      continue;
    }

    if (entry.endsWith(".md")) found.push(abs);
  }

  return found.sort();
}

function wrapText(text: string): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [INDENT];

  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= CONTENT_WIDTH) {
      current = next;
      continue;
    }

    if (current) lines.push(`${INDENT}${current}`);
    current = word;
  }

  if (current) lines.push(`${INDENT}${current}`);
  return lines;
}

function splitFrontmatter(lines: string[]) {
  if (lines[0] !== "---") return { frontmatter: null as string[] | null, body: lines };

  let end = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === "---") {
      end = i;
      break;
    }
  }

  if (end < 0) return { frontmatter: null as string[] | null, body: lines };
  return { frontmatter: lines.slice(1, end), body: lines.slice(end + 1) };
}

function normalizeFrontmatter(frontmatter: string[] | null): string[] | null {
  if (!frontmatter) return null;
  const idx = frontmatter.findIndex((line) => line.trim() === TARGET);
  if (idx < 0) return frontmatter;

  let next = idx + 1;
  while (next < frontmatter.length && (/^[ \t]+/.test(frontmatter[next]) || frontmatter[next] === "")) next++;

  const block = frontmatter
    .slice(idx + 1, next)
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" ");

  const wrapped = wrapText(block);
  return [...frontmatter.slice(0, idx + 1), ...wrapped, ...frontmatter.slice(next)];
}

type Fence = { char: "`" | "~"; size: number };

function parseFence(line: string): Fence | null {
  const trimmed = line.trim();
  const match = trimmed.match(/^([`~]{3,})/);
  if (!match) return null;
  const marker = match[1];
  const char = marker[0] as Fence["char"];
  return { char, size: marker.length };
}

function isParagraphLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;
  if (line.startsWith("    ") || line.startsWith("\t")) return false;
  if (trimmed.startsWith("#")) return false;
  if (trimmed.startsWith(">")) return false;
  if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.startsWith("+ ")) return false;
  if (/^\d+\.\s/.test(trimmed)) return false;
  if (/^[-*_]{3,}$/.test(trimmed)) return false;
  if (trimmed.startsWith("|")) return false;
  if (trimmed.startsWith("<!--") || trimmed.startsWith("-->")) return false;
  if (trimmed.startsWith("<") && trimmed.endsWith(">")) return false;
  if (parseFence(trimmed)) return false;
  return true;
}

function parseListItem(line: string) {
  const match = line.match(/^(\s*)([-+*]|\d+\.)\s+(.*)$/);
  if (!match) return null;
  return {
    indent: match[1],
    marker: match[2],
    body: match[3].trim(),
  };
}

function isContinuationLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;
  if (line.startsWith("    ") || line.startsWith("\t")) return false;
  if (trimmed.startsWith("#")) return false;
  if (trimmed.startsWith(">")) return false;
  if (trimmed.startsWith("|")) return false;
  if (/^[-*_]{3,}$/.test(trimmed)) return false;
  if (parseFence(trimmed)) return false;
  if (parseListItem(line)) return false;
  if (trimmed.startsWith("<!--") || trimmed.startsWith("-->")) return false;
  if (trimmed.startsWith("<") && trimmed.endsWith(">")) return false;
  return true;
}

function normalizeBody(body: string[]): string[] {
  const out: string[] = [];
  const paragraph: string[] = [];
  let activeFence: Fence | null = null;
  let activeList: { prefix: string; parts: string[] } | null = null;

  const flush = () => {
    if (paragraph.length === 0) return;
    out.push(paragraph.join(" "));
    paragraph.length = 0;
  };

  const flushList = () => {
    if (!activeList) return;
    out.push(`${activeList.prefix}${activeList.parts.join(" ")}`);
    activeList = null;
  };

  for (const line of body) {
    const fence = parseFence(line);

    if (!activeFence && fence) {
      flush();
      flushList();
      activeFence = fence;
      out.push(line);
      continue;
    }

    if (activeFence) {
      if (fence && fence.char === activeFence.char && fence.size >= activeFence.size) {
        activeFence = null;
      }
      out.push(line);
      continue;
    }

    const listItem = parseListItem(line);
    if (listItem) {
      flush();
      flushList();
      activeList = {
        prefix: `${listItem.indent}${listItem.marker} `,
        parts: listItem.body ? [listItem.body] : [],
      };
      continue;
    }

    if (activeList && isContinuationLine(line)) {
      activeList.parts.push(line.trim());
      continue;
    }

    flushList();

    if (isParagraphLine(line)) {
      paragraph.push(line.trim());
      continue;
    }

    flush();
    out.push(line);
  }

  flush();
  flushList();
  return out;
}

function normalizeMarkdown(file: string): boolean {
  const src = readFileSync(file, "utf8");
  const lines = src.split("\n");
  const { frontmatter, body } = splitFrontmatter(lines);
  const nextFrontmatter = normalizeFrontmatter(frontmatter);
  const nextBody = normalizeBody(body);

  const out = nextFrontmatter
    ? ["---", ...nextFrontmatter, "---", ...nextBody].join("\n")
    : nextBody.join("\n");

  if (out === src) return false;
  writeFileSync(file, out);
  return true;
}

const files = listMarkdownFiles(ROOT);
const changed: string[] = [];

for (const file of files) {
  if (normalizeMarkdown(file)) changed.push(relative(ROOT, file));
}

console.log(`Checked ${files.length} markdown files.`);
if (changed.length === 0) {
  console.log("No markdown changes needed.");
} else {
  console.log("Normalized:");
  for (const file of changed) console.log(`- ${file}`);
}
