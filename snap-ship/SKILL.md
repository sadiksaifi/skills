---
name: snap-ship
description: >
  Create and update GitHub PRs with intelligent diff analysis. Acts
  autonomously — analyzes, generates, creates without confirmation. Use when
  user wants to create a PR, open a pull request, update PR description, push
  and create, or ship their work. Trigger on "snap-ship", "ship it", "create
  a PR", "open PR", "update the PR", "push and create PR", or any context
  where the user wants to submit work as a pull request.
---

# Snap Ship

Autonomous PR creation and update from diff analysis. User said "ship" — ship it.

## Mode detection

`gh pr view --json number,title,body,url 2>/dev/null` — PR exists → update
mode. Otherwise → create mode.

## Create mode

### 1. Analyze

- Uncommitted changes → warn
- Branch = main/master → ask for branch name (one of few justified questions)
- Detect base branch via `gh repo view --json defaultBranchRef`
- Full diff, commit log, diff stats since base
- Check if branch is pushed

### 2. Detect PR template

Check in order: `.github/pull_request_template.md`,
`.github/PULL_REQUEST_TEMPLATE/`, `docs/pull_request_template.md`. None found
→ read `references/template.md`.

### 3. Generate and create

Title <70 chars matching project commit style. Fill template with specifics
from the diff — actual files, functions, behaviors. Vague summaries are
worthless.

Auto-detect issue references from commits and branch name. Found → add
`Closes #N` lines.

Push if not pushed. Create PR. Show URL.

Don't ask "does this look good?" — create it. User edits on GitHub or reruns
the skill. Only ask on genuine ambiguity (multiple templates, contradictory
changes).

## Update mode

### 1. Analyze current state

Fetch existing PR body and current diff. Identify what changed since last
update.

### 2. Re-detect PR template

Same lookup as create mode: `.github/pull_request_template.md`,
`.github/PULL_REQUEST_TEMPLATE/`, `docs/pull_request_template.md`. None found
→ read `references/template.md`. Extract its `## ` headings as "template
sections."

### 3. Preserve and update

For sections matching the template — regenerate from current diff. For
sections NOT in the template (manually added by user or reviewers) — preserve
untouched.

If body has no `## ` headers at all (fully hand-written), warn before
overwriting.

Update via `gh pr edit`. Show URL.

## After creating or updating

Mention: "Run `/snap-resolve` to address any review feedback."

## Principles

- **Diff is truth.** Analyze the actual diff, not just commit messages.
- **Match project style.** Conventional commits → conventional PR title.
- **Act, don't ask.** User said "ship" — ship.
- **Preserve intent.** Update mode respects manual edits to PR body.
