# Local Review Template

Use only when at least one finding passes the finding gate.

Priorities:

- `P0`: merge blocker with severe data, security, privacy, or core-path impact
- `P1`: likely user-visible regression, contract break, or important missing regression coverage
- `P2`: bounded edge-case, performance, compatibility, architecture, or testability risk with concrete impact

Each section has one owner: `Failure` states trigger, mechanism, and proof; `Impact` states the consequence; `Fix` states the corrective direction.

<template>

## Findings

### P1: [concise defect title]

- Location: `path/to/file.ts:42`
- Failure: [trigger, failure mechanism, and evidence]
- Impact: [specific user, system, security, performance, compatibility, or maintenance consequence]
- Fix: [specific corrective direction without a full patch]

## Risks / Unknowns

- [Material uncertainty that affects review confidence.]

</template>

Order findings by priority, then review path. Omit `## Risks / Unknowns` when empty. Missing test coverage uses the title `Missing regression coverage` and names the regression in `Failure`.
