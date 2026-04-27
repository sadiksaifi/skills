---
name: snap-ship
description: >
  Create or update a GitHub PR from the actual diff. Use when user wants to ship
  work, open a PR, refresh PR body, or generate a reviewable summary from
  current changes. Trigger on "snap-ship", "ship it", "create a PR", "open PR",
  "update the PR", "push and create PR".
---

# Snap Ship

Shipping manifest from diff truth.

## Workflow

1. `Detect:` Check whether PR already exists for the branch.
2. `Analyze:` Read diff, commits, stats, base branch, push state. Extract issue/PR refs from commits, branch name, existing PR body, and diff-adjacent docs when present. For any `Closes` target or scope claim, fetch linked issue body + comments and material parent PRD/epic/breakdown links. Recurse through material scope/acceptance/blocker links; normalize + dedupe canonical refs. Diff remains truth; linked context only bounds title/body/closure claims.
3. `Template:` Use repo PR template when present; otherwise use local refs.
4. `Write:` Generate concise, specific PR body from actual behavior and touched systems. Apply repo artifact style: terse, technical-dense, label-first.

## Contract

Artifact = PR title + PR body shaped by `references/contract.md` and `references/template.md`.

Required sections:
- `## Summary`
- `## Changes`
- `## Test Plan`
- `## QA`
- `## Closes`

## Lifecycle

Create mode: push if needed, then create PR. Update mode: preserve non-template sections, refresh template sections from the current diff, then edit PR.

## GitHub Hash Links

- Any Git commit hash/SHA shown to the user or written to GitHub comments, issues, PR bodies, review bodies, or durable artifacts must be clickable in GitHub.
- Use Markdown `[abcdef0](https://github.com/<owner>/<repo>/commit/<full-sha>)`; if Markdown is unsupported, paste the commit URL.
- Resolve short hashes to full SHAs before linking. Derive `<owner>/<repo>` from `gh repo view --json nameWithOwner`, PR context, or `origin` remote.

## Principles

- Diff is truth
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
