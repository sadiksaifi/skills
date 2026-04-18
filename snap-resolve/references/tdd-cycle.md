# TDD Cycle for PR Fixes

Each substantive [FIX] follows a strict vertical RED → GREEN → VERIFY → COMMIT cycle. Trivial fixes (typos, imports, renames) skip RED — direct fix → VERIFY → COMMIT.

## Per-Fix Cycle

### RED — Write the Test

- Exactly ONE test capturing the fix
- Describes **observable behavior**, not implementation details
- Public interface only
- Must FAIL — confirms the bug/issue exists

### GREEN — Minimal Implementation

- **Minimum code** to pass the failing test
- Don't anticipate other fixes
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
fix(scope): [description matching the PR feedback]
```

Store the commit hash — referenced in the reply to the reviewer.

## After All Fixes: Refactor

If multiple fixes touched overlapping code, single refactor pass. Candidates:
- Duplication → extract
- Shallow modules → deepen
- What new code reveals about existing code

Run tests after each refactor step. Commit separately:
```
refactor(scope): [what was improved]
```

## Per-Cycle Checklist

- [ ] Test describes behavior, not implementation
- [ ] Test uses public interface only
- [ ] Test would survive internal refactor
- [ ] Code is minimal for this fix
- [ ] No speculative features added
- [ ] Full suite + lint + format pass
- [ ] Atomic conventional commit
- [ ] Commit hash stored for reply
