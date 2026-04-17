# Forge Intake Contract

When a `snap-plan` artifact exists, consume it in this shape:

- `## Durable Decisions`
- `## Plan`
- `### Phase N: [Title]`
- `Goal:`
- `Covers:`
- `Build:`
- `Acceptance:`
- `Blockers:`
- `Size:`
- `Risk:`

Treat as constraints:
- `Interfaces:` lock external surfaces
- `Data:` lock key models and ids
- `Boundaries:` lock ownership seams

Execution semantics:
- Follow phase order
- Use `Acceptance:` as behavior targets
- Honor `Blockers:`
- Prefer one TDD cycle per acceptance item or smallest coherent behavior
