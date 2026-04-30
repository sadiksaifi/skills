---
name: snap-forge
description: >
  Build with strict vertical TDD. Use when user wants test-first implementation,
  red-green cycles, or execution from a scoped issue/plan. Trigger on
  "snap-forge", "forge this", "TDD", "build with tests", "test-first",
  "red-green-refactor", "implement with TDD".
---

# Snap Forge

Executor. One scoped slice. Many small TDD cycles when needed. One commit per completed behavior.

## Workflow

1. `Orient:` Resolve issue, plan comment, or direct task. For issue input, fetch issue body and all issue comments before scoping. Extract refs/URLs from body + comments. Read parent PRD/epic, plan/breakdown comments, referenced issues/PRs/discussions/docs that affect scope, acceptance, blockers, or implementation constraints. Recurse through material links; normalize + dedupe canonical refs; keep inaccessible/conflicting context as explicit blockers or unknowns. Read enough linked artifacts to reconstruct the full epic context before selecting the behavior. Read code, tests, CI, existing patterns. Detect test stack before writing.
2. `Scope ledger:` Extract acceptance items, explicit non-goals, blockers, and linked-slice boundaries. Keep a visible Done / In progress / Not done ledger. If user asked for an issue/slice, the selected scope is the whole issue/slice unless they explicitly narrowed it.
3. `Branch:` Parse `--branch` / `--worktree`. Derive names when user delegates naming.
4. `Baseline:` Run current tests. Identify lint + format commands. Start green.
5. `Execute:` Per behavior: `RED -> GREEN -> VERIFY -> COMMIT` with Conventional Commits v1. Continue cycles until the selected scope ledger is complete or a blocker stops execution.
6. `Refactor:` After all selected-scope behaviors are green, run one pass with tests between steps.

## Contract

If input includes `snap-plan` comment, read `references/contract.md` first. Treat `Interfaces`, `Data`, `Boundaries`, ordered phases as execution constraints. If the plan lives on an issue, inspect the full issue comment thread for later clarifications, amendments, review notes, and scope changes. If that thread points at a parent PRD/epic issue or breakdown comment, read those artifacts and their materially linked issues/comments before execution.

## Lifecycle

Respect plan order when present. If plan selects one phase, execute only that phase. Finish with full-suite verify + terse execution summary against the scope ledger.
Completed behavior stays committed. Do not leave finished forge work only in working tree unless user forbids commits.
Do not claim `Implemented #N`, `completed slice`, or equivalent unless every selected-scope acceptance item is Done. If execution stops after one behavior or partial coverage, label the result `Partial`, list remaining acceptance items, and state the blocker or continuation plan.

## GitHub Hash Links

- Any Git commit hash/SHA shown to the user or written to GitHub comments, issues, PR bodies, review bodies, or durable artifacts must be clickable in GitHub.
- Use Markdown `[abcdef0](https://github.com/<owner>/<repo>/commit/<full-sha>)`; if Markdown is unsupported, paste the commit URL.
- Resolve short hashes to full SHAs before linking. Derive `<owner>/<repo>` from `gh repo view --json nameWithOwner`, PR context, or `origin` remote.

## Principles

- Vertical TDD only
- Public-interface tests
- Deep modules, narrow interfaces: small public APIs; owned internals over pass-through glue
- Hexagonal boundaries: domain owns local interfaces; adapters translate database, framework, transport, vendor shapes
- Refactor after signal appears, not before
- Mock only at system boundaries
- Conventional commits mandatory for completed behaviors, not optional polish

Refs: `references/contract.md`, `references/tests.md`, `references/refactoring.md`, `references/deep-modules.md`, `references/interface-design.md`, `references/mocking.md`
