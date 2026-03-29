---
name: snap-resolve
description: >
  Resolve PR comments, reviews, and CI failures autonomously — fetches
  feedback, categorizes into fix/explain, applies TDD fixes, replies to every
  reviewer. Use when user wants to address PR feedback, resolve review
  comments, fix issues raised in a pull request, handle bot feedback
  (CodeRabbit, Greptile, Copilot), or fix failing CI/GitHub Actions. Trigger
  on "snap-resolve", "fix PR feedback", "address reviews", "respond to PR
  comments", "fix CI", "fix failing checks", or any context where user wants
  to resolve feedback on a pull request.
---

# Snap Resolve

Address all PR feedback — fix code with TDD where warranted, explain
decisions where not. Every reviewer gets a tagged reply. Act autonomously —
one checkpoint, then execute.

## 1. Fetch all feedback

Gather via `gh`:
- Review threads (inline comments + replies)
- Review body comments (submission text)
- PR-level comments (issue comments)
- Thread resolution status via GraphQL
- CI failures — `gh pr checks`, wait up to 60s for pending, then
  `gh run view --log-failed`. See `references/ci-checks.md` for procedure.

Exclude resolved threads. Deduplicate (same feedback in review body and
thread → keep thread version for its ID). Bot feedback (CodeRabbit, Greptile,
Copilot, Sweep) with `COMMENTED` state and actionable body counts as real
feedback.

Parse review bodies independently from threads — bots often embed feedback in
collapsible sections with no associated thread. "All threads resolved" ≠ "all
feedback addressed."

## 2. Explore codebase

Map feedback to files and functions. Understand existing tests and patterns
around affected areas. Context prevents wrong fixes.

## 3. Categorize and plan

Split using judgment:

- **[FIX]** — needs code change. Real bugs, valid improvements, missing tests,
  security/performance concerns. CI failures always [FIX].
- **[EXPLAIN]** — needs reply only. Reviewer misunderstands architecture,
  stylistic preference conflicts with project conventions, concern handled
  elsewhere, suggestion adds unnecessary complexity.

For each [FIX], judge severity:
- **Substantive** (logic bugs, behavior changes, missing validation) → full
  TDD cycle: RED → GREEN → VERIFY → COMMIT. See `references/tdd-cycle.md`.
- **Trivial** (typos, imports, renames, formatting) → direct fix → VERIFY →
  COMMIT. TDD on a typo is ceremony, not discipline.

Draft replies for all items. [FIX] replies reference commit hash. [EXPLAIN]
replies give reasoning.

## 4. Checkpoint

Present ONE summary:
- "[FIX] items: [list with brief descriptions]"
- "[EXPLAIN] items: [list with brief descriptions]"
- "CI failures: [list with check name + failure summary]"
- "Unsure: [list — ask for guidance]"

**Wait for approval.** Then execute everything.

## 5. Execute fixes

For each [FIX], run appropriate cycle (TDD or direct based on severity).
Commit locally, don't push yet.

## 6. Push and reply

One `git push` for all commits.

Reply to all items:
- [FIX]: "@reviewer — Fixed in `COMMIT_HASH`. [Brief description]"
- [EXPLAIN]: "@reviewer — [Reasoning referencing architecture/conventions]"

Resolve threads via GraphQL mutation where applicable.

CI fixes need no reply — passing checks are the response. Exception:
deduplicated items where a reviewer also flagged the issue → reply via kept
thread ID.

## 7. Suggest PR update

Mention: "Run `/snap-ship` to update the PR description with these changes."

## Principles

- **Every reviewer gets a reply.** Fix or explain — silence is disrespect.
- **Tag explicitly.** `@username` so they get notified.
- **Commit hashes in fix replies.** Reviewers verify the exact change.
- **Single push, parallel replies.** Batch commits, fire replies concurrently.
- **Judgment over ceremony.** TDD for substance, direct fix for trivia.
- **Act, don't ask.** One checkpoint catches edge cases. Then execute.
