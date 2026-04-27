---
name: snap-review
description: >
  Read-only PR review. Use when user wants a pull request reviewed for bugs,
  regressions, missing tests, or merge risk before asking humans to review or
  before resolving feedback. Trigger on "snap-review", "review this PR",
  "review the PR", "PR review", "check this pull request".
---

# Snap Review

Deep reviewer pass from diff truth. Read-only. Findings first. Bias toward negative discovery: bugs, regressions, broken contracts, missing tests, bad patterns, maintainability traps, architectural drift, security/privacy risk, performance risk, and merge blockers.

## Workflow

1. `Source:` Use PR from context, current branch, or ask. Prefer `gh pr view` for title, body, base/head refs, changed files, commits, status checks, review state, comments, review bodies, and review threads. Use `gh pr diff` or `git diff base...head` for patch truth. Parse linked refs/URLs from PR body + comments/reviews, including `#123`, `owner/repo#123`, full GitHub issue URLs, and closing-keyword forms like `closes`, `fixes`, `resolves`. Fetch linked issue bodies + comments; parent PRD/epic links count too. Recurse through material scope/acceptance/blocker links; normalize + dedupe canonical refs; route inaccessible/conflicting context to `Risks / Unknowns`.
2. `Explore:` Read PR/issue intent first, then changed code, adjacent contracts, tests, fixtures, docs, and runtime seams. Run read-only validation commands only when they sharpen review confidence.
3. `Review:` Run an in-depth negative review, not a skim. Hunt defects, regressions, bad patterns, missing tests, brittle seams, architectural drift, security/privacy risk, performance risk, and maintainability debt with concrete impact. Check behavior against PR intent + linked issues + existing contracts + repo instructions (`AGENTS.md`, `CLAUDE.md`, local conventions). Trace changed paths through callers, data shape, validation, errors, persistence, concurrency, auth, compatibility, deployment/runtime behavior, and tests.
4. `Report:` Output findings first. No code edits. No commits. No pushes. After the review is complete, ask: `Post this review to the PR?`
5. `Post:` If user approves, read `references/template.md`, self-detect harness identity, append attribution, then post the same review body to the GitHub PR. Capture the posted review/comment URL and return it to the user. Do not change findings while posting.

## Output

Findings-first review shape. For GitHub posting, use `references/template.md`.

- `Findings` — ordered by severity. Each item includes `Severity`, `Location`, `Issue`, `Impact`, `Evidence`, `Recommendation`.
- `Missing Tests` — only coverage gaps that would catch a material regression.
- `Risks / Unknowns` — merge risks not provable from local context.
- `No Findings` — use only when no material issue found. Include one sentence on what was checked.

Severity vocab:
- `Blocker` = breaks core path, data loss, security/privacy exposure, or cannot merge.
- `High` = likely user-visible regression or contract violation.
- `Medium` = edge-case regression, missing validation, brittle behavior with plausible production impact.
- `Low` = minor risk worth noting; never style-only.

## GitHub Hash Links

- Any Git commit hash/SHA shown to the user or written to GitHub comments, issues, PR bodies, review bodies, or durable artifacts must be clickable in GitHub.
- Use Markdown `[abcdef0](https://github.com/<owner>/<repo>/commit/<full-sha>)`; if Markdown is unsupported, paste the commit URL.
- Resolve short hashes to full SHAs before linking. Derive `<owner>/<repo>` from `gh repo view --json nameWithOwner`, PR context, or `origin` remote.

## Principles

- Read-only means no file edits, no commits, no pushes, no thread resolution. GitHub PR review/comment posting is allowed only after explicit user approval.
- Findings first. No summary before defects.
- Depth over speed. Treat the PR as guilty until evidence clears the changed surface.
- Negative findings over balance. Do not add praise, pros, or neutral observations unless needed to explain scope.
- Linked PR description/issues define review intent. Treat closing-linked issue acceptance criteria as contract truth.
- Repo instruction violations count as findings when they create concrete consistency, maintenance, runtime, or future-change risk.
- Bad-pattern findings need evidence: violated local convention, repeated brittle shape, avoidable coupling, wrong abstraction boundary, or runtime/tooling mismatch.
- Bugs over polish. Ignore formatting, naming, and preference unless correctness, maintainability, reviewability, or future-change risk is concrete.
- Cite file/line refs where possible. If exact line refs are unavailable, cite file + changed function/section.
- Do not invent findings. If impact is speculative, route to `Risks / Unknowns`.
- One finding per root cause. Deduplicate symptoms across files, tests, and CI.
- Verify before accusing when a quick read-only command can settle it.
- Existing tests passing does not neutralize a contract violation.
- If no findings, say so directly; do not pad with praise.
- After presenting the review, ask whether to post it to the PR. If approved, post with the attribution footer from `references/template.md` and return the posted review/comment link.
- If asked to fix findings, hand off to `snap-resolve`.
