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

Confirm test runner with user — wrong runner wastes cycles.

## 2. Branch strategy

Parse ARGUMENTS for optional flags. Syntax uses `=` for explicit values:

- `--branch=name` → use exact branch name
- `--branch` → derive autonomously, no user approval
- `--worktree=name` → use exact name for worktree dir and branch
- `--worktree` → derive autonomously, no user approval
- No flag → ask user: create new branch (recommend + suggest name), continue
  on current, or other

`--branch` and `--worktree` are mutually exclusive — if both present, error
immediately.

**Autonomous naming convention** (when flag has no value):
`{prefix}/{issue-number-if-available}/{ai-slug}` — prefix is `feat/`, `fix/`,
`refactor/`, etc. based on work type. Pick and go — yolo mode, no approval.

## 3. Verify baseline

Execute the resolved strategy from §2.

**`--branch`:**
1. Dirty working tree → error. Uncommitted changes + new branch is ambiguous.
2. Branch already exists (local or remote) → error.
3. `git checkout -b {branch-name}`.

**`--worktree`:**
1. Auto-detect base branch (`git branch -l main master`).
2. Project name: `basename $(git rev-parse --show-toplevel)`.
3. Worktree dir name: branch name with `/` replaced by `-`.
4. Worktree path: `~/.worktrees/{project-name}/{worktree-dir-name}`.
5. Path already exists → error. Branch already exists → error.
6. `git worktree add {path} -b {branch-name} {base-branch}`.
7. `cd` into worktree — all subsequent work happens there.
   Dirty state in original repo is fine — worktree gets clean checkout.

**No flag:** Create branch if user specified. Stay on current if they chose that.

Run existing tests — everything must pass before starting. Identify lint/format
commands.

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

If `--worktree` was used, include worktree path and branch name in summary.

## Principles

- **Vertical, never horizontal.** One complete cycle before the next.
- **Deep modules over shallow.** Small interfaces, deep implementations.
- **Accept dependencies, don't create them.** Pass externals in.
- **Return results, not side effects.** Easier to test.
- **Mock at system boundaries only.** Never mock your own code.

See `references/deep-modules.md`, `references/interface-design.md`,
`references/mocking.md`, `references/tests.md`.
