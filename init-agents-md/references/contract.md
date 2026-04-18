# AGENTS Contract

One file. Dense, durable, repo-specific.

## Shape

- Headings + label lines + bullets
- Dense technical phrasing over explanatory prose
- Minimal grammar acceptable; ambiguity is not
- Positive protocol: define right shape; skip anti-shape prose
- Keep only information that helps future agents act inside the repo

## Sections

Default:
- `## Commands`
- `## Architecture`
- `## Design Principles`
- `## Sharp Edges` when hidden traps, brittle flows, or expensive mistakes are
  part of normal work

Use fewer when enough. Add another section only when it carries an orthogonal
concern that cannot fit the core three without turning noisy.

## Content Rules

- Prefer commands over tool-name trivia
- Prefer module boundaries, stacks, and seams over generic summaries
- Prefer stable repo patterns over volatile snapshot detail
- Prefer terse principles over long explanation
- Keep testing, env, deploy, and workflow notes folded into the core sections
  when possible
- Use `Sharp Edges` for high-cost gotchas only: surprising defaults, brittle
  scripts, ordering constraints, unsafe paths, flaky flows, hidden invariants
