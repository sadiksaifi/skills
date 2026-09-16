# CI Failure Triage

Convert current GitHub Actions failures into deduplicated `CI` work items.

## Collect

```bash
gh pr checks "$pr" --repo "$owner/$repo" \
  --json name,state,bucket,link,workflow
```

- Keep `bucket: "fail"`; ignore `pass`, `skipping`, and `cancel`.
- Use only the newest run per workflow.
- Record pending checks for the final report; do not wait for them.

Extract the run ID from `/actions/runs/<run-id>` and fetch failed logs:

```bash
gh run view "$run_id" --repo "$owner/$repo" --log-failed
```

For large logs, isolate the first root failure in each job. Capture assertion or compiler output, rule/error code, test name, and file/line when present. Report inaccessible logs as blockers.

## Build CI items

Create one item per independent root cause:

```text
Type: CI
Source: <check-name>
Error: <specific failure>
Files: <paths, when known>
```

Merge a CI failure with reviewer feedback describing the same defect. Preserve the review thread/comment IDs for the reply. CI-only items need no reviewer reply.

Completion: every current failed check maps to a work item, a deduplicated item, or a concrete log-access blocker.
