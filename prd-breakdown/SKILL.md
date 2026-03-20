---
name: prd-breakdown
description: >
  Break a PRD (Product Requirements Document) into independently-grabbable
  GitHub issues using vertical slices (tracer bullets). Use this skill whenever
  the user wants to break down a PRD, split a feature spec into issues, create
  implementation tasks from a PRD, turn a PRD into a backlog, or decompose
  requirements into work items. Trigger on phrases like "break down this PRD",
  "create issues from the PRD", "split this into tasks", "turn this spec into
  issues", "vertical slices", "tracer bullets", "decompose this PRD",
  "implementation issues for PRD #N", or any variation where the user has a PRD
  (or feature spec) and wants it broken into actionable GitHub issues. Even if
  the user just says "break this down" or "create issues" in the context of a
  PRD or feature document, use this skill.
---

# PRD Breakdown

You are a senior engineer breaking a Product Requirements Document into vertical
slices — thin, end-to-end tracer bullets that each cut through every layer of
the system and are independently demoable. Your job is to understand the PRD,
explore the codebase to find natural seams for slicing, draft the breakdown,
iterate with the user, and create the GitHub issues.

The key insight behind vertical slicing is that a thin slice through all layers
(schema → API → UI → tests) is more valuable than a thick horizontal slice of
one layer. Each slice should be something an engineer can pick up, implement,
and demo without waiting on other slices — unless there's a genuine technical
dependency.

## Entry

Create the task list using `TaskCreate` so the user can see structured progress:

1. "Locate the PRD" — activeForm: "Locating the PRD"
2. "Explore the codebase" — activeForm: "Exploring the codebase"
3. "Draft vertical slices" — activeForm: "Drafting vertical slices"
4. "Prepare issue content" — activeForm: "Preparing issues"
5. "Create GitHub issues" — activeForm: "Creating issues"

Set dependencies so each task is `addBlockedBy` the previous one. Mark each
task `in_progress` when you start it and `completed` when done.

---

## Phase 1: Locate the PRD

Mark task "Locate the PRD" as `in_progress`.

Get the PRD into context. The user might provide:
- A GitHub issue number (`#42`, `42`)
- A GitHub issue URL
- The PRD text directly in their prompt
- A reference to a recent conversation where the PRD was created

If the user provided a number or URL, use Bash to fetch it:

```bash
gh issue view <number> --json number,title,body,labels,milestone,url
```

If the user didn't specify, use `AskUserQuestion` to ask for the issue number.

### Parse the PRD

Extract structured elements from the PRD body:

- **User stories** — look for `US-N` prefixed items
- **Functional requirements** — look for `FR-N` prefixed items
- **Non-functional requirements** — look for `NFR-N` prefixed items
- **Technical Context** — architecture notes, key files, constraints
- **Open Questions** — unresolved items that may need HITL slices
- **Out of Scope** — boundaries to respect when slicing

If the PRD doesn't follow the `US-N`/`FR-N`/`NFR-N` convention, extract
requirements from whatever structure exists — bullet points, numbered lists,
prose sections. Assign temporary IDs so you can reference them in slices.

Summarize the PRD back to the user briefly — confirm you've understood the
scope correctly before proceeding.

Mark task "Locate the PRD" as `completed`.

---

## Phase 2: Explore the Codebase

Mark task "Explore the codebase" as `in_progress`.

Understanding the codebase is what separates good slicing from naive slicing.
Without it, you'll slice along requirement boundaries. With it, you'll slice
along architectural seams — which is where the real value is.

### Quick scan (always)

- Use `Glob` to map the project structure — directories, entry points,
  config files
- Use `Grep` to find code related to the PRD's feature area — existing
  modules, naming patterns, related implementations
- Use `Read` to check key config files for tech stack and dependencies

### Deep dive (when the PRD touches complex areas)

Spawn 1-2 `Agent` subagents (Explore type) in parallel, each focused on a
specific area:

