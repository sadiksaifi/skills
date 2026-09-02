---
name: snap-review
description: >
  Review a GitHub pull request in read-only mode for material bugs,
  regressions, missing tests, architecture drift, security/privacy risk,
  performance risk, and merge blockers. Use when the user wants a PR reviewed
  before merge or before posting feedback.
---

## Invocation

Syntax: `/skill:snap-review [auto]`

## Args

| Key | Values | Default | Notes |
| --- | --- | --- | --- |
| `help` | bool | false | show usage |
| `auto` | bool | false | post the review after generating it without asking for confirmation, only when it contains priority-labeled findings |

Review a GitHub pull request in read-only mode. Findings first; no code edits. Ask before posting unless `auto` is provided. Never post a no-finding review to GitHub.

## Process

1. Find the PR from current branch/session context, or ask for one.

2. Gather full review context: PR title/body, base/head refs, changed files, commits, checks, diff, comments, reviews, review threads, and all comment replies. Follow linked issues, specs, PRDs, breakdown comments, parent issues, and links found inside their bodies/comments/replies recursively when they affect scope, acceptance, blockers, or intent.

   Also read the project's applicable agent instructions before judging the diff: root and nearest-path `AGENTS.md` files, `CLAUDE.md` files, or equivalent repo-local guidance that governs the changed paths. Treat those instructions as authoritative review context for conventions, architecture boundaries, test expectations, and output style. If repo instructions conflict, apply the nearest/path-specific guidance first and call out only conflicts that materially affect the review.

3. Review deeply:

   - Compare the diff against gathered intent, linked context, existing contracts, and repo conventions.
   - Account for prior review state. Do not duplicate findings already raised in PR reviews, comments, or threads unless the issue is still present and unresolved. If a prior finding was replied to or addressed, verify the current diff before repeating it.
   - Trace changed paths through callers, inputs, validation, errors, auth, permissions, persistence, concurrency, migrations, compatibility, runtime behavior, docs, and tests.
   - Inspect tests for real regression value. Good tests verify public behavior and would fail if the bug returned. Flag shallow tests, implementation-detail tests, excessive internal mocks, coverage padding, and tests that assert code shape instead of user-visible behavior.
   - Inspect architecture as a first-class review surface. Look for shallow wrappers, pass-through services, anemic public APIs, leaky adapter/domain coupling, vendor/framework/database shapes crossing into business logic, duplicated policy, local-port violations, brittle seams, and interfaces that make future changes harder.
   - File architecture findings when they create concrete future-change, correctness, testability, or maintainability risk.
   - Bad-pattern findings need evidence: violated local convention, repeated brittle shape, avoidable coupling, wrong abstraction boundary, or runtime/tooling mismatch.
   - Cite file/line refs where possible. If exact line refs are unavailable, cite file + changed function/section.
   - Do not invent findings. If impact is speculative, put it in `Risks / Unknowns`.
   - One finding per root cause. Deduplicate symptoms across files, tests, and CI.
   - Produce priority-labeled review findings with concrete impact and evidence. Look for material bugs, regressions, missing tests, security/privacy risk, performance risk, and merge blockers.
   - Treat every material missing-test gap as a priority-labeled `Missing regression coverage` finding with a concrete regression risk; do not report it as a separate unprioritized list.
   - Shape each finding with `Location`, `Reason`, `Impact`, `Evidence`, and `Fix direction`. `Reason` names the concrete failure mechanism; `Fix direction` gives a specific corrective action without supplying a full patch.

4. Report findings first. If there are no priority-labeled findings, output exactly `No Findings` as a single line and stop. Do not include template sections, pending-check notes, risks-only commentary, summaries, or posting offers in this case.

5. Otherwise report using `references/template.md`. Ask before posting unless `auto` is provided. A review qualifies for GitHub posting only when it contains at least one priority-labeled finding. `Risks / Unknowns`, pending checks, summaries, or `No Findings` alone never qualify. If approved or `auto` is provided for a qualifying review, post using the compact format in `references/posting.md`: prefer inline PR review comments for findings that can be anchored to current diff lines and keep only non-inlineable finding blocks plus the required footer in the top-level review body. Show the review/comment URL.
