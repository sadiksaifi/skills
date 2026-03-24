---
name: snap-spec
description: >
  Write Product Requirements Documents and optionally break them into vertical
  slice GitHub issues. Use whenever the user wants to write a PRD, spec out a
  feature, create product requirements, draft a feature proposal, break down a
  PRD into issues, create implementation tasks, or decompose requirements into
  work items. Trigger on "write a PRD", "spec this out", "snap-spec", "break
  down this PRD", "create issues from the PRD", "vertical slices", "feature
  requirements", "product spec", "I need a PRD for X", "split this into tasks",
  or any variation where the user wants to define what to build or slice a PRD
  into grabbable issues. When in doubt, activate.
---

# Snap Spec

Write a PRD through user interview and codebase exploration, publish as a
GitHub issue, then optionally break it into vertical slice issues. You may
skip steps if context already exists or they aren't needed.

## Writing a PRD

### 1. Quick intake

Get the rough idea. If the user already described it, extract what you can. If
vague, ask just enough to know what area of the product this touches and where
to look in the codebase. Don't go deep yet — the interview comes after
exploring.

### 2. Explore the codebase

Before interviewing, understand the technical landscape so your questions are
grounded in reality. Scan the project structure, search for patterns related to
the feature area, read relevant config and docs. Go deeper with subagents when
the feature touches complex or unfamiliar areas. Research externally (web,
library docs) when it adds value.

A PRD that ignores existing architecture is a fantasy — this step makes
requirements realistic.

### 3. Interview relentlessly

Walk each branch of the design tree, resolving dependencies one by one. For
every question, provide your recommended answer — this saves the user cognitive
load and keeps things moving. When the codebase can answer a question, explore
instead of asking.

Cover: problem statement, goals and non-goals, user stories (US-N), functional
requirements (FR-N), non-functional requirements (NFR-N), success metrics,
scope boundaries, open questions.

Be natural, not rigid. Follow the conversation thread rather than marching
through sections in order. The structure comes later when you organize.

Keep going until every branch is resolved or explicitly marked as an open
question, and you'd be confident handing the PRD to an engineer who could start
without asking clarifying questions.

### 4. Draft the PRD

Read the template from `references/prd-template.md`. Adapt
section depth to complexity — simple features don't need every section. Show the
complete draft to the user for approval. Iterate if they want changes.

### 5. Publish as GitHub issue

Discover available labels and milestones via `gh label list` and
`gh milestone list`. Create the issue with `[PRD]` title prefix. Show the URL
to the user.

### 6. Offer breakdown

Ask the user: "Want to split this into vertical slice issues?" If no, you're
done — suggest `/snap-scope` or `/snap-forge` as next steps. If yes, continue.

## Breaking into slices

### 7. Explore for slicing

If you haven't already explored deeply, do so now — find module boundaries,
integration points, and existing patterns. Good slicing follows architectural
seams, not requirement boundaries. Understanding the codebase is what separates
naive slicing from useful slicing.

### 8. Draft vertical slices

Break the PRD into tracer-bullet issues. Each slice is a thin vertical cut
through ALL layers (schema → API → logic → UI → tests) — never a horizontal
slice of one layer.

For each slice: title with `[Slice #N]` prefix (where N is the parent PRD issue
number), type (AFK or HITL), size (S/M/L),
blocked-by dependencies, which US/FR/NFR it covers, key files, and a 1-2
sentence summary.

Verify every FR and NFR is covered by at least one slice. Present the breakdown
to the user, iterate until approved.

### 9. Create slice issues

Read the template from `references/issue-template.md`.
Create issues in dependency order (foundation slices first) so you can reference
real issue numbers in blocked-by fields. Discover labels and milestones.

Show summary: issue list with URLs, dependency graph, which can run in parallel,
and coverage map.

## Principles

- **Specificity over vagueness.** "API response < 200ms at p95" is a
  requirement. "The system should be fast" is not.
- **Interview then organize.** Natural conversation first, structured document
  second.
- **Vertical over horizontal.** Every slice must be demoable end-to-end.
- **Codebase-informed.** Slicing along module boundaries beats slicing along
  requirement boundaries.
- **Always recommend.** Every question gets a recommended answer.

## Next steps

- `/snap-scope` to scope and brainstorm implementation of a slice
- `/snap-forge` to start TDD on a slice
