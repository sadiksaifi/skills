# AGENTS.md Template

Three sections max: **Commands**, **Architecture**, **Design Principles**.
That's it. Fold everything else into these three — testing strategy goes
in Design Principles, env/deployment goes in Architecture. A small CLI
tool might need 10 lines. A monorepo might need 40. Never exceed 50.

## Section: Commands

Merge dev, lint, fmt, check, test, db, deploy into one block. Use the
project's actual package manager / task runner.

```markdown
## Commands

- `<run> dev` — <what it starts, ports>
- `<run> dev:<app>` — individual (if monorepo)
- `<run> lint` / `<run> lint:fix` — <linter>
- `<run> fmt` / `<run> fmt:check` — <formatter>
- `<run> check` — lint + fmt (read-only, CI-safe)
- `<run> check-types` — tsc / mypy / etc.
- `<run> db:push` / `<run> db:generate` — <ORM> → <DB>
- `<run> deploy` / `<run> destroy` — <infra tool>
- `<run> test` — all (unit + integration)
- `<run> test:unit` — unit only via <orchestrator> (TDD inner loop)
- `<run> test:integration` — integration only (`tests/integration/`)
- `<run> test:<package>` — per-package (if monorepo)
```

Notes:
- Only include commands that actually exist in scripts
- If no test stratification, just `<run> test`
- Omit linter/formatter names if discoverable from config files —
  just show the command

## Section: Architecture

Stack description. One line per layer. Include package/module layout
if monorepo or multi-package.

```markdown
## Architecture

- **Monorepo** (<orchestrator>): `apps/<a>`, `apps/<b>`, `packages/{...}`
- **Frontend**: <framework> + <router> + <state> + <validation> + <ui-lib>
- **Backend**: <framework> on <runtime> + <rpc/api> + <validation>
- **Database**: <ORM> + <DB engine>
- **Infra**: <IaC tool> in `<path>`
```

Notes:
- For single-app projects, skip the monorepo line
- Name key libraries (Zod, tRPC, Drizzle, etc.) — they change how
  the AI agent writes code
- Skip obvious things (e.g., don't say "TypeScript" if tsconfig.json exists)

## Section: Design Principles

Only include principles the team actually follows. Each gets a terse
one-liner with sub-bullets only where needed. These shape how the AI
agent writes code — they're not documentation, they're instructions.

```markdown
## Design Principles

- **Deep modules**: narrow interfaces, rich implementation. No shallow wrappers.
- **DDD**: bounded contexts, aggregates, value objects, domain events.
- **TDD**: red → green → refactor. Unit tests colocated with features.
  Integration tests isolated in `tests/integration/`. No UI unit tests.
  <e2e tool> for e2e later.
- **Ubiquitous language**: domain terminology everywhere — code, comments,
  docs, conversation.
- **Feature slices**: self-contained vertical slices per feature.
  - Backend: `<path>/<feature>/` — router, schema, service, tests
  - Frontend: `<path>/<feature>/` — components, hooks, utils
  - Cross-cutting concerns (UI primitives, env, db client) stay in `packages/`
- Env vars validated via `<validation-lib>` in `<path>`
```

Common principles to probe for (only include if adopted):
- Deep modules (Ousterhout) — narrow API, rich internals
- DDD — bounded contexts, aggregates, value objects
- TDD — red-green-refactor cycle
- Feature slices — vertical colocation
- Ubiquitous language — domain terms in code
- CQRS — command/query separation
- Event sourcing — event log as source of truth
- Hexagonal/ports & adapters — dependency inversion at boundaries
- Clean architecture — dependency rule, use cases
- Trunk-based development — short-lived branches
- Conventional commits — feat/fix/chore prefixes

## Sections that must NOT exist standalone

These are the most common section-sprawl offenders. Fold them:

- **Testing** → fold into Design Principles (as a TDD/testing bullet)
- **Environment** → fold into Architecture (as a bullet) or Design Principles
- **Deployment** → fold into Architecture (one-liner)
- **Code Style** → don't include at all (discoverable from linter/formatter config)
- **Coding Conventions** → don't include (discoverable from code)
- **File Operations** → don't include (belongs in global agent config, not project)

## Anti-patterns to avoid

- Don't document what config files already say (linter name, formatter
  settings, TS strict mode)
- Don't add "This file provides guidance..." preamble
- Don't use long prose where a bullet point works
- Don't add aspirational sections ("we plan to add...") unless user
  explicitly wants them
- Don't duplicate README content — AGENTS.md is for AI agents, not humans
- Don't add comments explaining what AGENTS.md sections mean
- Don't pad with empty headers or placeholder sections
- Don't leak global agent config rules into project AGENTS.md (e.g., safe-rm,
  package manager preferences — those belong in agent-specific config)
