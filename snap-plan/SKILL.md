---
name: snap-plan
description: >
  Turn a GitHub issue into a phased implementation plan comment. Use when user
  wants execution order, tracer-bullet phases, durable decisions, or a plan
  another agent can build from. Trigger on "snap-plan", "plan this issue",
  "implementation plan", "phase this work", "tracer bullet", "durable decisions
  for issue #N".
---

# Snap Plan

Route card for execution. Read issue, lock durable choices, emit thin vertical phases.

## Workflow

1. `Source:` Use issue from context or ask. Fetch issue body and all comments. Extract refs/URLs from body + comments. Read parent PRD/epic, breakdown comments, plan comments, referenced issues/PRs/discussions/docs that affect scope. Recurse through material scope/acceptance/blocker links; normalize + dedupe canonical refs; route inaccessible/conflicting context to `Risks / Unknowns`.
2. `Explore:` Read code, seams, contracts, tests, integration layers, prior art. Resolve discoverable questions in code, not chat.
3. `Draft:` Read `references/contract.md`, then draft with `references/template.md`. Prefer `1-5` phases. Phase 1 = tracer bullet. Keep phase shape fixed. Shape for downstream `snap-forge`: smallest end-to-end behaviors that fit vertical `RED -> GREEN -> VERIFY -> COMMIT` work. Write in repo style: terse, technical-dense, label-first.

## Contract

Artifact = one issue comment shaped by `references/contract.md` and `references/template.md`.

Shared nouns:
- Durable decisions: `Interfaces`, `Data`, `Boundaries`
- Phase fields: `Goal`, `Covers`, `Build`, `Acceptance`, `Blockers`, `Size`, `Risk`
- Coverage ids: `US-*`, `FR-*`, `NFR-*`
- Size vocab: `S`, `M`, `L`

## Lifecycle

Draft in chat. Review granularity, blockers, coverage. Update existing plan comment when present; otherwise create one. Keep one canonical plan artifact per issue.

## GitHub Hash Links

- Any Git commit hash/SHA shown to the user or written to GitHub comments, issues, PR bodies, review bodies, or durable artifacts must be clickable in GitHub.
- Use Markdown `[abcdef0](https://github.com/<owner>/<repo>/commit/<full-sha>)`; if Markdown is unsupported, paste the commit URL.
- Resolve short hashes to full SHAs before linking. Derive `<owner>/<repo>` from `gh repo view --json nameWithOwner`, PR context, or `origin` remote.

## Principles

- Vertical phases over layer slices
- Forge-ready phases over milestone blobs
- Durable nouns over volatile file names
- Deep modules, narrow interfaces: plan owned behavior behind small public APIs, not pass-through wrappers
- Hexagonal boundaries: business logic owns local ports; adapters translate database, framework, transport, vendor shapes
- Fixed shape. Light prose
- Artifact prose stays token-thin: dense nouns, low glue
- `Acceptance` describes public-interface behavior, not internal tasks
- `Acceptance` avoids docs/tests/README commands, filenames, helpers, refactors, process verbs
- Docs, tests, refactors belong in `Build:` unless the artifact itself is the user-visible behavior under review
- Phase 1 stays tracer-thin. README/doc work usually lands in the last phase that changes that surface, not the tracer bullet
- `Acceptance` prefers interface nouns over repo-root commands or filenames
- Ordinary usage/docs refresh is not reviewer-visible artifact behavior for `Acceptance`; keep it in `Build:`
- Unknown policy branches go in `Risks / Unknowns`, not silent scope expansion inside `Acceptance`
- If source omits thresholds, derivation rules, or post-filter `total` semantics, keep them out of `Durable Decisions` and `Acceptance`; surface them in `Risks / Unknowns`
- Phase 1 title should say `Tracer Bullet` explicitly
- Requirement coverage when source ids exist; otherwise `Covers: inferred`
- Thin plan, not slice explosion
