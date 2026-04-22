# Plan Template

```markdown
## Durable Decisions
- `Interfaces:` [routes, commands, events, APIs]
- `Data:` [models, schemas, ids]
- `Boundaries:` [modules, services, integrations]
## Plan

### Phase 1: Tracer Bullet [Title]
- `Goal:` [single narrow outcome]
- `Covers:` [US/FR/NFR ids or inferred]
- `Build:` [thin end-to-end path]
- `Acceptance:`
  - [ ] [public behavior a user, client, or boundary can verify; avoid repo-root commands and filenames]
  - [ ] [avoid docs/tests/README updates/commands/filenames/process chores here]
- `Blockers:` none
- `Size:` S
- `Risk:` med
### Phase 2: [Title]
- `Goal:` ...
- `Covers:` ...
- `Build:` ...
- `Acceptance:`
  - [ ] [next public behavior, small enough for a few TDD cycles; avoid repo-root commands and filenames]
  - [ ] [docs/tests/README usage refresh stay in `Build:` unless the doc artifact itself is the acceptance target]
- `Blockers:` Phase 1
- `Size:` M
- `Risk:` low

## Risks / Unknowns
- [meaningful unresolved item]
- [missing threshold / derivation / total-semantic choice from source, if any]
```
