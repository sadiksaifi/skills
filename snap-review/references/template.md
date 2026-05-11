# Review Template

Use the Markdown inside `<template>` as the GitHub PR review body after user approval.
Any review finding — bug, test, architecture, security, performance — goes under `Findings` if it has concrete impact.
Use `No Findings` only when no material issue is found.

Priority:
- `P0` — blocks merge: data loss, security/privacy exposure, broken core path, or unrecoverable failure
- `P1` — likely user-visible regression, contract violation, or important missing test
- `P2` — edge-case regression, brittle behavior, architecture drift, or maintainability risk with plausible impact
- `P3` — minor issue worth fixing; no style-only findings

Finding shape:

```md
### P1 — [short finding title]

- `Location:` [file:line or area]
- `Issue:` [what is wrong]
- `Impact:` [why it matters]
- `Evidence:` [how to reproduce or verify the issue from diff, code path, test, command, or linked context]
```

<template>

## Findings

[priority-labeled findings, or `No Findings`]

## Missing Tests

[material coverage gaps, or `None`]

## Risks / Unknowns

[merge risks, inaccessible/conflicting context, or `None`]

*Reviewed using [skill:snap-review](https://github.com/sadiksaifi/skills/blob/main/snap-review/SKILL.md)*

</template>
