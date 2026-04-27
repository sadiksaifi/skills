# Issue Template

One vertical slice — thin end-to-end path, independently demoable.

## Template

```markdown
## Parent PRD

#<prd-issue-number> — Read the parent PRD first for full architectural context
and the [dependency graph](<prd-comment-url>) to understand where this slice fits.

## Slice Overview

[Concise description of this vertical slice — describe the end-to-end behavior,
not a layer-by-layer breakdown. Reference the parent PRD for full context.]

## Acceptance

- [ ] **AC-1:** [Specific, testable, tied to FR/NFR]
- [ ] **AC-2:** ...

## Coverage

User stories:
- **US-N** — [brief]

Requirements:
- **FR-X**, **FR-Y** — [brief description]
- **NFR-Z** — [brief description]

## Technical Hints

- `path/to/file.ts` — [what and why]
- `path/to/module/` — [pattern or constraint]

## Type

**AFK** (implement and merge independently) / **HITL** (needs human decision)

## Blocked By

- #<issue-number> — [hard prerequisite reason]

Or: **None — can start immediately**

## Best After

- #<issue-number> — [optional soft sequencing preference]

Or omit this section.

## Size

**S** / **M** / **L**
```

## Formatting Rules

- **Parent PRD** — deep-link to breakdown comment (URL captured in Step 5)
- **Title** — `[#N/S<i>] <name>` (N = PRD issue number, i = slice ordinal)
- **AC** — task-list checkboxes, referenceable in PRs
- **Coverage** — parent's ID scheme (US-N, FR-N, NFR-N); every FR/NFR in at least one slice
- **Technical hints** — file paths, patterns, gotchas from exploration
- **Type** — AFK (autonomous) or HITL (human decision). Prefer AFK
- **Blocked by** — hard blockers only; real issue refs after creation; `#N` or `[#N](<issue-url>)`; never `Slice N`, title-only labels, or parent-graph prose
- **Best after** — optional issue refs for sequencing preference; not a blocker; excluded from graph parity validation
- **Size** — complexity signal, not time estimate (S=hours, M=1-2d, L=multi-day)

## Validation Rules

Before publishing a slice issue body:
- Map staged `Slice N` blockers from the PRD graph to created issue refs.
- Set issue-local `Blocked By` to exactly those refs, or `None`.
- Compare issue-local `Blocked By` refs to graph incoming edges by issue ref.
- Stop on missing, extra, non-issue, or `Slice N` hard blockers.
- Keep soft sequencing in `Best After`, never `Blocked By`.
