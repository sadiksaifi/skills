# TDD Execute Mode

You're in execute mode. Your job is to implement the feature using strict
vertical RED-GREEN-REFACTOR-VERIFY-COMMIT cycles. Run fully autonomously —
only pause if something fails (test, lint, format check).

---

## Task Tracking

Use `TaskCreate` and `TaskUpdate` throughout execution to give the user clear,
structured progress. Create tasks at two levels:

**Setup tasks** (created on entry):
1. "Determine context and read plan" — activeForm: "Reading plan"
2. "Setup environment" — activeForm: "Setting up environment"

**Cycle tasks** (created after reading the plan/identifying behaviors):
For each behavior cycle, create a task:
- "Cycle N: [behavior description]" — activeForm: "Cycle N: [behavior]"
- Set dependencies: each cycle `addBlockedBy` the previous one

**Wrap-up task** (created with cycle tasks):
- "Final verification and summary" — activeForm: "Running final verification"
- `addBlockedBy` the last cycle task

Mark each task `in_progress` when starting, `completed` when done. This gives
the user a live progress view of the entire TDD execution in their terminal.

---

## Step 1: Determine Context

Mark task "Determine context and read plan" as `in_progress`.

**If a plan exists** (from a previous planning session or the current context):
1. Use the Read tool on the plan file
2. Summarize the behavior cycles and test suite from the plan
3. Proceed to Step 2 (Setup)

**If no plan exists** (user invoked `/tdd` directly with a task):
1. Use `AskUserQuestion` to ask: "What do you want to build?"
2. Use `Glob` and `Read` to detect the test suite (check package.json,
   pyproject.toml, test directories)
3. Use `AskUserQuestion` to confirm the detected test suite with the user
4. Use `AskUserQuestion` for branch strategy with options:
   - **Create a new branch (Recommended)** — suggest a name
   - **Continue on current branch** — show branch name
   - **Something else** — user specifies
5. Use `AskUserQuestion` to identify key behaviors to test with the user
6. Start executing cycles immediately — no need for a formal plan file

After reading the plan or identifying behaviors, create all the cycle tasks
and the wrap-up task now (with dependencies). Mark task "Determine context
and read plan" as `completed`.

---

## Step 2: Setup

Mark task "Setup environment" as `in_progress`.

Before the first cycle:

1. **Branch** — If the plan/user specified a new branch, create it now:
   ```
   git checkout -b <branch-name>
   ```

2. **Verify test suite** — Run the existing tests to make sure everything
   passes before you start. If there are no existing tests, that's fine.

3. **Identify lint/format commands** — Check the project for:
   - `package.json` scripts (lint, format, check)
   - Pre-commit hooks
   - Makefile targets
   - CI config

Mark task "Setup environment" as `completed`.

---

## Step 3: Execute Cycles

For each behavior (from the plan or your identified list), mark the
corresponding cycle task as `in_progress` and execute one complete cycle:

### RED — Write the Test

- Write exactly ONE test for the current behavior
- The test must describe **observable behavior**, not implementation details
- Use the public interface only — use `LSP` `documentSymbol` to verify you're
  testing exported/public symbols, and `hover` to check type signatures
- The test should FAIL when you run it — that's the point
- Run the test to confirm it fails

### GREEN — Write Minimal Implementation

- Write the **minimum code** needed to make the failing test pass
- Don't anticipate future tests
- Don't add speculative features
- Don't refactor yet — just make it pass
- Run the test to confirm it passes

### REFACTOR (if applicable)

- Now that you're GREEN, look for refactor candidates:
  - Extract duplication into functions/classes
  - Deepen modules — move complexity behind simple interfaces
  - Apply SOLID principles where natural
  - Move logic to where data lives (feature envy) — use `LSP` `findReferences`
    to see where data flows
  - Introduce value objects for primitive obsession
  - Long methods -> break into private helpers (keep tests on public interface)
  - Consider what new code reveals about existing code
  - Use `LSP` `incomingCalls` to check if refactored code is used elsewhere
    before changing signatures
- **Never refactor while RED** — you must be GREEN first
- Run tests after each refactor step — if anything breaks, undo and try again

### VERIFY

Run the full verification suite:
1. **Full test suite** — all tests, not just the new one
2. **Lint check** — if the project has a linter
3. **Format check** — if the project has a formatter

**If anything fails, stop and fix it before proceeding.** Never move past a
failing lint, test, or format check. This is the one thing that pauses
autonomous execution.

### COMMIT

Make one atomic conventional commit for this cycle:

```
feat(scope): add [behavior description]
```

or `fix`, `refactor`, `test` as appropriate. One commit per cycle — never
batch unrelated changes.

Mark the current cycle task as `completed`.

---

## Step 4: Repeat

Move to the next behavior and repeat Step 3. Continue until all behaviors
from the plan (or identified list) are complete.

Run fully autonomously through all cycles. Only pause when:
- A test that was previously passing now fails (regression)
- Lint or format check fails
- Something fundamentally doesn't work as expected

---

## Step 5: Wrap Up

Mark task "Final verification and summary" as `in_progress`.

After all cycles are complete:

1. **Run the full test suite** one final time to confirm everything passes

2. **Show the Manual Testing Checklist** — if the plan included one, present
   it to the user. If there was no plan, create a brief manual testing
   checklist based on what was built and present it.

3. **Summary** — Give the user a brief summary:
   - How many cycles completed
   - What behaviors were implemented
   - Any notable refactoring done
   - Current branch and commit count

Mark task "Final verification and summary" as `completed`.
