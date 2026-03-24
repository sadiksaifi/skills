---
name: snap-ship
description: >
  Create and update GitHub pull requests with intelligent diff analysis. Acts
  autonomously — analyzes, generates, and creates the PR without unnecessary
  confirmation steps. Use whenever the user wants to create a PR, open a pull
  request, update a PR description, push and create a PR, or submit their work.
  Trigger on "create a PR", "snap-ship", "ship", "ship it", "open a pull
  request", "make a PR", "update the PR", "push and create PR", "submit a PR",
  or any variation where the user wants to create or update a GitHub pull
  request. Even "PR" in the context of submitting work should trigger this.
---

# Snap Ship — Create & Update Pull Requests

Create and update PRs based on actual diff analysis. Act autonomously — the user
invoked this skill because they want a PR, so make it happen without asking
permission at every step.

## Mode detection

Run `gh pr view --json number,title,body,url 2>/dev/null`. If a PR exists for
the current branch → **update mode**. Otherwise → **create mode**. The user can
override explicitly.

## Create mode

### 1. Analyze changes

- Check for uncommitted changes — warn if any exist
- Get current branch name. If on main/master, ask for a branch name (this is
  one of the few times you should ask — you need a name)
- Detect base branch via `gh repo view --json defaultBranchRef`
- Get all commits, diff stats, and full diff since base
- Check if branch is pushed

### 2. Detect PR template

Check in order: `.github/pull_request_template.md`,
`.github/PULL_REQUEST_TEMPLATE/` directory, `docs/pull_request_template.md`.
If none found, read `references/template.md` as fallback.

### 3. Generate and create

Generate a concise title (<70 chars) matching the project's commit style. Fill
the template with specifics from the diff — reference actual files, functions,
and behaviors. Don't be vague.

Auto-detect issue references from commit messages and branch name. If found,
add `Closes #N` lines automatically and mention you did.

Push the branch if not already pushed. Create the PR. Show the URL.

Don't ask "does this look good?" — just create it. The user can edit on GitHub
or run the skill again to update. Only ask when something is genuinely ambiguous
(multiple PR templates to choose from, contradictory changes in the diff).

## Update mode

### 1. Analyze current state

Fetch existing PR details and current diff. Identify what changed since the PR
was created or last updated.

### 2. Regenerate and update

Re-detect the PR template. Generate an updated title and body reflecting the
current diff state. Update via `gh pr edit`. Show confirmation with URL.

## After creating or updating

Mention: "Run `/snap-resolve` to address any review feedback."

## Principles

- **Analyze the actual diff**, not just commit messages. The diff tells the truth.
- **Match project style.** If existing PRs use conventional commits, follow that.
- **Act, don't ask.** The user said "create a PR" — create it.
