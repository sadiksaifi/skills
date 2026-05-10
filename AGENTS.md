# SNAP Skills Repo

SNAP = SNAP's Not A Prompt. Portable, self-contained Agent Skills.

Spec: https://agentskills.io/specification

## Repo Contract

Follow Agent Skills spec unless local repo rules override. Keep this file evergreen: repo invariants only; no skill inventories, path indexes, workflow lists, or volatile detail. Local skill files own task semantics, activation triggers, output contracts, templates, examples, scripts, references, assets, and gotchas. Nearest instruction wins. Prefer self-contained skills; small intentional duplication beats cross-skill coupling.

## Skill Layout

`skill-name/` contains required `SKILL.md`; optional `scripts/`, `references/`, `assets/`, and skill-local files. `SKILL.md` contains YAML frontmatter followed by Markdown instructions.

| Field | Constraints |
| --- | --- |
| `name` | Required. 1–64 chars. Lowercase letters, numbers, hyphens. No leading/trailing hyphen. No `--`. Must match parent directory. |
| `description` | Required. 1–1024 chars. What the skill does, when to use it, concrete trigger terms. |

Argument-taking skills use portable Markdown sections per `docs/skill-invocation.md`.

Keep `SKILL.md` activation-critical: frontmatter, core procedure, resource map, execution-critical gotchas. Move long docs to `references/`, reusable output material to `assets/`, deterministic helpers to `scripts/`. Budget `<500` lines, `<5k` tokens preferred. Use skill-root-relative paths. Keep references one-level deep; avoid nested reference chains.

Templates are lazy-loaded resources. Put exact artifact Markdown in topic-specific `references/<topic>-template.md` files, not aggregated catch-all templates. `SKILL.md` should reference the exact template file needed for each artifact and avoid duplicating template structure. Wrap exact template bodies in plain `<template>` / `</template>` tags with a blank line after the opening tag and before the closing tag; no tag attributes.

## Invocation Contract

Argument-taking skills follow `docs/skill-invocation.md`. Put `## Invocation`, `## Args`, and `## Routes` in `SKILL.md` when inputs affect behavior.

## Authoring Contract

Dense technical handoff: high signal/low token, terse concrete nouns, implementation-aware steps, fields/ids/enums/interfaces, explicit scope, constraints, gotchas, templates. Prefer headings, labels, bullets, tables, positive protocol. Skip tutorial prose, motivational filler, broad adjectives, repeated caveats, redundant restatement, defensive prohibition lists unless safety-critical. Wrap frontmatter near 80 chars; do not force 80-char wrapping elsewhere.

## Output Contract

Skill outputs follow owning skill instructions and templates. Artifact language matches consumer: machine-bound artifacts are structured, deterministic, parseable; human-reviewed artifacts are reviewer-ready, natural, concise, and technically exact. Preserve exact ids, paths, commands, diffs, risks, decisions, and next actions. Durable repo artifacts inherit this style unless local skill defines another format.

## Script + Eval Contract

Scripts: non-interactive, deterministic where practical, flag/stdin/env driven, useful `--help`, clear failure, structured stdout, diagnostics stderr, dependency-light or dependency-documented, safe from repo-root and skill-root execution contexts.

Eval: behavior-sensitive skills may keep curated eval definitions near the skill. Do not commit eval run artifacts, traces, model outputs, temp files, secrets, or generated eval results. Never push generated eval results to git/GitHub.

## Editing Contract

Before skill edits, read nearest local instructions, templates, and referenced procedures required by the change. Persistent behavior belongs in local skill instructions, not chat context. Repo-level guidance stays generic; skill-specific schemas, examples, workflows, fixtures, and volatile rules live near the skill.

When skill context may already exist in the active session, reuse it first. Do not refetch GitHub issues, PRs, comments, review threads, PRDs, or linked artifacts unless the needed content is missing, freshness is required, or the user explicitly asks.
