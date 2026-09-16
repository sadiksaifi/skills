---
name: snap-issues
description: >
  Use when a conversation, feature brief, plan, spec, PRD, or repo context must
  become one concise GitHub issue or a dependency-aware set of
  implementation-ready vertical issues.
---

Default to one issue. Split only when one fresh agent context cannot implement, verify, and merge the outcome. Preserve only decisions that prevent rediscovery.

## Workflow

1. **Source.** Reuse current context. Fetch cited issues, PRs, docs, URLs, or files only when their content is missing; follow links only when they change scope or intent.

2. **Ground.** Inspect enough of the repo to use its domain language and respect current behavior, ADRs, interfaces, tests, and tracker conventions.

3. **Shape.** Resolve decisions that change scope, outcome, or dependencies. Keep one issue when possible. An explicit single-issue request is binding. Otherwise create independently mergeable vertical slices; each delivers a narrow end-to-end result and fits one fresh context.

   Use hard blockers only; otherwise keep issues parallel. For a wide mechanical refactor that cannot stay green as vertical slices, sequence expand, migration batches, then contract.

4. **Publish gate.** Apply this decision table:
   - One issue is sufficient, or the user explicitly requested one issue: proceed automatically.
   - Multiple issues are needed and the user explicitly authorized multiple issues or publication without questions: proceed automatically.
   - Multiple issues are needed without that authorization: show only proposed titles, one-line outcomes, and blockers, then stop. Continue only after explicit approval.

5. **Write.** Use [`references/issue-template.md`](references/issue-template.md). Make the summary easy to scan and the acceptance criteria precise enough to execute. Keep intent self-contained and link canonical background instead of copying it.

6. **Publish.** Create issues blocker-first so later issues can use GitHub's native `--blocked-by` relationships:

   ```bash
   gh issue create --repo "$owner/$repo" \
     --title "$title" --body-file "$body_file" \
     --blocked-by "$blocker_numbers"
   ```

   Omit `--blocked-by` when empty. Follow existing label, assignee, milestone, issue-type, and parent conventions; leave unset metadata unset. Preserve source or parent issues unless the user requests an update.

7. **Report.** Return created issue links, blocking edges, and the current frontier: issues with no open blockers.
