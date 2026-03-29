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

Read PRD issue → explore architectural seams → draft slices → quiz user →
create issues. Every FR and NFR must map to at least one slice.

## 1. Locate PRD

If PRD issue in conversation context, use it. Otherwise ask for issue
number/URL. Fetch with `gh issue view <number>`.

## 2. Explore for seams

Find module boundaries, integration points, existing patterns. Good slicing
follows architectural seams, not requirement boundaries — understanding the
codebase separates naive slicing from useful slicing.

Use subagents for deep exploration of unfamiliar areas.

## 3. Draft vertical slices

Each slice is a thin vertical cut through ALL layers (schema → API → logic →
UI → tests) — never horizontal. Tracer-bullet philosophy: narrow but complete
end-to-end paths.

Per slice:
- **Title** with `[Slice #N]` prefix (N = parent PRD issue number)
- **Type:** AFK (implement and merge independently) or HITL (needs human decision)
- **Size:** S (hours) / M (1-2 days) / L (multiple days)
- **Blocked by:** dependency on other slices
- **Coverage:** which US/FR/NFR it implements
- **Summary:** 1-2 sentences of end-to-end behavior

Verify coverage: every FR and NFR appears in at least one slice. Flag gaps.

Prefer AFK over HITL. Prefer many thin slices over few thick ones.

## 4. Quiz user

Present breakdown. Per slice: title, type, size, blocked-by, coverage.

Ask: granularity right? Dependencies correct? HITL/AFK assignments accurate?
Merge or split? Iterate until approved.

## 5. Create slice issues

Read `references/issue-template.md`. Create in dependency order (foundation
slices first) so blocked-by fields reference real issue numbers.

Discover labels/milestones via `gh label list`, `gh milestone list`.

Show summary: issue URLs, dependency graph, parallel-runnable slices, coverage
map confirming all FRs/NFRs assigned.

Do NOT close or modify the parent PRD issue.

## Principles

- **Vertical over horizontal.** Every slice is end-to-end, demoable.
- **Seams over requirements.** Slice along module boundaries.
- **Coverage is non-negotiable.** Every FR/NFR maps to a slice.
- **AFK by default.** Minimize human-blocking slices.
