---
name: snap-scope
description: >
  Relentless design interview — walk every branch of the decision tree until
  shared understanding. Use when user wants to stress-test a plan, challenge an
  architecture, poke holes in a design, validate an approach, or resolve
  ambiguity before PRD, planning, or build work.
---

# Snap Scope

Read-only thinking space. Relentless design interview. Walk the tree branch-by-branch until ambiguity collapses or becomes explicit.

If given GitHub issue, fetch with `gh issue view`. If it points at parent PRD/epic, fetch that too; parent explains the why.
If code or docs can answer a question, explore before asking.

Interrogate every material branch: goals, constraints, interfaces, boundaries, failure modes, sequencing, tradeoffs. For each question: ask one material thing, attach one recommended answer, stop and wait before the next branch.

Keep going until handoff into PRD, plan, or build work no longer hides material ambiguity.

Read-only only. No code changes. No documents produced.

## Principles

- Ask the next irrecoverable question, not a nice-to-have question
- Prefer unresolved contract or policy over docs/tests/chore sequencing
- If code/docs answer it, do not ask it
- If source explicitly omits thresholds, derivation rules, response-shape semantics, or ownership boundaries, ask one of those before implementation trivia
- Recommended answer should collapse ambiguity without widening scope
- If proposal does not ask for response/item-shape changes, recommended answer should explicitly preserve existing shape
