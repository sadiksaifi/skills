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

1. `Source:` Use PRD/slicing context already present in the session. If a PRD issue/comment/doc is explicitly provided and the needed body/comments are not already in session context, fetch them. If neither session context nor source ref exists, stop and ask for PRD context or a PRD issue; do not discover scope from scratch.
2. `Context:` Extract refs/URLs from available context. Read only missing material links that affect slicing, coverage, blockers, or acceptance. Recurse as needed; normalize + dedupe canonical refs; route inaccessible/conflicting context to `Open Questions` or explicit blockers. Do not refetch artifacts already available in session unless freshness is required or the user asks.
3. `Explore:` Read seams, module boundaries, integration points, prior art. Slice along architecture, not by layer. Recover implied semantics from current code, fixtures, tests before declaring ambiguity.
4. `Draft:` Read only the needed template: `references/breakdown-initial-template.md`, `references/breakdown-final-template.md`, or `references/slice-issue-template.md`. Prefer AFK slices. Keep titles stable. Assign stable `Slice N` staging ids. Cover every `FR-*` and `NFR-*`. Write in repo style: terse, technical-dense, label-first.

## Decision Gate

- If source PRD has no `Open Questions`, do not create `HITL` ratification slices.
- If source PRD says a policy point is undecided, do not resolve it from fixtures/tests/code. Keep that branch blocked behind `HITL`.
- Repo truth can fill gaps only when PRD leaves no explicit uncertainty signal.

## Artifact Rules

- Artifacts = PRD breakdown comment + slice issues shaped by topic-specific templates.
- Template files own exact Markdown. `SKILL.md` owns workflow, invariants, and gotchas.
- Initial breakdown: `references/breakdown-initial-template.md`.
- Final breakdown: `references/breakdown-final-template.md`.
- Slice issue: `references/slice-issue-template.md`.
- `Slice N` ids are staging/display metadata before issue creation; GitHub `#N` refs are canonical after creation.
- `Blocked by:` is hard execution prerequisite; `Best after:` is soft sequencing and never a graph edge.
- Final blocker fields use issue refs only: `#N`, `[#N](<url>)`, or `none`.
- Before final publish/update, validate every issue-local `Blocked By` set against final graph incoming edges by issue ref; fail on mismatch.

## Lifecycle

Draft slice set in chat first. Review merges, splits, blockers, and HITL edges. Post initial PRD breakdown with `Slice N` staging ids. Create slice issues in dependency order. Validate blockers before each publish: planned issue `Blocked By` refs must equal dependency-graph incoming edges after mapping staged `Slice N` blockers to created `#N` refs. Stop on hard mismatch; warn only for `Best after` soft sequencing differences. Update breakdown to final canonical form: `Slice N - [#<issue>](<issue-url>) <title>`.

## GitHub Hash Links

- Any Git commit hash/SHA shown to the user or written to GitHub comments, issues, PR bodies, review bodies, or durable artifacts must be clickable in GitHub.
- Use Markdown `[abcdef0](https://github.com/<owner>/<repo>/commit/<full-sha>)`; if Markdown is unsupported, paste the commit URL.
- Resolve short hashes to full SHAs before linking. Derive `<owner>/<repo>` from `gh repo view --json nameWithOwner`, PR context, or `origin` remote.

## Principles

- Vertical slices only
- Slice around deep-module seams: narrow interfaces; owned internal behavior; no layer-only wrapper work
- Preserve hexagonal boundaries: business logic owns local ports; adapters translate external shapes
- Coverage complete: every `FR-*` and `NFR-*` lands somewhere
- AFK by default
- Use `HITL` only for irreducible product/policy ambiguity. If PRD + repo truth already pin semantics tightly enough to implement, keep slices `AFK`
- Closed PRD beats repo omission. If prompt defines enums/behavior and does not expose `Open Questions`, first slice should encode the seam and implementation policy, not ask for ratification
- Unresolved product or API policy becomes `HITL` slice or explicit blocker, not silent assumption inside AFK work
- Localize ambiguity. Only slices that consume the unresolved policy should block on it; unrelated behaviors stay `AFK` and parallel
- `Open Questions` outrank fixture hints. Do not turn an explicitly unresolved rule into an AFK seam because current data suggests one implementation
- When filter and summary share only an upstream classifier seam, block both on that seam. Do not make summary wait for filter implementation
- Do not create standalone AFK seam/foundation slices. Fold seam work into the earliest user-visible behavior slice unless the slice is `HITL` or itself the user-visible deliverable
- `Blocked by:` means real execution dependency, not shared file touch. Independent query params and orthogonal behaviors stay parallel
- `Best after:` means sequencing preference only. Never treat it as a blocker or graph edge
- `Slice N` ids are staging/display metadata. After issue creation, GitHub issue refs are canonical dependency identifiers
- Slice issue `Blocked By` uses only `#N`/issue links or `none`; never `Slice N`, title-only labels, or stale parent graph prose
- Before publishing final slice issues or breakdown edits, compare every issue-local `Blocked By` set against the final PRD dependency graph by issue ref. Fail on mismatch
- Use label lines + bullets. No markdown tables
- Put shared derivation/policy guardrails in earliest slice; downstream slices block on that seam
- Do not invent ratification slices for standard cases with no open questions
- Docs/tests ride with the behavior slice they validate. Do not create chores-only slices unless the doc artifact itself is the user-visible deliverable
- Artifact prose stays token-thin: dense nouns, low glue
- Thin over thick
- Parent PRD remains source of truth
