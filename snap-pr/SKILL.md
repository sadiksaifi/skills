---
name: snap-pr
description: >
  Create a GitHub pull request from the current branch commits; update only
  with `--update`. Use when user wants to open a PR or refresh the current
  branch PR body. Trigger on "snap-pr", "create a PR", "open PR", "push and
  create PR", "snap-pr --update", "update the PR".
---

# Snap PR

Pull request manifest from branch truth. Diff explains the review surface; commits are what the PR contains.

## Workflow

1. `Detect:` Identify current branch, base branch, working tree state, unpushed commits, push state, and whether a PR already exists for the current branch. Use minimal git/gh metadata; do not fetch issue/PR bodies/comments.
2. `Mode:` Default = create. If a PR already exists and `--update` was not passed, stop and ask whether to update it. With `--update`, update the existing current-branch PR; if none exists, stop and say no PR exists for the current branch.
3. `Branch readiness:` PR content comes from commits on the current branch. If relevant work is uncommitted, stop and ask the user to commit or explicitly allow you to commit. If branch has unpushed commits, push before creating/updating the PR.
4. `Analyze:` Read base...HEAD diff/stat and enough commit subjects to describe changed behavior. Reuse session context from prior work (`snap-forge`, `snap-resolve`, direct task). Extract issue refs from branch name, commits, session context, and diff-adjacent docs. Branch commits are truth; diff is evidence for the PR body. If closure claim is uncertain, omit `Closes` or ask.
5. `Template:` Use repo PR template when present; otherwise use local refs.
6. `Write:` Generate concise, specific PR title/body from actual behavior and touched systems. Apply repo artifact style: terse, technical-dense, label-first.

## Artifact Rules

- Artifact = PR title + PR body shaped by repo PR template or `references/template.md`.
- Template owns exact Markdown. `SKILL.md` owns workflow, invariants, and gotchas.
- Title stays under 70 chars, matches repo style, and leads with user-visible behavior.
- `## QA` is manual reviewer flow only: context -> action -> visible result.
- `## QA` never includes tests, shell transcripts, copied assertions, raw status/body tuples, or exact payload snapshots.

## Lifecycle

Create mode: push branch commits if needed, then create PR. Existing PR without `--update`: stop and ask before editing. `--update` mode: preserve non-template sections, refresh template sections from base...HEAD diff + available session context, then edit the current-branch PR.

## GitHub Hash Links

- Any Git commit hash/SHA shown to the user or written to GitHub comments, issues, PR bodies, review bodies, or durable artifacts must be clickable in GitHub.
- Use Markdown `[abcdef0](https://github.com/<owner>/<repo>/commit/<full-sha>)`; if Markdown is unsupported, paste the commit URL.
- Resolve short hashes to full SHAs before linking. Derive `<owner>/<repo>` from `gh repo view --json nameWithOwner`, PR context, or `origin` remote.

## Principles

- Branch commits are truth; diff/stat explain review surface
- Do not pretend uncommitted work is in the PR. Stop for commit approval when relevant changes are uncommitted
- Session context beats refetching. Do not reload linked issue bodies, PR comments, review threads, or PRD context for PR creation/update
- Manual QA only in `## QA`
- `## QA` is reviewer walkthrough, not shell transcript dump or copied automated assertions
- `## QA` bullets use reviewer shape: context -> manual action -> expected result
- `## QA` stays one level above test cases: reviewer journey, not status/body tuple matrix
- Avoid `expect`, `assert`, exact payload snapshots, raw query/path repetition in `## QA`
- Avoid exact automated command repetition in `## QA` when `## Test Plan` already covers it
- If shipped surface is only CLI/API, keep `## QA` at scenario level. Describe reviewer intent + visible result, not imperative rerun commands
- Never mention tests or test execution in `## QA`; docs/test execution belongs only in `## Test Plan`
- Artifact prose stays token-thin: dense nouns, low glue
- Preserve user-added intent outside template sections
- Ask only on real ambiguity
- Title stays behavior-first. Prefer user-visible outcome over mechanism words like `arg`, `flag`, `refactor`, filenames, internal helpers
