# CI Check Failure Resolution

How to fetch, parse, and convert GitHub Actions failures into [FIX] items.

## Fetch check status

```bash
gh pr checks <number> --json name,state,bucket,link,workflow
```

Filter for `bucket: "fail"`. Ignore `pass`, `skipping`, `cancel`.

## Handle pending checks

If any checks have `bucket: "pending"`, wait briefly:

```bash
timeout 60 gh pr checks <number> --watch --fail-fast --interval 10
```

If the timeout expires, proceed with available results. Pending checks that
haven't completed are not blockers — note them in the checkpoint summary.

## Fetch failed logs

Extract the run ID from each failed check's `link` field (the numeric segment
after `/actions/runs/`), then:

```bash
gh run view <run-id> --log-failed
```

Use the most recent run only per workflow — ignore superseded runs from earlier
pushes. If log output is very large, focus on the first failure in each job
rather than ingesting everything.

## Parse failure types

Look for these patterns in the log output:

- **Test failures**: assertion errors, `FAIL` markers, test function names,
  file:line references from stack traces
- **Lint failures**: rule names (e.g., `no-unused-vars`), file:line references
- **Type errors**: type checker output (`TS2345`, `mypy`), file:line references
- **Build failures**: compilation errors, missing module/import errors

## Convert to [FIX] items

Each distinct failure becomes one [FIX] item:

- **Source**: `CI: {check-name}` (e.g., `CI: lint`, `CI: test-unit`)
- **Error**: the specific failure message from logs
- **Files**: extracted file paths from log output

## Deduplication with review feedback

A reviewer comment flagging the same issue as a CI failure should be merged into
one [FIX] item. Keep the review thread ID so the reviewer gets a reply when
fixed. The CI log provides the precise error; the reviewer comment provides
the thread to respond to.

## After fixes

CI fixes don't get review replies — passing checks after push are the response.
The exception is deduplicated items where a reviewer also flagged the issue —
those get a reply via the kept thread ID.
