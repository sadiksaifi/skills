# Review Template

Use the Markdown inside `<template>` as the local review report body only when there is at least one priority-labeled finding or one material `Missing Tests` item. If there are no findings and no material missing tests, output exactly `No Findings` as a single line instead of this template.
For GitHub posting, use `references/posting.md` so inlineable findings become review threads instead of duplicated top-level text.
Any review finding — bug, test, architecture, security, performance — goes under `Findings` if it has concrete impact.
Use `No Findings` only as the full local response when no material issue or missing-test item is found; never post it to GitHub.

Priority:
- `P0` — blocks merge: data loss, security/privacy exposure, broken core path, or unrecoverable failure
- `P1` — likely user-visible regression, contract violation, or important missing test
- `P2` — edge-case regression, brittle behavior, architecture drift, or maintainability risk with plausible impact
- `P3` — minor issue worth fixing; no style-only findings

Finding shape for local reports and non-inlineable top-level findings:

```md
### P1 — [short finding title]

- `Location:` [file:line or area]
- `Issue:` [what is wrong]
- `Impact:` [why it matters]
- `Evidence:` [how to reproduce or verify the issue from diff, code path, test, command, or linked context]
```

<template>

## Findings

[priority-labeled findings, or `None` when reporting material missing tests only]

## Missing Tests

[material coverage gaps, or `None`]

## Risks / Unknowns

[merge risks, inaccessible/conflicting context, or `None`]

*Reviewed using [skill:snap-review](https://github.com/sadiksaifi/skills/blob/main/snap-review/SKILL.md)*

</template>
