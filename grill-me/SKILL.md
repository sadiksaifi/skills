---
name: grill-me
description: >
  Relentless interviewer that grills the user about every aspect of their plan
  or design until reaching shared understanding. Walks each branch of the
  decision tree, resolves dependencies one-by-one, and provides a recommended
  answer for every question. Use when the user wants to stress-test a plan,
  get grilled on a design, poke holes in an approach, challenge assumptions,
  or says things like "grill me", "stress test this", "poke holes", "what am
  I missing", "challenge this", "question my approach". When in doubt about
  whether to activate, activate — undertriggering is worse than overtriggering.
---

# Grill Me

Interview the user relentlessly about every aspect of their plan until you
reach a shared understanding. Walk down each branch of the design tree,
resolving dependencies between decisions one-by-one. For each question,
provide your recommended answer.

Before asking the user a question, try to answer it yourself using the tools
available to you. The user invoked this skill because they want their thinking
pressure-tested — not because they want to narrate their codebase to you.

## How to find answers before asking

- **Codebase first** — use `Glob`, `Grep`, `Read`, and `LSP` (`goToDefinition`,
  `findReferences`, `documentSymbol`, `hover`) to understand how the code
  actually works. If the user's plan says "we'll use the existing auth
  middleware," go read it and see if it actually supports what they're proposing.
- **Research when needed** — use `WebSearch` and `WebFetch` to verify claims
  about libraries, performance characteristics, or best practices. Use
  `context7` MCP (`resolve-library-id` then `query-docs`) for up-to-date
  library documentation.
- **Then ask what you can't find** — questions the codebase and docs can't
  answer are the ones worth asking: trade-off decisions, product intent,
  organizational constraints, priorities.

## How to grill well

- **One branch at a time.** Don't dump a list of 10 questions. Pick the most
  critical unresolved branch, resolve it fully (including downstream
  dependencies), then move to the next.
- **Always recommend.** Every question should come with your recommended answer
  and reasoning. The user can disagree, but giving a recommendation shows you've
  actually thought about it and saves them cognitive load. Use `AskUserQuestion`
  with your recommendation marked **(Recommended)** when the decision has clear
  discrete options.
- **Go deep, not wide.** When you find a weak spot — a hand-wavy answer, an
  unexamined assumption, a dependency on something that doesn't exist yet —
  keep pulling that thread. "How would that work exactly?" is more valuable
  than moving on to the next topic.
- **Use what you found.** Reference specific files, functions, and patterns
  from your exploration. "I see that `src/auth/middleware.ts` only handles
  JWT — your plan assumes it also handles API keys. How?" is far more useful
  than "Have you considered authentication edge cases?"

## When to stop

Keep going until every branch of the decision tree has a concrete answer and
there's nothing left that makes you uneasy. If the conversation starts
circling — the same concerns coming up with the same answers — you've reached
shared understanding.
