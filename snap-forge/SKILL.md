---
name: snap-forge
description: >
  Build with strict vertical TDD. Use when user wants test-first implementation,
  red-green cycles, or execution from a scoped issue/plan. Trigger on
  "snap-forge", "forge this", "TDD", "build with tests", "test-first",
  "red-green-refactor", "implement with TDD".
---

# Snap Forge

Executor. One behavior, one cycle, one commit.

## Workflow

1. Orient Resolve input: issue, plan comment, or direct task. Read code, tests, CI, and existing patterns. Detect the test stack before writing anything.

2. Branch strategy Parse `--branch` / `--worktree`. Derive names when user delegates naming.

3. Baseline Run current tests. Identify lint and format commands. Start only from a green baseline.

4. Execute For each behavior: `RED -> GREEN -> VERIFY -> COMMIT`.

5. Refactor After all behaviors green, run one refactor pass with tests between steps.

## Contract

If input includes a `snap-plan` comment, read `references/contract.md` first. Treat `Interfaces`, `Data`, `Boundaries`, and ordered phases as execution constraints.

## Lifecycle

Respect plan order when present. If plan selects one phase, execute only that phase. Finish with full-suite verify and a terse execution summary.

## Principles

- Vertical TDD only.
- Public-interface tests.
- Deep modules over shallow glue.
- Refactor after signal appears, not before.
- Mock only at system boundaries.

See `references/contract.md`, `references/tests.md`, `references/refactoring.md`, `references/deep-modules.md`, `references/interface-design.md`, `references/mocking.md`.
