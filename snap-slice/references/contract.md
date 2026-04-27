# Slice Contract

Two artifacts:
- PRD breakdown comment
- Slice issue

Shared ids and enums stay verbatim.

## Shared Vocab

- `US-*`, `FR-*`, `NFR-*`
- `Slice N` staging id
- `Type: AFK | HITL`
- `Size: S | M | L`
- `Blocked by:`
- `Best after:`

Meanings:
- `AFK` = autonomous; implement and merge independently
- `HITL` = human decision required
- `S` = hours
- `M` = 1-2 days
- `L` = multi-day
- `Blocked by:` = hard execution prerequisite
- `Best after:` = soft sequencing preference; not a graph edge
- `Slice N` = draft/display id; not canonical after GitHub issue creation
- `#N` = canonical dependency id after issue creation

## Breakdown Comment Sections

- `## Slice Breakdown`
- `### Dependency Graph`
- `### Slices`
- `### Coverage`
- `### Validation`

## Slice Issue Sections

- `## Parent PRD`
- `## Slice Overview`
- `## Acceptance`
- `## Coverage`
- `## Technical Hints`
- `## Type`
- `## Blocked By`
- `## Best After` when useful
- `## Size`

## Dependency Metadata

- Initial PRD breakdown may use `Slice N` blockers before issues exist.
- Final PRD breakdown keeps stable staging labels and appends issue refs: `Slice N - [#<issue>](<issue-url>) <title>`.
- Mermaid edges are hard blockers only: blocker -> blocked.
- Final blocker fields use GitHub issue refs only: `#N`, `[#N](<url>)`, or `none`.
- Slice issue `Blocked By` never uses `Slice N`, title-only blockers, or stale parent prose.
- `Best after:` may reference `#N` for non-blocking execution order.

## Validation Gate

Before publishing final slice issues or final PRD breakdown:
- Build graph edge set from the PRD dependency graph.
- Map every staged `Slice N` to the created GitHub issue ref.
- For each issue, compare `Blocked By` refs to graph incoming edges by `#N`.
- Fail on missing, extra, or non-issue hard blockers.
- Warn, do not fail, on `Best after:` differences because they are soft ordering hints.
- Record validation result in the final breakdown `### Validation` section.

## Shape

- Mermaid only for dependency graph
- Bullets and label lines everywhere else
- No markdown tables
- Dense technical phrasing over narrative glue
- Minimal grammar acceptable; ambiguity is not
- Coverage lines use parent ids verbatim
- Acceptance uses task-list checkboxes
- Unresolved policy should appear as `HITL` slice or in `Blocked by:`, not be baked into AFK acceptance
- `HITL` is for missing product/policy truth, not for restating recoverable repo semantics
- If source PRD has no `Open Questions`, prefer AFK slices that encode the seam from repo truth
- If source PRD marks a rule unresolved, that rule stays `HITL`/blocked even when current fixtures hint at one likely implementation
- If only one branch is ambiguous, keep unrelated slices AFK + parallel
- Reporting/summary slices that only share a classifier seam should block on that seam, not on sibling filter implementation
- Standalone AFK seam/setup slices are out; attach seam work to a user-visible behavior slice
- `Blocked by:` reflects true prerequisite work; touching same route/module is not enough
- Orthogonal query params should stay parallel unless one slice depends on another's new seam
- Avoid docs/tests-only slices; attach docs/tests to the owning behavior slice
