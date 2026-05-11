# TDD Cycle for PR Fixes

Use for substantive `[FIX]` items. Trivial fixes like typos, imports, or renames may use direct edit → verify → commit.

## Philosophy

Tests should verify behavior through public interfaces, not implementation details. A fix test should fail when the bug exists and pass when the behavior is corrected.

Do not write all fix tests first and then all fixes. Work vertically: one failing test, one minimal fix, verify, commit, repeat.

## Per-Fix Cycle

### RED

Write one test for one fix.

- Test observable behavior, not private implementation.
- Use the public interface when possible.
- Confirm the test fails for the current bug or missing behavior.

### GREEN

Write the minimum code to pass the failing test.

- Do not anticipate other fixes.
- Do not add speculative behavior.
- Do not refactor while red.

### VERIFY

Run the relevant checks for the fix. Prefer targeted checks during the cycle and broader checks before push.

If a check fails, fix it before committing.

### COMMIT

Commit the completed fix with a small, atomic Conventional Commits v1.0.0 message.

```text
fix(scope): address [review/CI issue]
```

Store the full commit SHA or GitHub commit link for reviewer replies.

## Refactor

After all approved fixes pass, do one refactor pass if the fixes reveal duplication, shallow modules, brittle seams, or awkward interfaces.

Run checks after each refactor step. Commit refactoring separately when it changes code.

```text
refactor(scope): [what was improved]
```

## Checklist

```text
[ ] Test describes behavior, not implementation
[ ] Test fails before the fix
[ ] Fix is minimal for the current item
[ ] No speculative behavior added
[ ] Relevant checks pass
[ ] Fix is committed atomically
[ ] Commit link is available for replies
```
