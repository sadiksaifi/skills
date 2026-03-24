# Issue Template

Use this template when preparing issue bodies in Phase 4. Each issue represents
one vertical slice — a thin, end-to-end path through the system that is
independently demoable or verifiable.

## Template

```markdown
## Parent PRD

#<prd-issue-number>

## Slice overview

[Concise description of this vertical slice — describe the end-to-end behavior
this slice delivers, not a layer-by-layer breakdown. Reference the parent PRD
for full context rather than duplicating content.]

## Acceptance criteria

- [ ] **AC-1:** [Criterion — specific, testable, tied to a FR/NFR from the parent PRD]
- [ ] **AC-2:** ...
- [ ] **AC-3:** ...

## PRD coverage

User stories addressed:
- **US-N** — [brief reminder of what the story says]

Requirements implemented:
- **FR-X**, **FR-Y** — [brief description]
- **NFR-Z** — [brief description]

## Technical hints

[Files likely to be modified, relevant patterns discovered during codebase
exploration, architectural considerations, existing utilities to reuse.
This section saves the implementing engineer from re-exploring the codebase.]

- `path/to/file.ts` — [what to change and why]
- `path/to/module/` — [relevant pattern or constraint]

## Blocked by

- #<issue-number> — [brief reason]

Or: **None — can start immediately**

## Size

**S** / **M** / **L**
```

## Formatting Rules

- **Title prefix** — always use `[Slice #N]` where N is the parent PRD issue
  number (e.g., `[Slice #42] Add skill search endpoint + basic CLI`). This
  makes slices instantly distinguishable from the parent `[PRD]` issue AND
  tells you which PRD they belong to at a glance in GitHub issue lists
- **Acceptance criteria** use `AC-N` prefixes with task list checkboxes —
  they become checkable in GitHub and are easy to reference in PRs
- **PRD coverage** maps back to the parent PRD's ID scheme (US-N, FR-N, NFR-N)
  so nothing falls through the cracks — every FR/NFR should appear in at least
  one slice
- **Technical hints** are the implementing engineer's shortcut — specific file
  paths, existing patterns to follow, gotchas discovered during exploration
- **Blocked by** uses real issue numbers (created in dependency order) so
  GitHub auto-links them
- **Size** is a rough complexity signal (S = hours, M = a day or two, L = multiple days),
  not a time estimate — it helps with sprint planning and parallel assignment
