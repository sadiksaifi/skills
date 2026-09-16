---
name: snap-pr
description: >
  Use when current branch work must be staged, committed, pushed, and opened as
  a GitHub pull request, or when the existing branch PR needs its title, body,
  base, or reviewer verification refreshed.
---

Route automatically: update an existing branch PR; otherwise create one. A direct PR request or manual invocation authorizes relevant stage, commit, push, and publish operations.

## Workflow

1. **State.** Inspect branch/default/upstream, worktree, base diff, unpushed commits, and branch PR. For a detached/default branch, stop with one next action. Resolve one create or update route.

2. **Commit.** Without direct or manual authorization, ask before mutation. Infer scope from the request and session, stage only relevant paths, and create atomic Conventional Commits.
   For mixed scope, show candidate paths and ask one question. Stop when no publishable diff exists or the requested route is unavailable.

3. **Evidence.** Reuse session context. Read `base...HEAD` and linked sources only to account for every material change, intent decision, and verification result. Treat commits as evidence, not narrative.

4. **Body.** Use the repository PR template when present; otherwise use [`references/template.md`](references/template.md).
   Give each fact one home: summary for motivation and scope, changes for delivered behavior, verification for evidence, related links for traceability.

5. **Publish.** Push, then create or update. Preserve accurate content and metadata; change stale or explicitly requested fields. Honor draft, base, reviewer, label, assignee, and milestone requests.

6. **Verify.** Re-read title, body, base, head, state, and URL. Report the URL, route, pushed branch, verification, and blockers. Pending GitHub CI is acceptable.

Completion: the remote branch contains the relevant work, the PR matches the full branch diff and intent, and every body claim is evidence-backed.
