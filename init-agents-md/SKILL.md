---
name: init-agents-md
description: >
  Use this skill to create, regenerate, or update a project AGENTS.md file.
  Explores the codebase first, then interviews the user only on gaps code
  can't answer. Works for greenfield (empty repos) and brownfield alike.
  TRIGGER when the user wants to: create or write an AGENTS.md, set up AI
  agent instructions for a project, initialize or bootstrap project context
  for AI agents, generate a context/config file that AI agents read, help
  AI agents understand a codebase, regenerate or fix an outdated AGENTS.md,
  or onboard a team onto AI-assisted development. Also triggers on
  /init-agents-md and any mention of writing project-level AI instructions
  — even without naming AGENTS.md.
  DO NOT trigger for: README/docs edits, PRD writing, PR reviews, explaining
  architecture, scaffolding features, writing tests, configuring hooks or
  settings.json, or general code changes.
---

# init-agents-md

Explore → interview gaps → draft → iterate → write. Skip steps when context
already exists in conversation.

## 1. Detect & Explore

Launch Explore subagent(s) to scan the codebase. Determine:

**Project identity:**
- Language(s), framework(s), runtime
- Package manager + lockfile
- Monorepo (Turborepo, Nx, Lerna, Cargo workspaces, Go workspaces) vs single-app
- Greenfield (near-empty, no src, scaffold only) vs brownfield (established patterns)

**Commands & scripts:**
- Read package.json / pyproject.toml / Makefile / Taskfile / Justfile / Cargo.toml / etc.
- Catalog: dev, build, lint, format, check, test (all variants), db, deploy, CI scripts
- Detect test runner, linter, formatter, type checker
- Detect git hooks (husky, lefthook, pre-commit) and what they run

**Architecture:**
- Directory structure — feature-based, layer-based, domain-driven, or flat
- Tech stack per layer (frontend, backend, API, database, infra)
- Key packages/modules and their roles
- Database ORM/driver, migration tool
- Infra/deploy target (cloud provider, containerization, IaC tool)
- Env management (dotenv, t3-env, envalid, etc.)

**Conventions already in code:**
- Existing AGENTS.md, CLAUDE.md, README, CONTRIBUTING, .editorconfig, ADRs
- Test file naming patterns (*.test.ts, *_test.go, test_*.py)
- Test colocation vs separate test directories
- Import patterns, module boundaries

For large/unfamiliar codebases, use multiple Explore subagents in parallel
(up to 3) — one per major area. For small projects, one pass suffices.

## 2. Gap Analysis & Interview

After exploration, classify what you know vs what's ambiguous or missing.

**Greenfield projects** — more questions needed:
- Architecture direction (monolith, microservices, serverless, etc.)
- Design principles the team follows or wants to follow
- Testing strategy (unit, integration, e2e — what's in scope now vs later)
- Feature organization pattern (vertical slices, layer-based, flat)
- Deployment target

**Brownfield projects** — most things derivable, ask only about:
- Design philosophy not evident from code (deep modules? DDD? TDD? CQRS?)
- Testing strategy preferences if tests exist but conventions are unclear
- Anything contradictory or ambiguous in the codebase
- Non-obvious conventions (commit style, PR process, env setup quirks)

**Interview rules:**
- Never ask what the code already answers. If you can see it, state it.
- Always recommend a default based on what you found. User confirms or overrides.
- Batch related questions — don't ask one at a time when five can go together.
- If the user says something is fine or agrees with your inference, move on fast.
- Keep going until every AGENTS.md section has enough signal to write.

Example of a good question:
> "I see vitest in devDependencies and a `tests/` directory with `*.spec.ts`
> files. No integration or e2e tests visible. I'd recommend documenting:
> unit tests colocated as `*.spec.ts`, no integration/e2e yet. Sound right,
> or do you have a different testing strategy in mind?"

Example of a bad question:
> "What test framework do you use?" ← the code already answers this.

## 3. Draft

Generate the AGENTS.md following `references/template.md`. Key rules:

- **Token-efficient**: heavy technical terms, terse phrasing, sacrifice grammar
  for brevity. AI agents parse technical terms faster than prose.
- **Only include what's real**: don't add aspirational sections. If the project
  doesn't have tests yet, don't write a testing section with future plans unless
  the user explicitly wants that.
- **No fluff**: skip the "This file provides guidance..." preamble. Jump straight
  to content.
- **No discoverable info**: don't document what's obvious from config files
  (e.g., "linter is eslint" when .eslintrc exists, or "uses prettier" when
  .prettierrc exists). Only document commands to run them and non-obvious config.
- **3 sections max**: Commands, Architecture, Design Principles. That's it.
  Fold testing strategy into Design Principles. Fold env vars into Architecture
  or Design Principles. Fold deployment into Architecture. Never create
  standalone Testing, Environment, Deployment, or Code Style sections — the
  whole point is density. A 4th section is acceptable only for truly orthogonal
  concerns (e.g., a monorepo migration guide), never for content that fits
  naturally into the big three.

Show the full draft to the user. Don't write to disk yet.

## 4. Iterate

Incorporate user feedback. Common adjustments:
- Merging/splitting sections
- Adding/removing commands
- Adjusting terminology density
- Including or excluding design principles
- Changing the structure

Re-show after each round of changes. Repeat until user is satisfied.

## 5. Write

Write final AGENTS.md to project root. If one already exists, show a diff
and confirm before overwriting.

## Principles

- **Explore-first, ask-second.** The codebase is the source of truth. Interviews
  fill gaps, not replace reading.
- **Greenfield ≠ empty AGENTS.md.** Even empty repos have decisions (language,
  framework, package manager) worth documenting. Greenfield projects need more
  interview; brownfield need more exploration.
- **Token economics matter.** Every word in AGENTS.md is loaded into context on
  every conversation. Ruthlessly cut what doesn't help an AI agent work in the
  repo. A 30-line AGENTS.md that's all signal beats a 200-line one with noise.
- **Recommend, don't interrogate.** Propose defaults based on evidence. "I see X,
  I'd recommend Y" is better than "What do you want for Y?"
- **Adapt to the stack.** A Rust CLI project needs different sections than a
  Next.js monorepo. Don't force a template — use it as a menu to pick from.
