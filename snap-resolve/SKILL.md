---
name: snap-resolve
description: >
  Resolve PR comments, reviews, and feedback from humans and AI bots. Acts
  autonomously — fetches feedback, categorizes it, fixes code with TDD, and
  replies to reviewers with minimal ceremony. Use whenever the user wants to
  address PR feedback, resolve review comments, fix issues raised in a pull
  request, respond to reviewers, handle bot feedback from CodeRabbit, Greptile,
  or Copilot, or fix failing CI checks / GitHub Actions. Trigger on "resolve PR
  comments", "snap-resolve", "fix PR feedback", "address the reviews", "respond
  to PR comments", "handle PR reviews", "fix what the reviewers said", "fix CI",
  "fix failing checks", "fix GitHub Actions", or any variation where the user
  wants to resolve feedback or failing checks on a GitHub pull request.
---

# Snap Resolve — Resolve PR Feedback

Address all feedback on a PR — fix code where needed with TDD, explain decisions
where code changes aren't warranted. Every reviewer gets a tagged reply.

Act autonomously. The user wants feedback resolved — resolve it. Don't ask for
approval on every categorization and reply. Make one summary checkpoint, then
execute everything.

## Process

### 1. Fetch all feedback

Enter plan mode. Gather everything via `gh`:

- Review threads (inline comments + replies)
- Review body comments (text from review submissions)
- PR-level comments (issue comments)
- Check thread resolution status via GraphQL
- CI check failures — fetch via `gh pr checks`, wait up to 60s for pending
  checks, then fetch logs for failures with `gh run view --log-failed`. See
  `references/ci-checks.md` for detailed procedure.

Exclude already-resolved threads. Deduplicate (same feedback in review body and
thread — keep the thread version for its thread ID). Include bot feedback
(CodeRabbit, Greptile, Copilot, Sweep) — reviews with "COMMENTED" state and
actionable body text count as real feedback.

Parse review bodies independently from threads — bots often put feedback in
collapsible sections of review summaries with no associated thread. "All threads
resolved" doesn't mean "all feedback addressed."

### 2. Explore codebase

Based on files and code areas mentioned in feedback, understand the relevant
code. Map which feedback items relate to which files and functions. Understand
existing tests and patterns around affected areas.

### 3. Categorize and plan

Split feedback into two categories using your judgment:

- **[FIX]** — needs code changes. Real bugs, valid improvements, missing tests,
  legitimate performance or security concerns.
- **[EXPLAIN]** — needs explanation only. Reviewer misunderstands the
  architecture, stylistic preference conflicts with project conventions, concern
  is handled elsewhere, suggestion adds unnecessary complexity.

CI failures are always [FIX]. Use your judgment to determine whether a failure
is caused by the PR or is a pre-existing issue.

For each [FIX], plan a TDD cycle: RED test that captures the fix → GREEN
minimal implementation → REFACTOR → VERIFY → COMMIT. Read
`references/tdd-cycle.md` for the cycle structure.

Draft replies for all items. [FIX] replies reference the commit hash. [EXPLAIN]
replies explain the reasoning.

### 4. One summary checkpoint

Show the user ONE summary:
- "Here's what I'll fix: [list with brief descriptions]"
- "Here's what I'll explain: [list with brief descriptions]"
- "Here are N CI failures I'll fix: [list with check name + failure summary]"
- "Here are N items I'm unsure about: [list — ask for guidance]"

Get approval once. Then execute everything.

The current skill asks 4-5 approval questions that add 10+ minutes and hundreds
of tokens for decisions the agent can make correctly 95% of the time. One
checkpoint catches the 5% edge cases.

### 5. Execute fixes

Exit plan mode. For each [FIX] item, run a TDD cycle:
- RED: write test capturing the fix
- GREEN: minimal code to pass
- REFACTOR: if applicable
- VERIFY: full test suite + lint + format
- COMMIT: atomic conventional commit, store the hash

Commit locally but don't push yet.

### 6. Push and reply

After all fixes: one `git push` for all commits.

Reply to all feedback items in parallel:
- [FIX]: "@reviewer — Fixed in `COMMIT_HASH`. [Brief description]"
- [EXPLAIN]: "@reviewer — [Explanation referencing architecture/conventions]"

Resolve threads where applicable via GraphQL mutation.

### 7. Suggest PR update

Mention: "Run `/snap-ship` to update the PR description with these changes."

## Principles

- **Every reviewer gets a reply.** Fix or explain, they deserve a response.
- **Tag reviewers explicitly.** Start with `@username` so they get notified.
- **Commit hashes in fix replies.** Point to the exact commit.
- **Single push, parallel replies.** Batch commits, fire replies concurrently.
- **CI fixes need no reply.** Passing checks after push are the response.
  Deduplicate with reviewer comments that flag the same issue — keep the thread
  ID so the reviewer gets a reply.
- **Act, don't ask.** Categorize using judgment. One checkpoint, then execute.
