# Review Lenses

Apply each relevant lens to changed behavior and affected call paths. Findings require a concrete mechanism and impact, not pattern preference.

## Behavior

- **Correctness:** inputs, outputs, validation, errors, state transitions, persistence, and edge paths
- **Security and privacy:** authentication, authorization, trust boundaries, secrets, and sensitive data flow
- **Concurrency and lifecycle:** races, retries, idempotency, cancellation, cleanup, and resource ownership
- **Compatibility and data:** interfaces, migrations, rollout order, old callers, and persisted formats
- **Performance:** hot paths, query or network amplification, blocking work, memory, and unbounded growth
- **Operations:** failure visibility, recovery, configuration, and deployment assumptions

## Change economy

Ask yourself: "Can this be solved correctly with less code?" Every added abstraction, wrapper, helper, layer, file, defensive branch, and test must serve a concrete present requirement, invariant, or variation point. Prefer deletion, simplification, reuse, or inlining when it preserves correctness, clarity, locality, and module depth.

Treat a large or diffuse diff as a signal to inspect scope and necessity, never as a finding by itself. Report excess structure only when it creates concrete maintenance, correctness, testability, or future-change cost.

## Tests

Tests buy confidence where owned behavior can regress. Account for every added or materially changed test by identifying the distinct owned behavior or regression it protects and a realistic production-code change that would make it fail.

Flag missing regression coverage only when owned behavior has a plausible regression, lacks durable public-interface evidence, and justifies maintenance. Name the exact regression. For a bug fix, the test must exercise the former failure path rather than merely pass with the new implementation.

A test is low-value when it duplicates existing behavioral evidence; adds input permutations without reaching a different branch, boundary, or failure mode; restates third-party behavior, types, compiler checks, static declarations, obvious wiring, constants, trivial accessors, or coverage totals; or would keep passing when its claimed behavior breaks. Flag implementation-detail assertions and internal mocks when they create false confidence or maintenance risk. Consolidate low-value additions into one root-cause finding and direct the fix toward deletion or the smallest set that preserves distinct evidence.

Strong tests enter and verify through public interfaces, keep owned modules real, and use doubles only at uncontrolled system boundaries.

## Architecture

Correct behavior can still ship poor architecture. Review modules, interfaces, seams, and adapters for leverage, locality, and testability:

- **Depth:** substantial behavior sits behind a small interface.
- **Interface:** callers learn only necessary invariants, errors, ordering, configuration, and performance characteristics.
- **Seam:** variability has a deliberate location; new seams represent real variation rather than hypothetical indirection.
- **Locality:** policy, knowledge, and change stay concentrated instead of spreading across callers.
- **Testability:** callers and tests use the same public interface without reaching into implementation.

Use the deletion test: if removing a module makes its complexity vanish rather than reappear across callers, it is likely shallow pass-through structure.

Also inspect duplicated policy, leaky adapters, vendor or storage shapes entering domain logic, misplaced behavior, and interfaces that expose implementation complexity. Report architecture only when the diff creates concrete correctness, testability, maintenance, or future-change cost.

## Finding gate

Before reporting, verify:

- the issue exists in the current diff or remains unresolved from prior feedback
- a supported input or realistic condition reaches it
- the impact is material enough to fix
- the cited evidence proves the mechanism
- the fix direction addresses the root cause
