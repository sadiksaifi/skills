# TDD Cycle

Each behavior follows a strict vertical RED → GREEN → VERIFY → COMMIT cycle.
Refactoring happens once after all behaviors pass — not per-cycle. Premature
refactoring reshapes code before patterns emerge.

## Per-Behavior Cycle

### RED — Write the Test

- Exactly ONE test for current behavior
- Describes **observable behavior**, not implementation details
- Public interface only
- Must FAIL — confirms the behavior doesn't exist yet

### GREEN — Minimal Implementation

- **Minimum code** to pass the failing test
- Don't anticipate future behaviors
- Don't add speculative features
- Don't refactor yet
- Must PASS

### VERIFY

1. Full test suite — all tests, not just the new one
2. Lint check
3. Format check

If anything fails, stop and fix before proceeding.

### COMMIT

One atomic conventional commit:
```
feat(scope): [behavior description]
```

## After All Behaviors Pass: Refactor

Single pass over the full implementation. Candidates:
- Duplication → extract function/class
- Shallow modules → deepen (move complexity behind simple interfaces)
- Long methods → private helpers (keep tests on public interface)
- Feature envy → move logic to where data lives
- Primitive obsession → value objects
- SOLID violations → apply where natural
- What new code reveals about existing code

**Never refactor while red.** Run tests after each refactor step.

Commit refactoring separately:
```
refactor(scope): [what was improved]
```

## Per-Cycle Checklist

- [ ] Test describes behavior, not implementation
- [ ] Test uses public interface only
- [ ] Test would survive internal refactor
- [ ] Code is minimal for this test
- [ ] No speculative features added
- [ ] Full suite + lint + format pass
- [ ] Atomic conventional commit
