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

1. `Fetch:` Gather review threads, review bodies, PR comments, unresolved thread ids, CI failures. Dedupe by actionability.
2. `Explore:` Read affected code, tests, patterns before touching fixes.
3. `Categorize:` Split into `[FIX]` and `[EXPLAIN]`. Use TDD for substantive fixes. Use direct fixes for trivia.

## Lifecycle

Present one checkpoint summary:
- `[FIX]`
- `[EXPLAIN]`
- `CI failures`
- `Unsure`

Checkpoint shape:
- `[FIX]` = deduped defect/work items only. One item per underlying fix set.
- `CI failures` = failing jobs or test names only. If a CI failure maps to an existing `[FIX]`, point to that item id or summary; do not restate the defect as a second work item.
- `[EXPLAIN]` = rationale-only decisions, scope calls, or reviewer answers with no code-change promise.

After approval: execute fixes, push once, reply to every reviewer, resolve addressed threads, suggest `/snap-ship`.

## Principles

- Every reviewer gets a reply
- Commit hashes in fix replies
- `[EXPLAIN]` replies stay rationale-only. No fix hash, file path, docs/code change claim, or "updated X" language unless code actually changed for that thread
- Explain-only reply shape: decision -> why -> scope boundary. Example: `Keeping single-value status for v1 per maintainer guidance; multi-value filter stays out of scope for this PR.`
- `Resolved Threads` lists fix threads actually addressed. Do not auto-list pure explain/rationale threads there unless explicitly resolved in tool state
- One push, then replies
- TDD for substance, not cosmetics
- Resolve what you addressed
