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
- Coverage lines use parent ids verbatim
- Acceptance uses task-list checkboxes
