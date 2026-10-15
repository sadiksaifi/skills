---
name: snap-pr
description: >
  Use when the user asks to create or update a pull request
---

Publish the current branch as a reviewer-ready PR whose body matches the full branch diff:

```
# direct PR request or manual invocation authorizes stage, commit, push, publish; otherwise ask first
state = inspect(branch, default, upstream, worktree, base...HEAD, unpushed, branch_pr)
if detached or on default: stop with one next action
route = update if branch_pr else create

paths = relevant(request, session)    # mixed scope: show candidate paths, ask once
commit(paths)                         # atomic Conventional Commits
if no publishable diff: stop

evidence = read(base...HEAD, linked sources)   # every material change, decision, and check; commits are evidence, not narrative
title = outcome of the change
body = repo PR template or the template below

push
route(title, body)                    # keep accurate fields; change stale or requested ones
apply requested draft, base, reviewers, labels, assignees, milestone

reread(title, body, base, head, state, url)
report url, route, branch, verification, blockers   # pending CI is fine
done = remote has the work, PR matches the full diff and intent, every body claim has evidence
```

```markdown
## Summary

[1-2 sentences: why this PR exists and where its scope ends.]

## Changes

- [2-6 bullets: delivered behavior and its observable effect.]

## Verification

[Only checks that ran; drop unused lines. None ran: `Not run: [reason]`.]

- Automated: `[command]` - [result]
- Manual: [action] -> [observed result]

## Related

[Drop this section when there are no links.]

- Closes [issue reference]
```
