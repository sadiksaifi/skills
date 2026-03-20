---
name: pr-resolve
description: >
  Resolve PR comments, reviews, and feedback from humans and AI bots. Use this
  skill whenever the user wants to address PR feedback, resolve review comments,
  fix issues raised in a pull request review, respond to PR reviewers, or handle
  feedback from bots like CodeRabbit, Greptile, or Copilot. Trigger on phrases
  like "resolve PR comments", "fix PR feedback", "address the reviews",
  "respond to PR comments", "handle PR reviews", "fix what the reviewers said",
  or any variation where the user wants to resolve, fix, or reply to feedback
  on a GitHub pull request. This skill operates in plan mode — it creates a
  resolution plan, not immediate fixes.
---

# PR Resolve

You help the user address all feedback on a GitHub pull request — fixing code
where needed with strict TDD, and explaining decisions where code changes aren't
warranted. Every reviewer gets a tagged reply with either a commit hash or an
explanation.

This skill operates in **plan mode only**. It helps Claude's built-in plan mode
create an excellent plan for resolving PR feedback.

## Entry

Call `EnterPlanMode` first to enter plan mode, then create tasks using
`TaskCreate`:

1. "Fetch PR conversations" — activeForm: "Fetching PR conversations"
2. "Explore codebase" — activeForm: "Exploring codebase"
3. "Categorize feedback" — activeForm: "Categorizing feedback"
4. "Prepare fix plan with TDD" — activeForm: "Preparing TDD fix plan"
5. "Prepare replies" — activeForm: "Preparing replies"
6. "Hand off to plan mode" — activeForm: "Handing off to plan mode"

Set dependencies so each task is `addBlockedBy` the previous one.

---

## Step 1: Fetch PR Conversations

Mark task "Fetch PR conversations" as `in_progress`.

Fetch ALL feedback on the current branch's PR. Run these via Bash:

```bash
# PR details + reviews + comments
gh pr view --json number,title,body,url,reviews,comments,reviewRequests

# Inline review comments (review threads)
gh api repos/{owner}/{repo}/pulls/{number}/comments

# PR-level comments (issue comments)
gh api repos/{owner}/{repo}/issues/{number}/comments

# Reviews with bodies
gh api repos/{owner}/{repo}/pulls/{number}/reviews
```

Get review thread resolution status. Run via Bash:

```bash
gh api graphql -f query='{
  repository(owner:"{owner}", name:"{repo}") {
    pullRequest(number:{N}) {
      reviewThreads(first:100) {
        nodes {
          id
          isResolved
          comments(first:10) {
            nodes { body author { login } databaseId }
          }
        }
      }
    }
  }
}'
```

### Processing Rules

**Collect from all sources:**
- Review threads (inline comments + their replies)
- Review body comments (the text reviewers write when submitting a review)
- PR-level comments (issue comments on the PR)

**Deduplicate:** A piece of feedback may appear in both a review body and as
a thread comment. Consolidate by matching content, author, and timestamp.
Keep the thread version (it has a thread ID for resolution).

**Exclude already-resolved threads:** If `isResolved` is true, skip it.

**Parse review bodies independently from threads:** Review bodies can contain
actionable feedback (nitpicks, suggestions, issues) that has NO associated
review thread. This happens when bots like CodeRabbit put feedback in collapsible
sections of the review summary rather than as inline code comments. After
checking thread resolution, separately iterate ALL review bodies from
`/pulls/{number}/reviews`. Parse each body for actionable sections — look for
headings like "Nitpick comments", "Suggestions", "Issues", or any structured
feedback. Do NOT assume "all threads resolved" means "all feedback addressed."
A review body with actionable content and no matching thread is unresolved
feedback that must be collected.

**Include bot feedback:** Reviews with state "COMMENTED" that have body text
with actionable feedback count as real feedback. Bots like CodeRabbit, Greptile,
Copilot, and Sweep put their analysis here. Don't skip them just because
GitHub doesn't consider them "requesting changes."

**Extract reviewer identity:** For each feedback item, record:
- `@username` for tagging in replies
- Comment/thread ID for replying via the correct API
- Thread ID (GraphQL node ID) for resolution if applicable

Mark task "Fetch PR conversations" as `completed`.

---

## Step 2: Explore Codebase

Mark task "Explore codebase" as `in_progress`.

Based on the files and code areas mentioned in the feedback:

- Use `Agent` subagents (Explore type), `Glob`, `Grep`, `Read` to understand the relevant code
- Use `LSP` for precise understanding:
  - `findReferences` to see what depends on code being discussed
  - `goToDefinition` / `goToImplementation` to trace logic
  - `documentSymbol` to understand file structure
  - `incomingCalls` / `outgoingCalls` for call chains
- Map which feedback items relate to which files/functions
- Understand existing tests, patterns, and architecture around affected areas

This context is essential for both fixing code AND writing good explanations.

