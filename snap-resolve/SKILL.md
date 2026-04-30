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

1. `Fetch:` Gather PR title, PR body, PR comments, review threads, review bodies, unresolved thread ids, CI failures. Extract linked refs/URLs from PR body + comments/reviews. For each resolvable issue ref, fetch title/body/comments. Read parent PRD/epic, breakdown comments, plan comments, and referenced issues/PRs/discussions/docs that affect fix scope. Recurse through material scope/acceptance/blocker links. Support `#123`, `owner/repo#123`, full GitHub issue URLs, and closing-keyword forms like `closes`, `fixes`, `resolves`. Normalize + dedupe refs by canonical identity. Route unreadable, invalid, or conflicting refs to `Unsure`.
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

After approval: execute fixes, push once, reply to every reviewer using the fix/explain reply patterns, resolve addressed threads, suggest `/snap-ship`.

## GitHub Hash Links

- Any Git commit hash/SHA shown to the user or written to GitHub comments, issues, PR bodies, review bodies, or durable artifacts must be clickable in GitHub.
- Use Markdown `[abcdef0](https://github.com/<owner>/<repo>/commit/<full-sha>)`; if Markdown is unsupported, paste the commit URL.
- Resolve short hashes to full SHAs before linking. Derive `<owner>/<repo>` from `gh repo view --json nameWithOwner`, PR context, or `origin` remote.

## Fix Reply Pattern

For every `[FIX]` reviewer reply, use this shape:

```md
Addressed <specific defect/scope> from <source comment/review/CI link> in [abcdef0](https://github.com/<owner>/<repo>/commit/<full-sha>):

- <observable outcome, behavior, or guard added>
- <test/coverage detail when material>

Verified:
- `<command>`
- `<command>`
```

Rules:
- Lead with `Addressed ... from ... in ...:`. Link the source review/comment when possible; use `this thread` only when replying inline and no stable URL is available.
- Link every material fix commit. If the fix spans commits, write `in [sha1](...), [sha2](...):`.
- Bullets state shipped outcomes, not implementation diary.
- `Verified:` lists commands actually run against the final pushed state. Omit commands not run.
- If multiple threads share one fix, reuse the same commit + verification facts, but tailor the defect/source phrase per thread.

## Principles

- Every reviewer gets a reply
- Fix replies must follow the `Addressed ... from ... in ...` pattern with a `Verified:` command list
- Commit hashes in fix replies must use GitHub commit links
- Fetch PR/issue context before categorization. No blind review triage.
- Linked issue discovery comes from PR body, PR comments, review bodies, review threads, and closing-keyword forms. Support `#123`, `owner/repo#123`, full GitHub issue URLs, and forms like `closes`, `fixes`, `resolves`.
- Normalize + dedupe linked issues by canonical `owner/repo#number`.
- Invalid, unreadable, or conflicting linked issue context goes to `Unsure`, not silent skip.
- `[EXPLAIN]` replies stay rationale-only. No fix hash, file path, docs/code change claim, or "updated X" language unless code actually changed for that thread.
- Explain-only reply shape: decision -> why -> scope boundary. May cite PR title/body or linked issue title/body when that is the reason. Example: `Keeping single-value status for v1 per PR scope and linked issue #123; multi-value filter stays out of scope for this PR.`
- `Resolved Threads` lists fix threads actually addressed. Do not auto-list pure explain/rationale threads there unless explicitly resolved in tool state.
- One push, then replies
- TDD for substance, not cosmetics
- Fix toward deep modules, narrow interfaces: owned behavior over pass-through glue
- Preserve hexagonal boundaries: domain avoids database, framework, transport, vendor shapes; adapters translate
- Resolve what you addressed
