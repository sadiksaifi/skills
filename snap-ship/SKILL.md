---
name: snap-ship
description: >
  Create or update a GitHub PR from the actual diff. Use when user wants to
  ship work, open a PR, refresh PR body, or generate a reviewable summary from
  current changes. Trigger on "snap-ship", "ship it", "create a PR", "open
  PR", "update the PR", "push and create PR".
---

# Snap Ship

Shipping manifest from diff truth.

## Workflow

1. Detect mode
Check whether PR already exists for the branch.

2. Analyze
Read diff, commits, stats, base branch, and push state.

3. Template
Use repo PR template when present; otherwise use local refs.

4. Write
Generate concise, specific PR body from actual behavior and touched systems.
Apply repo artifact style: terse, technical-dense, label-first.

## Contract

Artifact = PR title + PR body shaped by `references/contract.md` and
`references/template.md`.

Required sections:
- `## Summary`
- `## Changes`
- `## Test Plan`
- `## QA`
- `## Closes`

## Lifecycle

Create mode: push if needed, then create PR.
Update mode: preserve non-template sections, refresh template sections from the
current diff, then edit PR.

## Principles

- Diff is truth.
- Manual QA only in `## QA`.
- Artifact prose stays token-thin: dense nouns, low glue.
- Preserve user-added intent outside template sections.
- Ask only on real ambiguity.
