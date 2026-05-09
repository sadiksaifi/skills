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

Blueprint from existing scope. Explore architecture, publish a PRD another agent can plan from without guesswork.

## Workflow

1. `Source:` Use scoped product context already present in the session. If a GitHub issue/comment/PR/doc is explicitly provided and the needed body/comments are not already in session context, fetch them. If neither session context nor a source ref exists, stop: tell the user to run `snap-scope` first, then rerun `snap-prd` with that context.
2. `Context:` Extract refs/URLs from available context. Read only missing material links that affect product intent, scope, users, requirements, blockers, or open questions. Recurse as needed; normalize + dedupe canonical refs. Do not refetch artifacts already available in session unless freshness is required or the user asks.
3. `Explore:` Read relevant code, tests, routes, schemas, public interfaces, prior art. Find deep modules, seams, constraints, test patterns.
4. `Draft:` Read `references/template.md`, then draft. Adapt depth to complexity. Apply repo artifact style: terse, technical-dense, label-first. Keep ids stable.

## Artifact Rules

- Artifact = one GitHub issue shaped by `references/template.md`.
- Template owns exact Markdown. `SKILL.md` owns workflow, invariants, and gotchas.
- Stable ids after publish: `US-*`, `FR-*`, `NFR-*`.
- User stories stay outcome-led; docs/tests/maintainer chores stay out.
- Requirements include only requested or repo-grounded public behavior.
- Missing policy branches go to `Open Questions` or `Out of Scope`, not invented `FR-*`.

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
- Deep modules, narrow interfaces: small capability APIs with rich internal ownership
- Hexagonal boundaries: business logic owns local ports; adapters translate database, framework, transport, vendor shapes
- Scope interview belongs to `snap-scope`; `snap-prd` does not run its own interview
- User stories stay outcome-led. Docs/tests/maintainer chores belong in requirements or testing decisions, not as primary capability
- Do not invent net-new behavior to close ambiguity. Put unresolved policy in `Open Questions` or `Out of Scope`
- If brief/repo omit thresholds, error payload shape, tie-breakers, normalization policy, keep them out of `FR-*`; recommend in `Open Questions`
- Treat implied operational properties as suspect. Do not promote them into `FR-*` without source proof: non-interactive, zero-count buckets, exact setup assumptions, derivation formulas, over-arity policy
- Do not promote likely implementation facts into requirements: line-oriented terminal output, network/file-write assumptions, `total` semantics after new filters, default zero buckets, derived-state formulas
- When source omits `total` semantics after a new filter, leave it in `Open Questions`; do not encode it in `FR-*`
- When source introduces opt-in params like `include=summary`, do not infer extra absence/presence rules into `FR-*` unless explicitly stated
- Keep implementation grounding abstract: interfaces, data, boundaries. Skip file paths, helper names, shell commands
- When repo is mostly docs/no implementation, say that explicitly in `Problem` instead of inferring hidden seams
- Shape for downstream handoff: `snap-slice`, `snap-forge`
