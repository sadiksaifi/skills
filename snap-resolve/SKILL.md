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

2. **Evidence.** Choose the narrowest route that proves the current worklist:
   - **Warm handoff:** when the current session contains a completed review of the same PR and its reviewed head SHA still matches the PR head, reuse its gathered evidence, conclusions, and posted review as the starting record. Refresh only mutable execution state: local status and HEAD, the PR head SHA, current checks, feedback created after the review, and identifiers or resolution state needed for selected replies. Treat the PR body, reviewed diff, commits, repository instructions, linked artifacts, and established findings as cached; fetch one only to fill a specific gap.
   - **Cold start:** otherwise gather the PR body, comments, reviews, threads and replies, commits, current checks, failed logs, and linked artifacts that affect intent or acceptance.

   A changed head, different target, failed review post, conflicting evidence, or missing action-critical detail invalidates only the affected cached evidence; refresh that evidence rather than restarting discovery. Follow [`references/ci-checks.md`](references/ci-checks.md) for current failed checks. Complete when every reused fact is tied to the current PR head and every candidate item has enough current evidence to classify.

3. **Worklist.** On a warm handoff, start from the review's established findings and unresolved feedback, add only newer feedback and current CI failures, then deduplicate. On a cold start, build the worklist from gathered evidence. Classify each item:
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
