---
name: init-agents-md
description: >
  Create, regenerate, or refine a project AGENTS.md. Use when user wants
  project-level agent instructions, repo context for future agents, or a stale
  AGENTS.md rewritten into a denser, more useful form. Trigger on
  "/init-agents-md", "write AGENTS.md", "fix AGENTS.md", "project AI
  instructions", "bootstrap agent context", or equivalent phrasing.
---

# init-agents-md

Bootstrap repo intelligence. Explore first. Interview on gaps. Emit a dense,
low-noise AGENTS.md future agents can work from.

## Workflow

1. Explore
Read manifests, task runners, lockfiles, top-level docs, existing agent files,
repo layout, tests, and deploy/tooling seams. Derive as much as code can tell.
Use subagents for large repos.

2. Interview
Ask only for missing philosophy, contradictory signals, or intent code cannot
reveal. Recommend defaults from evidence.

3. Draft
Read `references/contract.md`, then draft with `references/template.md`.
Write the artifact in repo style: terse, technical-dense, label-first.

## Contract

Artifact = one project-level AGENTS.md shaped by `references/contract.md` and
`references/template.md`.

Default sections:
- `## Commands`
- `## Architecture`
- `## Design Principles`
- `## Sharp Edges` when the repo has non-obvious traps worth front-loading

Use fewer when repo is tiny. Use more only for a truly orthogonal concern.

## Lifecycle

Show draft in chat first. Iterate until right. If project already has AGENTS,
show diff before overwrite.

## Principles

- Explore-first. Ask on gaps.
- Positive protocol over defensive prose.
- Dense nouns over tutorial glue.
- Document stable working rules, not config trivia.
- Surface costly gotchas explicitly when they change agent behavior.
- Shape for future agent handoff, not human onboarding prose.
