# PRD Contract

One artifact. One issue. Stable ids. Dense prose. Product-first.

## Sections

- `# [Title]`
- `## Problem`
- `## Solution`
- `## User Stories`
- `## Functional Requirements`
- `## Non-Functional Requirements`
- `## Implementation Decisions`
- `## Testing Decisions`
- `## Success Metrics`
- `## Out of Scope`
- `## Open Questions`

## Fields

### User Stories

- `US-1: ...`
- `US-2: ...`
- Outcome-led user capability only; docs/tests/maintainer chores stay out

### Functional Requirements

- `FR-1: ...`
- `FR-2: ...`
- Only requested or repo-grounded public behavior; leave missing policy in `Open Questions`
- Do not turn inferred operational properties into `FR-*` without source proof
- Avoid speculative semantics for totals, output shape, zero buckets, setup assumptions, or derived-state mapping
- Avoid inferred absence/presence rules for opt-in params unless source states them

### Non-Functional Requirements

- `NFR-1: ...`
- `NFR-2: ...`

### Implementation Decisions

Durable choices only:
- Interfaces
- Data
- Boundaries

Optional when material:
- Auth
- Migration
- Observability
- Performance

### Success Metrics

Use label lines, not tables:
- `Metric: ...`
- `Current: ...`
- `Target: ...`
- `Measure: ...`

## Shape

- Bullets over paragraphs where possible
- Specific nouns over vague adjectives
- Dense technical phrasing over tutorial prose
- Minimal grammar acceptable; ambiguity is not
- No file paths
- No code snippets
- No exact shell commands unless the command is product surface under specification
- One requirement per bullet
- Unresolved policy branches go to `Open Questions` or `Out of Scope`, not invented `FR-*`
- Keep ids stable after publish
