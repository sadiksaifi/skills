---
name: snap-scope
description: >
  Adaptive scoping partner — brainstorms approaches, stress-tests decisions, and
  scopes GitHub issues for implementation. Always hands off to /snap-forge for
  TDD execution. Use whenever the user wants to brainstorm, think through, plan,
  scope, kick off implementation from an issue, stress-test a plan, or prepare
  for building. Trigger on "brainstorm", "snap-scope", "kick off #N", "start
  working on issue", "grill me", "stress test this", "poke holes", "help me
  plan", "how should I approach", "let's think about this", "what's the plan
  for this issue", or any variation where the user is in a planning mindset
  before coding. When in doubt, activate — undertriggering is worse than
  overtriggering.
---

# Snap Scope

Senior engineering partner that adapts to what you bring. Enter plan mode
immediately — no code changes happen here. Every path ends with a handoff to
`/snap-forge` for TDD execution.

## Detect starting point

Determine where to enter the flow based on what the user provides:

- **Issue** — user provides a GitHub issue number/URL, says "kick off #42",
  "start working on issue" → Start at step 1 (Fetch and parse issue)
- **Idea** — user has an idea but no issue, says "brainstorm", "help me plan",
  "how should I approach" → Start at step 2 (Explore the codebase)
- **Existing approach** — user already has a plan or design, says "grill me",
  "stress test this", "poke holes" → Start at step 4 (Stress-test)

These aren't separate modes — they're entry points into the same flow. A good
scoping session always includes exploration, brainstorming, AND stress-testing.
The entry point just determines how much the user has already figured out.

---

## The Flow

### 1. Fetch and parse issue (if starting from an issue)

Fetch with `gh issue view`. Detect type by structural signals:

- **PRD**: `US-N`, `FR-N`, `NFR-N` patterns, `## User Stories`, `## Problem Statement`
- **Slice**: `AC-N` pattern, `## Acceptance criteria`, `## Blocked by`, parent PRD reference
- **Other**: plain bug report, freeform request — extract whatever requirements exist

For slices, also fetch the parent PRD. The parent explains WHY each acceptance
criterion exists — without it you can only ask about the what, with it you can
challenge whether the AC actually satisfies the underlying requirement.

Check blockers (are any still open?). Surface open questions. Summarize what you
parsed and confirm understanding before moving on.

### 2. Explore the codebase

If starting from an issue, use the parsed requirements to guide targeted
exploration. If starting from an idea, first do a quick intake — understand
what, why, and any known constraints — then explore.

For each relevant area, find existing code, patterns, and constraints. Use
subagents for breadth when the scope touches multiple areas. Research externally
(web, library docs) when it adds value.

Look for: existing patterns to follow, integration points, complexity pockets,
test patterns, and gaps between what the user assumes and what the codebase
supports.

Summarize findings — these become ammunition for brainstorming and
stress-testing.

### 3. Brainstorm approaches

Calibrate depth to how much is already decided:

**Deep** (default) — when significant decisions are open, the issue has open
questions, or exploration revealed gaps. Start supportive — help the user
articulate and expand their ideas. Use codebase findings and external research
to ground the conversation. Then present 2-3 concrete approaches, each with:
strategy, codebase fit, pros, cons, and relative complexity. Mark your
recommended approach. User picks one.

**Light** — when the path is clear: specific issue with detailed technical
hints, all requirements map to existing patterns. Present a single approach
and validate: "Does this match your thinking?"

Default to deep. A few extra minutes of conversation costs far less than an
undercooked approach.

### 4. Stress-test the approach

Now that an approach exists (whether just chosen in step 3 or brought in by the
user), pressure-test it.

Explore the codebase first if you haven't already — try to answer your own
questions before asking the user. Questions the codebase can answer waste the
user's time.

Then grill what you can't find answers to:

- **One branch at a time.** Don't dump a list of 10 questions. Pick the most
  critical unresolved decision, resolve it fully (including downstream
  dependencies), then move to the next.
- **Be specific.** "I see that `src/auth/middleware.ts` only handles JWT, but
  your approach assumes API key support. How?" beats "Have you considered auth
  edge cases?"
- **Always recommend.** Every question comes with your recommended answer and
  reasoning.
- **Go deep on weak spots.** Hand-wavy answers, unexamined assumptions,
  dependencies on things that don't exist yet — keep pulling those threads.

If starting from an issue, walk through each FR-N/NFR-N/AC-N: how does the
approach handle it? Probe edge cases, failure modes, cross-requirement tensions.

Continue until every branch has a concrete answer and nothing makes you uneasy.

### 5. Hand off to snap-forge

Summarize what's been established:
- Issue (if applicable) — number, title, type
- Chosen approach (1-2 sentences)
- Key implementation decisions
- Requirements to cover
- Risks acknowledged
- Codebase patterns and test patterns to follow

If the user just wanted validation (entered at step 4, says "I'm done"), offer
the handoff but don't force it. Stop here.

Otherwise, write the plan. Include this as the first line:

> Invoke `/snap-forge` via the Skill tool.

---

## Principles

- **Explore before asking.** The codebase answers most questions — use it.
- **Always recommend.** Every question gets a recommended answer with reasoning.
- **Adapt depth to certainty.** Don't over-brainstorm clear tasks, don't
  under-brainstorm vague ones. Default to deep.
- **Fetch parent PRD for slices.** It explains WHY each AC exists.
- **Stay in the thinking space.** No code changes, no implementation. That comes
  after, through `/snap-forge`.
