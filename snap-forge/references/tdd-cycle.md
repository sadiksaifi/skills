# TDD Cycle for PR Fixes

Each `[FIX]` item follows a strict vertical RED->GREEN->REFACTOR->VERIFY->COMMIT
cycle. This is not optional — every fix goes through the full cycle.

## The Cycle

### RED — Write the Test

- Write exactly ONE test that captures the fix
- The test must describe **observable behavior**, not implementation details
- Use the public interface only
- Use `LSP` `documentSymbol` to verify you're testing public symbols
- The test should FAIL — confirming the bug/issue exists
- Run the test to confirm it fails

### GREEN — Write Minimal Implementation

- Write the **minimum code** to make the failing test pass
- Don't anticipate other fixes
- Don't add speculative features
- Don't refactor yet
- Run the test to confirm it passes

### REFACTOR (if applicable)

- Now that you're GREEN, look for refactor candidates:
  - Extract duplication into functions/classes
  - Deepen modules — move complexity behind simple interfaces
  - Apply SOLID principles where natural
  - Move logic to where data lives
  - Long methods -> private helpers (keep tests on public interface)
- **Never refactor while RED** — get to GREEN first
- Run tests after each refactor step
- Use `LSP` `incomingCalls` before changing signatures

### VERIFY

Run the full verification suite:
1. **Full test suite** — all tests, not just the new one
2. **Lint check** — if the project has a linter
3. **Format check** — if the project has a formatter

**If anything fails, stop and fix it before proceeding.**

### COMMIT

Make one atomic conventional commit:

```
fix(scope): [description matching the PR feedback]
```

Store the commit hash — it will be referenced in the reply to the reviewer.

## Per-Cycle Checklist

- [ ] Test describes behavior, not implementation
- [ ] Test uses public interface only
- [ ] Test would survive internal refactor
- [ ] Code is minimal for this test
- [ ] No speculative features added
- [ ] Lint + format check + tests pass
- [ ] Atomic commit made (conventional commit)
- [ ] Commit hash stored for reply

## Rules

- One test at a time
- Only enough code to pass current test
- Don't anticipate future fixes
- Keep tests focused on observable behavior
- Never proceed past a failing lint, test, or format check
- One commit per fix — never batch unrelated changes
