# Behavior Tests

Tests buy confidence where owned behavior can regress. A test that cannot fail under a plausible regression adds maintenance, not signal.

## Test threshold

Add a test only when it:

- verifies behavior this codebase owns or promises
- can fail under a plausible regression
- adds evidence beyond types, compiler, linter, or direct inspection
- is durable enough to justify its maintenance

Use direct verification for static declarations, obvious wiring, constants, trivial accessors, and similarly inspectable changes. Existing checks or manual observation are sufficient when a new assertion adds no signal.

Test an integration's contract or adapter behavior, not whether a third-party library works as documented. Coverage alone never justifies a test.

## Test contract

A strong test enters and verifies through public interfaces, covers one meaningful behavior, and survives internal refactoring. Prefer integration-style tests across real controlled code. Keep owned modules real.

Use test doubles only at uncontrolled boundaries: external services, time, randomness, filesystem edges, and databases when a real test database is impractical. Expose a narrow operation-specific interface at that boundary.

## Red gate

A valid red test fails because the behavior is absent or wrong. Resolve setup, fixture, import, and environment failures before implementation.

When useful automated coverage is impractical, agree on an observable verification method before changing production code.
