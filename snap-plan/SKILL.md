---
name: snap-plan
description: >
  Turn any GitHub issue (PRD or slice) into a phased implementation plan posted
  as an issue comment — durable architectural decisions, tracer-bullet vertical
  slices. Use when user wants to plan HOW to implement a specific issue, phase
  the work, identify durable decisions, or figure out what to build first.
  Trigger on "snap-plan", "plan this issue", "tracer bullet", "implementation
  plan", "phase this work", "what should we build first", "durable decisions
  for issue #N". Input is a GitHub issue number/URL. Do NOT use for writing
  PRDs (snap-prd) or breaking PRDs into separate task issues (snap-slice).
---

# Snap Plan

Read a GitHub issue → identify durable decisions → draft tracer-bullet phases
→ post as issue comment. Issue-type agnostic — works on PRDs or individual
slices; plan depth scales to issue scope.

## 1. Get the issue

If issue URL/number in conversation context, use it. Otherwise ask. Fetch
with `gh issue view <number>`.

## 2. Explore codebase

Understand current architecture, existing patterns, integration layers. Focus
on what's relevant to the issue — module boundaries, dependency graphs, test
infrastructure.

Use subagents for deep exploration of unfamiliar areas.

## 3. Identify durable architectural decisions

Before phasing, lock down decisions unlikely to change across implementation:

- Route structures / URL patterns
- Database schema shape
- Key data models and abstractions
- Auth/authz approach
- Third-party service boundaries

These anchor the plan — every phase references them.

## 4. Draft tracer-bullet phases

Break the issue into vertical slices. Each phase is a thin end-to-end path
through ALL layers — never a horizontal slice of one layer.

- Each slice delivers a narrow but COMPLETE path (schema → API → logic → UI → tests)
- Completed slice is demoable or verifiable standalone
- Prefer many thin slices over few thick ones
- Include durable decisions (routes, schemas, model names) — exclude volatile details (file paths, function names)
- Order simplest-to-most-complex; first phase is the tracer bullet (thinnest possible end-to-end proof)

## 5. Post as issue comment

Post plan as comment on the source issue via `gh issue comment`. Present the
posted plan to the user — they can request changes (repost with edits) or
proceed to snap-forge/snap-slice.

```
## Durable Decisions
- **Routes:** ...
- **Schema:** ...
- **Key models:** ...

---

## Phase 1: [Title] (tracer bullet)
**Covers:** [user stories / requirements from source issue]
### What to build
[End-to-end behavior, not layer-by-layer]
### Acceptance criteria
- [ ] ...

---

## Phase 2: [Title]
...
```

## Principles

- **Vertical over horizontal.** Every phase is end-to-end, never one-layer-deep.
- **Durable over volatile.** Plan references routes/schemas/models, not file paths.
- **Tracer bullet first.** Thinnest possible proof that the path works.
