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

Work-packet generator. Read PRD, cut thin vertical slices, map every requirement.

## Workflow

1. `Source:` Read PRD issue body and all comments. Pull parent context from conversation when available. Extract refs/URLs from body + comments. Read parent PRD/epic, breakdown comments, plan comments, referenced issues/PRs/discussions/docs that affect slicing, coverage, blockers, or acceptance. Recurse through material scope/acceptance/blocker links; normalize + dedupe canonical refs; route inaccessible/conflicting context to `Open Questions` or explicit blockers.
2. `Explore:` Read seams, module boundaries, integration points, prior art. Slice along architecture, not by layer. Recover implied semantics from current code, fixtures, tests before declaring ambiguity.
3. `Draft:` Read `references/contract.md`, then draft with `references/template.md`. Prefer AFK slices. Keep titles stable. Cover every `FR-*` and `NFR-*`. Write in repo style: terse, technical-dense, label-first.

## Decision Gate

- If source PRD has no `Open Questions`, do not create `HITL` contract-ratification slices.
- If source PRD says a contract point is undecided, do not resolve it from fixtures/tests/code. Keep that branch blocked behind `HITL`.
- Repo truth can fill gaps only when PRD leaves no explicit uncertainty signal.

## Contract

Artifacts = PRD breakdown comment + slice issues shaped by `references/contract.md` and `references/template.md`.

Shared nouns:
- `US-*`, `FR-*`, `NFR-*`
- `Type: AFK | HITL`
- `Size: S | M | L`
- `Blocked by:`

## Lifecycle

Draft slice set in chat first. Review merges, splits, blockers, and HITL edges. Post canonical PRD breakdown comment. Create slice issues in dependency order. Update breakdown with issue refs.

## GitHub Hash Links

- Any Git commit hash/SHA shown to the user or written to GitHub comments, issues, PR bodies, review bodies, or durable artifacts must be clickable in GitHub.
- Use Markdown `[abcdef0](https://github.com/<owner>/<repo>/commit/<full-sha>)`; if Markdown is unsupported, paste the commit URL.
- Resolve short hashes to full SHAs before linking. Derive `<owner>/<repo>` from `gh repo view --json nameWithOwner`, PR context, or `origin` remote.

## Principles

- Vertical slices only
- Coverage complete: every `FR-*` and `NFR-*` lands somewhere
- AFK by default
- Use `HITL` only for irreducible product/policy ambiguity. If PRD + repo truth already pin semantics tightly enough to implement, keep slices `AFK`
- Closed PRD beats repo omission. If prompt defines enums/behavior and does not expose `Open Questions`, first slice should encode the seam and implementation contract, not ask for ratification
- Unresolved product or contract policy becomes `HITL` slice or explicit blocker, not silent assumption inside AFK work
- Localize ambiguity. Only slices that consume the unresolved contract should block on it; unrelated behaviors stay `AFK` and parallel
- `Open Questions` outrank fixture hints. Do not turn an explicitly unresolved rule into an AFK seam because current data suggests one implementation
- When filter and summary share only an upstream classifier/contract seam, block both on that seam. Do not make summary wait for filter implementation
- Do not create standalone AFK seam/foundation slices. Fold seam work into the earliest user-visible behavior slice unless the slice is `HITL` or itself the user-visible deliverable
- `Blocked by:` means real execution dependency, not shared file touch. Independent query params and orthogonal behaviors stay parallel
- Use label lines + bullets. No markdown tables
- Put shared derivation/contract guardrails in earliest slice; downstream slices block on that seam
- Do not invent contract-ratification slices for standard cases with no open questions
- Docs/tests ride with the behavior slice they validate. Do not create chores-only slices unless the doc artifact itself is the user-visible deliverable
- Artifact prose stays token-thin: dense nouns, low glue
- Thin over thick
- Parent PRD remains source of truth
