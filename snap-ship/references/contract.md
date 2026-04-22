# PR Contract

One PR body. Dense, specific, reviewable.

## Sections

- `## Summary`
- `## Changes`
- `## Test Plan`
- `## QA`
- `## Closes`

## Shape

- `Summary` = 1-3 bullets; what changed, why it matters
- `Changes` = grouped bullets by subsystem or behavior
- `Test Plan` = automated verification already run or intended
- `QA` = manual reviewer flows only
- `QA` should read like reviewer steps: setup/context -> action -> expected result; keep automated commands in `Test Plan`
- `QA` should not read like copied test cases or exact shell transcript output
- `QA` should avoid `expect`, raw status/body tuples, or exact payload snapshots
- `QA` should summarize surface behavior a reviewer can confirm, not restate endpoint matrix already covered by tests
- For CLI/API-only diffs, `QA` should stay scenario-level rather than imperative rerun steps
- `QA` should never mention tests or test execution
- `Closes` = issue refs when found
- Dense technical phrasing over broad explanation
- Minimal grammar acceptable; ambiguity is not

## Title

- Under 70 chars
- Match repo commit style
- Prefer behavior over implementation detail
- Prefer user-visible verbs and nouns: `support named greeting output`, `add status summary`
- Avoid mechanism-first phrasing like `optional name arg`, filenames, helpers, or parser internals
