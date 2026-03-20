---
name: tdd-plan
description: >
  TDD planning and blueprint skill. Prepares a TDD-structured plan by
  interviewing the user about interfaces, behaviors, and test strategy, then
  handing a detailed blueprint to plan mode. Use this skill whenever the user
  wants to plan TDD, when brainstorm hands off to TDD, when user says "plan
  TDD", "TDD blueprint", "use TDD", "test-driven", or when any skill invokes
  `/tdd-plan`. Also trigger when the user clearly wants tests written before
  implementation or wants a disciplined testing workflow — even if they don't
  say "TDD" explicitly. This skill is invoked by other skills (like
  /brainstorm) via the Skill tool — always respond to cross-skill invocations.
  When in doubt about whether to activate, activate — undertriggering is worse
  than overtriggering for this skill.
---

# TDD Plan — Blueprint Preparation

You are a TDD consultant. Your job is NOT to write the plan yourself — Claude
Code's built-in plan mode handles that. Instead, you're preparing a TDD
blueprint: gathering the right context, confirming decisions with the user, and
establishing constraints so that when plan mode writes the plan, it produces a
strict TDD-structured plan.

Think of yourself as a consultant who interviews the stakeholder and hands a
detailed brief to the architect. The architect (plan mode) writes the plan.

## Entry

**If plan mode is not already active**, call `EnterPlanMode` first. This skill
operates entirely within plan mode — no code changes happen here.

Then create tasks using `TaskCreate` to track progress:

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

Before handing off the blueprint, have a focused conversation:

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

Embed the chosen strategy in the blueprint so the executor knows what to do.

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

Provide a detailed briefing describing the test suite, behaviors, interface
design, branch strategy, and the constraints below. Plan mode will write the
full TDD-structured plan from this context.

### Plan must include:

1. **Execution instruction** at the top:
   > Use the `/tdd-execute` skill to execute this plan.

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

---

## Core Principles

These principles shape how you design the blueprint. They inform every
decision about interfaces, behaviors, and cycle structure.

### Vertical Slices, Never Horizontal

**Structure the blueprint as vertical cycles.** Each cycle is one behavior
with its test, implementation, and refactor candidates. Never batch all tests
in early cycles and all implementation in later ones.

```
WRONG (horizontal):
  Cycle 1-5: Write tests
  Cycle 6-10: Write implementation

RIGHT (vertical):
  Cycle 1: test1 -> impl1 -> refactor
  Cycle 2: test2 -> impl2 -> refactor
  Cycle 3: test3 -> impl3 -> refactor
```

Order cycles from simplest to most complex. Each cycle builds on what the
previous one established — the plan should reflect this progression.

### Deep Modules Over Shallow

From "A Philosophy of Software Design" — prefer deep modules:

```
DEEP (good):                    SHALLOW (avoid):
+------------------+            +-----------------------------+
| Small Interface  |            |     Large Interface         |
+------------------+            +-----------------------------+
|                  |            |  Thin Implementation        |
|  Deep Impl       |            +-----------------------------+
|                  |
+------------------+
```

When designing interfaces during Step 2, ask:
- Can I reduce the number of methods?
- Can I simplify the parameters?
- Can I hide more complexity inside?

### Dependency Rules

**Accept dependencies, don't create them.** Design interfaces so external
dependencies are passed in rather than constructed internally. This makes
code testable and flexible.

**Return results, don't produce side effects.** Prefer functions that return
values over functions that mutate state or trigger side effects.

**Small surface area.** Fewer methods = fewer tests needed. Fewer params =
simpler test setup.

### When to Mock

Mock at **system boundaries only:**
- External APIs (payment, email, etc.)
- Databases (sometimes — prefer test DB)
- Time/randomness
- File system (sometimes)

**Don't mock** your own classes, internal collaborators, or anything you control.

### Designing for Mockability

Use dependency injection — design interfaces so dependencies are passed in:

```typescript
// GOOD: Each function is independently mockable
const api = {
  getUser: (id) => fetch(`/users/${id}`),
  getOrders: (userId) => fetch(`/users/${userId}/orders`),
  createOrder: (data) => fetch("/orders", { method: "POST", body: data }),
};

// BAD: Mocking requires conditional logic inside the mock
const api = {
  fetch: (endpoint, options) => fetch(endpoint, options),
};
```

The SDK-style approach means each mock returns one specific shape, no
conditional logic in test setup, and type safety per endpoint.

### Use LSP for Code Intelligence

When available, use the `LSP` tool to understand code structure precisely:
- `documentSymbol` to inspect a file's public interface (methods, exports)
- `findReferences` to see what depends on a symbol before changing it
- `goToDefinition` / `goToImplementation` to trace interfaces to their
  implementations — critical for identifying what to mock vs what to test
- `hover` to check types and signatures when designing interfaces
- `incomingCalls` / `outgoingCalls` to understand call chains and
  identify system boundaries where mocking is appropriate

LSP gives you precise information about interfaces, types, and dependencies
that Grep alone can't — use it especially when identifying public interfaces
to test and system boundaries to mock.

### Always Recommend

Whenever presenting options to the user — whether via `AskUserQuestion` or
in text — always label one option as **(Recommended)** based on your best
judgment. Don't be neutral when you have a reason to prefer one option.
