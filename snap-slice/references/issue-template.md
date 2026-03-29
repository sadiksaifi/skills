# Issue Template

Each issue represents one vertical slice — a thin, end-to-end path through the
system that is independently demoable or verifiable.

## Template

```markdown
## Parent PRD

#<prd-issue-number>

## Slice overview

[Concise description of this vertical slice — describe the end-to-end behavior,
not a layer-by-layer breakdown. Reference the parent PRD for full context.]

## Acceptance criteria

- [ ] **AC-1:** [Criterion — specific, testable, tied to FR/NFR from parent PRD]
- [ ] **AC-2:** ...

## PRD coverage

User stories addressed:
- **US-N** — [brief reminder]

Requirements implemented:
- **FR-X**, **FR-Y** — [brief description]
- **NFR-Z** — [brief description]

## Technical hints

[Files to modify, relevant patterns, architectural considerations, existing
utilities to reuse. Saves the implementing engineer from re-exploring.]

- `path/to/file.ts` — [what to change and why]
- `path/to/module/` — [relevant pattern or constraint]

## Blocked by

- #<issue-number> — [brief reason]

Or: **None — can start immediately**

## Size

**S** / **M** / **L**
```

## Formatting Rules

- **Title prefix** — `[Slice #N]` where N is parent PRD issue number
- **AC prefixes** with task list checkboxes — checkable in GitHub, easy to reference in PRs
- **PRD coverage** maps back to parent's ID scheme (US-N, FR-N, NFR-N) — every FR/NFR should appear in at least one slice
- **Technical hints** — specific file paths, existing patterns, gotchas from exploration
- **Blocked by** — real issue numbers (create in dependency order)
- **Size** — complexity signal (S = hours, M = 1-2 days, L = multiple days), not a time estimate
