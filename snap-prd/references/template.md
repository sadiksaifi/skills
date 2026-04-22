# PRD Template

```markdown
# [Feature Title]

## Problem
- Who is blocked
- What is missing or broken
- Why now
- [if repo is docs-only or lacks implementation, say so plainly]
## Solution
- User-visible change
- Core system behavior
## User Stories
- `US-1:` As a [user], I want [capability], so that [outcome]
- [keep docs/tests/maintainer chores out of primary stories]
## Functional Requirements
- `FR-1:` [Specific, testable behavior]
- [only requested or repo-grounded behavior; leave missing policy in `Open Questions`]
- [do not encode inferred setup rules, derivation formulas, zero-count semantics, or argument-count policy without source proof]
- [do not invent `total` semantics, line-oriented output rules, or network/file-write constraints without source proof]
- [do not infer extra response-presence rules for opt-in params unless source states them]
## Non-Functional Requirements
- `NFR-1:` [Latency, security, reliability, auditability, cost, etc.]
## Implementation Decisions
- `Interfaces:` [routes, commands, events, APIs]
- `Data:` [models, schemas, ids]
- `Boundaries:` [modules, services, integrations]
- [keep repo grounding abstract; skip file paths/helpers/command transcripts]
## Testing Decisions
- Public-interface test shape
- Modules to exercise
- Prior art worth copying
## Success Metrics
- `Metric:` [name]
  `Current:` [baseline]
  `Target:` [goal]
  `Measure:` [how to measure]
## Out of Scope
- Deferred work
## Open Questions
- Owner + unresolved decision; keep unchosen policy branches here, not in `FR-*`
```
