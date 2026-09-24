# Fix Cycle

Use this cycle for substantive `[FIX]` and `CI` items. For typos, imports, and mechanical renames, edit, verify, and commit directly.

## Vertical cycle

1. **RED:** Find the existing test owner for the defect. Extend it or add one public-interface regression only if existing coverage would miss the former failure; confirm the assertion fails on the pre-fix code for the reported reason. If a new test adds no distinct evidence, use the existing owner or direct verification.
2. **GREEN:** Make the smallest change that passes. Keep unrelated refactoring out of the fix.
3. **VERIFY:** Run the targeted test and relevant lint, type, or build checks. Resolve every local failure before committing.
4. **COMMIT:** Create one atomic Conventional Commit and retain its full SHA for the reply.

```text
fix(scope): address <review or CI issue>
```

Repeat the full cycle per item rather than batching tests and fixes.

## Test threshold

Add a regression test for meaningful risk only when it protects a distinct failure mode. Prefer behavior assertions over implementation details. Coverage-only and duplicate tests add no value.

## Refactor

After selected fixes are green, refactor only when they exposed duplication, brittle seams, or an awkward interface. Re-run affected checks and commit the refactor separately.

```text
refactor(scope): <improvement>
```

Completion: each substantive fix has a pre-fix failure and post-fix proof through the existing owner or a distinct new test; relevant checks pass and the atomic commit SHA is recorded. For a direct trivial fix, local verification and the commit SHA satisfy completion.
