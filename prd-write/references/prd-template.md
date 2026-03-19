# PRD Template

Use this template when assembling the PRD in Phase 4. Adapt section depth to
the feature's complexity — simple features may not need every section fully
fleshed out, while complex features may need subsections within requirements.

## Template

```markdown
# [Feature Title]

## Problem Statement
[What's broken/missing, who's affected, why this matters now]

## Goals & Non-Goals

### Goals
- [Goal 1]
- [Goal 2]

### Non-Goals
- [Explicitly not trying to do X]

## User Stories
- **US-1:** As a [user type], I want [capability], so that [benefit]
- **US-2:** ...

## Functional Requirements
- [ ] **FR-1:** [Requirement 1 — specific and testable]
- [ ] **FR-2:** [Requirement 2]
- ...

## Non-Functional Requirements
- [ ] **NFR-1:** [Performance: e.g., "API response < 200ms at p95"]
- [ ] **NFR-2:** [Security: e.g., "All endpoints require authentication"]
- ...

## Success Metrics

| Metric | Current | Target | How to Measure |
|--------|---------|--------|----------------|
| [Metric 1] | [baseline] | [goal] | [method] |

<details>
<summary>Technical Context</summary>

### Relevant Architecture
[Key patterns, modules, and constraints from codebase exploration]

### Key Files
- `path/to/file.ts` — [what it does and why it's relevant]

### Technical Constraints
- [Constraint 1 discovered from exploration]

</details>

## Out of Scope
- [Thing 1 — deferred to future iteration]

## Open Questions
- [ ] [Question 1 — who needs to answer, by when if known]
```

## Formatting Rules

- **Task lists** (`- [ ]`) for requirements — they become checkable in GitHub
- **Tables** for success metrics — scannable at a glance
- **`<details>` collapsible** for Technical Context — keeps the PRD focused on
  product while making technical context accessible
- **ID prefixes** — Number user stories (`US-1`), functional requirements
  (`FR-1`), and non-functional requirements (`NFR-1`) so they can be
  cross-referenced in PRs, discussions, and implementation tasks (e.g.,
  "this PR implements FR-3" or "FR-4 is blocked by NFR-2")
- **Specificity over vagueness** — "Support filtering" is bad; "Users can
  filter the transaction list by date range, status, and amount" is good
- **Title prefix** — Use `[PRD]` prefix in the GitHub issue title (e.g.,
  `[PRD] Dark Mode Support`)
