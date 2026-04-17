---
name: snap-prd
description: >
  Write a product-grade PRD as a GitHub issue with stable `US/FR/NFR` ids.
  Use when user wants to spec a feature, formalize requirements, or turn a
  rough idea into an implementation-ready product document. Trigger on
  "snap-prd", "write a PRD", "spec this out", "product spec", "document the
  requirements", "feature proposal".
---

# Snap PRD

Blueprint first. Explore architecture, interview for intent, publish a PRD
another agent can plan from without guesswork.

## Workflow

1. Intake
Infer product area from conversation. Ask only for missing intent that
exploration cannot recover.

2. Explore
Read relevant code, tests, routes, schemas, contracts, prior art. Find deep
modules, seams, constraints, and test patterns.

3. Interview
Resolve problem, users, outcomes, scope, requirements, metrics, and durable
implementation decisions. Recommend an answer with each question. Keep moving
branch-by-branch until ambiguity is explicit, not hidden.

4. Draft
Read `references/contract.md`, then draft with `references/template.md`.
Adapt depth to complexity. Keep prose dense. Keep ids stable.

## Contract

Artifact = one GitHub issue shaped by `references/contract.md` and
`references/template.md`.

Required:
- Stable ids: `US-*`, `FR-*`, `NFR-*`
- Explicit `Implementation Decisions`
- Explicit `Out of Scope`
- Explicit `Open Questions`

Default syntax:
- Headings
- Label lines
- Bullets

## Lifecycle

Draft in chat first. Iterate until approved. Discover labels and milestones.
Create GitHub issue with `[PRD]` title prefix. Show URL.

## Principles

- Product doc, not tech spec.
- Specificity beats adjectives.
- Deep modules beat shallow sprawl.
- Explore first. Interview on gaps, not on discoverable facts.
- Shape for downstream handoff: `snap-plan`, `snap-slice`, `snap-forge`.
