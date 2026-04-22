---
name: snap-forge
description: >
  Build with strict vertical TDD. Use when user wants test-first implementation,
  red-green cycles, or execution from a scoped issue/plan. Trigger on
  "snap-forge", "forge this", "TDD", "build with tests", "test-first",
  "red-green-refactor", "implement with TDD".
---

# Snap Forge

Executor. One behavior. One cycle. One commit.

## Workflow

1. `Orient:` Resolve issue, plan comment, or direct task. Read code, tests, CI, existing patterns. Detect test stack before writing.
2. `Branch:` Parse `--branch` / `--worktree`. Derive names when user delegates naming.
3. `Baseline:` Run current tests. Identify lint + format commands. Start green.
4. `Execute:` Per behavior: `RED -> GREEN -> VERIFY -> COMMIT` with Conventional Commits v1.
5. `Refactor:` After all behaviors green, run one pass with tests between steps.

## Contract

If input includes `snap-plan` comment, read `references/contract.md` first. Treat `Interfaces`, `Data`, `Boundaries`, ordered phases as execution constraints.

## Lifecycle

Respect plan order when present. If plan selects one phase, execute only that phase. Finish with full-suite verify + terse execution summary.
Completed behavior stays committed. Do not leave finished forge work only in working tree unless user forbids commits.

## Principles

- Vertical TDD only
- Public-interface tests
- Deep modules over shallow glue
- Refactor after signal appears, not before
- Mock only at system boundaries
- Conventional commits mandatory for completed behaviors, not optional polish

Refs: `references/contract.md`, `references/tests.md`, `references/refactoring.md`, `references/deep-modules.md`, `references/interface-design.md`, `references/mocking.md`
