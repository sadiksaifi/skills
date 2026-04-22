# Slice Contract

Two artifacts:
- PRD breakdown comment
- Slice issue

Shared ids and enums stay verbatim.

## Shared Vocab

- `US-*`, `FR-*`, `NFR-*`
- `Type: AFK | HITL`
- `Size: S | M | L`
- `Blocked by:`

Meanings:
- `AFK` = autonomous; implement and merge independently
- `HITL` = human decision required
- `S` = hours
- `M` = 1-2 days
- `L` = multi-day

## Breakdown Comment Sections

- `## Slice Breakdown`
- `### Dependency Graph`
- `### Slices`
- `### Coverage`

## Slice Issue Sections

- `## Parent PRD`
- `## Slice Overview`
- `## Acceptance`
- `## Coverage`
- `## Technical Hints`
- `## Type`
- `## Blocked By`
- `## Size`

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
