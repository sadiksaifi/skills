# Single-Root AGENTS.md Template

Use when one repo-wide `AGENTS.md` is sufficient. Use the enclosed Markdown as the artifact shape.

<template>

# [Project Name]

[One-line repo purpose only if it changes agent behavior.]

## Commands

- `<command>` — [primary dev loop]
- `<command>` — [read-only verification]
- `<command>` — [default test path]
- `<command>` — [build/package/generate/deploy if agents use it]

## Architecture

- `Shape:` [single app | library | service | docs | mixed]
- `Runtime:` [language/runtime/toolchain]
- `Entry points:` [main app/service/CLI/library paths]
- `Data:` [db/orm/migrations/generated clients if material]
- `External seams:` [APIs/queues/storage/deploy target if material]

## Working Rules

- [repo-wide convention, invariant, ownership rule, or code organization rule]
- [testing/type/lint expectation that changes implementation behavior]
- [safe-edit rule for generated files, migrations, fixtures, secrets, or snapshots]

## Verification

- [minimum checks before handoff]
- [targeted test command pattern]

## Sharp Edges

- [costly gotcha, ordering constraint, brittle workflow, or unsafe path]

</template>
