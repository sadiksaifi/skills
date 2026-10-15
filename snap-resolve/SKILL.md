---
name: snap-resolve
description: >
  Use when the user asks to resolve PR review feedback, failing checks, or unresolved threads
---

Take every open review item and failing check on the PR to done: fix or explain, reply, resolve:

```
pr = owner, repo, number from branch or session   # ask only when none

if this session reviewed this PR and the reviewed head SHA == PR head:   # warm handoff
    reuse its evidence, findings, and posted review
    refresh only: local status and HEAD, PR head SHA, checks, feedback newer than the review, thread state
    # everything else is cached; fetch a source only to fill a specific gap
else:                                                                     # cold start
    gather body, comments, reviews, threads and replies, commits, checks, failed logs, linked artifacts that affect intent or acceptance
# a changed head, other target, failed review post, or conflicting evidence invalidates only the affected evidence; refresh that
threads = capture query
ci = ci items

items = dedupe(findings and feedback + ci)   # merge a CI failure with feedback on the same defect; keep that feedback's ids
classify each:
    FIX                 # code, docs, or test change
    EXPLAIN             # reply only
    CI                  # check failure
    Already addressed   # current evidence proves it
    Unsure              # evidence missing, conflicting, or inaccessible

if the user asked to approve first: show the worklist; run only approved items; Unsure needs clarification first
else: run FIX, EXPLAIN, CI; skip Already addressed; hold Unsure

for item in selected:
    if trivial:                 # typo, import, mechanical rename
        edit; verify; commit
    else:
        red(item)               # extend the existing test owner; add one public-interface regression only when existing coverage misses the former failure; fails on pre-fix code for the reported reason; asserts behavior, not implementation; coverage alone never justifies it
        green(item)             # smallest change that passes; no unrelated refactoring
        run targeted test, lint, type, build; fix every local failure
        commit                  # fix(scope): address <issue>; keep the full SHA for the reply
refactor while green when fixes exposed duplication, brittle seams, or an awkward interface   # refactor(scope): <improvement>, separate commit

push once
plain(replies)   # everyday words; one idea per sentence; cut each sentence the reviewer would not miss
for item in FIX and EXPLAIN: reply through its channel; resolve its thread after the reply succeeds
rerun the capture query   # every unexpected unresolved thread is a missed reply, failed resolution, or reported blocker

report commits, local checks, replies, pending CI, held Unsure, blockers   # pending CI is reported, not awaited
done = every item completed, skipped with evidence, held, or blocked with a reason; every failed check mapped to an item or a blocker
```

## CI items

```
gh pr checks "$pr" --repo "$owner/$repo" --json name,state,bucket,link,workflow
# keep bucket "fail", newest run per workflow; record pending checks for the report

gh run view "$run_id" --repo "$owner/$repo" --log-failed   # run_id from /actions/runs/<run-id>
# per job, the first root failure: assertion or compiler output, error code, test name, file:line
# inaccessible log -> blocker

item = CI | <check name> | <specific error> | <files>   # one per independent root cause; CI-only items get no reply
```

## Threads

Capture query, paginated past 100 threads. Keep each thread's `id`, `isResolved`, and its root comment `databaseId` (`replyTo: null`) and `url`. Replies target the root; the REST endpoint rejects replies to replies.

```bash
gh api graphql --paginate -f query='
  query($owner: String!, $repo: String!, $pr: Int!, $endCursor: String) {
    repository(owner: $owner, name: $repo) {
      pullRequest(number: $pr) {
        reviewThreads(first: 100, after: $endCursor) {
          nodes {
            id
            isResolved
            path
            comments(first: 50) {
              nodes {
                databaseId
                body
                url
                author { login }
                replyTo { databaseId }
              }
            }
          }
          pageInfo { hasNextPage endCursor }
        }
      }
    }
  }
' -F owner="$owner" -F repo="$repo" -F pr="$pr"
```

```
channel(item):
    review thread or line comment -> gh api --method POST "repos/$owner/$repo/pulls/$pr/comments/$comment_id/replies" -f body="$body"
    top-level PR comment          -> gh pr comment "$pr" --repo "$owner/$repo" --body "$body"   # wrapped in the quote template
    CI only                       -> no reply   # a merged CI item uses its feedback's channel
# inline reply fails: report it; fall back to a quote reply only when it still helps the reviewer

resolve(thread):   # only after its reply succeeds; Unsure, skipped, already addressed, already resolved, and failed-reply threads stay as they are
    gh api graphql -f query='mutation($threadId: ID!) { resolveReviewThread(input: { threadId: $threadId }) { thread { id isResolved } } }' -F threadId="$thread_id"
# permission failure: report and continue
```

## Reply templates

FIX:

```markdown
## FIXED

- Fixed [concern] in [commit](https://github.com/OWNER/REPO/commit/SHA).
- [Observable result or regression coverage.]

Verified:
- `[command that ran]`
```

EXPLAIN:

```markdown
## EXPLANATION

- [Behavior, scope, or decision.]
- [Issue, PR, or spec link; drop when none.]
```

Top-level quote wrapper:

```markdown
> [Feedback excerpt.]
>
> Source: ORIGINAL_COMMENT_URL

[FIXED or EXPLANATION body]
```
