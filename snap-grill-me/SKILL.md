---
name: snap-grill-me
description: Interview the user relentlessly about a plan or design until reaching shared understanding, resolving each branch of the decision tree. Use when user wants to stress-test a plan, get grilled on their design, or mentions "grill me".
---

Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer — then stop and wait for my response before moving to the next branch.

If given a GitHub issue, fetch it with `gh issue view`. If it references a parent PRD or epic, fetch that too — the parent explains WHY each requirement exists.

If a question can be answered by exploring the codebase, explore the codebase instead.

No code changes — this is purely a thinking space.
