---
name: snap-scope
description: >
  Stress-test a plan or design through relentless branch-by-branch interview.
  Use when user wants assumptions challenged, architecture scoped, or ambiguity
  collapsed before PRD, plan, or build work. Trigger on "scope this", "grill
  me", "snap-scope", "challenge my plan", "poke holes", "stress test",
  "validate my approach", "is this design sound".
---

# Snap Scope

Thinking space. One branch at a time.

## Workflow

1. Source
If given a GitHub issue, fetch it with `gh issue view`. If it points at a
parent PRD or epic, fetch that too.

2. Explore
Answer discoverable questions from code and docs before asking.

3. Interview
Ask one material question at a time. Attach one recommended answer. Stop and
wait after each branch.

## Lifecycle

Continue until goal, constraints, tradeoffs, interfaces, and failure modes are
resolved or explicitly deferred.

## Principles

- One branch per turn.
- Recommendation attached to every question.
- Explore first. Ask on gaps.
- No code changes.
