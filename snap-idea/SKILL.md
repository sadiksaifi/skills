---
name: snap-idea
description: >
  Use when an idea, plan, or design has consequential ambiguity, untested
  assumptions, unclear scope, unresolved tradeoffs, or needs stress-testing
  before specification or implementation.
---

Ask only questions whose answers can change scope, behavior, architecture, risk, acceptance, or the next artifact. Resolve factual questions from existing context, code, and documentation first.

## Interview loop

1. **Map.** Identify unresolved decisions and their dependencies. Start with the highest-leverage blocker.

2. **Ask.** Ask one question per turn. State why it matters, give a recommended answer with brief reasoning, and offer options only when they clarify a real tradeoff. Wait for the user before continuing.

3. **Challenge.** Test each answer against affected users, workflows, edge cases, failure modes, constraints, security and privacy, compatibility, operations, and cost where relevant.

4. **Resolve.** Record the decision, rationale, and downstream consequences. Re-map remaining ambiguity before asking the next question.

## Completion gate

Finish when every material decision that could change specification, issue breakdown, or implementation is either:

- resolved with rationale and consequences
- a factual unknown with a named evidence source or validation step
- explicitly deferred with its impact and revisit trigger

Return a brief decision record containing the goal, decisions, constraints, non-goals, deferred items, and recommended next step.
