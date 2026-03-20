# TDD Plan Mode

You're in plan mode. Your job is NOT to write the plan yourself — Claude
Code's built-in plan mode is already excellent at that. Instead, you're
preparing a TDD blueprint: gathering the right context, confirming decisions
with the user, and establishing constraints so that when plan mode writes
the plan, it produces a strict TDD-structured plan.

Think of yourself as a consultant who interviews the stakeholder and hands
a detailed brief to the architect. The architect (plan mode) writes the plan.

## Task Tracking

On entry, create tasks using `TaskCreate` to track progress through the
blueprint preparation:

1. "Detect test suite" — activeForm: "Detecting test suite"
2. "Discuss interfaces and behaviors" — activeForm: "Discussing interfaces and behaviors"
3. "Decide branch strategy" — activeForm: "Deciding branch strategy"
4. "Hand off TDD blueprint to plan mode" — activeForm: "Handing off to plan mode"

Set dependencies so each task is `addBlockedBy` the previous one. Mark each
task `in_progress` when you start it and `completed` when done.

---

## Step 1: Detect Test Suite

Mark task "Detect test suite" as `in_progress`.

Check the project for an existing test setup:

- `package.json` → look for jest, vitest, mocha, playwright, etc.
- `pyproject.toml` / `setup.cfg` → look for pytest, unittest
- `Cargo.toml` → built-in test framework
- `go.mod` → built-in testing package
- `*.test.*`, `*.spec.*`, `__tests__/`, `tests/` directories
- CI config files for test commands

**Always confirm with the user**, even if you detect something. Present what
you found and ask if it's correct. If nothing is found, present popular
options for their stack with a **(Recommended)** choice.

Mark task "Detect test suite" as `completed`.

---

## Step 2: Discuss with the User

Mark task "Discuss interfaces and behaviors" as `in_progress`.

Before writing the plan, have a focused conversation:

1. **Confirm interface changes** — What should the public interface look like?
   What functions/methods/endpoints are needed?
   a. Use `AskUserQuestion` to ask what public methods/endpoints are needed
   b. Use `LSP` `documentSymbol` on relevant files to list current exports
   c. Use `LSP` `findReferences` to see what depends on existing symbols
   d. Use `LSP` `hover` to check type signatures

2. **Confirm behaviors to test** — Which behaviors matter most? You can't test
   everything. Focus testing effort on critical paths and complex logic, not
   every possible edge case. Prioritize with the user.

3. **Identify deep module opportunities** — Where can we use a small interface
   to hide complex implementation? Use `LSP` `incomingCalls`/`outgoingCalls`
   to map call chains and find where complexity can be buried. Point these
   out to the user.

4. **Design for testability** — Are there external dependencies that need
   injection? System boundaries that need mock-friendly interfaces? Use `LSP`
   `goToDefinition`/`goToImplementation` to trace dependencies and identify
   system boundaries.

5. **List behaviors, not implementation steps** — Frame the plan around
   observable behaviors ("user can log in with valid credentials") not
   implementation details ("create loginUser function").

6. **Get user approval** — Use `AskUserQuestion` to present the behavior list
   and interface design. Proceed only after the user confirms.

Mark task "Discuss interfaces and behaviors" as `completed`.

---

## Step 3: Branch Strategy

Mark task "Decide branch strategy" as `in_progress`.

Ask the user about branching using `AskUserQuestion`:

- **Create a new branch (Recommended)** — Suggest a branch name based on the
  feature being built (e.g., `feat/user-authentication`, `fix/cart-total-calc`)
- **Continue on current branch** — Show the current branch name
- **Something else** — User specifies

Embed the chosen strategy in the plan so the executor knows what to do.

Mark task "Decide branch strategy" as `completed`.

---

## Step 4: Hand Off to Plan Mode

Mark task "Hand off TDD blueprint to plan mode" as `in_progress`.

You've done your job. You've gathered:
- Test suite (confirmed with user)
- Interface design and behaviors to test (confirmed with user)
- Deep module opportunities
- Testability considerations
- Branch strategy (confirmed with user)

You're already in plan mode (either from the original skill invocation or from
brainstorm's handoff). Provide a detailed briefing describing the test suite,
behaviors, interface design, branch strategy, and the constraints below. Plan
mode will write the full TDD-structured plan from this context.

### Plan must include:

1. **Execution instruction** at the top:
   > Use the `/tdd` skill to execute this plan.

2. **Setup section** with test suite, branch strategy, and lint/format commands

3. **Behavior cycles** ordered from simplest to most complex. Each cycle:
   ```
   ## Cycle N: [Behavior Description]
   **Test:** [What the test asserts — observable behavior]
   **Implementation:** [Minimal code needed]
   **Refactor candidates:** [What to consider after GREEN]
   ```

4. **Per-cycle checklist:**
   - [ ] Test describes behavior, not implementation
   - [ ] Test uses public interface only
   - [ ] Test would survive internal refactor
   - [ ] Code is minimal for this test
   - [ ] No speculative features added
   - [ ] Lint + format check + tests pass
   - [ ] Atomic commit made (conventional commit)

5. **Refactoring guidelines:**
   - Extract duplication into functions/classes
   - Deepen modules — move complexity behind simple interfaces
   - Apply SOLID principles where natural
   - Move logic to where data lives (feature envy)
   - Introduce value objects for primitive obsession
   - Long methods -> private helpers (keep tests on public interface)
   - Never refactor while RED — get to GREEN first
   - Run tests after each refactor step

6. **Manual Testing Checklist** at the end:
   > Show this checklist to the user after all cycles are complete.
   - [ ] [Concrete manual verification steps]

The plan must be self-contained — the executor might be in a fresh session
with cleared context. Everything they need should be in the plan file.

Mark task "Hand off TDD blueprint to plan mode" as `completed`.

Let plan mode take it from here. Your blueprint ensures it produces a
strict TDD plan instead of a generic one.
