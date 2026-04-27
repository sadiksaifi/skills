---
name: snap-prd
description: >
  Write a product-grade PRD as a GitHub issue with stable `US/FR/NFR` ids. Use
  when user wants to spec a feature, formalize requirements, or turn a rough
  idea into an implementation-ready product document. Trigger on "snap-prd",
  "write a PRD", "spec this out", "product spec", "document the requirements",
  "feature proposal".
---

# Snap PRD

Blueprint first. Explore architecture, interview for intent, publish a PRD another agent can plan from without guesswork.

## Workflow

1. `Intake:` Infer product area from conversation. If source includes an existing issue/comment/PR/doc, fetch body and all comments/review threads where available. Extract refs/URLs from body + comments. Read parent PRD/epic, related issues/PRs/discussions/docs that affect product intent, scope, users, requirements, blockers, or open questions. Recurse through material links; normalize + dedupe canonical refs. Ask only for missing intent exploration cannot recover.
2. `Explore:` Read relevant code, tests, routes, schemas, contracts, prior art. Find deep modules, seams, constraints, test patterns.
3. `Interview:` Resolve problem, users, outcomes, scope, requirements, metrics, durable implementation decisions. Recommend an answer with each question. Keep moving branch-by-branch until ambiguity is explicit, not hidden.
4. `Draft:` Read `references/contract.md`, then draft with `references/template.md`. Adapt depth to complexity. Apply repo artifact style: terse, technical-dense, label-first. Keep ids stable.

## Contract

Artifact = one GitHub issue shaped by `references/contract.md` and `references/template.md`.

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

Draft in chat first. Iterate until approved. Discover labels and milestones. Create GitHub issue with `[PRD]` title prefix. Show URL.

## GitHub Hash Links

- Any Git commit hash/SHA shown to the user or written to GitHub comments, issues, PR bodies, review bodies, or durable artifacts must be clickable in GitHub.
- Use Markdown `[abcdef0](https://github.com/<owner>/<repo>/commit/<full-sha>)`; if Markdown is unsupported, paste the commit URL.
- Resolve short hashes to full SHAs before linking. Derive `<owner>/<repo>` from `gh repo view --json nameWithOwner`, PR context, or `origin` remote.

## Principles

- Product doc, not tech spec
- Specificity beats adjectives
- Artifact prose stays token-thin: dense nouns, low glue
- Deep modules beat shallow sprawl
- Explore first. Interview on gaps, not discoverable facts
- User stories stay outcome-led. Docs/tests/maintainer chores belong in requirements or testing decisions, not as primary capability
- Do not invent net-new behavior to close ambiguity. Put unresolved policy in `Open Questions` or `Out of Scope`
- If brief/repo omit thresholds, error payload shape, tie-breakers, normalization policy, keep them out of `FR-*`; recommend in `Open Questions`
- Treat implied operational properties as suspect. Do not promote them into `FR-*` without source proof: non-interactive, zero-count buckets, exact setup assumptions, derivation formulas, over-arity policy
- Do not promote likely implementation facts into requirements: line-oriented terminal output, network/file-write assumptions, `total` semantics after new filters, default zero buckets, derived-state formulas
- When source omits `total` semantics after a new filter, leave it in `Open Questions`; do not encode it in `FR-*`
- When source introduces opt-in params like `include=summary`, do not infer extra absence/presence rules into `FR-*` unless explicitly stated
- Keep implementation grounding abstract: interfaces, data, boundaries. Skip file paths, helper names, shell commands
- When repo is mostly docs/no implementation, say that explicitly in `Problem` instead of inferring hidden seams
- Shape for downstream handoff: `snap-plan`, `snap-slice`, `snap-forge`
