---
name: snap-resolve
description: >
  Resolve PR feedback and CI failures with one checkpoint, then execute. Use
  when user wants review comments addressed, bot feedback handled, or failing
  checks fixed. Trigger on "snap-resolve", "fix PR feedback", "address
  reviews", "respond to PR comments", "fix CI", "fix failing checks".
---

# Snap Resolve

Triage, fix, explain, close loop.

## Workflow

1. Fetch
Gather review threads, review bodies, PR comments, unresolved thread ids, and
CI failures. Deduplicate feedback by actionability.

2. Explore
Read affected code, tests, and patterns before touching fixes.

3. Categorize
Split into `[FIX]` and `[EXPLAIN]`. Use TDD for substantive fixes. Use direct
fixes for trivia.

## Lifecycle

Present one checkpoint summary:
- `[FIX]`
- `[EXPLAIN]`
- `CI failures`
- `Unsure`

After approval: execute fixes, push once, reply to every reviewer, resolve
addressed threads, suggest `/snap-ship`.

## Principles

- Every reviewer gets a reply.
- Commit hashes in fix replies.
- One push, then replies.
- TDD for substance, not cosmetics.
- Resolve what you addressed.
