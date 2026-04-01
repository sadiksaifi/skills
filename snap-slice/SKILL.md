---
name: snap-slice
description: >
  Break a PRD GitHub issue into multiple independently-grabbable vertical slice
  GitHub issues with full FR/NFR coverage mapping. Use when user wants to
  decompose a PRD into assignable work items, create implementation tickets,
  or split requirements into tasks the team can grab. Trigger on "snap-slice",
  "slice this PRD", "break this down into issues", "create tickets from PRD",
  "vertical slices", "split into tasks", "decompose into issues". Output is
  multiple GitHub issues with dependency tracking. Do NOT use for writing PRDs
  (snap-prd), planning implementation phases (snap-plan), or building code
  (snap-forge).
---

# Snap Slice

Read PRD → explore seams → draft slices → quiz → post breakdown on PRD →
create issues → update breakdown with issue refs. Every FR/NFR maps to at
least one slice.

## 1. Locate PRD

Read PRD with `gh issue view <number>`. Infer from conversation context or
ask.

## 2. Explore for seams

Find module boundaries, integration points, existing patterns. Slice along
architectural seams, not requirement boundaries. Use subagents for deep
exploration.

## 3. Draft vertical slices

Thin vertical cuts through ALL layers (schema → API → logic → UI → tests).
Tracer-bullet: narrow but complete end-to-end.

Per slice:
- **Title** — `[#N/S<i>] <name>` (N = PRD issue number, i = slice ordinal)
- **Type** — AFK (autonomous) or HITL (needs human decision)
- **Size** — S (hours) / M (1-2 days) / L (multiple days)
- **Blocked by** — other slices
- **Coverage** — US/FR/NFR IDs
- **Summary** — 1-2 sentences, end-to-end behavior

Verify: every FR/NFR in at least one slice. Flag gaps.

Prefer AFK. Prefer thin over thick.

## 4. Quiz user

Present: title, type, size, blocked-by, coverage per slice.

Iterate on granularity, dependencies, HITL/AFK, merges/splits until approved.

## 5. Post breakdown on parent PRD

Read `references/prd-comment-template.md`. Post dependency graph + slice index
+ coverage map as comment via `gh issue comment <prd-number> --body` using
slice titles (issues don't exist yet). Capture comment URL from stdout.

## 6. Create slice issues

Read `references/issue-template.md`. Create in dependency order so blocked-by
fields resolve to real issue numbers. Inject comment URL from Step 5 into each
slice's Parent PRD deep-link.

Discover labels/milestones: `gh label list`, `gh milestone list`.

## 7. Update PRD comment with issue numbers

Edit the comment from Step 5 via `gh issue comment <prd-number> --edit-last`.
Replace slice titles with real issue refs (`#<number>`) in the mermaid graph,
slice table, and coverage map.

Show terminal summary: issue URLs, dependency graph, parallel-runnable slices,
coverage map.

## Guards

- Do NOT close or edit the parent PRD issue body.

## Principles

- **Vertical over horizontal.** Every slice end-to-end, demoable.
- **Seams over requirements.** Slice along module boundaries.
- **Coverage non-negotiable.** Every FR/NFR maps to a slice.
- **AFK by default.** Minimize human-blocking slices.
