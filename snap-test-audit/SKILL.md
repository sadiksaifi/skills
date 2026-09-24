---
name: snap-test-audit
description: >
  Use when periodically auditing an existing test suite for redundant, fake,
  implementation-coupled, or low-value tests and test-only production seams.
---

# Test audit

Audit existing tests after they have accumulated. This skill does not gate new tests; implementation and review skills handle that. Default to read-only findings. Edit only when the user requests cleanup. Scope the audit to the requested project, subsystem, or files; do not silently sample a requested full audit.

1. **Inventory.** Read repository rules and identify every test in scope, its production owner, neighboring suites, and relevant CI routing. For a full audit, record baseline pass/fail results and account for every test declaration, including parameterized rows with distinct assertions. Done when every in-scope test has an owner and baseline status or a stated reason it could not run.
2. **Judge the proof.** Read each test and its production path. Identify the behavior its assertions actually detect, a credible regression that makes it fail, and the strongest existing suite for that contract. Check history and non-test callers before judging a test-only seam. Classify each test: retain, repair a weak assertion, consolidate into a named owner, or delete with surviving proof or a no-test rationale. Done when every test has an evidence-backed disposition.
3. **Plan the cut.** Group redundant cases by contract, not filename. Name keeper suites, assertions to carry over, and production seams that would become unused. Treat a valuable baseline failure as a possible product defect, not disposable coverage. Done when every proposed deletion has a surviving contract owner or an explicit reason no test is needed.
4. **Report or clean up.** On a read-only audit, report the ledger and a prioritized, coherent cleanup plan. If cleanup was requested, change one owner-boundary group at a time, preserve unique contracts, and remove test-only seams only after checking all callers. Run focused suites after each group. Done when every planned change is applied and its keeper passes, or the audit remains read-only with no files changed.
5. **Preserve and verify.** Compare removed assertions with keepers; test restored unique contracts against a deliberate temporary production fault where feasible, then restore the source. Run the relevant broader checks and `git diff --check` after edits. Report baseline failures, retained false positives, validation, and test versus production changes separately. Done when every in-scope test and changed path is accounted for, and unresolved failures or lost contracts are named.

## Suspect patterns

Investigate rather than deleting by pattern alone:

- assertions with no behavioral check, self-comparisons, or expectations derived from the code under test;
- copied exports, manifests, fixtures, or source greps that track implementation rather than a contract;
- repeated cases already proved at a stronger boundary or permutations with no new failure mode;
- mocks or fixtures that produce the very result the test claims to verify;
- negative cases that pass at the wrong guard or never reach the intended path;
- tests coupled to private call shapes or kept alive by test-only exports, wrappers, or globals;
- test names that promise behavior the assertions do not check.

Retain independent public API, protocol, security, migration, storage, platform, package, or user-facing byte contracts. Static inspection may be their cheapest independent guard. A slow test or one that breaks under refactoring is a prompt to investigate, not automatic deletion.
