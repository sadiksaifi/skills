# Multi-Scope Root AGENTS.md Template

Use for the root `AGENTS.md` when nested AGENTS.md files exist or should exist for a monorepo, domain split, or other subtree-specific guidance. Use the enclosed Markdown as the artifact shape.

<template>

# [Repo Name]

[One-line repo purpose only if it changes agent behavior.]

## Scope Map

- `AGENTS.md` — repo-wide defaults for all paths.
- `<path>/AGENTS.md` — [local scope: domain/workspace/app/package/infra/docs]
- `<path>/AGENTS.md` — [local scope]

## Repo Commands

- `<command>` — [repo-wide install/bootstrap/dev loop]
- `<command>` — [repo-wide read-only verification]
- `<command>` — [repo-wide test/build/package if material]

## Repo Architecture

- `Shape:` [monorepo/workspaces/domains]
- `Package manager:` [tool + workspace config]
- `Runtime:` [primary languages/runtimes]
- `Layout:` [apps/packages/domains/modules with purpose]
- `Shared seams:` [contracts, generated clients, shared config, deploy/IaC if material]

## Global Rules

- [repo-wide invariant or convention every subtree follows]
- [cross-package dependency boundary or ownership rule]
- [generated/migration/secret/snapshot rule]

## Verification

- [minimum repo-level checks before handoff]
- [targeted workspace test pattern]

## Sharp Edges

- [repo-wide costly gotcha, ordering constraint, brittle workflow, or unsafe path]

</template>
