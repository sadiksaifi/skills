# Plan Contract

One comment. One canonical plan. Thin vertical phases.

## Sections

- `## Durable Decisions`
- `## Plan`
- `## Risks / Unknowns`
- `## Validation` — optional; use only when it adds signal

## Durable Decisions

Core fields:
- `Interfaces:`
- `Data:`
- `Boundaries:`

Optional when material:
- `Auth:`
- `Migration:`
- `Observability:`
- `Performance:`

## Plan

Per phase:
- `### Phase N: [Title]`
- `Goal:`
- `Covers:`
- `Build:`
- `Acceptance:`
- `Blockers:`
- `Size:`
- `Risk:`

## Vocab

- `Covers:` `US-*`, `FR-*`, `NFR-*`, or `inferred`
- `Size: S` = hours
- `Size: M` = 1-2 days
- `Size: L` = multi-day; smell for `snap-plan`
- `Risk: low` = known pattern
- `Risk: med` = one meaningful unknown
- `Risk: high` = new boundary, dependency, or feasibility unknown

## Shape

- Headings + label lines + bullets
- Dense technical phrasing over connective prose
- Minimal grammar acceptable; ambiguity is not
- `Build:` = end-to-end slice, not layer checklist
- `Acceptance:` = public-interface behavior checkboxes
- `Blockers:` = `none`, prior phases, or external dependency
- Each acceptance item should fit one or a few vertical `RED -> GREEN -> VERIFY -> COMMIT` cycles
- Prefer one coherent behavior cluster per phase, not bundled unrelated work
- Prefer `1-5` phases
