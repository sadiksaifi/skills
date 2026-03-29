---
name: snap-forge
description: >
  Strict TDD execution — vertical RED-GREEN-VERIFY-COMMIT cycles per behavior,
  single REFACTOR pass at end. Use when user wants to BUILD something with
  test-driven development: writing actual code and tests, not planning or
  documenting. Trigger on "snap-forge", "forge this", "TDD", "build with
  tests", "test-first", "red-green-refactor", "implement with TDD", or when
  user wants tests written before implementation code. Do NOT use for writing
  PRDs (snap-prd), planning (snap-plan), or design review (snap-scope).
---

# Snap Forge — TDD Execute

Strict vertical TDD cycles. One test, one implementation, one commit.
Refactor only after all behaviors green — premature refactoring reshapes code
before you see the full picture (Ousterhout: patterns only emerge once enough
implementation exists to reveal them).

## 1. Orient

Determine input: GitHub issue, conversation context, or direct task. Quick
codebase scan of relevant area — detect test suite (`package.json`,
`pyproject.toml`, `Cargo.toml`, `go.mod`, test dirs, CI config), existing
patterns, test infrastructure.

If input is a GitHub issue, fetch comments via `gh issue view <number>
--comments`. Look for a plan comment (`## Durable Decisions` or `## Phase`
headers). If found:
- Durable decisions are constraints — respect locked routes, schemas, models.
- Phase list defines the behavior sequence for TDD cycles.
- If plan specifies a current phase, execute only that phase.

If detected test runner is unambiguous, use it. If multiple runners detected
or none found, confirm with user.

If input is a direct task (no issue, no plan), decompose into testable
behaviors before proceeding — list observable outcomes through public
interfaces, ordered simplest to most complex.

## 2. Branch strategy

Recommend a new branch (suggest name based on task). Create it unless user
says otherwise.

## 3. Verify baseline

Create branch if specified. Run existing tests — everything must pass before
starting. Identify lint/format commands.

## 4. Execute cycles

For each behavior, one complete cycle:

**RED** — Write exactly ONE test for current behavior. Must describe
observable behavior through public interface (see `references/tests.md`).
Run — must fail.

**GREEN** — Minimum code to pass the failing test. Don't anticipate future
tests. Don't add speculative features. Run — must pass.

**VERIFY** — Full test suite + lint + format. If anything fails, stop and fix.

**COMMIT** — One atomic conventional commit for this cycle.

Run autonomously. Only pause on:
- Previously passing test fails (regression)
- Lint/format failure
- Fundamental breakage

If a test passes immediately (behavior already implemented by prior cycles),
commit as a verification test — don't force a RED phase that can't fail.

Vertical cycles respond to what you learn from the previous one. Horizontal
batching (all tests first, all impl second) tests imagined behavior, not
actual behavior. It produces tests coupled to the shape you imagined, not the
shape that emerged. This is the single most important discipline — never
batch.

## 5. Refactor pass

After ALL behaviors green, single refactor pass. See
`references/refactoring.md` for candidates:
- Duplication → extract
- Shallow modules → deepen (Ousterhout)
- Feature envy → move logic to where data lives
- Primitive obsession → value objects
- What new code reveals about existing code

Run tests after each refactor step. Never refactor while red. Autonomous —
tests are the guardrail.

**VERIFY** — Full suite + lint + format.

**COMMIT** — Separate refactoring commit(s), clearly labeled.

## 6. Wrap up

Full test suite one final time. Summary: cycles completed, behaviors
implemented, refactoring done, branch, commit count.

## Principles

- **Vertical, never horizontal.** One complete cycle before the next.
- **Deep modules over shallow.** Small interfaces, deep implementations.
- **Accept dependencies, don't create them.** Pass externals in.
- **Return results, not side effects.** Easier to test.
- **Mock at system boundaries only.** Never mock your own code.

See `references/deep-modules.md`, `references/interface-design.md`,
`references/mocking.md`, `references/tests.md`.
