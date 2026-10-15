---
name: snap-issues
description: >
  Use when the user asks to turn context, a plan, or a spec into one or more GitHub issues
---

Turn the request into one concise GitHub issue, or into vertical issues only when one cannot fit:

```
source = current context      # fetch cited issues, PRs, docs, URLs, files only when missing
source += walk(source)   # follow linked issues, PRs, specs, and docs, then their links; skip anything already read; stop at items that don't bear on intent
ground in repo: domain language, current behavior, ADRs, interfaces, tests, tracker conventions
resolve decisions that change scope, outcome, or dependencies

issues = [one]
if user asked for one: keep one
elif one fresh agent context cannot implement, verify, and merge it:
    issues = vertical slices  # each independently mergeable, narrow end-to-end, fits one fresh context
    # wide mechanical refactor that cannot stay green: expand, migration batches, contract
blockers = hard blockers only # everything else stays parallel

if len(issues) > 1 and user has not authorized multiple issues:
    show titles, one-line outcomes, blockers; stop until approved

for issue in issues, blockers first:
    title = short, specific outcome
    body = template below     # self-contained intent; keep only decisions that prevent rediscovery; link background, don't copy it
    plain(title, body)        # for an implementer new to the code: everyday words over internal terms; one short sentence per bullet; cut each sentence the implementer would not miss
    gh issue create --repo "$owner/$repo" --title "$title" --body-file "$body_file" --blocked-by "$blocker_numbers"
    # drop --blocked-by when empty
    # follow repo label, assignee, milestone, issue-type, parent conventions; leave unset metadata unset
    # leave source and parent issues unchanged unless asked

report issue links, blocking edges, frontier   # frontier = issues with no open blockers
```

```markdown
## Summary

[1-2 sentences: why this issue exists and where its scope ends. Leave required behavior to the checklist.]

## Acceptance criteria

[2-5 one-sentence observable checks, precise enough to execute; the single source of required behavior.]

- [ ] [Primary externally verifiable behavior.]
- [ ] [Material error, permission, or edge behavior.]

## Context

[Only context that changes implementation. Drop this section when there is none.]

- Source: [Canonical issue, plan, specification, or discussion.]
- Constraint: [Decision or contract the implementer must preserve.]
```
