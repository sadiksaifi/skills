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

evidence = read(base...HEAD, linked sources)   # read every material change, decision, and check; the body keeps only what a reviewer needs
title = outcome of the change
body = repo PR template or the template below
plain(title, body)    # for a reviewer new to the code: everyday words over internal terms; one short sentence per bullet; cut each sentence the reviewer would not miss

push
route(title, body)                    # keep accurate fields; change stale or requested ones
apply requested draft, base, reviewers, labels, assignees, milestone

reread(title, body, base, head, state, url)
report url, route, branch, verification, blockers   # pending CI is fine
done = remote has the work, PR matches the full diff and intent, every body claim has evidence
```

```markdown
## Summary

[1-2 sentences: what changes, why, and where scope ends.]

## Changes

- [2-6 one-sentence bullets: the changes a reviewer should check.]

## Verification

[One line per check that ran. Review and fix history stays in review threads. None ran: `Not run: [reason]`.]

- `[command]` on [platform]: [result]
- Manual: [action] -> [observed result]

## Related

[Drop this section when there are no links.]

- Closes [issue reference]
```