- **LSP `documentSymbol`** — understand module public interfaces
- **LSP `findReferences`** — map what depends on what
- **LSP `goToDefinition` / `goToImplementation`** — trace connections
- **LSP `hover`** — check types and signatures
- **LSP `incomingCalls` / `outgoingCalls`** — map call chains and
  system boundaries

The goal is to identify:
- **Module boundaries** — where one concern ends and another begins
- **Integration points** — database, APIs, external services, UI components
- **Existing patterns** — how similar features were built before
- **Shared infrastructure** — utilities, middleware, base classes that
  slices will build on

### External research (when needed)

- Use `WebSearch` or `WebFetch` for unfamiliar technologies mentioned in the PRD
- Use `context7` MCP (`resolve-library-id` then `query-docs`) for
  library-specific implementation guidance

### Summarize

Brief the user on what you found and how it affects the slicing strategy.
For example: "The codebase has a clear MVC separation — each slice should
touch the model, controller, and view layers. The auth middleware is shared,
so the first slice should include any auth changes needed."

Mark task "Explore the codebase" as `completed`.

---

## Phase 3: Draft Vertical Slices

Mark task "Draft vertical slices" as `in_progress`.

This is the core of the skill. Break the PRD into tracer-bullet slices.

### Slicing principles

**Vertical, not horizontal.** Each slice cuts through ALL integration layers
end-to-end (schema → API → business logic → UI → tests). Never create a slice
that is just "build the database layer" or "build the API" — those are
horizontal slices that can't be demoed independently.

**Thin over thick.** Prefer many small slices over few large ones. A slice
that takes a day is better than one that takes a week. More slices means
more opportunities for parallel work and faster feedback.

**Follow architectural seams.** Use what you learned in Phase 2. If the
codebase has natural module boundaries, slice along them. If there's a
shared infrastructure layer, the first slice should set it up.

**Foundation first.** If multiple slices depend on shared infrastructure
(e.g., a new database table, a new API route pattern, a new component
library), create a "foundation" slice that sets this up. Keep it minimal —
just enough for the next slices to build on.

### Classify each slice

For each slice, determine:

- **Title** — use the `[Slice]` prefix followed by a short, descriptive name
  (e.g., `[Slice] Add skill search endpoint + basic CLI`). The prefix makes
  slices instantly recognizable in GitHub issue lists alongside the parent PRD.
- **Type:**
  - **AFK** — can be implemented and merged without human decisions. Prefer
    AFK slices — they're the ones engineers can grab and run with.
  - **HITL** — requires a human decision before or during implementation
    (e.g., "Choose the auth provider", "Design the database schema",
    "Get UX sign-off on the flow"). Keep these few and front-load them
    so they don't block AFK slices.
- **Size** — rough complexity signal:
  - **S** — a few hours of focused work
  - **M** — a day or two
  - **L** — multiple days (consider splitting further)
- **Blocked by** — which other slices must complete first. Minimize
  dependencies — the more slices that can run in parallel, the better.
- **Covers** — which US-N, FR-N, NFR-N items from the PRD this slice
  addresses. Every requirement should appear in at least one slice.
- **Key files** — which files/modules this slice will likely touch
  (from your codebase exploration)
- **Summary** — 1-2 sentences describing the end-to-end behavior this
  slice delivers

### Coverage check

After drafting all slices, verify that every FR-N and NFR-N from the PRD is
covered by at least one slice. If any requirement is orphaned, either add it
to an existing slice or create a new one. Flag any Open Questions from the
PRD that need HITL slices.

### Present to the user

Show the full breakdown as a numbered list with all the fields above.
Highlight:
- Which slices can start immediately (no blockers)
- Which slices are on the critical path (blocking the most other slices)
- Any requirements that were hard to place

Use `AskUserQuestion`:

- **"Looks good, prepare the issues (Recommended)"** — proceed to Phase 4
- **"Too coarse — split some slices further"** — user specifies which slices
  to split, you refine and re-present
- **"Too fine — merge some slices"** — user specifies which to merge
- **"Something else"** — freeform feedback

Iterate until approved.

Mark task "Draft vertical slices" as `completed`.

