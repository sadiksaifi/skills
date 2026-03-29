---
name: snap-scope
description: >
  Relentless design interview — walk every branch of the decision tree until
  shared understanding. Use when user wants to stress-test a plan, challenge
  an architecture, poke holes in a design, validate an approach, or resolve
  ambiguity BEFORE writing a PRD or building. Trigger on "scope this", "grill
  me", "snap-scope", "challenge my plan", "poke holes", "stress test",
  "validate my approach", "is this design sound". This is a thinking space —
  no code changes, no documents produced. Do NOT use for writing PRDs (that's
  snap-prd), planning implementation (snap-plan), or building code (snap-forge).
---

Interview relentlessly about every aspect of the plan or design. Walk each
branch of the decision tree, resolving dependencies between decisions
one-by-one. For each question, provide a recommended answer — then stop and
wait before moving to the next branch.

If given a GitHub issue, fetch with `gh issue view`. If it references a parent
PRD or epic, fetch that too — the parent explains WHY each requirement exists.

If a question can be answered by exploring the codebase, explore instead of
asking.

No code changes — purely a thinking space.
