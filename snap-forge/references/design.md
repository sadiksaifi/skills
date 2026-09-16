# Testable Design

Load when the public seam is unclear or green code exposes a refactor opportunity.

## Before red

Choose the smallest stable public contract that expresses the behavior. Prefer:

- narrow interfaces that hide implementation depth
- dependencies supplied at system boundaries
- explicit inputs and returned results
- operation-specific boundary methods
- complexity behind one cohesive module

A good seam makes the behavior easy to invoke and observe without exposing internals.

## While green

Refactor when the implementation reveals duplication, shallow pass-through modules, long mixed-purpose methods, misplaced behavior, or primitive-heavy contracts.

Keep each step small, run affected checks after it, and preserve the public contract unless the task requires an interface change. Commit material refactoring separately from behavior changes.