Mark task "Explore codebase" as `completed`.

---

## Step 3: Categorize Feedback

Mark task "Categorize feedback" as `in_progress`.

Split all feedback into two categories:

### `[FIX]` — Needs Code Changes

The reviewer identified something that should be changed:
- A real bug or missing error handling
- A valid improvement backed by the codebase exploration
- A missing test case
- A performance or security concern that's legitimate

### `[EXPLAIN]` — Needs Explanation Only

The current approach is correct:
- The reviewer doesn't understand the architecture or requirements
- It's a stylistic preference that conflicts with project conventions
- The concern is already handled elsewhere in the code
- The suggestion would introduce unnecessary complexity

**Present the categorization to the user** via `AskUserQuestion`. Show each
feedback item with your proposed category and reasoning. The user can override
any categorization — they know their codebase and reviewers best.

Always label your recommended category with **(Recommended)**.

Mark task "Categorize feedback" as `completed`.

---

## Step 4: Prepare Fix Plan with TDD

Mark task "Prepare fix plan with TDD" as `in_progress`.

Use the Read tool on `${CLAUDE_SKILL_DIR}/references/tdd-cycle.md` for the TDD
cycle reference.

For each `[FIX]` item, prepare a TDD cycle entry:

```
### Fix: [description from feedback]
- **Source:** @reviewer-name, [thread/comment link]
- **Feedback:** [original comment text, brief]
- **RED:** [test that captures the fix — observable behavior]
- **GREEN:** [minimal implementation to pass]
- **REFACTOR:** [if applicable]
- **VERIFY:** lint + format + full test suite
- **COMMIT:** conventional commit, store hash as `COMMIT_HASH_N`
```

**Ordering:** Independent fixes first, then fixes that depend on earlier ones.

Each fix becomes a Task in the plan with a stored commit hash in metadata.

Mark task "Prepare fix plan with TDD" as `completed`.

---

## Step 5: Prepare Replies

Mark task "Prepare replies" as `in_progress`.

For each feedback item, draft the reply:

**For `[FIX]` items:**
```
@reviewer-username

Fixed in `COMMIT_HASH_N`.

[Brief description of what was changed and why]
```

**For `[EXPLAIN]` items:**
```
@reviewer-username

[Explanation of why the current approach is correct, referencing
architecture, requirements, or project conventions as needed]
```

**Present ALL replies to the user** for review. Let them edit any reply before
it's baked into the plan. This is the user's last chance to adjust tone,
add context, or change a category.

Mark task "Prepare replies" as `completed`.

---

## Step 6: Hand Off to Plan Mode

Mark task "Hand off to plan mode" as `in_progress`.

Hand the following to Claude's built-in plan mode for the final plan:

### The plan must include:

1. **Setup** — branch info, PR number, test suite, lint/format commands

2. **TDD fix cycles** — ordered `[FIX]` items with full
   RED/GREEN/REFACTOR/VERIFY/COMMIT. Each cycle commits locally but does
   **NOT push**. Store each commit hash.

3. **Per-cycle task** — one Task per fix, with commit hash stored in metadata
   after the commit

4. **Single push** — after ALL fix cycles complete, one `git push` to push
   all commits at once

5. **Parallel replies** — after push, reply to ALL feedback items in parallel
   (they're independent of each other). Run each via Bash:

   For review thread replies:
   ```bash
   gh api repos/{owner}/{repo}/pulls/{N}/comments/{comment_id}/replies \
     -f body="@username ..."
   ```

   For PR-level comment replies:
   ```bash
   gh api repos/{owner}/{repo}/issues/{N}/comments \
     -f body="@username ..."
   ```

   Resolve threads where applicable:
   ```bash
   gh api graphql -f query='mutation {
     resolveReviewThread(input: { threadId: "THREAD_NODE_ID" }) {
       thread { isResolved }
     }
   }'
   ```

   Replace `COMMIT_HASH_N` placeholders with actual commit hashes from the
   fix tasks.

6. **Suggest PR update** — after all replies are posted, suggest running `/pr`
   to update the PR description to reflect the changes

Mark task "Hand off to plan mode" as `completed`.

---

## Principles

**Every reviewer gets a reply.** Whether their feedback was fixed or explained,
they deserve a tagged response. This is about respect and communication.

**Tag reviewers explicitly.** Start every reply with `@username` so they get
notified. This includes bots — `@coderabbitai`, `@graborot`, etc.

**Commit hashes in fix replies.** When you fix something, point the reviewer
to the exact commit. They shouldn't have to dig through the diff to verify.

**Single push, parallel replies.** Don't push after each fix — batch all
commits and push once. Then fire all replies concurrently.

**Always recommend.** When presenting categorization or options, always label
one as **(Recommended)**.

**Resolve threads.** For threads that support resolution, resolve them after
replying. This keeps the PR conversation clean.
