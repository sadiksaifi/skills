---
name: snap-resolve
description: >
  Resolve PR feedback and CI failures with one checkpoint, then execute. Use
  when user wants review comments addressed, bot feedback handled, or failing
  checks fixed. Trigger on "snap-resolve", "fix PR feedback", "address reviews",
  "respond to PR comments", "fix CI", "fix failing checks".
---

# Snap Resolve

Triage, fix, explain, close loop.

## Workflow

1. `Fetch:` Gather PR title, PR body, linked issue refs from PR body, linked issue title/body for each resolvable ref, review threads, review bodies, PR comments, unresolved thread ids, CI failures. Support `#123`, `owner/repo#123`, full GitHub issue URLs, and closing-keyword forms like `closes`, `fixes`, `resolves`. Normalize + dedupe issue refs by canonical issue identity. Route unreadable, invalid, or conflicting refs to `Unsure`.
2. `Explore:` Read fetched PR/issue context first, then affected code, tests, patterns before touching fixes.
3. `Categorize:` Split into `[FIX]` and `[EXPLAIN]`. Scope decisions against PR intent + linked issue context. Use TDD for substantive fixes. Use direct fixes for trivia.

## Lifecycle

Present one checkpoint summary:
- `[FIX]`
- `[EXPLAIN]`
- `CI failures`
- `Unsure`

Checkpoint shape:
- `[FIX]` = deduped defect/work items only. One item per underlying fix set. Scope against PR intent + linked issue context.
- `CI failures` = failing jobs or test names only. If a CI failure maps to an existing `[FIX]`, point to that item id or summary; do not restate the defect as a second work item.
- `[EXPLAIN]` = rationale-only decisions, scope calls, or reviewer answers with no code-change promise. May cite PR or linked issue scope.
- `Unsure` = unreadable/invalid/conflicting issue refs, linked issues with inaccessible bodies, PR↔issue scope conflicts, or reviewer asks whose fit cannot be resolved from fetched context.

After approval: execute fixes, push once, reply to every reviewer, resolve addressed threads, suggest `/snap-ship`.

## Principles

- Every reviewer gets a reply
- Commit hashes in fix replies
- Fetch PR/issue context before categorization. No blind review triage.
- Linked issue discovery comes from PR body refs. Support `#123`, `owner/repo#123`, full GitHub issue URLs, and closing-keyword forms like `closes`, `fixes`, `resolves`.
- Normalize + dedupe linked issues by canonical `owner/repo#number`.
- Invalid, unreadable, or conflicting linked issue context goes to `Unsure`, not silent skip.
- `[EXPLAIN]` replies stay rationale-only. No fix hash, file path, docs/code change claim, or "updated X" language unless code actually changed for that thread.
- Explain-only reply shape: decision -> why -> scope boundary. May cite PR title/body or linked issue title/body when that is the reason. Example: `Keeping single-value status for v1 per PR scope and linked issue #123; multi-value filter stays out of scope for this PR.`
- `Resolved Threads` lists fix threads actually addressed. Do not auto-list pure explain/rationale threads there unless explicitly resolved in tool state.
- One push, then replies
- TDD for substance, not cosmetics
- Resolve what you addressed
