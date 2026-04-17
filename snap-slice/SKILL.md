---
name: snap-slice
description: >
  Break a PRD into independently grabbable vertical slices. Use when user wants
  implementation tickets, dependency-aware slices, or requirement coverage
  mapped onto work items. Trigger on "snap-slice", "slice this PRD", "create
  tickets from PRD", "vertical slices", "split into tasks", "decompose into
  issues".
---

# Snap Slice

Work-packet generator. Read PRD, cut thin vertical slices, map every
requirement.

## Workflow

1. Source
Read PRD issue with `gh issue view`. Pull parent context from conversation when
available.

2. Explore
Read seams, module boundaries, integration points, and prior art. Slice along
architecture, not by layer.

3. Draft
Read `references/contract.md`, then draft with `references/template.md`.
Prefer AFK slices. Keep titles stable. Cover every `FR-*` and `NFR-*`.
Write artifacts in repo style: terse, technical-dense, label-first.

## Contract

Artifacts = PRD breakdown comment + slice issues shaped by
`references/contract.md` and `references/template.md`.

Shared nouns:
- `US-*`, `FR-*`, `NFR-*`
- `Type: AFK | HITL`
- `Size: S | M | L`
- `Blocked by:`

## Lifecycle

Draft slice set in chat first. Review merges, splits, blockers, and HITL edges.
Post canonical PRD breakdown comment. Create slice issues in dependency order.
Update breakdown with issue refs.

## Principles

- Vertical slices only.
- Coverage complete: every `FR-*` and `NFR-*` lands somewhere.
- AFK by default.
- Artifact prose stays token-thin: dense nouns, low glue.
- Thin over thick.
- Parent PRD remains source of truth.
