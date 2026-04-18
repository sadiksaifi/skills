# AGENTS Template

Three sections by default. Dense. Field-oriented. No preamble.

```markdown
## Commands

- `<run> dev` — [main dev loop]
- `<run> check` — [read-only verification]
- `<run> test` — [default test path]
- `<run> <project-specific>` — [db, deploy, generate, package, etc.]

## Architecture

- `Shape:` [single-app | monorepo | workspace | library]
- `Runtime:` [language + runtime]
- `Frontend:` [framework + router + state + validation]    # if material
- `Backend:` [framework + API style + validation]          # if material
- `Data:` [db + orm + migrations]                          # if material
- `Infra:` [deploy target + infra tool]                    # if material
- `Layout:` [major packages/apps/modules]

## Design Principles

- [deep module / bounded context / feature slice / TDD / CQRS / etc.]
- [testing strategy where it changes how an agent should work]
- [repo-specific constraint or naming rule]

## Sharp Edges

- [high-cost gotcha]
- [ordering constraint or brittle workflow]
- [unsafe path, hidden invariant, or flaky flow]
```

Use actual commands only. Omit empty lines. Collapse irrelevant bullets. Use `## Sharp Edges` only when the repo has real traps worth front-loading.
