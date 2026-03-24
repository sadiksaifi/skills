---
name: snap-forge
description: >
  TDD plan and execute in one skill — strict vertical RED-GREEN-REFACTOR-VERIFY-COMMIT
  cycles. Adaptive: skips planning if /snap-scope already ran, reads an existing
  plan, or does quick self-setup for small fixes. Use when the user wants TDD,
  test-driven development, red-green-refactor, to build or fix something with
  tests first, or when a plan references "/snap-forge" or "/tdd". Trigger on
  "snap-forge", "forge", "TDD", "build this", "start TDD", "execute the plan",
  "run TDD cycles", "test-driven", or when /snap-scope hands off. Also trigger
  when the user clearly wants tests before implementation. When in doubt,
  activate — undertriggering is worse than overtriggering.
---

# Snap Forge — TDD Plan + Execute

Plan the behaviors, then execute strict vertical RED-GREEN-REFACTOR-VERIFY-COMMIT
cycles. One test at a time, one implementation at a time, never batching.

## Detect context

Determine your starting point:

- **Post-scope** — conversation contains snap-scope context (issue details,
  chosen approach, implementation decisions, requirements). Skip to step 1
  (Detect test suite).
- **Plan exists** — a plan file references `/snap-forge`, `/tdd-execute`, or
  `/tdd` with behavior cycles defined. Skip to step 5 (Setup).
- **Standalone** — direct invocation with no prior context. Start from Quick
  self-setup.

## Quick self-setup (standalone only)

Quick codebase scan of the relevant area. Identify the task, existing patterns,
and test infrastructure.

If the task is complex enough to need a full brainstorm, suggest `/snap-scope`
first. This setup exists for small, focused tasks where you know what you want
and just need TDD discipline.

## Planning

### 1. Detect test suite

Check `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, test
directories, and CI config. Confirm with the user even if you detect something —
wrong test runner means wasted cycles.

### 2. Discuss interfaces and behaviors

Confirm what public interface changes are needed. List behaviors to test —
these should describe observable outcomes ("user can log in with valid
credentials"), not implementation steps ("create loginUser function").

Identify opportunities for deep modules — small interfaces hiding complex
implementations. See `references/deep-modules.md`.

For testability and mocking decisions, see
`references/interface-design.md` and
`references/mocking.md`.

Focus testing effort on critical paths and complex logic, not every edge case.
Get user approval on the behavior list.

### 3. Branch strategy

Ask: create a new branch (recommended, suggest a name), continue on current
branch, or something else.

### 4. Write plan and transition

Write a plan file with:
- Setup: test suite, branch, lint/format commands
- Behavior cycles ordered simplest to most complex
- Per-cycle checklist (see `references/tdd-cycle.md`)
- Manual testing checklist at the end

Exit plan mode and proceed to execution.

## Execution

### 5. Setup

Create branch if specified. Run existing tests to verify everything passes
before you start. Identify lint and format commands.

### 6. Execute cycles

For each behavior, one complete cycle before starting the next:

**RED** — Write exactly ONE test for the current behavior. It must describe
observable behavior through the public interface. Run it — it should fail.

**GREEN** — Write the minimum code to make the failing test pass. Don't
anticipate future tests. Don't add speculative features. Run it — it should
pass.

**REFACTOR** — Now that you're green, look for improvements. See
`references/refactoring.md` for candidates. Never refactor
while red. Run tests after each refactor step.

**VERIFY** — Full test suite + lint + format. If anything fails, stop and fix
before proceeding.

**COMMIT** — One atomic conventional commit for this cycle.

Run autonomously through all cycles. Only pause when:
- A previously passing test fails (regression)
- Lint or format check fails
- Something fundamentally doesn't work as expected

Vertical cycles respond to what you learn from the previous one. Horizontal
batching (all tests first, then all implementation) tests imagined behavior
instead of actual behavior — that's why we never do it.

### 7. Wrap up

Run the full test suite one final time. Show the manual testing checklist.
Summary: cycles completed, behaviors implemented, refactoring done, current
branch and commit count.

## Principles

- **Vertical slices, never horizontal.** One complete cycle before the next.
- **Deep modules over shallow.** Small interfaces, deep implementations.
- **Accept dependencies, don't create them.** Pass externals in.
- **Return results, don't produce side effects.** Easier to test.
- **Mock at system boundaries only.** Never mock your own code.
- **Always recommend.** Every decision point gets a recommendation.

See `references/tests.md` for what makes a good vs bad test.
