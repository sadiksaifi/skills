# Issue Template

One vertical slice — thin end-to-end path, independently demoable.

## Template

```markdown
## Parent PRD

#<prd-issue-number> — Read the parent PRD first for full architectural context
and the [dependency graph](<prd-comment-url>) to understand where this slice fits.

## Slice overview

[Concise description of this vertical slice — describe the end-to-end behavior,
not a layer-by-layer breakdown. Reference the parent PRD for full context.]

## Acceptance criteria

- [ ] **AC-1:** [Specific, testable, tied to FR/NFR]
- [ ] **AC-2:** ...

## PRD coverage

User stories:
- **US-N** — [brief]

Requirements:
- **FR-X**, **FR-Y** — [brief description]
- **NFR-Z** — [brief description]

## Technical hints

- `path/to/file.ts` — [what and why]
- `path/to/module/` — [pattern or constraint]

## Type

**AFK** (implement and merge independently) / **HITL** (needs human decision)

## Blocked by

- #<issue-number> — [brief reason]

Or: **None — can start immediately**

## Size

**S** / **M** / **L**
```

## Formatting Rules

- **Parent PRD** — deep-link to breakdown comment (URL captured in Step 5)
- **Title** — `[#N/S<i>] <name>` (N = PRD issue number, i = slice ordinal)
- **AC** — task-list checkboxes, referenceable in PRs
- **PRD coverage** — parent's ID scheme (US-N, FR-N, NFR-N); every FR/NFR in at least one slice
- **Technical hints** — file paths, patterns, gotchas from exploration
- **Type** — AFK (autonomous) or HITL (human decision). Prefer AFK
- **Blocked by** — real issue numbers (create in dependency order)
- **Size** — complexity signal, not time estimate (S=hours, M=1-2d, L=multi-day)
