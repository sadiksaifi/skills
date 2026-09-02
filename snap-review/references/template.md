# Review Template

Use the Markdown inside `<template>` as the local review report body only when there is at least one priority-labeled finding. Treat every material missing-test gap as a priority-labeled `Missing regression coverage` finding. If there are no findings, output exactly `No Findings` as a single line instead of this template.

For GitHub posting, use `references/posting.md`; it converts the report into compact standalone finding blocks, places inlineable findings in review threads, and omits local-only sections.

Priority:

- `P0` — blocks merge: data loss, security/privacy exposure, broken core path, or unrecoverable failure
- `P1` — likely user-visible regression, contract violation, or important missing regression coverage
- `P2` — edge-case regression, brittle behavior, architecture drift, or maintainability risk with plausible impact
- `P3` — minor issue worth fixing; no style-only findings

Prefer these stable defect titles when they fit: `Incorrect behavior`, `Missing validation`, `Resource lifecycle defect`, `Concurrency defect`, `Security boundary defect`, `Privacy defect`, `Performance regression`, `Architecture defect`, `Compatibility regression`, `Error handling defect`, and `Missing regression coverage`.

Finding shape:

```md
### P1 — Incorrect behavior

- Location: `path/to/file.ts:42 (RIGHT)`
- Reason: [concrete trigger or affected path and resulting defect]
- Impact: [specific consequence]
- Evidence: [proof from the diff, call path, test, command, or linked context]
- Fix direction: [specific corrective action without a full patch]
```

<template>

## Findings

[priority-labeled findings]

## Risks / Unknowns

[material merge risks or inaccessible/conflicting context that affect confidence, or `None`]

*Reviewed using [skill:snap-review](https://github.com/sadiksaifi/skills/blob/main/snap-review/SKILL.md)*

</template>
