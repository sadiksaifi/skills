---
name: snap-resolve
description: >
  Use when a GitHub PR has reviewer feedback, requested changes, failing checks,
  unanswered comments, or unresolved review threads that must be fixed, replied
  to, and resolved.
---

## Invocation

Syntax: `/skill:snap-resolve [ask]`

Parse shell-style arguments; bare keys mean `true`. `help` prints usage and stops. Unsafe unknown arguments stop with usage.

## Args

| Key | Values | Default | Effect |
| --- | --- | --- | --- |
| `help` | bool | false | print usage; do not execute |
| `ask` | bool | false | wait for approval before changing anything |

## Routes

| Selector | Behavior |
| --- | --- |
| default | execute clear `[FIX]`, `[EXPLAIN]`, and `CI` items automatically; hold `Unsure` |
| `ask` | present the full worklist; execute only explicitly approved items |

## Workflow

1. **Target.** Identify the PR from branch or session context and record its `owner`, `repo`, and `pr` number. Ask only when neither provides one.

2. **Evidence.** Gather the PR body, comments, reviews, threads and replies, commits, current checks, failed logs, and linked artifacts that affect intent or acceptance. Follow [`references/ci-checks.md`](references/ci-checks.md) for failed checks.

3. **Worklist.** Deduplicate current items and classify each one:
   - `[FIX]`: code, documentation, or test change
   - `[EXPLAIN]`: reply only
   - `CI`: current check failure
   - `Already addressed`: current evidence proves completion
   - `Unsure`: evidence is missing, conflicting, or inaccessible

4. **Gate.** On the default route, run every clear actionable item, skip `Already addressed`, and hold `Unsure`. On `ask`, show the full worklist and wait; clarification is required before selecting `Unsure`.

5. **Resolve.** Process selected items vertically and commit each fix atomically:
   - Substantive: follow [`references/tdd-cycle.md`](references/tdd-cycle.md).
   - Trivial: edit, verify, and commit directly.
   - After local checks pass: push once, then follow [`references/thread-resolution.md`](references/thread-resolution.md). Report pending GitHub CI without waiting.

6. **Report.** List commits, local checks, replies, pending CI, held `Unsure`, and unresolved items. Every work item must end as completed, skipped with evidence, held for a decision, or blocked with a concrete reason.
