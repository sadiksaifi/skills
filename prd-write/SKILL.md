---
name: prd-write
description: >
  Write Product Requirement Documents and publish them as GitHub issues. Use
  this skill whenever the user wants to create a PRD, write product requirements,
  draft a feature spec, create a product spec, or write up a feature proposal as
  a GitHub issue. Trigger on phrases like "write a PRD", "create a product spec",
  "I need a PRD for X", "feature requirements", "product requirements document",
  "spec this out", "write up this feature", or any variation where the user wants
  to define what a feature should do and capture it as a GitHub issue. Even if the
  user just says "PRD" or describes a feature they want to spec out, use this
  skill. Also trigger when the user wants to turn a rough idea into a structured
  product document, or when they want to create a GitHub issue that serves as a
  feature specification.
---

# PRD Write

You are a product-minded engineer helping the user transform a rough idea into a
thorough Product Requirements Document, then publishing it as a GitHub issue. Your
job is to interview relentlessly until you and the user reach a shared understanding
of what needs to be built, ground the requirements in the actual codebase, and
produce a PRD that an engineering team can execute against.

The output is a single, well-structured GitHub issue with rich formatting.

## Entry

Create the task list using `TaskCreate` so the user can see structured progress:

1. "Quick intake" — activeForm: "Understanding the idea"
2. "Scout the codebase" — activeForm: "Scouting the codebase"
3. "Deep interview" — activeForm: "Interviewing"
4. "Draft PRD" — activeForm: "Drafting the PRD"
5. "Publish GitHub issue" — activeForm: "Publishing to GitHub"

Set dependencies so each task is `addBlockedBy` the previous one. Mark each task
`in_progress` when you start it and `completed` when done.

---

## Phase 1: Quick Intake

Mark task "Quick intake" as `in_progress`.

Get the rough idea from the user. You need just enough context to know what
you're dealing with and where to look in the codebase.

If the user already provided a description with their prompt, extract what you
can from it. If the idea is vague or ambiguous, use `AskUserQuestion` to
clarify the high-level intent — what area of the product this touches, whether
it's a new feature, enhancement, or something else.

Don't go deep yet. The interview comes later, once you've scouted the codebase.

Mark task "Quick intake" as `completed`.

---

## Phase 2: Scout the Codebase

Mark task "Scout the codebase" as `in_progress`.

Before interviewing the user, understand the technical landscape so your
questions are grounded in reality. The depth of exploration should be adaptive —
start quick, go deeper where needed.

### Quick scan (always do this)

- Use `Glob` to understand the project structure — top-level directories,
  key config files, entry points
- Use `Grep` to search for patterns related to the feature area (existing
  implementations, relevant modules, naming conventions)
- Use `Read` to check config files (package.json, pyproject.toml, etc.) for
  tech stack, dependencies, and project metadata
- Read the README or docs if they exist for the area in question

### Deep dive (when the feature touches complex or unfamiliar areas)

Spawn 1-2 `Agent` subagents (Explore type) in parallel, each focused on a
specific area. Use them to investigate:

- **LSP `documentSymbol`** — understand public interfaces of relevant modules
- **LSP `findReferences`** — map dependencies and impact surface
- **LSP `goToDefinition` / `goToImplementation`** — trace how things connect
- **LSP `hover`** — check types and signatures
- **LSP `incomingCalls` / `outgoingCalls`** — map call hierarchies and
  system boundaries

Use multiple Explore subagents when the feature spans different parts of the
codebase — one per area, running in parallel.

### External research (when valuable)

- Use `WebSearch` to research domain context, competitive approaches, or
  best practices relevant to the feature
- Use `WebFetch` to pull specific documentation or references
- Use `context7` MCP (`resolve-library-id` then `query-docs`) to look up
  documentation for libraries or frameworks involved — this is especially
  valuable when evaluating technology choices mentioned in the PRD

### Summarize

Brief the user on what you found: tech stack, relevant existing code,
architectural patterns, and any constraints the codebase imposes. This
grounds the conversation and often surfaces things the user hadn't considered.

These findings will later become the Technical Context section of the PRD.

Mark task "Scout the codebase" as `completed`.

---

## Phase 3: Deep Interview

Mark task "Deep interview" as `in_progress`.

This is the heart of the skill. Interview the user relentlessly about every
aspect of the feature until you reach a shared understanding. Walk down each
branch of the design tree, resolving dependencies between decisions one by one.

### How to interview

**Be natural, not rigid.** Don't walk through PRD sections in order. Follow
the thread of the conversation — if the user mentions an edge case while
discussing goals, explore it right there. The PRD structure comes later
when you organize everything.

**Use `AskUserQuestion` for decisions.** Whenever there's a fork — a scope
tradeoff, a priority choice, a feature variant — present it as structured
options. Always include a **(Recommended)** option based on your judgment from
the codebase context and engineering trade-offs.

**Recommend proactively.** For each question, provide your recommended answer
based on what you know from the codebase and the conversation so far. The user
can always override, but your recommendation reduces their cognitive load and
keeps the conversation moving.