---

## Phase 4: Prepare Issue Content

Mark task "Prepare issue content" as `in_progress`.

### Draft issues

Read the issue template from `${CLAUDE_SKILL_DIR}/references/issue-template.md`
and prepare the full issue body for each slice.

For each issue:
- Fill in the template with the slice's details
- Write acceptance criteria that are specific and testable — tie each AC
  back to the parent PRD's FR-N or NFR-N where possible
- Include technical hints from your codebase exploration — specific files,
  patterns to follow, gotchas
- Include the blocked-by field (will be updated with real issue numbers
  in Phase 5)

### Show drafts to the user

Present all issue drafts in the conversation. The user should see exactly
what will be created. Use `AskUserQuestion`:

- **"Looks good, create them (Recommended)"** — proceed to Phase 5
- **"I want to edit some"** — user provides changes, you revise
- **"Something else"** — freeform

### Discover metadata

Run these Bash commands in parallel:

- `gh label list --limit 100 --json name,description` — available labels
- `gh milestone list --json title,description` — available milestones

Use `AskUserQuestion` to confirm metadata. Prefill with recommended values:

- **Labels** — suggest relevant ones (e.g., "enhancement", area-specific
  labels, "size:S", "size:M", "size:L"). Use `multiSelect: true`.
- **Milestone** — suggest one if a relevant milestone exists (often the
  same milestone as the parent PRD)
- **Assignees** — ask if the user wants to assign anyone

Mark task "Prepare issue content" as `completed`.

---

## Phase 5: Create GitHub Issues

Mark task "Create GitHub issues" as `in_progress`.

### Create in dependency order

Create issues starting with the ones that have no blockers (foundation
slices), then work through the dependency graph. This is important because
each issue's "Blocked by" field needs to reference real issue numbers.

For each slice, run via Bash:

```bash
gh issue create \
  --title "[Slice] Title" \
  --body "$(cat <<'EOF'
  ...issue body...
  EOF
  )" \
  --label "label1,label2" \
  --milestone "milestone-name"
```

After creating each issue, capture its number from the output. Use it to
populate the "Blocked by" field in subsequent issues that depend on it.

### Summary

After all issues are created, show the user:

1. **Issue list** — all created issues with their numbers, titles, types
   (AFK/HITL), sizes, and URLs
2. **Dependency graph** — which issues block which, shown as a simple tree
3. **Parallel lanes** — which issues can be worked on simultaneously
4. **Coverage map** — which PRD requirements (FR-N, NFR-N) each issue covers

Suggest next steps:
- "Assign the unblocked slices to get started"
- "Resolve the HITL slices first to unblock downstream work"
- "Run `/brainstorm` or `/tdd-plan` when picking up a slice"

Do NOT close or modify the parent PRD issue.

Mark task "Create GitHub issues" as `completed`.

---

## Principles

**Vertical over horizontal.** The single most important principle. Every
slice must cut through all layers. An engineer should be able to pick up
one slice, implement it, and have something demoable — not a database
migration that nobody can see working.

**Codebase-informed slicing.** The difference between naive slicing (just
splitting requirements evenly) and good slicing (following architectural
seams) is codebase knowledge. A slice that aligns with module boundaries
is easier to implement, review, and merge than one that cuts across them.

**Maximize parallelism.** The fewer dependencies between slices, the more
engineers can work simultaneously. When you find yourself creating a long
chain of dependencies, ask whether those slices can be restructured to
run in parallel instead.

**Every requirement has a home.** After slicing, every FR-N and NFR-N from
the PRD should appear in at least one slice's coverage. If a requirement
is orphaned, something went wrong in the breakdown.

**HITL slices should be front-loaded.** Human decisions (architecture
choices, UX reviews, vendor selections) block downstream work. Identify
them early, make them their own slices, and put them at the top of the
dependency graph so they get resolved first.

**Recommend, don't just ask.** When presenting options via `AskUserQuestion`,
always label one as **(Recommended)** based on your judgment. The user
benefits from your informed opinion.
