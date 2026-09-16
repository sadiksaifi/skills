# SNAP Skills Repository

Portable, self-contained [Agent Skills](https://agentskills.io/specification).

## Authority

User instructions override the nearest repository instructions; nearest instructions override the Agent Skills specification. This file owns evergreen repository invariants only. Skill-local files own activation, workflow, schemas, templates, examples, assets, scripts, and gotchas.

Persist behavior in repository files, not conversation memory. Keep skills self-contained; prefer small intentional duplication over cross-skill coupling.

## Skill contract

Each `skill-name/` requires `SKILL.md` and may contain `references/`, `assets/`, and `scripts/`.

| Field | Contract |
| --- | --- |
| `name` | Required, 1–64 lowercase letters, numbers, and hyphens; no leading/trailing hyphen or `--`; must match the directory. |
| `description` | Required, 1–1024 characters; model-facing activation pointer beginning `Use when...`; name distinct trigger branches, not body identity. |

Keep `SKILL.md` activation-critical: route selection, ordered procedure, completion criteria, resource pointers, and execution-critical guardrails. Inline steps every route needs. Move branch-specific detail to one-level-deep references. Prefer fewer than 500 lines and 5,000 tokens.

End each step with a checkable completion condition. The final condition must account for every selected item, changed path, finding, or artifact relevant to the skill.

## Resources and invocation

- Put exact artifact bodies in focused `references/` files; use topic-specific names when a skill has multiple artifacts. Wrap exact bodies in plain `<template>` / `</template>` tags with a blank line inside.
- Point from the step to the exact resource it needs. Co-locate definitions, rules, and caveats. Keep reference chains one level deep.
- Keep deterministic automation in `scripts/`: non-interactive, dependency-light or documented, safe from repository and skill roots, clear on failure, stable on stdout, diagnostic on stderr.
- Argument-taking skills declare `/skill:<name> [key|key=value]...` with `## Invocation`, `## Args`, and `## Routes`. Bare keys mean `true`. Reserve `help`; document defaults and conflicts; stop with concise usage for unsafe unknown arguments.

## Authoring

Write for predictable execution:

- clean, concise, brief, high-signal, direct
- procedure before supporting reference
- one authoritative home per meaning
- precise established vocabulary instead of repeated explanation
- positive protocol; prohibitions only as necessary guardrails
- exact scope, ids, paths, commands, enums, risks, evidence, and next actions
- no tutorial prose, motivational filler, broad adjectives, duplicated caveats, or discoverable environment facts

Match the consumer. Human-reviewed artifacts are natural and scannable. Machine-bound artifacts are deterministic and parseable. Preserve exact decisions, verification, and unresolved work.

## Work protocol

Before editing, read the nearest instructions and every resource required by the changed branch. Reuse active context before fetching external artifacts; refresh only when missing, stale, or explicitly requested.

Treat manifests, scripts, and the filesystem as source of truth rather than copying their contents into instructions.

After edits, verify frontmatter, directory/name agreement, links, template tags, stale references, command syntax, and `git diff --check`. Keep temporary files, traces, generated outputs, and secrets out of git.
