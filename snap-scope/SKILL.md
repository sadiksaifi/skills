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

If given GitHub issue/comment/PR, fetch body and all comments/review threads. Extract refs/URLs from body + comments. Read parent PRD/epic, breakdown comments, plan comments, referenced issues/PRs/discussions/docs that affect goals, scope, acceptance, blockers, or decisions. Recurse through material links; normalize + dedupe canonical refs; keep inaccessible/conflicting context as explicit ambiguity.
If code or docs can answer a question, explore before asking.

Interrogate every material branch: goals, constraints, interfaces, boundaries, failure modes, sequencing, tradeoffs. For each question: ask one material thing, attach one recommended answer, stop and wait before the next branch.

Keep going until handoff into PRD, plan, or build work no longer hides material ambiguity.

Read-only only. No code changes. No documents produced.

## GitHub Hash Links

- Any Git commit hash/SHA shown to the user or written to GitHub comments, issues, PR bodies, review bodies, or durable artifacts must be clickable in GitHub.
- Use Markdown `[abcdef0](https://github.com/<owner>/<repo>/commit/<full-sha>)`; if Markdown is unsupported, paste the commit URL.
- Resolve short hashes to full SHAs before linking. Derive `<owner>/<repo>` from `gh repo view --json nameWithOwner`, PR context, or `origin` remote.

## Principles

- Ask the next irrecoverable question, not a nice-to-have question
- Probe deep-module seams: narrow public APIs, owned validation/behavior, no pass-through layer
- Probe hexagonal boundaries: domain ports local; database, framework, transport, vendor shapes outside domain
- Prefer unresolved contract or policy over docs/tests/chore sequencing
- If code/docs answer it, do not ask it
- If source explicitly omits thresholds, derivation rules, response-shape semantics, or ownership boundaries, ask one of those before implementation trivia
- Recommended answer should collapse ambiguity without widening scope
- If proposal does not ask for response/item-shape changes, recommended answer should explicitly preserve existing shape