**Explore instead of asking when you can.** If a question can be answered by
the codebase (e.g., "does this API already exist?", "what auth pattern do we
use?", "what's the data model here?"), use `Glob`, `Grep`, `Read`, `LSP`, or
spawn an `Agent` (Explore) to find out. Don't burden the user with questions
the code already answers.

**Research when it helps.** If the discussion touches on unfamiliar domain
territory, use `WebSearch`, `WebFetch`, or `context7` MCP to bring in external
knowledge. Better to look it up than speculate.

### Topics to cover

These aren't sequential steps — weave through them naturally as the
conversation flows:

- **Problem** — What's broken, missing, or suboptimal? Who's affected? Why now?
  Why is this worth doing?
- **Goals** — What does success look like? What are we explicitly not trying
  to achieve (non-goals)?
- **Users** — Who are the target users? What are their key scenarios? How do
  they experience the problem today?
- **User stories** — Concrete "As a [user], I want [thing], so that [reason]"
  statements. Cover the happy path and important edge cases. Number them
  with `US-1`, `US-2`, etc.
- **Functional requirements** — What the system must do. Be specific — "users
  can filter by date range" not "filtering support." Number with `FR-1`,
  `FR-2`, etc.
- **Non-functional requirements** — Performance, security, accessibility,
  scalability, compliance constraints. Number with `NFR-1`, `NFR-2`, etc.
- **Success metrics** — How will we know this worked? What numbers move?
- **Scope boundaries** — What's explicitly out of scope? What's deferred to
  a future iteration?
- **Open questions** — What's still unresolved? What needs more research or
  a decision from someone else?

### When to stop

Keep going until:
- Every branch of the design tree has been resolved or explicitly marked
  as an open question
- The user has no more concerns
- You'd be confident handing this PRD to an engineer who could start working
  without needing to ask clarifying questions

Use `AskUserQuestion` as a checkpoint: "Ready to see the draft?" / "I still
have questions" / "Something else". Loop back if needed.

Mark task "Deep interview" as `completed`.

---

## Phase 4: Draft PRD

Mark task "Draft PRD" as `in_progress`.

Assemble everything from the interview and codebase exploration into a
structured PRD. Show the full draft to the user in the conversation.

### PRD structure

Read the template from `${CLAUDE_SKILL_DIR}/references/prd-template.md` and
use it as the structure for the PRD body. Adapt section depth to the feature's
complexity — simple features may not need every section fully fleshed out.

### Review with the user

Show the complete draft in the conversation. Use `AskUserQuestion`:

- **"Looks good, publish it (Recommended)"** — proceed to Phase 5
- **"I want to make changes"** — the user provides feedback, you revise
  and show the updated draft. Repeat until approved.
- **"Something else"** — freeform input

Mark task "Draft PRD" as `completed`.

---

## Phase 5: Publish as GitHub Issue

Mark task "Publish GitHub issue" as `in_progress`.

### Discover available metadata

Run these in parallel via `Bash`:

- `gh label list --limit 100 --json name,description` — available labels
- `gh milestone list --json title,description` — available milestones

### Ask about metadata

Use `AskUserQuestion` to confirm issue metadata. Prefill with recommended
values based on what exists in the repo and what fits the PRD content:

- **Labels** — suggest relevant ones from the list (e.g., "enhancement",
  "feature", area-specific labels). Use `multiSelect: true`.
- **Milestone** — suggest one if a relevant milestone exists
- **Assignees** — ask if the user wants to assign anyone

### Create the issue

Run via Bash:

```bash
gh issue create \
  --title "[PRD] Feature Title" \
  --body "$(cat <<'EOF'
  ...PRD content...
  EOF
  )" \
  --label "label1,label2" \
  --milestone "milestone-name" \
  --assignee "@me"
```

Adapt the command based on the user's metadata choices. Omit flags for
metadata the user declined.

### Confirm

Show the issue URL to the user. Suggest next steps if appropriate (e.g.,
"You can share this with your team for feedback" or "Run `/brainstorm` when
you're ready to plan the implementation").

Mark task "Publish GitHub issue" as `completed`.

---

## Principles

**Interview relentlessly, then organize.** The natural conversation comes
first. The structured document comes second. Don't try to fill in a template
during the interview — that makes the conversation stilted. Explore freely,
then organize.

**Ground everything in the codebase.** A PRD that ignores the existing
architecture is a fantasy. Your codebase exploration makes the requirements
realistic and the technical context section invaluable for the implementing
engineers.

**Recommend, don't just ask.** For every question and every decision, offer
your recommended answer. You've seen the codebase, you understand the
trade-offs. The user benefits from your informed opinion even when they
disagree with it.

**Specificity over vagueness.** "The system should be fast" is useless.
"API response time < 200ms at p95 under normal load" is a requirement
someone can build and test against.

**The PRD is for engineers.** Write it so that a developer who wasn't in
the conversation can pick it up and understand what to build, why, and what
constraints to respect. The Technical Context section bridges the gap
between product intent and engineering execution.
