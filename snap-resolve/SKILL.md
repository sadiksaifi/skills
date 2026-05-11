---
name: snap-resolve
description: >
  Resolve GitHub PR feedback and failing checks. Use when the user wants review
  comments addressed, CI failures fixed, reviewer replies posted, or addressed
  review threads resolved.
---

## Invocation

Syntax: `/skill:snap-resolve [auto]`

## Args

| Key | Values | Default | Notes |
| --- | --- | --- | --- |
| `help` | bool | false | show usage |
| `auto` | bool | false | skip checkpoint approval for clear `[FIX]`, `[EXPLAIN]`, and `CI` items; never auto-run `Unsure` |

Resolve GitHub PR feedback and failing checks. One checkpoint before execution unless `auto` is provided.

## Process

1. Find the PR from current branch/session context, or ask for one.

2. Gather full PR context: title/body, comments, reviews, review threads, replies, checks, failed logs, and linked issues/specs/PRDs recursively when they affect scope, acceptance, blockers, or intent. Use `references/ci-checks.md` for CI failure parsing.

3. Classify each current item, accounting for prior replies, resolved threads, commits, and CI reruns:
   - `[FIX]`: requires code/docs/test change
   - `[EXPLAIN]`: reply only; no code-change promise
   - `CI`: failing check or log-derived failure
   - `Already addressed`: prior reply/fix/CI update shows the item was handled; skip unless it is still failing or explicitly reopened
   - `Unsure`: missing, conflicting, or inaccessible context

4. Show one checkpoint with `[FIX]`, `[EXPLAIN]`, `CI`, `Already addressed`, and `Unsure`. Wait for approval unless `auto` is provided. Never auto-run `Unsure`.

5. Execute approved fixes. Use `references/tdd-cycle.md` for substantive fixes and direct edits for trivial fixes. Commit each fix atomically.

6. Reply using `references/thread-resolution.md`: use true review-thread inline replies when a thread endpoint exists; for top-level PR comments, post a quote-reply comment that quotes the relevant original feedback. Resolve addressed review threads only after replying. Push once, then report commits, verification, replies, and remaining unresolved items.
