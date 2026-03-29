---
name: snap-prd
description: >
  Write a structured PRD through user interview, codebase exploration, and deep
  module identification — publish as GitHub issue with numbered US/FR/NFR
  identifiers. Use when user wants to write a PRD, spec out a feature, document
  requirements, create a product spec, or formalize what to build. Trigger on
  "snap-prd", "write a PRD", "spec this out", "product spec", "I need a PRD",
  "document the requirements", "feature proposal". This produces a GitHub issue
  — do NOT use for challenging a design (snap-scope), planning implementation
  phases (snap-plan), or breaking a PRD into task issues (snap-slice).
---

# Snap PRD

Interview → explore → draft → publish. Skip steps when context already exists.

## 1. Intake

Extract the rough idea. If vague, ask just enough to identify the product area
and where to look in the codebase. Save depth for the interview.

## 2. Explore codebase

Understand the technical landscape before interviewing — questions must be
grounded in architectural reality. A PRD divorced from architecture is fantasy.

Specifically look for:
- **Existing patterns** the feature should follow or extend (route conventions,
  DB migration patterns, component structure, API contracts)
- **Module boundaries** — where the new feature touches existing modules and
  where new ones are needed
- **Deep modules** (Ousterhout): small interface, large implementation. Identify
  where they exist and where the new feature should create them. Name them
  explicitly in Implementation Decisions
- **Test infrastructure** — existing test patterns, frameworks, prior art for
  similar features
- **Constraints** — what the architecture makes easy or hard

Use subagents for complex or unfamiliar areas. Research externally (web,
library docs) when it adds value.

## 3. Interview relentlessly

Walk each branch of the design tree, resolving dependencies one-by-one.
Provide a recommended answer for every question — reduces cognitive load,
keeps momentum.

When the codebase can answer a question, explore instead of asking.

Cover: problem statement, proposed solution, user stories, functional
requirements, non-functional requirements, implementation decisions (modules,
interfaces, schemas, API contracts, architectural choices), testing decisions
(what to test, which modules, prior art), success metrics, scope boundaries,
open questions.

Natural conversation first, structured document second. Follow the thread;
don't march through sections rigidly. Continue until every branch is resolved
or explicitly deferred — the PRD must be handoff-ready to an engineer with
zero clarifying questions.

## 4. Draft the PRD

Read `references/prd-template.md`. Adapt section depth to complexity — simple
features don't need every section. Show complete draft for approval; iterate
on feedback.

## 5. Publish as GitHub issue

Discover labels/milestones via `gh label list`, `gh milestone list`. Create
issue with `[PRD]` title prefix. Show URL to user.

## Principles

- **Specificity over vagueness.** "API < 200ms at p95" is a requirement; "fast" is not.
- **Deep modules over shallow.** Small interfaces hiding significant implementation.
- **Interview then organize.** Natural conversation first, structure second.
- **Always recommend.** Every question gets a recommended answer.
- **PRD, not tech spec.** Implementation Decisions describe architectural choices
  and rationale — never include code snippets, file contents, or implementation
  details that go stale. The PRD is a product document that survives refactors.
