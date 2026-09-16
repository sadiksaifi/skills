# Fix Cycle

Use this cycle for substantive `[FIX]` and `CI` items. For typos, imports, and mechanical renames, edit, verify, and commit directly.

## Vertical cycle

1. **RED:** Add one test for one defect. Exercise observable behavior through a public interface. Confirm it fails for the reported reason.
2. **GREEN:** Make the smallest change that passes. Keep unrelated refactoring out of the fix.
3. **VERIFY:** Run the targeted test and relevant lint, type, or build checks. Resolve every local failure before committing.
4. **COMMIT:** Create one atomic Conventional Commit and retain its full SHA for the reply.

```text
fix(scope): address <review or CI issue>
```

Repeat the full cycle per item rather than batching tests and fixes.

## Test threshold

Add a regression test when the changed behavior is meaningful, risky, or non-trivial. Prefer behavior assertions over implementation details. Coverage-only tests add no value.

## Refactor

After selected fixes are green, refactor only when they exposed duplication, brittle seams, or an awkward interface. Re-run affected checks and commit the refactor separately.

```text
refactor(scope): <improvement>
```

Completion: the test failed for the target behavior, now passes, relevant checks pass, and the atomic commit SHA is recorded. For a direct trivial fix, local verification and the commit SHA satisfy completion.
