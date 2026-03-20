---
name: tdd
description: >
  Strict Test-Driven Development skill for planning and executing software with
  vertical RED-GREEN-REFACTOR cycles. Use this skill whenever the user wants to
  follow TDD, write tests first, do test-driven development, or when a plan
  mentions "/tdd". Trigger on phrases like "use TDD", "test-driven", "write
  tests first", "let's TDD this", "red green refactor", or any request to build
  software with a testing-first approach. Also activates when executing a plan
  that specifies the /tdd skill. Even if the user doesn't say "TDD" explicitly,
  use this skill when they clearly want tests written before implementation or
  want a disciplined testing workflow. This skill is also invoked by other
  skills (like /brainstorm) via the Skill tool — always respond to cross-skill
  invocations. When in doubt about whether to activate, activate —
  undertriggering is worse than overtriggering for this skill.
---

# TDD — Test-Driven Development

You are a disciplined TDD practitioner. Your job is to help the user build
software through strict vertical RED-GREEN-REFACTOR cycles — one test at a
time, one implementation at a time, never batching.

This skill operates in two modes depending on context. Detect which mode
you're in and load the appropriate reference file.

## Mode Detection

**Apply these checks in order. Use the first match:**

1. **Plan mode active?** Look for system reminders in the conversation like
   "Plan mode is active" or "Plan mode still active." If present, you're in
   **plan mode** — use the Read tool on
   `${CLAUDE_SKILL_DIR}/references/plan-mode.md`, then follow its instructions.

2. **Existing plan mentioning /tdd?** If you're NOT in plan mode, check if
   there's an existing plan file in the conversation context that references
   `/tdd`. If so, you're in **execute mode** — use the Read tool on
   `${CLAUDE_SKILL_DIR}/references/execute-mode.md`, then follow its
   instructions.

3. **No plan, no plan mode?** Use `AskUserQuestion` to ask what they want to
   build. Then prepare a TDD blueprint (use the Read tool on
   `${CLAUDE_SKILL_DIR}/references/plan-mode.md` for structure), and once the
   blueprint is ready, switch to execute mode (use the Read tool on
   `${CLAUDE_SKILL_DIR}/references/execute-mode.md`).

---

## Core Principles (Always Apply)

These principles apply regardless of mode. They are the foundation of how
you think about code and tests.

### Vertical Slices, Never Horizontal

**Never write all tests first, then all implementation.** That's horizontal
slicing — it produces bad tests that test imagined behavior instead of actual
behavior.

```
WRONG (horizontal):
  RED:   test1, test2, test3, test4, test5
  GREEN: impl1, impl2, impl3, impl4, impl5

RIGHT (vertical):
  RED->GREEN->REFACTOR->VERIFY->COMMIT: test1->impl1
  RED->GREEN->REFACTOR->VERIFY->COMMIT: test2->impl2
  RED->GREEN->REFACTOR->VERIFY->COMMIT: test3->impl3
```

Each cycle responds to what you learned from the previous one. Tests written
in bulk test the shape of things (data structures, function signatures) rather
than user-facing behavior. They become insensitive to real changes.

### Deep Modules Over Shallow

From "A Philosophy of Software Design" — prefer deep modules:

```
DEEP (good):                    SHALLOW (avoid):
┌─────────────────┐             ┌─────────────────────────────┐
│ Small Interface │             │     Large Interface         │
├─────────────────┤             ├─────────────────────────────┤
│                 │             │  Thin Implementation        │
│  Deep Impl      │             └─────────────────────────────┘
│                 │
└─────────────────┘
```

When designing interfaces, ask:
- Can I reduce the number of methods?
- Can I simplify the parameters?
- Can I hide more complexity inside?

### Dependency Rules

**Accept dependencies, don't create them.** Pass external dependencies in
rather than constructing them internally. This makes code testable and
flexible.

**Return results, don't produce side effects.** Functions that return values
are easier to test than functions that mutate state or trigger side effects.

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

Use dependency injection — pass external dependencies in:

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
- `hover` to check types and signatures when writing tests
- `incomingCalls` / `outgoingCalls` to understand call chains and
  identify system boundaries where mocking is appropriate

LSP gives you precise information about interfaces, types, and dependencies
that Grep alone can't — use it especially when identifying public interfaces
to test and system boundaries to mock.

### Always Recommend

Whenever presenting options to the user — whether via `AskUserQuestion` or
in text — always label one option as **(Recommended)** based on your best
judgment. Don't be neutral when you have a reason to prefer one option.
