# Scoped AGENTS.md Template

Use for nested AGENTS.md files in a domain, workspace, app, package, infra area, docs area, generated-code zone, or other subtree with distinct behavior. Use the enclosed Markdown as the artifact shape.

<template>

# [Scope Name]

Applies to `<path>/`. Parent AGENTS.md guidance still applies; this file contains only local deltas and overrides.

## Local Commands

- `<command>` — [local dev/test/build/generate flow]
- `<command>` — [local verification or targeted test path]

## Local Architecture

- `Scope:` [domain/workspace/app/package/infra/docs/generated zone]
- `Runtime:` [local language/runtime/framework]
- `Entry points:` [local app/service/library/module paths]
- `Dependencies:` [local shared packages, generated contracts, external seams if material]

## Local Rules

- [local convention, invariant, ownership rule, or implementation constraint]
- [local testing/type/lint expectation]
- [safe-edit rule for local generated files, migrations, fixtures, secrets, or snapshots]

## Overrides

- [parent rule overridden here, with exact local replacement]

## Sharp Edges

- [local costly gotcha, ordering constraint, brittle workflow, or unsafe path]

</template>
