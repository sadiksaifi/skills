---
name: pr
description: >
  Create and update GitHub pull requests with intelligent diff analysis and
  well-crafted descriptions. Use this skill whenever the user wants to create
  a PR, open a pull request, push and create a PR, update a PR description,
  or refresh a PR after making more changes. Trigger on phrases like "create
  a PR", "open a pull request", "make a PR", "update the PR", "update PR
  description", "push and create PR", "submit a PR", or any variation where
  the user wants to create or update a GitHub pull request. Even if the user
  just says "PR" or "pull request" in the context of submitting their work,
  use this skill.
---

# PR — Create & Update Pull Requests

You help the user create and update GitHub pull requests with well-crafted
titles and descriptions based on actual diff analysis. For PR reviews, suggest
the existing `/review-pr` or `/code-review` skills instead.

## Mode Detection

Determine whether to create or update:

1. Run `gh pr view --json number,title,body,url 2>/dev/null` on the current branch
2. If a PR exists → **Update mode**
3. If no PR exists → **Create mode**
4. The user can also specify explicitly (e.g., "update the PR", "create a new PR")

---

## Create Mode

### Task Tracking

Create tasks using `TaskCreate`:

1. "Analyze changes" — activeForm: "Analyzing changes"
2. "Detect PR template" — activeForm: "Detecting PR template"
3. "Generate PR content" — activeForm: "Generating PR content"
4. "Create pull request" — activeForm: "Creating pull request"

Set dependencies so each task is `addBlockedBy` the previous one.

### Step 1: Analyze Changes

Mark task "Analyze changes" as `in_progress`.

Gather context about what's being submitted:

- `git status` — check for uncommitted changes. If there are unstaged or
  uncommitted changes, warn the user and ask if they want to commit first.
- `git branch --show-current` — get current branch name
- If on `main` or `master`, use `AskUserQuestion` to ask the user with options:
  - **"Create a branch (Recommended)"** — suggest a name based on the changes
  - **"Stay on main"** — proceed (warn about pushing directly)
  - **"Something else"** — user specifies
- Detect the base branch — check if the repo uses `main`, `master`, `develop`,
  or another default. Use `gh repo view --json defaultBranchRef -q .defaultBranchRef.name`.
- `git log <base>..HEAD --oneline` — all commits on this branch
- `git diff <base>..HEAD --stat` — summary of what changed
- `git diff <base>..HEAD` — full diff for analysis
- Check if branch is pushed: `git rev-parse --abbrev-ref @{upstream} 2>/dev/null`

Mark task "Analyze changes" as `completed`.

### Step 2: Detect PR Template

Mark task "Detect PR template" as `in_progress`.

Look for a project PR template. Check in this order, use the first found:

1. `.github/pull_request_template.md`
2. `.github/PULL_REQUEST_TEMPLATE/` directory (may have multiple templates)
3. `docs/pull_request_template.md`

If found, read it and use it as the structure for the PR body.

If not found, read the fallback template from
`${CLAUDE_SKILL_DIR}/references/template.md` and use that.

Mark task "Detect PR template" as `completed`.

### Step 3: Generate PR Content

Mark task "Generate PR content" as `in_progress`.

**Title:** Generate a concise PR title (<70 chars) that captures the essence
of the change. Use conventional style when the repo follows it (e.g.,
`feat: add user authentication`). Analyze commit messages to match the
project's style.

**Body:** Fill in the template structure using the diff and commit analysis.
Be specific — reference actual files, functions, and behaviors changed.
Don't be vague.

**Issue linking:** Ask the user via `AskUserQuestion`:

- **"Yes, I have issues to close"** — ask for issue numbers, add `Closes #N`
  lines to the PR body
- **"No issues to link (Recommended)"** — proceed without
- **"Something else"** — freeform input

**Draft review:** Present the generated title and body to the user. Ask for
approval or edits via `AskUserQuestion`:

- **"Looks good, create it (Recommended)"** — proceed to create
- **"I want to edit"** — let user provide changes, regenerate
- **"Something else"** — freeform

Mark task "Generate PR content" as `completed`.

### Step 4: Create Pull Request

Mark task "Create pull request" as `in_progress`.

1. Push branch if not already pushed:
   ```
   git push -u origin <branch-name>
   ```

2. Create the PR:
   ```
   gh pr create --title "..." --body "$(cat <<'EOF'
   ...body content...
   EOF
   )"
   ```

3. Show the PR URL to the user.

4. Present next steps as text (not AskUserQuestion — the PR is done):
   "You can run `/review-pr` or `/code-review` to review the PR before
   requesting reviewers."

Mark task "Create pull request" as `completed`.

---

## Update Mode

### Task Tracking

Create tasks using `TaskCreate`:

1. "Analyze current changes" — activeForm: "Analyzing changes"
2. "Compare with existing PR" — activeForm: "Comparing with existing PR"
3. "Update pull request" — activeForm: "Updating pull request"

Set dependencies so each task is `addBlockedBy` the previous one.

### Step 1: Analyze Current Changes

Mark task "Analyze current changes" as `in_progress`.

- `gh pr view --json number,title,body,url` — get existing PR details
- Detect base branch (same logic as create mode)
- `git log <base>..HEAD --oneline` — current commits (may have new ones)
- `git diff <base>..HEAD --stat` — current diff summary
- `git diff <base>..HEAD` — full current diff

Mark task "Analyze current changes" as `completed`.

### Step 2: Compare with Existing PR

Mark task "Compare with existing PR" as `in_progress`.

- Compare the current diff against what the existing PR description covers
- Identify what's new, changed, or removed since the PR was created
- Note any commits that were added after the original PR

Mark task "Compare with existing PR" as `completed`.

### Step 3: Update Pull Request

Mark task "Update pull request" as `in_progress`.

1. Re-detect PR template (same logic as create mode)
2. Generate updated title + body reflecting the current state of the diff
3. Ask user about issue linking via `AskUserQuestion`:
   - **"Yes, I have issues to close"** — ask for issue numbers
   - **"No issues to link (Recommended)"** — proceed
   - **"Something else"** — freeform
4. Present the updated draft to user for approval
5. Update the PR:
   ```
   gh pr edit <number> --title "..." --body "$(cat <<'EOF'
   ...updated body...
   EOF
   )"
   ```
6. Show confirmation with the PR URL

Mark task "Update pull request" as `completed`.

---

## Principles

**Analyze the actual diff, not just commit messages.** Commit messages can be
vague or misleading. The diff tells you what actually changed.

**Match the project's style.** If existing PRs use conventional commits in
titles, follow that. If they use a specific template, use it. Adapt, don't
impose.

**Always recommend.** When presenting options via `AskUserQuestion`, always
label one as **(Recommended)**.

**Don't review — suggest reviewers.** This skill creates and updates PRs.
For reviews, point the user to `/review-pr` or `/code-review`.

**Push before creating.** Always ensure the branch is pushed to the remote
before attempting `gh pr create`.
