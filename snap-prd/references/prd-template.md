# PRD Template

Adapt section depth to complexity — simple features may not need every section.

## Template

```markdown
# [Feature Title]

## Problem Statement
[What's broken/missing, who's affected, why it matters now]

## Solution
[Proposed approach from the user's perspective]

## User Stories
- **US-1:** As a [user type], I want [capability], so that [benefit]
- **US-2:** ...

## Functional Requirements
- [ ] **FR-1:** [Specific, testable requirement]
- [ ] **FR-2:** ...

## Non-Functional Requirements
- [ ] **NFR-1:** [Performance: e.g., "API response < 200ms at p95"]
- [ ] **NFR-2:** [Security: e.g., "All endpoints require authentication"]
- ...

## Implementation Decisions

Durable architectural choices made during interview:
- Modules to build/modify and their interfaces
- Schema changes
- API contracts
- Architectural decisions and rationale

Do NOT include specific file paths or code snippets — they go stale fast.

## Testing Decisions
- What makes a good test for this feature (behavior through public interfaces, not implementation)
- Which modules will be tested
- Prior art (similar tests in the codebase)

## Success Metrics

| Metric | Current | Target | How to Measure |
|--------|---------|--------|----------------|
| [Metric 1] | [baseline] | [goal] | [method] |

<details>
<summary>Technical Context</summary>

### Relevant Architecture
[Key patterns, modules, constraints from codebase exploration]

### Technical Constraints
[Constraints discovered from exploration]

</details>

## Out of Scope
- [Thing 1 — deferred to future iteration]

## Open Questions
- [ ] [Question 1 — who needs to answer, by when if known]
```

## Formatting Rules

- **Task lists** (`- [ ]`) for requirements — checkable in GitHub
- **Tables** for success metrics — scannable
- **`<details>` collapsible** for Technical Context — keeps focus on product
- **ID prefixes** (US-N, FR-N, NFR-N) for cross-referencing in PRs and slice issues
- **Specificity** — "Support filtering" is bad; "Filter transactions by date range, status, and amount" is good
- **Title prefix** — `[PRD]` in GitHub issue title
